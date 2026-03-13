import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { WebSocket } from "ws";
import { writeSkill } from "../agents/skills.test-helpers.js";
import { writeConfigFile } from "../config/config.js";
import { getReplyFromConfig, testState } from "../gateway/test-helpers.mocks.js";
import {
  connectOk,
  installGatewayTestHooks,
  onceMessage,
  rpcReq,
  startServerWithClient,
} from "../gateway/test-helpers.server.js";
import { emitAgentEvent, registerAgentRunContext } from "../infra/agent-events.js";
import { startChatServer } from "./server.js";

installGatewayTestHooks();

describe("standalone chat server", () => {
  it("serves the UI and proxies gateway rpc methods for chat parity features", async () => {
    testState.agentsConfig = {
      list: [
        { id: "main", default: true, name: "Main" },
        { id: "ops", name: "Ops" },
      ],
    };

    const staticDir = fs.mkdtempSync(path.join(os.tmpdir(), "standalone-chat-ui-"));
    fs.writeFileSync(
      path.join(staticDir, "index.html"),
      "<!doctype html><title>TraversalAI</title>",
    );
    const workspaceDir = fs.mkdtempSync(path.join(os.tmpdir(), "standalone-chat-workspace-"));
    await writeSkill({
      dir: path.join(workspaceDir, ".agents", "skills", "triage-skill"),
      name: "triage-skill",
      description: "A test skill exposed through the gateway.",
    });
    await writeConfigFile({
      agents: {
        defaults: {
          workspace: workspaceDir,
        },
        list: [
          { id: "main", default: true, name: "Main" },
          { id: "ops", name: "Ops" },
        ],
      },
    });
    getReplyFromConfig.mockImplementation(async (_ctx, opts) => {
      const runId = opts?.runId ?? "tool-run";
      opts?.onAgentRunStart?.(runId);
      registerAgentRunContext(runId, {
        sessionKey: "agent:ops:main",
        verboseLevel: "on",
      });
      setTimeout(() => {
        emitAgentEvent({
          runId,
          sessionKey: "agent:ops:main",
          stream: "tool",
          data: {
            phase: "start",
            name: "read",
            toolCallId: "tool-1",
            args: { path: "README.md" },
          },
        });
      }, 10);
      setTimeout(() => {
        emitAgentEvent({
          runId,
          sessionKey: "agent:ops:main",
          stream: "tool",
          data: {
            phase: "end",
            name: "read",
            toolCallId: "tool-1",
            result: { content: [{ type: "text", text: "ok" }] },
          },
        });
      }, 20);
      return { text: "tool completed" };
    });

    const startedGateway = await startServerWithClient("secret");
    await connectOk(startedGateway.ws, { token: "secret", scopes: ["operator.admin"] });

    const chatServer = await startChatServer({
      port: 0,
      staticDir,
      gatewayUrl: `ws://127.0.0.1:${startedGateway.port}`,
      gatewayToken: "secret",
    });

    try {
      const browserWs = new WebSocket(chatServer.url.replace("http://", "ws://"));
      await new Promise<void>((resolve, reject) => {
        browserWs.once("open", () => resolve());
        browserWs.once("error", reject);
      });

      await onceMessage<{ type?: string }>(
        browserWs,
        (msg) => msg.type === "gateway.ready",
        10_000,
      );

      browserWs.send(
        JSON.stringify({ type: "rpc", id: "agents", method: "agents.list", params: {} }),
      );
      const agents = await onceMessage<{
        type?: string;
        id?: string;
        ok?: boolean;
        payload?: { defaultId?: string; agents?: Array<{ id?: string }> };
      }>(browserWs, (msg) => msg.type === "resp" && msg.id === "agents", 10_000);
      expect(agents.ok).toBe(true);
      expect(agents.payload?.defaultId).toBe("main");
      expect(agents.payload?.agents?.some((agent) => agent.id === "ops")).toBe(true);

      browserWs.send(
        JSON.stringify({ type: "rpc", id: "models", method: "models.list", params: {} }),
      );
      const models = await onceMessage<{
        type?: string;
        id?: string;
        ok?: boolean;
        payload?: { models?: unknown[] };
      }>(browserWs, (msg) => msg.type === "resp" && msg.id === "models", 10_000);
      expect(models.ok).toBe(true);
      expect(Array.isArray(models.payload?.models)).toBe(true);

      browserWs.send(
        JSON.stringify({ type: "rpc", id: "tools", method: "tools.catalog", params: {} }),
      );
      const tools = await onceMessage<{
        type?: string;
        id?: string;
        ok?: boolean;
        payload?: { groups?: Array<{ id?: string }> };
      }>(browserWs, (msg) => msg.type === "resp" && msg.id === "tools", 10_000);
      expect(tools.ok).toBe(true);
      expect(tools.payload?.groups?.length).toBeGreaterThan(0);

      browserWs.send(
        JSON.stringify({ type: "rpc", id: "skills", method: "skills.status", params: {} }),
      );
      const skills = await onceMessage<{
        type?: string;
        id?: string;
        ok?: boolean;
        payload?: { skills?: Array<{ name?: string }> };
      }>(browserWs, (msg) => msg.type === "resp" && msg.id === "skills", 10_000);
      expect(skills.ok).toBe(true);
      expect(Array.isArray(skills.payload?.skills)).toBe(true);
      expect(skills.payload?.skills?.some((skill) => skill.name === "triage-skill")).toBe(true);

      const patched = await rpcReq<{ ok?: boolean; resolved?: { model?: string } }>(
        startedGateway.ws,
        "sessions.patch",
        { key: "agent:ops:main", model: "openai/gpt-5" },
      );
      expect(patched.ok).toBe(true);
      expect(patched.payload?.resolved?.model).toBe("gpt-5");

      browserWs.send(
        JSON.stringify({
          type: "rpc",
          id: "chat-send",
          method: "chat.send",
          params: {
            sessionKey: "agent:ops:main",
            message: "use a tool",
            idempotencyKey: "tool-run",
          },
        }),
      );
      const sendAck = await onceMessage<{
        type?: string;
        id?: string;
        ok?: boolean;
        payload?: { runId?: string };
      }>(browserWs, (msg) => msg.type === "resp" && msg.id === "chat-send", 10_000);
      expect(sendAck.ok).toBe(true);
      expect(sendAck.payload?.runId).toBe("tool-run");

      const toolStart = await onceMessage<{
        type?: string;
        event?: string;
        payload?: {
          runId?: string;
          stream?: string;
          data?: { phase?: string; toolCallId?: string };
        };
      }>(
        browserWs,
        (msg) =>
          msg.type === "gateway.event" &&
          msg.event === "agent" &&
          msg.payload?.runId === "tool-run" &&
          msg.payload?.stream === "tool" &&
          msg.payload?.data?.phase === "start",
        10_000,
      );
      expect(toolStart.payload?.data?.toolCallId).toBe("tool-1");

      const toolEnd = await onceMessage<{
        type?: string;
        event?: string;
        payload?: {
          runId?: string;
          stream?: string;
          data?: { phase?: string; toolCallId?: string };
        };
      }>(
        browserWs,
        (msg) =>
          msg.type === "gateway.event" &&
          msg.event === "agent" &&
          msg.payload?.runId === "tool-run" &&
          msg.payload?.stream === "tool" &&
          msg.payload?.data?.phase === "end",
        10_000,
      );
      expect(toolEnd.payload?.data?.toolCallId).toBe("tool-1");

      browserWs.close();
    } finally {
      getReplyFromConfig.mockReset();
      chatServer.stop();
      startedGateway.ws.close();
      await startedGateway.server.close();
      fs.rmSync(staticDir, { recursive: true, force: true });
      fs.rmSync(workspaceDir, { recursive: true, force: true });
    }
  });
});

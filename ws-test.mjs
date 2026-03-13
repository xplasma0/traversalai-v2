import { WebSocket } from "ws";
import { createRequire } from "module";

const TEST_PORT = 15175;
const TIMEOUT_MS = 15000;

const results = {};
let rpcCounter = 0;
const pending = new Map();

function sendRpc(ws, method, params) {
  return new Promise((resolve, reject) => {
    const id = `rpc-${++rpcCounter}`;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ type: "rpc", id, method, params }));
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error(`RPC timeout: ${method}`));
      }
    }, 10000);
  });
}

async function main() {
  console.log("=== Chat Server Integration Test ===\n");

  console.log("[1] Connecting WebSocket to BFF...");
  const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}`);

  // Wait for gateway.ready
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout waiting for gateway.ready")), TIMEOUT_MS);

    ws.on("open", () => {
      console.log("    WebSocket connected to BFF");
    });

    ws.on("message", (raw) => {
      const data = JSON.parse(String(raw));
      if (data.type === "gateway.ready") {
        clearTimeout(timer);
        console.log("    gateway.ready received!");
        results["Gateway Connection"] = "PASS";
        resolve(data);
      } else if (data.type === "gateway.error") {
        clearTimeout(timer);
        reject(new Error(`Gateway error: ${data.message}`));
      } else if (data.type === "resp") {
        const p = pending.get(data.id);
        if (p) {
          pending.delete(data.id);
          if (data.ok) p.resolve(data.payload);
          else p.reject(new Error(data.error?.message ?? "Unknown error"));
        }
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });

  // Test agents.list
  console.log("\n[2] Testing agents.list RPC...");
  try {
    const agentsRes = await sendRpc(ws, "agents.list", {});
    if (agentsRes?.agents && Array.isArray(agentsRes.agents)) {
      results["agents.list"] = `PASS (${agentsRes.agents.length} agents)`;
      for (const a of agentsRes.agents.slice(0, 5)) {
        console.log(`      - ${a.id}: ${a.name ?? "(no name)"}`);
      }
    } else {
      results["agents.list"] = "WARN: no agents array in response";
    }
  } catch (e) {
    results["agents.list"] = `FAIL: ${e.message}`;
    console.log("    Error:", e.message);
  }

  // Test models.list
  console.log("\n[3] Testing models.list RPC...");
  try {
    const modelsRes = await sendRpc(ws, "models.list");
    if (modelsRes?.models && Array.isArray(modelsRes.models)) {
      results["models.list"] = `PASS (${modelsRes.models.length} models)`;
      for (const m of modelsRes.models.slice(0, 5)) {
        console.log(`      - ${m.id}: ${m.label ?? m.id} (${m.provider ?? "?"})`);
      }
    } else {
      results["models.list"] = "WARN: no models array in response";
    }
  } catch (e) {
    results["models.list"] = `FAIL: ${e.message}`;
    console.log("    Error:", e.message);
  }

  // Test chat.send
  console.log("\n[4] Testing chat.send RPC...");
  const sessionKey = `test-${Date.now()}`;
  try {
    const events = [];

    const chatDone = new Promise((resolve) => {
      const chatTimer = setTimeout(() => resolve(), 12000);

      ws.on("message", (raw) => {
        const data = JSON.parse(String(raw));
        if (data.type === "gateway.event" && data.event === "chat" && data.payload?.sessionKey === sessionKey) {
          events.push(data.payload);
          console.log(`    [chat event] state=${data.payload.state}`);
          if (data.payload.state === "final" || data.payload.state === "error" || data.payload.state === "aborted") {
            clearTimeout(chatTimer);
            setTimeout(() => resolve(), 500);
          }
        }
        if (data.type === "gateway.event" && data.event === "agent" && data.payload?.stream === "tool") {
          events.push({ ...data.payload, _type: "tool" });
          console.log(`    [tool event] ${data.payload.data?.name ?? "?"} state=${data.payload.data?.state}`);
        }
      });
    });

    const sendRes = await sendRpc(ws, "chat.send", {
      sessionKey,
      message: "Reply with exactly one word: OK",
      idempotencyKey: `test-${Date.now()}`,
    });
    console.log("    chat.send accepted:", JSON.stringify(sendRes).substring(0, 100));

    await chatDone;
    const chatEvents = events.filter(e => !e._type);
    const toolEvents = events.filter(e => e._type === "tool");
    console.log(`    Received ${chatEvents.length} chat events, ${toolEvents.length} tool events`);

    if (chatEvents.length > 0) {
      const finalEvent = chatEvents.find(e => e.state === "final");
      const lastMessage = finalEvent?.message ?? chatEvents[chatEvents.length - 1]?.message ?? "";
      const text = typeof lastMessage === "string" ? lastMessage : lastMessage?.text ?? "";
      console.log("    Final text:", text.substring(0, 200));
      results["chat.send"] = `PASS (${chatEvents.length} events)`;
    } else {
      results["chat.send"] = "WARN: no chat events received";
    }

    if (toolEvents.length > 0) {
      results["Tool Events"] = `PASS (${toolEvents.length} tool events)`;
    } else {
      results["Tool Events"] = "SKIP: no tool invocations in this simple test";
    }
  } catch (e) {
    results["chat.send"] = `FAIL: ${e.message}`;
    console.log("    Error:", e.message);
  }

  // Test sessions.patch (agent switching)
  console.log("\n[5] Testing sessions.patch (agent switching)...");
  try {
    const patchRes = await sendRpc(ws, "sessions.patch", { key: sessionKey, agentId: "default" });
    console.log("    sessions.patch response:", JSON.stringify(patchRes).substring(0, 100));
    results["Agent Switching (sessions.patch)"] = "PASS";
  } catch (e) {
    results["Agent Switching (sessions.patch)"] = `FAIL: ${e.message}`;
    console.log("    Error:", e.message);
  }

  // Test sessions.reset
  console.log("\n[6] Testing sessions.reset...");
  try {
    const resetRes = await sendRpc(ws, "sessions.reset", { key: sessionKey, reason: "new" });
    console.log("    sessions.reset response:", JSON.stringify(resetRes).substring(0, 100));
    results["Session Reset"] = "PASS";
  } catch (e) {
    results["Session Reset"] = `FAIL: ${e.message}`;
    console.log("    Error:", e.message);
  }

  ws.close();

  // Summary
  console.log("\n\n=== RESULTS ===");
  let allPass = true;
  for (const [k, v] of Object.entries(results)) {
    const status = v.startsWith("PASS") ? "✓" : v.startsWith("SKIP") ? "○" : "✗";
    if (v.startsWith("FAIL")) allPass = false;
    console.log(`  ${status} ${k}: ${v}`);
  }
  console.log(`\nOverall: ${allPass ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);
  process.exit(allPass ? 0 : 1);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});

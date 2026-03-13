import { describe, expect, it } from "vitest";
import {
  buildStandaloneSessionKey,
  normalizeAgentsList,
  normalizeModelsList,
} from "../../apps/standalone-chat/src/gateway-session";

describe("standalone chat gateway session helpers", () => {
  it("normalizes agents.list into a gateway-backed session key", () => {
    const normalized = normalizeAgentsList({
      defaultId: "ops",
      mainKey: "work",
      scope: "per-sender",
      agents: [
        { id: "main", name: "Main" },
        { id: "ops", name: "Ops" },
      ],
    });

    expect(normalized.currentAgentId).toBe("ops");
    expect(normalized.mainKey).toBe("work");
    expect(normalized.sessionKey).toBe("agent:ops:work");
  });

  it("preserves explicit agent switches and supports global scope", () => {
    const switched = normalizeAgentsList(
      {
        defaultId: "main",
        mainKey: "main",
        scope: "global",
        agents: [{ id: "main" }, { id: "ops" }],
      },
      "ops",
    );

    expect(switched.currentAgentId).toBe("ops");
    expect(switched.sessionKey).toBe("global");
    expect(buildStandaloneSessionKey({ agentId: "ops", mainKey: "work" })).toBe("agent:ops:work");
  });

  it("maps models.list name fields into UI labels", () => {
    const normalized = normalizeModelsList(
      {
        models: [
          { id: "anthropic/claude-sonnet", name: "Claude Sonnet", provider: "anthropic" },
          { id: "openai/gpt-5", name: "GPT-5", provider: "openai" },
        ],
      },
      "openai/gpt-5",
    );

    expect(normalized.currentModelId).toBe("openai/gpt-5");
    expect(normalized.models[0]).toEqual({
      id: "anthropic/claude-sonnet",
      label: "Claude Sonnet",
      provider: "anthropic",
    });
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import type { TraversalAIConfig } from "../config/config.js";
import { resolveAckReaction, resolveMessagePrefix } from "./identity.js";

describe("resolveAckReaction", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers account-level overrides", () => {
    const cfg: TraversalAIConfig = {
      messages: { ackReaction: "👀" },
      agents: { list: [{ id: "main", identity: { emoji: "✅" } }] },
      channels: {
        slack: {
          ackReaction: "eyes",
          accounts: {
            acct1: { ackReaction: " party_parrot " },
          },
        },
      },
    };

    expect(resolveAckReaction(cfg, "main", { channel: "slack", accountId: "acct1" })).toBe(
      "party_parrot",
    );
  });

  it("falls back to channel-level overrides", () => {
    const cfg: TraversalAIConfig = {
      messages: { ackReaction: "👀" },
      agents: { list: [{ id: "main", identity: { emoji: "✅" } }] },
      channels: {
        slack: {
          ackReaction: "eyes",
          accounts: {
            acct1: { ackReaction: "party_parrot" },
          },
        },
      },
    };

    expect(resolveAckReaction(cfg, "main", { channel: "slack", accountId: "missing" })).toBe(
      "eyes",
    );
  });

  it("uses the global ackReaction when channel overrides are missing", () => {
    const cfg: TraversalAIConfig = {
      messages: { ackReaction: "✅" },
      agents: { list: [{ id: "main", identity: { emoji: "😺" } }] },
    };

    expect(resolveAckReaction(cfg, "main", { channel: "discord" })).toBe("✅");
  });

  it("falls back to the agent identity emoji when global config is unset", () => {
    const cfg: TraversalAIConfig = {
      agents: { list: [{ id: "main", identity: { emoji: "🔥" } }] },
    };

    expect(resolveAckReaction(cfg, "main", { channel: "discord" })).toBe("🔥");
  });

  it("returns the default emoji when no config is present", () => {
    const cfg: TraversalAIConfig = {};

    expect(resolveAckReaction(cfg, "main")).toBe("👀");
  });

  it("allows empty strings to disable reactions", () => {
    const cfg: TraversalAIConfig = {
      messages: { ackReaction: "👀" },
      channels: {
        telegram: {
          ackReaction: "",
        },
      },
    };

    expect(resolveAckReaction(cfg, "main", { channel: "telegram" })).toBe("");
  });

  it("uses TraversalAI message prefix fallback in TraversalAI runtime", () => {
    vi.stubEnv("TRAVERSALAI_APP", "1");
    const cfg: TraversalAIConfig = {};

    expect(resolveMessagePrefix(cfg, "main")).toBe("[traversalai]");
  });
});

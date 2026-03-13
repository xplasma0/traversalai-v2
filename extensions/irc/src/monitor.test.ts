import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#traversalai",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#traversalai",
      rawTarget: "#traversalai",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "traversalai-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "traversalai-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "traversalai-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "traversalai-bot",
      rawTarget: "traversalai-bot",
    });
  });
});

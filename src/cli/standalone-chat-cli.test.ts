import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";

const startChatServer = vi.fn().mockResolvedValue({
  port: 5175,
  url: "http://127.0.0.1:5175",
  stop: vi.fn(),
});

vi.mock("node:fs", async () => {
  const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
  return {
    ...actual,
    existsSync: vi.fn().mockReturnValue(true),
  };
});

vi.mock("../chat-server/server.js", () => ({
  startChatServer,
}));

vi.mock("../commands/onboard-helpers.js", () => ({
  detectBrowserOpenSupport: vi.fn().mockResolvedValue({ ok: true }),
  openUrl: vi.fn().mockResolvedValue(true),
}));

vi.mock("../runtime.js", () => ({
  defaultRuntime: {
    log: vi.fn(),
    error: vi.fn(),
    exit: vi.fn(),
  },
}));

describe("standalone chat cli", () => {
  afterEach(() => {
    startChatServer.mockClear();
  });

  it("passes explicit gateway overrides to the standalone chat server", async () => {
    const { registerStandaloneChatCli } = await import("./standalone-chat-cli.js");
    const program = new Command();
    registerStandaloneChatCli(program);
    setTimeout(() => {
      process.emit("SIGINT");
    }, 0);

    await program.parseAsync(
      [
        "chat",
        "--no-open",
        "--url",
        "ws://127.0.0.1:5192",
        "--token",
        "secret",
        "--password",
        "pw",
      ],
      { from: "user" },
    );

    expect(startChatServer).toHaveBeenCalledWith(
      expect.objectContaining({
        gatewayUrl: "ws://127.0.0.1:5192",
        gatewayToken: "secret",
        gatewayPassword: "pw",
      }),
    );
  });
});

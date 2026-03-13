import { describe, expect, it } from "vitest";
import {
  applyAssistantChatEvent,
  extractChatMessageText,
} from "../../apps/standalone-chat/src/chat-events";

describe("standalone chat event helpers", () => {
  it("extracts assistant text from gateway chat message content blocks", () => {
    expect(
      extractChatMessageText({
        role: "assistant",
        content: [
          { type: "text", text: "Hello" },
          { type: "text", text: " world" },
        ],
      }),
    ).toBe("Hello world");
  });

  it("accepts string chat payloads", () => {
    expect(extractChatMessageText("Hello")).toBe("Hello");
  });

  it("updates assistant messages immutably for live gateway events", () => {
    const original = [
      {
        id: "run-1",
        role: "assistant" as const,
        content: [{ type: "text" as const, text: "Hello" }],
      },
    ];

    const updated = applyAssistantChatEvent({
      messages: original,
      runId: "run-1",
      text: "Hello world",
    });

    expect(updated).not.toBe(original);
    expect(updated[0]).not.toBe(original[0]);
    expect(updated[0].content).not.toBe(original[0].content);
    expect(updated[0].content[0].text).toBe("Hello world");
    expect(original[0].content[0].text).toBe("Hello");
  });
});

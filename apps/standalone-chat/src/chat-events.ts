export function extractChatMessageText(message: unknown): string {
  if (typeof message === "string") {
    return message;
  }
  if (!message || typeof message !== "object") {
    return "";
  }
  const record = message as { text?: unknown; content?: unknown };
  if (typeof record.text === "string") {
    return record.text;
  }
  if (!Array.isArray(record.content)) {
    return "";
  }
  return record.content
    .filter(
      (block): block is { type: string; text?: unknown } =>
        Boolean(block) && typeof block === "object" && "type" in block,
    )
    .filter((block) => block.type === "text")
    .map((block) => (typeof block.text === "string" ? block.text : ""))
    .join("");
}

export type ChatMessage = {
  id?: string;
  role: "user" | "assistant";
  content: Array<{ type: "text"; text: string }>;
};

export function applyAssistantChatEvent(params: {
  messages: ChatMessage[];
  runId: string;
  text: string;
}): ChatMessage[] {
  if (!params.text) {
    return params.messages;
  }
  const next = [...params.messages];
  const last = next[next.length - 1];
  if (last?.role === "assistant" && last.id === params.runId) {
    const content = [...last.content];
    const lastBlock = content[content.length - 1];
    if (lastBlock?.type === "text") {
      content[content.length - 1] = { ...lastBlock, text: params.text };
    } else {
      content.push({ type: "text", text: params.text });
    }
    next[next.length - 1] = {
      ...last,
      content,
    };
    return next;
  }
  next.push({
    id: params.runId,
    role: "assistant",
    content: [{ type: "text", text: params.text }],
  });
  return next;
}

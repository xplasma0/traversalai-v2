import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("traversalai", 16)).toBe("traversalai");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("traversalai-status-output", 10)).toBe("traversalai-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});

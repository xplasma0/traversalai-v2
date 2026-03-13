import { describe, expect, it } from "vitest";
import { TraversalAISchema } from "./zod-schema.js";

describe("TraversalAISchema cron retention and run-log validation", () => {
  it("accepts valid cron.sessionRetention and runLog values", () => {
    expect(() =>
      TraversalAISchema.parse({
        cron: {
          sessionRetention: "1h30m",
          runLog: {
            maxBytes: "5mb",
            keepLines: 2500,
          },
        },
      }),
    ).not.toThrow();
  });

  it("rejects invalid cron.sessionRetention", () => {
    expect(() =>
      TraversalAISchema.parse({
        cron: {
          sessionRetention: "abc",
        },
      }),
    ).toThrow(/sessionRetention|duration/i);
  });

  it("rejects invalid cron.runLog.maxBytes", () => {
    expect(() =>
      TraversalAISchema.parse({
        cron: {
          runLog: {
            maxBytes: "wat",
          },
        },
      }),
    ).toThrow(/runLog|maxBytes|size/i);
  });
});

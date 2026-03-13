import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it.each([
    {
      name: "help flag",
      argv: ["node", "traversalai", "--help"],
      expected: true,
    },
    {
      name: "version flag",
      argv: ["node", "traversalai", "-V"],
      expected: true,
    },
    {
      name: "normal command",
      argv: ["node", "traversalai", "status"],
      expected: false,
    },
    {
      name: "root -v alias",
      argv: ["node", "traversalai", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "traversalai", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with log-level",
      argv: ["node", "traversalai", "--log-level", "debug", "-v"],
      expected: true,
    },
    {
      name: "subcommand -v should not be treated as version",
      argv: ["node", "traversalai", "acp", "-v"],
      expected: false,
    },
    {
      name: "root -v alias with equals profile",
      argv: ["node", "traversalai", "--profile=work", "-v"],
      expected: true,
    },
    {
      name: "subcommand path after global root flags should not be treated as version",
      argv: ["node", "traversalai", "--dev", "skills", "list", "-v"],
      expected: false,
    },
  ])("detects help/version flags: $name", ({ argv, expected }) => {
    expect(hasHelpOrVersion(argv)).toBe(expected);
  });

  it.each([
    {
      name: "single command with trailing flag",
      argv: ["node", "traversalai", "status", "--json"],
      expected: ["status"],
    },
    {
      name: "two-part command",
      argv: ["node", "traversalai", "agents", "list"],
      expected: ["agents", "list"],
    },
    {
      name: "terminator cuts parsing",
      argv: ["node", "traversalai", "status", "--", "ignored"],
      expected: ["status"],
    },
  ])("extracts command path: $name", ({ argv, expected }) => {
    expect(getCommandPath(argv, 2)).toEqual(expected);
  });

  it.each([
    {
      name: "returns first command token",
      argv: ["node", "traversalai", "agents", "list"],
      expected: "agents",
    },
    {
      name: "returns null when no command exists",
      argv: ["node", "traversalai"],
      expected: null,
    },
  ])("returns primary command: $name", ({ argv, expected }) => {
    expect(getPrimaryCommand(argv)).toBe(expected);
  });

  it.each([
    {
      name: "detects flag before terminator",
      argv: ["node", "traversalai", "status", "--json"],
      flag: "--json",
      expected: true,
    },
    {
      name: "ignores flag after terminator",
      argv: ["node", "traversalai", "--", "--json"],
      flag: "--json",
      expected: false,
    },
  ])("parses boolean flags: $name", ({ argv, flag, expected }) => {
    expect(hasFlag(argv, flag)).toBe(expected);
  });

  it.each([
    {
      name: "value in next token",
      argv: ["node", "traversalai", "status", "--timeout", "5000"],
      expected: "5000",
    },
    {
      name: "value in equals form",
      argv: ["node", "traversalai", "status", "--timeout=2500"],
      expected: "2500",
    },
    {
      name: "missing value",
      argv: ["node", "traversalai", "status", "--timeout"],
      expected: null,
    },
    {
      name: "next token is another flag",
      argv: ["node", "traversalai", "status", "--timeout", "--json"],
      expected: null,
    },
    {
      name: "flag appears after terminator",
      argv: ["node", "traversalai", "--", "--timeout=99"],
      expected: undefined,
    },
  ])("extracts flag values: $name", ({ argv, expected }) => {
    expect(getFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "traversalai", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "traversalai", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "traversalai", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it.each([
    {
      name: "missing flag",
      argv: ["node", "traversalai", "status"],
      expected: undefined,
    },
    {
      name: "missing value",
      argv: ["node", "traversalai", "status", "--timeout"],
      expected: null,
    },
    {
      name: "valid positive integer",
      argv: ["node", "traversalai", "status", "--timeout", "5000"],
      expected: 5000,
    },
    {
      name: "invalid integer",
      argv: ["node", "traversalai", "status", "--timeout", "nope"],
      expected: undefined,
    },
  ])("parses positive integer flag values: $name", ({ argv, expected }) => {
    expect(getPositiveIntFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("builds parse argv from raw args", () => {
    const cases = [
      {
        rawArgs: ["node", "traversalai", "status"],
        expected: ["node", "traversalai", "status"],
      },
      {
        rawArgs: ["node-22", "traversalai", "status"],
        expected: ["node-22", "traversalai", "status"],
      },
      {
        rawArgs: ["node-22.2.0.exe", "traversalai", "status"],
        expected: ["node-22.2.0.exe", "traversalai", "status"],
      },
      {
        rawArgs: ["node-22.2", "traversalai", "status"],
        expected: ["node-22.2", "traversalai", "status"],
      },
      {
        rawArgs: ["node-22.2.exe", "traversalai", "status"],
        expected: ["node-22.2.exe", "traversalai", "status"],
      },
      {
        rawArgs: ["/usr/bin/node-22.2.0", "traversalai", "status"],
        expected: ["/usr/bin/node-22.2.0", "traversalai", "status"],
      },
      {
        rawArgs: ["node24", "traversalai", "status"],
        expected: ["node24", "traversalai", "status"],
      },
      {
        rawArgs: ["/usr/bin/node24", "traversalai", "status"],
        expected: ["/usr/bin/node24", "traversalai", "status"],
      },
      {
        rawArgs: ["node24.exe", "traversalai", "status"],
        expected: ["node24.exe", "traversalai", "status"],
      },
      {
        rawArgs: ["nodejs", "traversalai", "status"],
        expected: ["nodejs", "traversalai", "status"],
      },
      {
        rawArgs: ["node-dev", "traversalai", "status"],
        expected: ["node", "traversalai", "node-dev", "traversalai", "status"],
      },
      {
        rawArgs: ["traversalai", "status"],
        expected: ["node", "traversalai", "status"],
      },
      {
        rawArgs: ["bun", "src/entry.ts", "status"],
        expected: ["bun", "src/entry.ts", "status"],
      },
    ] as const;

    for (const testCase of cases) {
      const parsed = buildParseArgv({
        programName: "traversalai",
        rawArgs: [...testCase.rawArgs],
      });
      expect(parsed).toEqual([...testCase.expected]);
    }
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "traversalai",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "traversalai", "status"]);
  });

  it("decides when to migrate state", () => {
    const nonMutatingArgv = [
      ["node", "traversalai", "status"],
      ["node", "traversalai", "health"],
      ["node", "traversalai", "sessions"],
      ["node", "traversalai", "config", "get", "update"],
      ["node", "traversalai", "config", "unset", "update"],
      ["node", "traversalai", "models", "list"],
      ["node", "traversalai", "models", "status"],
      ["node", "traversalai", "memory", "status"],
      ["node", "traversalai", "agent", "--message", "hi"],
    ] as const;
    const mutatingArgv = [
      ["node", "traversalai", "agents", "list"],
      ["node", "traversalai", "message", "send"],
    ] as const;

    for (const argv of nonMutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(false);
    }
    for (const argv of mutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(true);
    }
  });

  it.each([
    { path: ["status"], expected: false },
    { path: ["config", "get"], expected: false },
    { path: ["models", "status"], expected: false },
    { path: ["agents", "list"], expected: true },
  ])("reuses command path for migrate state decisions: $path", ({ path, expected }) => {
    expect(shouldMigrateStateFromPath(path)).toBe(expected);
  });
});

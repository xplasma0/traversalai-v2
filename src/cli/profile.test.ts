import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "traversalai",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "traversalai", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "traversalai", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "traversalai", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "traversalai", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "traversalai", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "traversalai", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "traversalai", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "traversalai", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".traversalai-dev");
    expect(env.TRAVERSALAI_PROFILE).toBe("dev");
    expect(env.TRAVERSALAI_STATE_DIR).toBe(expectedStateDir);
    expect(env.TRAVERSALAI_CONFIG_PATH).toBe(path.join(expectedStateDir, "traversalai.json"));
    expect(env.TRAVERSALAI_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      TRAVERSALAI_STATE_DIR: "/custom",
      TRAVERSALAI_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.TRAVERSALAI_STATE_DIR).toBe("/custom");
    expect(env.TRAVERSALAI_GATEWAY_PORT).toBe("19099");
    expect(env.TRAVERSALAI_CONFIG_PATH).toBe(path.join("/custom", "traversalai.json"));
  });

  it("uses TRAVERSALAI_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      TRAVERSALAI_HOME: "/srv/traversalai-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/traversalai-home");
    expect(env.TRAVERSALAI_STATE_DIR).toBe(path.join(resolvedHome, ".traversalai-work"));
    expect(env.TRAVERSALAI_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".traversalai-work", "traversalai.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "traversalai doctor --fix",
      env: {},
      expected: "traversalai doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "traversalai doctor --fix",
      env: { TRAVERSALAI_PROFILE: "default" },
      expected: "traversalai doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "traversalai doctor --fix",
      env: { TRAVERSALAI_PROFILE: "Default" },
      expected: "traversalai doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "traversalai doctor --fix",
      env: { TRAVERSALAI_PROFILE: "bad profile" },
      expected: "traversalai doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "traversalai --profile work doctor --fix",
      env: { TRAVERSALAI_PROFILE: "work" },
      expected: "traversalai --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "traversalai --dev doctor",
      env: { TRAVERSALAI_PROFILE: "dev" },
      expected: "traversalai --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("traversalai doctor --fix", { TRAVERSALAI_PROFILE: "work" })).toBe(
      "traversalai --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("traversalai doctor --fix", { TRAVERSALAI_PROFILE: "  jbtraversalai  " })).toBe(
      "traversalai --profile jbtraversalai doctor --fix",
    );
  });

  it("handles command with no args after traversalai", () => {
    expect(formatCliCommand("traversalai", { TRAVERSALAI_PROFILE: "test" })).toBe(
      "traversalai --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm traversalai doctor", { TRAVERSALAI_PROFILE: "work" })).toBe(
      "pnpm traversalai --profile work doctor",
    );
  });
});

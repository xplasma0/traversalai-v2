import { afterEach, describe, expect, it, vi } from "vitest";
import type { TraversalAIConfig } from "../config/config.js";
import {
  applyOnboardingLocalWorkspaceConfig,
  ONBOARDING_DEFAULT_DM_SCOPE,
} from "./onboard-config.js";

describe("applyOnboardingLocalWorkspaceConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sets secure dmScope default when unset", () => {
    const baseConfig: TraversalAIConfig = {};
    const result = applyOnboardingLocalWorkspaceConfig(baseConfig, "/tmp/workspace");

    expect(result.session?.dmScope).toBe(ONBOARDING_DEFAULT_DM_SCOPE);
    expect(result.gateway?.mode).toBe("local");
    expect(result.agents?.defaults?.workspace).toBe("/tmp/workspace");
  });

  it("preserves existing dmScope when already configured", () => {
    const baseConfig: TraversalAIConfig = {
      session: {
        dmScope: "main",
      },
    };
    const result = applyOnboardingLocalWorkspaceConfig(baseConfig, "/tmp/workspace");

    expect(result.session?.dmScope).toBe("main");
  });

  it("preserves explicit non-main dmScope values", () => {
    const baseConfig: TraversalAIConfig = {
      session: {
        dmScope: "per-account-channel-peer",
      },
    };
    const result = applyOnboardingLocalWorkspaceConfig(baseConfig, "/tmp/workspace");

    expect(result.session?.dmScope).toBe("per-account-channel-peer");
  });

  it("applies TraversalAI identity defaults for fresh installs", () => {
    vi.stubEnv("TRAVERSALAI_APP", "1");

    const baseConfig: TraversalAIConfig = {};
    const result = applyOnboardingLocalWorkspaceConfig(baseConfig, "/tmp/workspace");

    expect(result.ui?.assistant?.name).toBe("TraversalAI");
    const main = result.agents?.list?.find((agent) => agent.id === "main");
    expect(main?.identity?.name).toBe("Master Control Agent");
    expect(main?.identity?.theme).toContain("orchestrator");
  });

  it("provisions built-in TraversalAI agents for fresh installs", () => {
    vi.stubEnv("TRAVERSALAI_APP", "1");

    const result = applyOnboardingLocalWorkspaceConfig({}, "/tmp/workspace");

    expect(result.agents?.list?.map((agent) => agent.id)).toEqual(
      expect.arrayContaining(["main", "email", "social-media"]),
    );
    expect(result.agents?.list?.find((agent) => agent.id === "main")?.default).toBe(true);
    expect(result.agents?.list?.find((agent) => agent.id === "email")?.name).toBe("Email Agent");
    expect(result.agents?.list?.find((agent) => agent.id === "social-media")?.name).toBe(
      "Social Media Agent",
    );
  });

  it("preserves existing built-in agent customizations", () => {
    vi.stubEnv("TRAVERSALAI_APP", "1");

    const result = applyOnboardingLocalWorkspaceConfig(
      {
        agents: {
          list: [
            {
              id: "email",
              name: "Inbox Commander",
              tools: { profile: "full" },
            },
          ],
        },
      },
      "/tmp/workspace",
    );

    const email = result.agents?.list?.find((agent) => agent.id === "email");
    expect(email?.name).toBe("Inbox Commander");
    expect(email?.tools?.profile).toBe("full");
  });
});

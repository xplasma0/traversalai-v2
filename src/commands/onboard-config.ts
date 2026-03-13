import { applyTraversalAiBuiltInAgents } from "../agents/builtins.js";
import type { TraversalAIConfig } from "../config/config.js";
import type { DmScope } from "../config/types.base.js";

export const ONBOARDING_DEFAULT_DM_SCOPE: DmScope = "per-channel-peer";
const TRAVERSALAI_DEFAULT_AGENT_NAME = "TraversalAI";
const TRAVERSALAI_DEFAULT_AGENT_THEME =
  "AI for tourism corps that helps teams accelerate hospitality outcomes";

function applyTraversalAiIdentityDefaults(baseConfig: TraversalAIConfig): TraversalAIConfig {
  if (process.env.TRAVERSALAI_APP !== "1") {
    return baseConfig;
  }

  const withBuiltins = applyTraversalAiBuiltInAgents(baseConfig);
  const nextAgents = { ...withBuiltins.agents };
  const list = Array.isArray(nextAgents.list) ? [...nextAgents.list] : [];
  const mainIndex = list.findIndex((entry) => entry?.id?.trim() === "main");
  const current = mainIndex >= 0 ? (list[mainIndex] ?? { id: "main" }) : { id: "main" };
  const mainAgent = {
    ...current,
    identity: {
      ...current.identity,
      name: current.identity?.name ?? TRAVERSALAI_DEFAULT_AGENT_NAME,
      theme: current.identity?.theme ?? TRAVERSALAI_DEFAULT_AGENT_THEME,
    },
  };
  if (mainIndex >= 0) {
    list[mainIndex] = mainAgent;
  } else {
    list.push(mainAgent);
  }
  nextAgents.list = list;

  return {
    ...withBuiltins,
    agents: nextAgents,
    ui: {
      ...withBuiltins.ui,
      assistant: {
        ...withBuiltins.ui?.assistant,
        name: withBuiltins.ui?.assistant?.name ?? TRAVERSALAI_DEFAULT_AGENT_NAME,
      },
    },
  };
}

export function applyOnboardingLocalWorkspaceConfig(
  baseConfig: TraversalAIConfig,
  workspaceDir: string,
): TraversalAIConfig {
  const withIdentityDefaults = applyTraversalAiIdentityDefaults(baseConfig);
  return {
    ...withIdentityDefaults,
    agents: {
      ...withIdentityDefaults.agents,
      defaults: {
        ...withIdentityDefaults.agents?.defaults,
        workspace: workspaceDir,
      },
    },
    gateway: {
      ...withIdentityDefaults.gateway,
      mode: "local",
    },
    session: {
      ...withIdentityDefaults.session,
      dmScope: withIdentityDefaults.session?.dmScope ?? ONBOARDING_DEFAULT_DM_SCOPE,
    },
  };
}

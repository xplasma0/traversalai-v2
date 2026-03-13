import type { TraversalAIConfig } from "../config/config.js";
import type { AgentConfig } from "../config/types.agents.js";

const TRAVERSALAI_MAIN_AGENT_ID = "main";
const TRAVERSALAI_EMAIL_AGENT_ID = "email";
const TRAVERSALAI_SOCIAL_AGENT_ID = "social-media";

const TRAVERSALAI_MAIN_AGENT: AgentConfig = {
  id: TRAVERSALAI_MAIN_AGENT_ID,
  default: true,
  name: "Master Control Agent",
  identity: {
    name: "Master Control Agent",
    theme:
      "Primary TraversalAI orchestrator that plans work, routes specialized tasks, and coordinates built-in agents.",
  },
  subagents: {
    allowAgents: [TRAVERSALAI_EMAIL_AGENT_ID, TRAVERSALAI_SOCIAL_AGENT_ID],
  },
  tools: {
    profile: "full",
  },
};

const TRAVERSALAI_EMAIL_AGENT: AgentConfig = {
  id: TRAVERSALAI_EMAIL_AGENT_ID,
  name: "Email Agent",
  identity: {
    name: "Email Agent",
    theme:
      "Specialized TraversalAI agent for email triage, drafting, sending, inbox organization, and follow-up workflows.",
  },
  tools: {
    profile: "messaging",
  },
};

const TRAVERSALAI_SOCIAL_AGENT: AgentConfig = {
  id: TRAVERSALAI_SOCIAL_AGENT_ID,
  name: "Social Media Agent",
  identity: {
    name: "Social Media Agent",
    theme:
      "Specialized TraversalAI agent for social posting, monitoring, engagement, and response drafting across social channels.",
  },
  tools: {
    profile: "messaging",
  },
};

export const TRAVERSALAI_BUILTIN_AGENT_IDS = [
  TRAVERSALAI_MAIN_AGENT_ID,
  TRAVERSALAI_EMAIL_AGENT_ID,
  TRAVERSALAI_SOCIAL_AGENT_ID,
] as const;

const TRAVERSALAI_BUILTIN_AGENTS: AgentConfig[] = [
  TRAVERSALAI_MAIN_AGENT,
  TRAVERSALAI_EMAIL_AGENT,
  TRAVERSALAI_SOCIAL_AGENT,
];

function mergeUnique(values: Array<string | undefined> = []): string[] | undefined {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const trimmed = typeof value === "string" ? value.trim() : "";
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out.length > 0 ? out : undefined;
}

function mergeAgentEntry(current: AgentConfig | undefined, builtin: AgentConfig): AgentConfig {
  const currentIdentity = current?.identity;
  const builtinIdentity = builtin.identity;
  const currentTools = current?.tools;
  const builtinTools = builtin.tools;
  const currentSubagents = current?.subagents;
  const builtinSubagents = builtin.subagents;

  return {
    ...builtin,
    ...current,
    default: current?.default ?? builtin.default,
    name: current?.name ?? builtin.name,
    identity: {
      ...builtinIdentity,
      ...currentIdentity,
      name: currentIdentity?.name ?? builtinIdentity?.name,
      theme: currentIdentity?.theme ?? builtinIdentity?.theme,
    },
    subagents: {
      ...builtinSubagents,
      ...currentSubagents,
      allowAgents:
        mergeUnique([
          ...(currentSubagents?.allowAgents ?? []),
          ...(builtinSubagents?.allowAgents ?? []),
        ]) ?? currentSubagents?.allowAgents,
    },
    tools: {
      ...builtinTools,
      ...currentTools,
      profile: currentTools?.profile ?? builtinTools?.profile,
    },
  };
}

export function applyTraversalAiBuiltInAgents(baseConfig: TraversalAIConfig): TraversalAIConfig {
  if (process.env.TRAVERSALAI_APP !== "1") {
    return baseConfig;
  }

  const nextAgents = { ...baseConfig.agents };
  const list = Array.isArray(nextAgents.list) ? [...nextAgents.list] : [];

  for (const builtin of TRAVERSALAI_BUILTIN_AGENTS) {
    const index = list.findIndex((entry) => entry?.id?.trim() === builtin.id);
    const current = index >= 0 ? list[index] : undefined;
    const merged = mergeAgentEntry(current, builtin);
    if (index >= 0) {
      list[index] = merged;
    } else {
      list.push(merged);
    }
  }

  nextAgents.list = list;

  return {
    ...baseConfig,
    agents: nextAgents,
  };
}

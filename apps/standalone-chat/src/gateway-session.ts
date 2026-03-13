export type AgentSummary = { id: string; name?: string };
export type ModelChoice = { id: string; provider?: string; label?: string };
export type SessionScope = "per-sender" | "global";
export type SavedSession = {
  key: string;
  agentId: string;
  mainKey: string;
  title: string;
  preview?: string;
  updatedAt?: number;
};

type AgentsListPayload = {
  defaultId?: string;
  mainKey?: string;
  scope?: SessionScope;
  agents?: Array<{ id?: string; name?: string }>;
};

type ModelsListPayload = {
  models?: Array<{ id?: string; name?: string; provider?: string }>;
};

export function buildStandaloneSessionKey(params: {
  agentId: string;
  mainKey?: string;
  scope?: SessionScope;
}): string {
  if (params.scope === "global") {
    return "global";
  }
  const agentId = params.agentId.trim() || "main";
  const mainKey = params.mainKey?.trim() || "main";
  return `agent:${agentId}:${mainKey}`;
}

export function parseStandaloneSessionKey(sessionKey: string | null | undefined): {
  agentId: string;
  mainKey: string;
} | null {
  const trimmed = sessionKey?.trim();
  if (!trimmed || trimmed === "global") {
    return null;
  }
  const match = /^agent:([^:]+):(.+)$/.exec(trimmed);
  if (!match) {
    return null;
  }
  return {
    agentId: match[1].trim() || "main",
    mainKey: match[2].trim() || "main",
  };
}

export function normalizeAgentsList(
  payload: AgentsListPayload | null | undefined,
  fallbackAgentId?: string,
): {
  agents: AgentSummary[];
  currentAgentId: string;
  mainKey: string;
  scope: SessionScope;
  sessionKey: string;
} {
  const agents = Array.isArray(payload?.agents)
    ? payload.agents
        .map((agent) => {
          const id = typeof agent?.id === "string" ? agent.id.trim() : "";
          if (!id) {
            return null;
          }
          const name = typeof agent?.name === "string" ? agent.name.trim() : "";
          return { id, ...(name ? { name } : {}) };
        })
        .filter((agent): agent is AgentSummary => Boolean(agent))
    : [];
  const defaultId =
    typeof payload?.defaultId === "string" && payload.defaultId.trim()
      ? payload.defaultId.trim()
      : "";
  const preferredId = fallbackAgentId?.trim() || defaultId || agents[0]?.id || "main";
  const currentAgentId = agents.some((agent) => agent.id === preferredId)
    ? preferredId
    : (defaultId && agents.some((agent) => agent.id === defaultId) ? defaultId : agents[0]?.id) ||
      preferredId;
  const mainKey =
    typeof payload?.mainKey === "string" && payload.mainKey.trim() ? payload.mainKey.trim() : "main";
  const scope = payload?.scope === "global" ? "global" : "per-sender";
  return {
    agents,
    currentAgentId,
    mainKey,
    scope,
    sessionKey: buildStandaloneSessionKey({ agentId: currentAgentId, mainKey, scope }),
  };
}

export function normalizeModelsList(
  payload: ModelsListPayload | null | undefined,
  fallbackModelId?: string,
): {
  models: ModelChoice[];
  currentModelId: string;
} {
  const models = Array.isArray(payload?.models)
    ? payload.models
        .map((model) => {
          const id = typeof model?.id === "string" ? model.id.trim() : "";
          if (!id) {
            return null;
          }
          const label = typeof model?.name === "string" ? model.name.trim() : "";
          const provider = typeof model?.provider === "string" ? model.provider.trim() : "";
          return {
            id,
            ...(provider ? { provider } : {}),
            ...(label ? { label } : {}),
          };
        })
        .filter((model): model is ModelChoice => Boolean(model))
    : [];
  const preferredId = fallbackModelId?.trim() || "";
  const currentModelId = models.some((model) => model.id === preferredId)
    ? preferredId
    : (models[0]?.id ?? "");
  return { models, currentModelId };
}

export function normalizeSessionsList(
  payload:
    | {
        sessions?: Array<{
          key?: string;
          label?: string;
          displayName?: string;
          derivedTitle?: string;
          lastMessagePreview?: string;
          updatedAt?: number | null;
        }>;
      }
    | null
    | undefined,
): SavedSession[] {
  const sessions = Array.isArray(payload?.sessions) ? payload.sessions : [];
  return sessions
    .map((session) => {
      const key = typeof session?.key === "string" ? session.key.trim() : "";
      if (!key || key === "global" || key === "unknown") {
        return null;
      }
      const parsed = parseStandaloneSessionKey(key);
      if (!parsed) {
        return null;
      }
      const title =
        (typeof session?.displayName === "string" && session.displayName.trim()) ||
        (typeof session?.label === "string" && session.label.trim()) ||
        (typeof session?.derivedTitle === "string" && session.derivedTitle.trim()) ||
        parsed.mainKey;
      const preview =
        typeof session?.lastMessagePreview === "string" && session.lastMessagePreview.trim()
          ? session.lastMessagePreview.trim()
          : undefined;
      const updatedAt =
        typeof session?.updatedAt === "number" && Number.isFinite(session.updatedAt)
          ? session.updatedAt
          : undefined;
      return {
        key,
        agentId: parsed.agentId,
        mainKey: parsed.mainKey,
        title,
        ...(preview ? { preview } : {}),
        ...(updatedAt ? { updatedAt } : {}),
      };
    })
    .filter((session): session is SavedSession => Boolean(session))
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

import type { TraversalAIConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: TraversalAIConfig, pluginId: string): TraversalAIConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}

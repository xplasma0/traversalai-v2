import type { TraversalAIConfig } from "../config/config.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { ensureModelAllowlistEntry } from "./model-allowlist.js";

export async function applyDefaultModelChoice(params: {
  config: TraversalAIConfig;
  setDefaultModel: boolean;
  defaultModel: string;
  applyDefaultConfig: (config: TraversalAIConfig) => TraversalAIConfig;
  applyProviderConfig: (config: TraversalAIConfig) => TraversalAIConfig;
  noteDefault?: string;
  noteAgentModel: (model: string) => Promise<void>;
  prompter: WizardPrompter;
}): Promise<{ config: TraversalAIConfig; agentModelOverride?: string }> {
  if (params.setDefaultModel) {
    const next = params.applyDefaultConfig(params.config);
    if (params.noteDefault) {
      await params.prompter.note(`Default model set to ${params.noteDefault}`, "Model configured");
    }
    return { config: next };
  }

  const next = params.applyProviderConfig(params.config);
  const nextWithModel = ensureModelAllowlistEntry({
    cfg: next,
    modelRef: params.defaultModel,
  });
  await params.noteAgentModel(params.defaultModel);
  return { config: nextWithModel, agentModelOverride: params.defaultModel };
}

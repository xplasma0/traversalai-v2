import type { TraversalAIConfig } from "../config/config.js";
import { applyAgentDefaultPrimaryModel } from "./model-default.js";

export const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3-pro-preview";

export function applyGoogleGeminiModelDefault(cfg: TraversalAIConfig): {
  next: TraversalAIConfig;
  changed: boolean;
} {
  return applyAgentDefaultPrimaryModel({ cfg, model: GOOGLE_GEMINI_DEFAULT_MODEL });
}

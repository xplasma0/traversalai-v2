import type {
  AnyAgentTool,
  TraversalAIPluginApi,
  TraversalAIPluginToolFactory,
} from "../../src/plugins/types.js";
import { createLobsterTool } from "./src/lobster-tool.js";

export default function register(api: TraversalAIPluginApi) {
  api.registerTool(
    ((ctx) => {
      if (ctx.sandboxed) {
        return null;
      }
      return createLobsterTool(api) as AnyAgentTool;
    }) as TraversalAIPluginToolFactory,
    { optional: true },
  );
}

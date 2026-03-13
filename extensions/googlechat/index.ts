import type { TraversalAIPluginApi } from "traversalai/plugin-sdk";
import { emptyPluginConfigSchema } from "traversalai/plugin-sdk";
import { googlechatDock, googlechatPlugin } from "./src/channel.js";
import { handleGoogleChatWebhookRequest } from "./src/monitor.js";
import { setGoogleChatRuntime } from "./src/runtime.js";

const plugin = {
  id: "googlechat",
  name: "Google Chat",
  description: "TraversalAI Google Chat channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: TraversalAIPluginApi) {
    setGoogleChatRuntime(api.runtime);
    api.registerChannel({ plugin: googlechatPlugin, dock: googlechatDock });
    api.registerHttpHandler(handleGoogleChatWebhookRequest);
  },
};

export default plugin;

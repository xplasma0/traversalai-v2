import os from "node:os";
import path from "node:path";
import type { PluginRuntime } from "traversalai/plugin-sdk";

export const msteamsRuntimeStub = {
  state: {
    resolveStateDir: (env: NodeJS.ProcessEnv = process.env, homedir?: () => string) => {
      const override = env.TRAVERSALAI_STATE_DIR?.trim() || env.TRAVERSALAI_STATE_DIR?.trim();
      if (override) {
        return override;
      }
      const resolvedHome = homedir ? homedir() : os.homedir();
      return path.join(resolvedHome, ".traversalai");
    },
  },
} as unknown as PluginRuntime;

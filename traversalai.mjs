#!/usr/bin/env node

import module from "node:module";
import os from "node:os";
import path from "node:path";

const stateDir = path.join(os.homedir(), ".traversalai");

process.env.TRAVERSALAI_APP = process.env.TRAVERSALAI_APP || "1";
process.env.TRAVERSALAI_CLI_NAME = process.env.TRAVERSALAI_CLI_NAME || "traversalai";
process.env.TRAVERSALAI_STATE_DIR = process.env.TRAVERSALAI_STATE_DIR || stateDir;
process.env.TRAVERSALAI_CONFIG_PATH =
  process.env.TRAVERSALAI_CONFIG_PATH || path.join(stateDir, "traversalai.json");

// https://nodejs.org/api/module.html#module-compile-cache
if (module.enableCompileCache && !process.env.NODE_DISABLE_COMPILE_CACHE) {
  try {
    module.enableCompileCache();
  } catch {
    // Ignore errors
  }
}

const isModuleNotFoundError = (err) =>
  err && typeof err === "object" && "code" in err && err.code === "ERR_MODULE_NOT_FOUND";

const installProcessWarningFilter = async () => {
  for (const specifier of ["./dist/warning-filter.js", "./dist/warning-filter.mjs"]) {
    try {
      const mod = await import(specifier);
      if (typeof mod.installProcessWarningFilter === "function") {
        mod.installProcessWarningFilter();
        return;
      }
    } catch (err) {
      if (isModuleNotFoundError(err)) {
        continue;
      }
      throw err;
    }
  }
};

await installProcessWarningFilter();

const tryImport = async (specifier) => {
  try {
    await import(specifier);
    return true;
  } catch (err) {
    if (isModuleNotFoundError(err)) {
      return false;
    }
    throw err;
  }
};

if (await tryImport("./dist/entry.js")) {
  // OK
} else if (await tryImport("./dist/entry.mjs")) {
  // OK
} else {
  throw new Error("traversalai: missing dist/entry.(m)js (build output).");
}

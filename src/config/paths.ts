import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { expandHomePrefix, resolveRequiredHomeDir } from "../infra/home-dir.js";
import type { TraversalAIConfig } from "./types.js";

/**
 * Nix mode detection: When TRAVERSALAI_NIX_MODE=1, the gateway is running under Nix.
 * In this mode:
 * - No auto-install flows should be attempted
 * - Missing dependencies should produce actionable Nix-specific error messages
 * - Config is managed externally (read-only from Nix perspective)
 */
export function resolveIsNixMode(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.TRAVERSALAI_NIX_MODE === "1";
}

export const isNixMode = resolveIsNixMode();

// Support historical (and occasionally misspelled) legacy state dirs.
const LEGACY_STATE_DIRNAMES = [".clawdbot", ".moldbot", ".moltbot"] as const;
const TRAVERSALAI_STATE_DIRNAME = ".traversalai";
const TRAVERSALAI_CONFIG_FILENAME = "traversalai.json";
const LEGACY_CONFIG_FILENAMES = ["clawdbot.json", "moldbot.json", "moltbot.json"] as const;

function resolveDefaultHomeDir(): string {
  return resolveRequiredHomeDir(process.env, os.homedir);
}

/** Build a homedir thunk that respects TRAVERSALAI_HOME for the given env. */
function envHomedir(env: NodeJS.ProcessEnv): () => string {
  return () => resolveRequiredHomeDir(env, os.homedir);
}

function legacyStateDirs(homedir: () => string = resolveDefaultHomeDir): string[] {
  return LEGACY_STATE_DIRNAMES.map((dir) => path.join(homedir(), dir));
}

function isTraversalAiRuntime(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.TRAVERSALAI_APP === "1";
}

function defaultStateDirname(env: NodeJS.ProcessEnv = process.env): string {
  return TRAVERSALAI_STATE_DIRNAME;
}

function defaultConfigFilename(env: NodeJS.ProcessEnv = process.env): string {
  return TRAVERSALAI_CONFIG_FILENAME;
}

function newStateDir(
  homedir: () => string = resolveDefaultHomeDir,
  env: NodeJS.ProcessEnv = process.env,
): string {
  return path.join(homedir(), defaultStateDirname(env));
}

export function resolveLegacyStateDir(homedir: () => string = resolveDefaultHomeDir): string {
  return legacyStateDirs(homedir)[0] ?? newStateDir(homedir);
}

export function resolveLegacyStateDirs(homedir: () => string = resolveDefaultHomeDir): string[] {
  return legacyStateDirs(homedir);
}

export function resolveNewStateDir(homedir: () => string = resolveDefaultHomeDir): string {
  return newStateDir(homedir);
}

/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via TRAVERSALAI_STATE_DIR.
 * Default: ~/.traversalai
 */
export function resolveStateDir(
  env: NodeJS.ProcessEnv = process.env,
  homedir: () => string = envHomedir(env),
): string {
  const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
  const override =
    env.TRAVERSALAI_STATE_DIR?.trim() ||
    env.CLAWDBOT_STATE_DIR?.trim();
  if (override) {
    return resolveUserPath(override, env, effectiveHomedir);
  }
  const newDir = newStateDir(effectiveHomedir, env);
  const useLegacyFallback = !isTraversalAiRuntime(env);
  const legacyDirs = useLegacyFallback ? legacyStateDirs(effectiveHomedir) : [];
  const hasNew = fs.existsSync(newDir);
  if (hasNew) {
    return newDir;
  }
  const existingLegacy = legacyDirs.find((dir) => {
    try {
      return fs.existsSync(dir);
    } catch {
      return false;
    }
  });
  if (existingLegacy) {
    return existingLegacy;
  }
  return newDir;
}

function resolveUserPath(
  input: string,
  env: NodeJS.ProcessEnv = process.env,
  homedir: () => string = envHomedir(env),
): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    const expanded = expandHomePrefix(trimmed, {
      home: resolveRequiredHomeDir(env, homedir),
      env,
      homedir,
    });
    return path.resolve(expanded);
  }
  return path.resolve(trimmed);
}

export const STATE_DIR = resolveStateDir();

/**
 * Config file path (JSON5).
 * Can be overridden via TRAVERSALAI_CONFIG_PATH.
 * Default: ~/.traversalai/traversalai.json (or $TRAVERSALAI_STATE_DIR/traversalai.json)
 */
export function resolveCanonicalConfigPath(
  env: NodeJS.ProcessEnv = process.env,
  stateDir: string = resolveStateDir(env, envHomedir(env)),
): string {
  const override =
    env.TRAVERSALAI_CONFIG_PATH?.trim() ||
    env.TRAVERSALAI_CONFIG_PATH?.trim() ||
    env.CLAWDBOT_CONFIG_PATH?.trim();
  if (override) {
    return resolveUserPath(override, env, envHomedir(env));
  }
  return path.join(stateDir, defaultConfigFilename(env));
}

/**
 * Resolve the active config path by preferring existing config candidates
 * before falling back to the canonical path.
 */
export function resolveConfigPathCandidate(
  env: NodeJS.ProcessEnv = process.env,
  homedir: () => string = envHomedir(env),
): string {
  const candidates = resolveDefaultConfigCandidates(env, homedir);
  const existing = candidates.find((candidate) => {
    try {
      return fs.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}

/**
 * Active config path (prefers existing config files).
 */
export function resolveConfigPath(
  env: NodeJS.ProcessEnv = process.env,
  stateDir: string = resolveStateDir(env, envHomedir(env)),
  homedir: () => string = envHomedir(env),
): string {
  const override = env.TRAVERSALAI_CONFIG_PATH?.trim() || env.TRAVERSALAI_CONFIG_PATH?.trim();
  if (override) {
    return resolveUserPath(override, env, homedir);
  }
  const stateOverride = env.TRAVERSALAI_STATE_DIR?.trim() || env.TRAVERSALAI_STATE_DIR?.trim();
  const configFilename = defaultConfigFilename(env);
  const candidates = [
    path.join(stateDir, configFilename),
    ...LEGACY_CONFIG_FILENAMES.map((name) => path.join(stateDir, name)),
  ];
  const existing = candidates.find((candidate) => {
    try {
      return fs.existsSync(candidate);
    } catch {
      return false;
    }
  });
  if (existing) {
    return existing;
  }
  if (stateOverride) {
    return path.join(stateDir, configFilename);
  }
  const defaultStateDir = resolveStateDir(env, homedir);
  if (path.resolve(stateDir) === path.resolve(defaultStateDir)) {
    return resolveConfigPathCandidate(env, homedir);
  }
  return path.join(stateDir, configFilename);
}

export const CONFIG_PATH = resolveConfigPathCandidate();

/**
 * Resolve default config path candidates across default locations.
 * Order: explicit config path → state-dir-derived paths → new default.
 */
export function resolveDefaultConfigCandidates(
  env: NodeJS.ProcessEnv = process.env,
  homedir: () => string = envHomedir(env),
): string[] {
  const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
  const explicit =
    env.TRAVERSALAI_CONFIG_PATH?.trim() ||
    env.TRAVERSALAI_CONFIG_PATH?.trim() ||
    env.CLAWDBOT_CONFIG_PATH?.trim();
  const configFilename = defaultConfigFilename(env);
  if (explicit) {
    return [resolveUserPath(explicit, env, effectiveHomedir)];
  }

  const candidates: string[] = [];
  const traversalaiStateDir =
    env.TRAVERSALAI_STATE_DIR?.trim() ||
    env.TRAVERSALAI_STATE_DIR?.trim() ||
    env.CLAWDBOT_STATE_DIR?.trim();
  if (traversalaiStateDir) {
    const resolved = resolveUserPath(traversalaiStateDir, env, effectiveHomedir);
    candidates.push(path.join(resolved, configFilename));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(resolved, name)));
  }

  const defaultDirs = isTraversalAiRuntime(env)
    ? [newStateDir(effectiveHomedir, env)]
    : [newStateDir(effectiveHomedir, env), ...legacyStateDirs(effectiveHomedir)];
  for (const dir of defaultDirs) {
    candidates.push(path.join(dir, configFilename));
    candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(dir, name)));
  }
  return candidates;
}

export const DEFAULT_GATEWAY_PORT = 18789;
export const DEFAULT_TRAVERSALAI_GATEWAY_PORT = 28789;

export function resolveDefaultGatewayPort(env: NodeJS.ProcessEnv = process.env): number {
  return isTraversalAiRuntime(env) ? DEFAULT_TRAVERSALAI_GATEWAY_PORT : DEFAULT_GATEWAY_PORT;
}

/**
 * Gateway lock directory (ephemeral).
 * Default: os.tmpdir()/traversalai-<uid> (uid suffix when available).
 */
export function resolveGatewayLockDir(tmpdir: () => string = os.tmpdir): string {
  const base = tmpdir();
  const uid = typeof process.getuid === "function" ? process.getuid() : undefined;
  const suffix = uid != null ? `traversalai-${uid}` : "traversalai";
  return path.join(base, suffix);
}

const OAUTH_FILENAME = "oauth.json";

/**
 * OAuth credentials storage directory.
 *
 * Precedence:
 * - `TRAVERSALAI_OAUTH_DIR` (explicit override)
 * - `$*_STATE_DIR/credentials` (canonical server/default)
 */
export function resolveOAuthDir(
  env: NodeJS.ProcessEnv = process.env,
  stateDir: string = resolveStateDir(env, envHomedir(env)),
): string {
  const override = env.TRAVERSALAI_OAUTH_DIR?.trim() || env.TRAVERSALAI_OAUTH_DIR?.trim();
  if (override) {
    return resolveUserPath(override, env, envHomedir(env));
  }
  return path.join(stateDir, "credentials");
}

export function resolveOAuthPath(
  env: NodeJS.ProcessEnv = process.env,
  stateDir: string = resolveStateDir(env, envHomedir(env)),
): string {
  return path.join(resolveOAuthDir(env, stateDir), OAUTH_FILENAME);
}

export function resolveGatewayPort(
  cfg?: TraversalAIConfig,
  env: NodeJS.ProcessEnv = process.env,
): number {
  const envRaw =
    env.TRAVERSALAI_GATEWAY_PORT?.trim() ||
    env.TRAVERSALAI_GATEWAY_PORT?.trim() ||
    env.CLAWDBOT_GATEWAY_PORT?.trim();
  if (envRaw) {
    const parsed = Number.parseInt(envRaw, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  const configPort = cfg?.gateway?.port;
  if (typeof configPort === "number" && Number.isFinite(configPort)) {
    if (configPort > 0) {
      return configPort;
    }
  }
  return resolveDefaultGatewayPort(env);
}

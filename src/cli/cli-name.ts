import path from "node:path";

export const DEFAULT_CLI_NAME = "traversalai";

const KNOWN_CLI_NAMES = new Set([DEFAULT_CLI_NAME, "traversalai"]);
const CLI_PREFIX_RE = /^(?:((?:pnpm|npm|bunx|npx)\s+))?(traversalai|traversalai)\b/;

export function resolveCliName(argv: string[] = process.argv): string {
  const envCliName = process.env.TRAVERSALAI_CLI_NAME?.trim();
  if (envCliName && KNOWN_CLI_NAMES.has(envCliName)) {
    return envCliName;
  }
  const argv1 = argv[1];
  if (!argv1) {
    return envCliName || DEFAULT_CLI_NAME;
  }
  const base = path.basename(argv1).trim();
  if (KNOWN_CLI_NAMES.has(base)) {
    return base;
  }
  return envCliName || DEFAULT_CLI_NAME;
}

export function replaceCliName(command: string, cliName = resolveCliName()): string {
  if (!command.trim()) {
    return command;
  }
  if (!CLI_PREFIX_RE.test(command)) {
    return command;
  }
  return command.replace(CLI_PREFIX_RE, (_match, runner: string | undefined) => {
    return `${runner ?? ""}${cliName}`;
  });
}

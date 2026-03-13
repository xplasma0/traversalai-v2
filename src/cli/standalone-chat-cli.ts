import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Command } from "commander";
import { startChatServer } from "../chat-server/server.js";
import { detectBrowserOpenSupport, openUrl } from "../commands/onboard-helpers.js";
import { defaultRuntime } from "../runtime.js";
import { formatDocsLink } from "../terminal/links.js";
import { theme } from "../terminal/theme.js";

export function getChatUiDirCandidates(packageRoot: string): string[] {
  return [
    join(packageRoot, "dist", "standalone-chat-ui"),
    join(packageRoot, "apps", "standalone-chat", "dist"),
  ];
}

export function resolveChatUiDir(): string {
  // From dist/ (compiled), navigate up to package root and check packaged assets first.
  const here = dirname(fileURLToPath(import.meta.url));
  const packageRoot = dirname(here);
  const candidates = getChatUiDirCandidates(packageRoot);
  const resolved = candidates.find((candidate) => existsSync(join(candidate, "index.html")));
  return resolved ?? candidates[0];
}

export function registerStandaloneChatCli(program: Command) {
  program
    .command("chat")
    .description("Open the TraversalAI Chat UI in your browser (gateway-connected)")
    .option("--port <port>", "HTTP server port", "5175")
    .option("--no-open", "Print URL but do not launch a browser")
    .option("--url <url>", "Gateway WebSocket URL override")
    .option("--token <token>", "Gateway token override")
    .option("--password <password>", "Gateway password override")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/chat", "xplasma0.github.io/traversalai-docs/cli/chat")}\n`,
    )
    .action(async (opts) => {
      const staticDir = resolveChatUiDir();
      if (!existsSync(join(staticDir, "index.html"))) {
        defaultRuntime.error(
          "Chat UI assets are missing. Reinstall the package or rebuild the standalone chat bundle.",
        );
        defaultRuntime.exit(1);
        return;
      }

      const port = Number.parseInt(String(opts.port), 10) || 5175;

      try {
        const server = await startChatServer({
          port,
          staticDir,
          gatewayUrl: opts.url as string | undefined,
          gatewayToken: opts.token as string | undefined,
          gatewayPassword: opts.password as string | undefined,
        });

        defaultRuntime.log(`TraversalAI Chat UI: ${server.url}`);

        if (opts.open !== false) {
          const browserSupport = await detectBrowserOpenSupport();
          if (browserSupport.ok) {
            const opened = await openUrl(server.url);
            if (opened) {
              defaultRuntime.log("Opened in your browser. Press Ctrl+C to stop.");
            } else {
              defaultRuntime.log("Could not open browser. Visit the URL above.");
            }
          } else {
            defaultRuntime.log("No browser detected. Visit the URL above.");
          }
        } else {
          defaultRuntime.log("Browser launch disabled (--no-open). Visit the URL above.");
        }

        // Keep the process alive until Ctrl+C
        await new Promise<void>((resolve) => {
          const shutdown = () => {
            defaultRuntime.log("\nShutting down...");
            server.stop();
            resolve();
          };
          process.on("SIGINT", shutdown);
          process.on("SIGTERM", shutdown);
        });
      } catch (err) {
        defaultRuntime.error(String(err));
        defaultRuntime.exit(1);
      }
    });
}

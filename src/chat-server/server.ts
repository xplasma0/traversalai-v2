import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { extname, join } from "node:path";
import { WebSocket, WebSocketServer } from "ws";
import { GatewayClient } from "../gateway/client.js";
import { GATEWAY_CLIENT_CAPS } from "../gateway/protocol/client-info.js";
import { PROTOCOL_VERSION } from "../gateway/protocol/index.js";
import { loadOrCreateDeviceIdentity } from "../infra/device-identity.js";
import { resolveGatewayConnection } from "../tui/gateway-chat.js";
import { GATEWAY_CLIENT_MODES, GATEWAY_CLIENT_NAMES } from "../utils/message-channel.js";
import { VERSION } from "../version.js";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

export type ChatServerOptions = {
  port?: number;
  staticDir: string;
  gatewayUrl?: string;
  gatewayToken?: string;
  gatewayPassword?: string;
};

/**
 * Start an HTTP + WebSocket server that:
 * 1. Serves the standalone-chat frontend from `staticDir`
 * 2. Proxies browser WebSocket connections to the TraversalAI gateway
 *
 * Each browser WS connection gets its own dedicated GatewayClient so that
 * events are scoped per client.
 */
export async function startChatServer(
  opts: ChatServerOptions,
): Promise<{ port: number; url: string; stop: () => void }> {
  const { staticDir } = opts;
  const port = opts.port ?? 5175;

  // Resolve gateway connection details from user config
  const gwConn = resolveGatewayConnection({
    url: opts.gatewayUrl,
    token: opts.gatewayToken,
    password: opts.gatewayPassword,
  });

  const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    serveStatic(req, res, staticDir);
  });

  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (browserWs) => {
    // Each browser client gets its own gateway connection
    const gwClient = createGatewayProxy(browserWs, gwConn);
    gwClient.start();

    // Forward RPC requests from browser to gateway
    browserWs.on("message", (raw) => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg.type === "rpc" && typeof msg.method === "string") {
          gwClient
            .request(msg.method, msg.params)
            .then((payload) => {
              safeSend(browserWs, { type: "resp", id: msg.id, ok: true, payload });
            })
            .catch((err: Error) => {
              safeSend(browserWs, {
                type: "resp",
                id: msg.id,
                ok: false,
                error: { message: err.message },
              });
            });
        }
      } catch {
        // Ignore malformed messages
      }
    });

    browserWs.on("close", () => {
      gwClient.stop();
    });
  });

  return new Promise((resolve, reject) => {
    httpServer.on("error", reject);
    httpServer.listen(port, "127.0.0.1", () => {
      const address = httpServer.address() as AddressInfo | null;
      const resolvedPort = address?.port ?? port;
      const url = `http://127.0.0.1:${resolvedPort}`;
      resolve({
        port: resolvedPort,
        url,
        stop: () => {
          for (const client of wss.clients) {
            client.close();
          }
          wss.close();
          httpServer.close();
        },
      });
    });
  });
}

// --- Gateway proxy per browser client ---

function createGatewayProxy(
  browserWs: WebSocket,
  conn: { url: string; token?: string; password?: string },
): GatewayClient {
  // Load device identity eagerly so we control the exact identity used.
  const deviceIdentity = loadOrCreateDeviceIdentity();
  return new GatewayClient({
    url: conn.url,
    token: conn.token,
    password: conn.password,
    clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
    clientDisplayName: "traversalai-chat-bff",
    clientVersion: VERSION,
    platform: process.platform,
    mode: GATEWAY_CLIENT_MODES.UI,
    caps: [GATEWAY_CLIENT_CAPS.TOOL_EVENTS],
    instanceId: randomUUID(),
    minProtocol: PROTOCOL_VERSION,
    maxProtocol: PROTOCOL_VERSION,
    scopes: ["operator.admin"],
    deviceIdentity,

    onHelloOk: (hello) => {
      safeSend(browserWs, { type: "gateway.ready", hello });
    },

    onEvent: (evt) => {
      safeSend(browserWs, {
        type: "gateway.event",
        event: evt.event,
        payload: evt.payload,
        seq: evt.seq,
      });
    },

    onClose: (code, reason) => {
      safeSend(browserWs, {
        type: "gateway.disconnected",
        code,
        reason,
      });
    },

    onConnectError: (err) => {
      safeSend(browserWs, {
        type: "gateway.error",
        message: err.message,
      });
    },
  });
}

function safeSend(ws: WebSocket, data: unknown) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// --- Static file server ---

function serveStatic(req: IncomingMessage, res: ServerResponse, staticDir: string) {
  let urlPath = (req.url ?? "/").split("?")[0];
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = join(staticDir, urlPath);

  // Prevent directory traversal
  if (!filePath.startsWith(staticDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    // SPA fallback: serve index.html for non-asset paths
    const indexPath = join(staticDir, "index.html");
    if (existsSync(indexPath)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(readFileSync(indexPath));
    } else {
      res.writeHead(404);
      res.end("Not Found — run the frontend build first.");
    }
    return;
  }

  const ext = extname(filePath);
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  res.end(readFileSync(filePath));
}

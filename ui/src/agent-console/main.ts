import { css, html, LitElement, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { extractText } from "../ui/chat/message-extract.ts";
import type { ChatEventPayload } from "../ui/controllers/chat.ts";
import { GatewayBrowserClient, type GatewayEventFrame } from "../ui/gateway.ts";
import type { GatewayAgentRow } from "../ui/types.ts";

type RenderMessage = {
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: number;
};

const AGENT_UI_SETTINGS_KEY = "traversalai.agent.ui.v1";

function defaultGatewayUrl(): string {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${location.host}`;
}

function readSavedSettings(): { gatewayUrl: string; token: string } {
  try {
    const raw = localStorage.getItem(AGENT_UI_SETTINGS_KEY);
    if (!raw) {
      return { gatewayUrl: defaultGatewayUrl(), token: "" };
    }
    const parsed = JSON.parse(raw) as { gatewayUrl?: string; token?: string };
    return {
      gatewayUrl:
        typeof parsed.gatewayUrl === "string" && parsed.gatewayUrl.trim()
          ? parsed.gatewayUrl.trim()
          : defaultGatewayUrl(),
      token: typeof parsed.token === "string" ? parsed.token : "",
    };
  } catch {
    return { gatewayUrl: defaultGatewayUrl(), token: "" };
  }
}

function saveSettings(gatewayUrl: string, token: string) {
  localStorage.setItem(AGENT_UI_SETTINGS_KEY, JSON.stringify({ gatewayUrl, token }));
}

function normalizeRole(message: unknown): "user" | "assistant" | "system" {
  const role =
    typeof (message as { role?: unknown })?.role === "string"
      ? ((message as { role: string }).role || "").toLowerCase()
      : "system";
  if (role === "user") {
    return "user";
  }
  if (role === "assistant") {
    return "assistant";
  }
  return "system";
}

function normalizeMessage(message: unknown): RenderMessage | null {
  const text = extractText(message);
  if (!text || !text.trim()) {
    return null;
  }
  const timestampRaw = (message as { timestamp?: unknown })?.timestamp;
  const timestamp = typeof timestampRaw === "number" ? timestampRaw : Date.now();
  return {
    role: normalizeRole(message),
    text,
    timestamp,
  };
}

@customElement("traversal-agent-console")
export class TraversalAgentConsole extends LitElement {
  static override styles = css`
    :host {
      --brand-bg: #ffffff;
      --brand-panel: #f9f9f9;
      --brand-text: #0d0d0d;
      --brand-muted: #666666;
      --brand-border: #e5e5e5;
      --brand-accent: #10a37f;
      --brand-accent-hover: #1a7f64;
      --brand-danger: #ef4444;

      display: block;
      min-height: 100vh;
      color: var(--brand-text);
      font-family:
        "Inter",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
      background: var(--brand-bg);
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --brand-bg: #212121;
        --brand-panel: #171717;
        --brand-text: #ececec;
        --brand-muted: #b4b4b4;
        --brand-border: #333333;
      }
    }

    * {
      box-sizing: border-box;
    }

    .layout {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
    }

    .left {
      background: var(--brand-panel);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100vh;
      overflow-y: auto;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 10px;
      background: transparent;
    }

    .brand img {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }

    .brand-title {
      font-size: 16px;
      font-weight: 500;
      letter-spacing: normal;
    }

    .brand-sub {
      display: none;
    }

    .connect {
      display: grid;
      gap: 12px;
      padding: 12px 10px;
    }

    label {
      display: grid;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;
      color: var(--brand-text);
    }

    input,
    textarea,
    button {
      font: inherit;
      color: inherit;
    }

    input,
    textarea {
      background: var(--brand-bg);
      border: 1px solid var(--brand-border);
      border-radius: 6px;
      padding: 8px 12px;
      outline: none;
      transition: border-color 0.15s ease;
    }

    input:focus,
    textarea:focus {
      border-color: var(--brand-accent);
    }

    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: space-between;
      font-size: 12px;
      color: var(--brand-muted);
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--brand-muted);
    }

    .dot.ok {
      background: var(--brand-accent);
    }

    button {
      border: 1px solid transparent;
      border-radius: 6px;
      padding: 6px 12px;
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      transition: all 0.15s ease;
    }

    .btn-primary {
      background: var(--brand-accent);
      color: #fff;
    }

    .btn-primary:hover {
      background: var(--brand-accent-hover);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: transparent;
      border-color: var(--brand-border);
      color: var(--brand-text);
    }

    .btn-secondary:hover {
      background: var(--brand-border);
    }

    .agent-list {
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 10px;
    }

    .agent-item {
      width: 100%;
      border: none;
      background: transparent;
      border-radius: 6px;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      color: var(--brand-text);
      font-weight: 400;
    }

    .agent-item:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    @media (prefers-color-scheme: dark) {
      .agent-item:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }

    .agent-item.active {
      background: rgba(0, 0, 0, 0.08);
      font-weight: 500;
    }

    @media (prefers-color-scheme: dark) {
      .agent-item.active {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .agent-name {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .agent-id {
      display: none;
    }

    .main {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      min-height: 100vh;
      background: var(--brand-bg);
    }

    .main-header {
      padding: 18px 24px;
      border-bottom: 1px solid var(--brand-border);
      background: var(--brand-bg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .main-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: normal;
    }

    .main-sub {
      color: var(--brand-muted);
      font-size: 13px;
      margin-top: 4px;
      font-family: monospace;
    }

    .thread {
      padding: 24px 24px 120px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
    }

    .bubble {
      max-width: 100%;
      padding: 0;
      border-radius: 0;
      border: none;
      background: transparent;
      white-space: pre-wrap;
      line-height: 1.6;
      font-size: 15px;
      display: flex;
      gap: 16px;
    }

    .bubble::before {
      content: "";
      width: 30px;
      height: 30px;
      border-radius: 4px;
      flex-shrink: 0;
      background-size: cover;
      background-position: center;
    }

    .bubble.user::before {
      background-color: var(--brand-panel);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E");
      background-size: 16px;
      background-repeat: no-repeat;
      align-self: flex-start;
    }

    @media (prefers-color-scheme: dark) {
      .bubble.user::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b4b4b4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E");
      }
    }

    .bubble.assistant::before {
      background-color: var(--brand-accent);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7v1a1 1 0 0 1-1 1h-2v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3H4a1 1 0 0 1-1-1v-1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z'/%3E%3C/svg%3E");
      background-size: 18px;
      background-repeat: no-repeat;
      align-self: flex-start;
    }

    .bubble.system {
      justify-content: center;
      color: var(--brand-muted);
      font-size: 13px;
    }

    .bubble.system::before {
      display: none;
    }

    .bubble-content {
      flex: 1;
      min-width: 0;
    }

    .composer {
      position: sticky;
      bottom: 0;
      padding: 24px;
      background: linear-gradient(180deg, transparent, var(--brand-bg) 40%);
    }

    .composer-box {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid var(--brand-border);
      border-radius: 12px;
      background: var(--brand-bg);
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    @media (prefers-color-scheme: dark) {
      .composer-box {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    }

    .composer-box:focus-within {
      border-color: var(--brand-muted);
    }

    textarea {
      min-height: 24px;
      max-height: 200px;
      resize: none;
      border: none;
      background: transparent;
      padding: 0;
      font-size: 15px;
      line-height: 1.5;
    }

    textarea:focus {
      box-shadow: none;
      border-color: transparent;
    }

    .composer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .btn-send {
      background: var(--brand-accent);
      color: white;
      border: none;
      border-radius: 6px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
    }

    .btn-send:disabled {
      background: var(--brand-border);
      color: var(--brand-muted);
      cursor: not-allowed;
    }

    .btn-send svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .muted {
      color: var(--brand-muted);
      font-size: 13px;
    }

    .error {
      color: var(--brand-danger);
      font-size: 13px;
      padding: 8px 12px;
      background: rgba(239, 68, 68, 0.1);
      border-radius: 6px;
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .left {
        display: none; /* In a real app, this would be a drawer */
      }

      .main {
        height: 100vh;
      }

      .thread {
        padding: 16px 16px 120px;
      }

      .composer {
        padding: 16px;
      }
    }
  `;

  private client: GatewayBrowserClient | null = null;

  @state() private gatewayUrl = readSavedSettings().gatewayUrl;
  @state() private token = readSavedSettings().token;
  @state() private connected = false;
  @state() private connecting = false;
  @state() private agents: GatewayAgentRow[] = [];
  @state() private selectedAgentId: string | null = null;
  @state() private messages: RenderMessage[] = [];
  @state() private draft = "";
  @state() private stream = "";
  @state() private sending = false;
  @state() private lastError: string | null = null;

  override createRenderRoot() {
    return this.attachShadow({ mode: "open" });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.connect();
  }

  override disconnectedCallback(): void {
    this.client?.stop();
    this.client = null;
    super.disconnectedCallback();
  }

  private sessionKeyForCurrentAgent(): string {
    const id = this.selectedAgentId || "main";
    return `agent:${id}:main`;
  }

  private async loadAgents() {
    if (!this.client || !this.connected) {
      return;
    }
    const res = await this.client.request<{ agents: GatewayAgentRow[]; defaultId?: string }>(
      "agents.list",
      {},
    );
    this.agents = Array.isArray(res.agents) ? res.agents : [];
    const hasSelection =
      this.selectedAgentId && this.agents.some((entry) => entry.id === this.selectedAgentId);
    if (!hasSelection) {
      this.selectedAgentId = res.defaultId ?? this.agents[0]?.id ?? "main";
    }
    await this.loadHistory();
  }

  private async loadHistory() {
    if (!this.client || !this.connected || !this.selectedAgentId) {
      return;
    }
    const res = await this.client.request<{ messages?: unknown[] }>("chat.history", {
      sessionKey: this.sessionKeyForCurrentAgent(),
      limit: 200,
    });
    const next: RenderMessage[] = [];
    for (const raw of res.messages ?? []) {
      const normalized = normalizeMessage(raw);
      if (normalized) {
        next.push(normalized);
      }
    }
    this.messages = next;
    this.stream = "";
  }

  private handleGatewayEvent(evt: GatewayEventFrame) {
    if (evt.event !== "chat") {
      return;
    }
    const payload = evt.payload as ChatEventPayload | undefined;
    if (!payload || payload.sessionKey !== this.sessionKeyForCurrentAgent()) {
      return;
    }
    if (payload.state === "delta") {
      const delta = extractText(payload.message);
      if (typeof delta === "string") {
        this.stream = delta;
      }
      return;
    }
    if (payload.state === "final" || payload.state === "aborted") {
      const normalized = normalizeMessage(payload.message);
      if (normalized) {
        this.messages = [...this.messages, normalized];
      }
      this.stream = "";
      this.sending = false;
      return;
    }
    if (payload.state === "error") {
      this.lastError = payload.errorMessage ?? "Agent run failed.";
      this.stream = "";
      this.sending = false;
    }
  }

  private connect() {
    this.lastError = null;
    this.connecting = true;
    this.connected = false;
    saveSettings(this.gatewayUrl, this.token);

    this.client?.stop();
    const client = new GatewayBrowserClient({
      url: this.gatewayUrl,
      token: this.token.trim() ? this.token.trim() : undefined,
      clientName: "traversalai-control-ui",
      mode: "webchat",
      onHello: () => {
        if (this.client !== client) {
          return;
        }
        this.connected = true;
        this.connecting = false;
        this.lastError = null;
        void this.loadAgents().catch((err) => {
          this.lastError = String(err);
        });
      },
      onClose: ({ code, reason, error }) => {
        if (this.client !== client) {
          return;
        }
        this.connected = false;
        this.connecting = false;
        this.sending = false;
        this.stream = "";
        this.lastError = error?.message ?? `Disconnected (${code}): ${reason || "no reason"}`;
      },
      onEvent: (evt) => {
        if (this.client !== client) {
          return;
        }
        this.handleGatewayEvent(evt);
      },
    });
    this.client = client;
    client.start();
  }

  private async selectAgent(agentId: string) {
    if (agentId === this.selectedAgentId) {
      return;
    }
    this.selectedAgentId = agentId;
    this.lastError = null;
    try {
      await this.loadHistory();
    } catch (err) {
      this.lastError = String(err);
    }
  }

  private async send() {
    if (!this.client || !this.connected) {
      return;
    }
    const message = this.draft.trim();
    if (!message || this.sending) {
      return;
    }
    this.sending = true;
    this.lastError = null;
    this.messages = [
      ...this.messages,
      {
        role: "user",
        text: message,
        timestamp: Date.now(),
      },
    ];
    this.draft = "";
    this.stream = "";
    try {
      await this.client.request("chat.send", {
        sessionKey: this.sessionKeyForCurrentAgent(),
        message,
        deliver: false,
      });
    } catch (err) {
      this.lastError = String(err);
      this.sending = false;
      this.stream = "";
    }
  }

  override render() {
    const selectedAgent = this.agents.find((entry) => entry.id === this.selectedAgentId) ?? null;
    const headerName =
      selectedAgent?.identity?.name?.trim() ||
      selectedAgent?.name?.trim() ||
      this.selectedAgentId ||
      "main";

    return html`
      <div class="layout">
        <aside class="left">
          <div class="brand">
            <img src="/traversalai-logo.jpg" alt="TraversalAI" />
            <div>
              <div class="brand-title">TRAVERSALAI</div>
              <div class="brand-sub">Agent Console</div>
            </div>
          </div>

          <section class="connect">
            <label>
              Gateway URL
              <input
                .value=${this.gatewayUrl}
                @input=${(e: Event) => {
                  this.gatewayUrl = (e.target as HTMLInputElement).value;
                }}
                placeholder="ws://127.0.0.1:18789"
              />
            </label>
            <label>
              Token
              <input
                .value=${this.token}
                @input=${(e: Event) => {
                  this.token = (e.target as HTMLInputElement).value;
                }}
                placeholder="Gateway token"
              />
            </label>
            <div class="row">
              <span><span class="dot ${this.connected ? "ok" : ""}"></span> ${
                this.connected ? "Connected" : this.connecting ? "Connecting" : "Offline"
              }</span>
              <button class="btn-secondary" type="button" @click=${() => this.connect()}>
                Reconnect
              </button>
            </div>
            ${this.lastError ? html`<div class="error">${this.lastError}</div>` : nothing}
          </section>

          <section class="agent-list" aria-label="Agent list">
            ${this.agents.map(
              (agent) => html`
                <button
                  type="button"
                  class="agent-item ${agent.id === this.selectedAgentId ? "active" : ""}"
                  @click=${() => {
                    void this.selectAgent(agent.id);
                  }}
                >
                  <span class="agent-name">${agent.identity?.name || agent.name || agent.id}</span>
                  <span class="agent-id">${agent.id}</span>
                </button>
              `,
            )}
          </section>
        </aside>

        <section class="main">
          <header class="main-header">
            <div>
              <div class="main-title">${headerName}</div>
              <div class="main-sub">${this.sessionKeyForCurrentAgent()}</div>
            </div>
            <div class="muted">AgentZero-style operator view</div>
          </header>

          <div class="thread" id="thread">
            ${this.messages.map(
              (msg) => html`<div class="bubble ${msg.role}">
              <div class="bubble-content">${msg.text}</div>
            </div>`,
            )}
            ${
              this.stream
                ? html`<div class="bubble assistant">
              <div class="bubble-content">${this.stream}</div>
            </div>`
                : nothing
            }
            ${
              this.messages.length === 0 && !this.stream
                ? html`
                    <div class="bubble system">
                      <div class="bubble-content">No conversation yet for this agent.</div>
                    </div>
                  `
                : nothing
            }
          </div>

          <footer class="composer">
            <div class="composer-box">
              <textarea
                .value=${this.draft}
                placeholder="Message agent..."
                @input=${(e: Event) => {
                  this.draft = (e.target as HTMLTextAreaElement).value;
                }}
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void this.send();
                  }
                }}
              ></textarea>
              <div class="composer-actions">
                <button
                  class="btn-send"
                  type="button"
                  title="Send message"
                  ?disabled=${!this.connected || this.sending || !this.draft.trim()}
                  @click=${() => void this.send()}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </section>
      </div>
    `;
  }
}

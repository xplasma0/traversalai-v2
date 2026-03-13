# TraversalAI Full Documentation Bundle

Generated: 2026-03-13T07:44:14.627Z

## Reader Guide

This bundle compiles the documentation surface of the repository into a single reference-oriented document. It is not a verbatim copy of every page; it is a structured master guide plus an exhaustive catalog of the shipped docs.

## Product and Installation

- product-facing brand: TraversalAI
- compatibility wrapper and many internals still use TraversalAI naming
- primary install path: `npm install -g traversalai@latest`
- source workflow: `corepack pnpm install`, `corepack pnpm build`, `node traversalai.mjs onboard`

## Built-in Agents

TraversalAI now provisions the following built-ins during setup and onboarding:

1. Master Control Agent
2. Email Agent
3. Social Media Agent

They are created through config-backed provisioning, not through UI-only defaults, so they appear consistently in the gateway and runtime surfaces.

## Key Operator Commands

```text
traversalai onboard
traversalai chat --no-open
traversalai gateway --force
traversalai agents list
traversalai health
traversalai security audit --deep
node scripts/generate-doc-pdfs.mjs
```

## Documentation Map

### .i18n

documentation group

- `docs/.i18n/README.md`

### automation

automation, hooks, cron, webhook, and event-driven workflow docs

- `docs/automation/auth-monitoring.md`
- `docs/automation/cron-jobs.md`
- `docs/automation/cron-vs-heartbeat.md`
- `docs/automation/gmail-pubsub.md`
- `docs/automation/hooks.md`
- `docs/automation/poll.md`
- `docs/automation/troubleshooting.md`
- `docs/automation/webhook.md`

### brave-search.md

documentation group

- `docs/brave-search.md`

### channels

channel-specific setup, routing, pairing, and troubleshooting

- `docs/channels/bluebubbles.md`
- `docs/channels/broadcast-groups.md`
- `docs/channels/channel-routing.md`
- `docs/channels/discord.md`
- `docs/channels/feishu.md`
- `docs/channels/googlechat.md`
- `docs/channels/grammy.md`
- `docs/channels/group-messages.md`
- `docs/channels/groups.md`
- `docs/channels/imessage.md`
- `docs/channels/index.md`
- `docs/channels/irc.md`
- `docs/channels/line.md`
- `docs/channels/location.md`
- `docs/channels/matrix.md`
- `docs/channels/mattermost.md`
- `docs/channels/msteams.md`
- `docs/channels/nextcloud-talk.md`
- `docs/channels/nostr.md`
- `docs/channels/pairing.md`
- `docs/channels/signal.md`
- `docs/channels/slack.md`
- `docs/channels/synology-chat.md`
- `docs/channels/telegram.md`
- `docs/channels/tlon.md`
- `docs/channels/troubleshooting.md`
- `docs/channels/twitch.md`
- `docs/channels/whatsapp.md`
- `docs/channels/zalo.md`
- `docs/channels/zalouser.md`

### ci.md

documentation group

- `docs/ci.md`

### cli

CLI command reference by feature area

- `docs/cli/acp.md`
- `docs/cli/agent.md`
- `docs/cli/agents.md`
- `docs/cli/approvals.md`
- `docs/cli/browser.md`
- `docs/cli/channels.md`
- `docs/cli/clawbot.md`
- `docs/cli/completion.md`
- `docs/cli/config.md`
- `docs/cli/configure.md`
- `docs/cli/cron.md`
- `docs/cli/daemon.md`
- `docs/cli/dashboard.md`
- `docs/cli/devices.md`
- `docs/cli/directory.md`
- `docs/cli/dns.md`
- `docs/cli/docs.md`
- `docs/cli/doctor.md`
- `docs/cli/gateway.md`
- `docs/cli/health.md`
- `docs/cli/hooks.md`
- `docs/cli/index.md`
- `docs/cli/logs.md`
- `docs/cli/memory.md`
- `docs/cli/message.md`
- `docs/cli/models.md`
- `docs/cli/node.md`
- `docs/cli/nodes.md`
- `docs/cli/onboard.md`
- `docs/cli/pairing.md`
- `docs/cli/plugins.md`
- `docs/cli/qr.md`
- `docs/cli/reset.md`
- `docs/cli/sandbox.md`
- `docs/cli/secrets.md`
- `docs/cli/security.md`
- `docs/cli/sessions.md`
- `docs/cli/setup.md`
- `docs/cli/skills.md`
- `docs/cli/status.md`
- `docs/cli/system.md`
- `docs/cli/tui.md`
- `docs/cli/uninstall.md`
- `docs/cli/update.md`
- `docs/cli/voicecall.md`
- `docs/cli/webhooks.md`

### concepts

architecture and conceptual model explanations

- `docs/concepts/agent-loop.md`
- `docs/concepts/agent-workspace.md`
- `docs/concepts/agent.md`
- `docs/concepts/architecture.md`
- `docs/concepts/compaction.md`
- `docs/concepts/context.md`
- `docs/concepts/features.md`
- `docs/concepts/markdown-formatting.md`
- `docs/concepts/memory.md`
- `docs/concepts/messages.md`
- `docs/concepts/model-failover.md`
- `docs/concepts/model-providers.md`
- `docs/concepts/models.md`
- `docs/concepts/multi-agent.md`
- `docs/concepts/oauth.md`
- `docs/concepts/presence.md`
- `docs/concepts/queue.md`
- `docs/concepts/retry.md`
- `docs/concepts/session-pruning.md`
- `docs/concepts/session-tool.md`
- `docs/concepts/session.md`
- `docs/concepts/sessions.md`
- `docs/concepts/streaming.md`
- `docs/concepts/system-prompt.md`
- `docs/concepts/timezone.md`
- `docs/concepts/typebox.md`
- `docs/concepts/typing-indicators.md`
- `docs/concepts/usage-tracking.md`

### date-time.md

documentation group

- `docs/date-time.md`

### debug

debugging and diagnosis notes

- `docs/debug/node-issue.md`

### design

design notes and integration proposals

- `docs/design/kilo-gateway-integration.md`

### diagnostics

diagnostic flags and runtime debug behavior

- `docs/diagnostics/flags.md`

### experiments

documentation group

- `docs/experiments/onboarding-config-protocol.md`
- `docs/experiments/plans/acp-thread-bound-agents.md`
- `docs/experiments/plans/acp-unified-streaming-refactor.md`
- `docs/experiments/plans/browser-evaluate-cdp-refactor.md`
- `docs/experiments/plans/openresponses-gateway.md`
- `docs/experiments/plans/pty-process-supervision.md`
- `docs/experiments/plans/session-binding-channel-agnostic.md`
- `docs/experiments/proposals/model-config.md`
- `docs/experiments/research/memory.md`

### FULL_DOCUMENTATION.md

documentation group

- `docs/FULL_DOCUMENTATION.md`

### gateway

gateway operation, API, configuration, health, security, and networking

- `docs/gateway/authentication.md`
- `docs/gateway/background-process.md`
- `docs/gateway/bonjour.md`
- `docs/gateway/bridge-protocol.md`
- `docs/gateway/cli-backends.md`
- `docs/gateway/configuration-examples.md`
- `docs/gateway/configuration-reference.md`
- `docs/gateway/configuration.md`
- `docs/gateway/discovery.md`
- `docs/gateway/doctor.md`
- `docs/gateway/gateway-lock.md`
- `docs/gateway/health.md`
- `docs/gateway/heartbeat.md`
- `docs/gateway/index.md`
- `docs/gateway/local-models.md`
- `docs/gateway/logging.md`
- `docs/gateway/multiple-gateways.md`
- `docs/gateway/network-model.md`
- `docs/gateway/openai-http-api.md`
- `docs/gateway/openresponses-http-api.md`
- `docs/gateway/pairing.md`
- `docs/gateway/protocol.md`
- `docs/gateway/remote-gateway-readme.md`
- `docs/gateway/remote.md`
- `docs/gateway/sandbox-vs-tool-policy-vs-elevated.md`
- `docs/gateway/sandboxing.md`
- `docs/gateway/secrets-plan-contract.md`
- `docs/gateway/secrets.md`
- `docs/gateway/security/index.md`
- `docs/gateway/tailscale.md`
- `docs/gateway/tools-invoke-http-api.md`
- `docs/gateway/troubleshooting.md`
- `docs/gateway/trusted-proxy-auth.md`

### help

operator FAQs, scripts, environment, and testing help

- `docs/help/debugging.md`
- `docs/help/environment.md`
- `docs/help/faq.md`
- `docs/help/index.md`
- `docs/help/scripts.md`
- `docs/help/testing.md`
- `docs/help/troubleshooting.md`

### index.md

documentation group

- `docs/index.md`

### install

installation guides across environments

- `docs/install/ansible.md`
- `docs/install/bun.md`
- `docs/install/development-channels.md`
- `docs/install/docker.md`
- `docs/install/exe-dev.md`
- `docs/install/fly.md`
- `docs/install/gcp.md`
- `docs/install/hetzner.md`
- `docs/install/index.md`
- `docs/install/installer.md`
- `docs/install/macos-vm.md`
- `docs/install/migrating.md`
- `docs/install/nix.md`
- `docs/install/node.md`
- `docs/install/northflank.mdx`
- `docs/install/podman.md`
- `docs/install/railway.mdx`
- `docs/install/render.mdx`
- `docs/install/uninstall.md`
- `docs/install/updating.md`

### ja-JP

documentation group

- `docs/ja-JP/AGENTS.md`
- `docs/ja-JP/index.md`
- `docs/ja-JP/start/getting-started.md`
- `docs/ja-JP/start/wizard.md`

### logging.md

documentation group

- `docs/logging.md`

### network.md

documentation group

- `docs/network.md`

### nodes

node runtime, media, voice, and device docs

- `docs/nodes/audio.md`
- `docs/nodes/camera.md`
- `docs/nodes/images.md`
- `docs/nodes/index.md`
- `docs/nodes/location-command.md`
- `docs/nodes/media-understanding.md`
- `docs/nodes/talk.md`
- `docs/nodes/troubleshooting.md`
- `docs/nodes/voicewake.md`

### perplexity.md

documentation group

- `docs/perplexity.md`

### pi-dev.md

documentation group

- `docs/pi-dev.md`

### pi.md

documentation group

- `docs/pi.md`

### platforms

OS and hosting platform guides

- `docs/platforms/android.md`
- `docs/platforms/digitalocean.md`
- `docs/platforms/index.md`
- `docs/platforms/ios.md`
- `docs/platforms/linux.md`
- `docs/platforms/mac/bundled-gateway.md`
- `docs/platforms/mac/canvas.md`
- `docs/platforms/mac/child-process.md`
- `docs/platforms/mac/dev-setup.md`
- `docs/platforms/mac/health.md`
- `docs/platforms/mac/icon.md`
- `docs/platforms/mac/logging.md`
- `docs/platforms/mac/menu-bar.md`
- `docs/platforms/mac/peekaboo.md`
- `docs/platforms/mac/permissions.md`
- `docs/platforms/mac/release.md`
- `docs/platforms/mac/remote.md`
- `docs/platforms/mac/signing.md`
- `docs/platforms/mac/skills.md`
- `docs/platforms/mac/voice-overlay.md`
- `docs/platforms/mac/voicewake.md`
- `docs/platforms/mac/webchat.md`
- `docs/platforms/mac/xpc.md`
- `docs/platforms/macos.md`
- `docs/platforms/oracle.md`
- `docs/platforms/raspberry-pi.md`
- `docs/platforms/windows.md`

### plugins

plugin, extension, and community package docs

- `docs/plugins/agent-tools.md`
- `docs/plugins/community.md`
- `docs/plugins/manifest.md`
- `docs/plugins/voice-call.md`
- `docs/plugins/zalouser.md`

### prose.md

documentation group

- `docs/prose.md`

### providers

provider-specific auth, models, and runtime guidance

- `docs/providers/anthropic.md`
- `docs/providers/bedrock.md`
- `docs/providers/claude-max-api-proxy.md`
- `docs/providers/cloudflare-ai-gateway.md`
- `docs/providers/deepgram.md`
- `docs/providers/github-copilot.md`
- `docs/providers/glm.md`
- `docs/providers/huggingface.md`
- `docs/providers/index.md`
- `docs/providers/kilocode.md`
- `docs/providers/litellm.md`
- `docs/providers/minimax.md`
- `docs/providers/mistral.md`
- `docs/providers/models.md`
- `docs/providers/moonshot.md`
- `docs/providers/nvidia.md`
- `docs/providers/ollama.md`
- `docs/providers/openai.md`
- `docs/providers/opencode.md`
- `docs/providers/openrouter.md`
- `docs/providers/qianfan.md`
- `docs/providers/qwen.md`
- `docs/providers/synthetic.md`
- `docs/providers/together.md`
- `docs/providers/venice.md`
- `docs/providers/vercel-ai-gateway.md`
- `docs/providers/vllm.md`
- `docs/providers/xiaomi.md`
- `docs/providers/zai.md`

### refactor

documentation group

- `docs/refactor/clawnet.md`
- `docs/refactor/exec-host.md`
- `docs/refactor/outbound-session-mirroring.md`
- `docs/refactor/plugin-sdk.md`
- `docs/refactor/strict-config.md`

### reference

documentation group

- `docs/reference/AGENTS.default.md`
- `docs/reference/RELEASING.md`
- `docs/reference/api-usage-costs.md`
- `docs/reference/codebase-overview.md`
- `docs/reference/credits.md`
- `docs/reference/device-models.md`
- `docs/reference/prompt-caching.md`
- `docs/reference/rpc.md`
- `docs/reference/session-management-compaction.md`
- `docs/reference/templates/AGENTS.dev.md`
- `docs/reference/templates/AGENTS.md`
- `docs/reference/templates/BOOT.md`
- `docs/reference/templates/BOOTSTRAP.md`
- `docs/reference/templates/HEARTBEAT.md`
- `docs/reference/templates/IDENTITY.dev.md`
- `docs/reference/templates/IDENTITY.md`
- `docs/reference/templates/SOUL.dev.md`
- `docs/reference/templates/SOUL.md`
- `docs/reference/templates/TOOLS.dev.md`
- `docs/reference/templates/TOOLS.md`
- `docs/reference/templates/USER.dev.md`
- `docs/reference/templates/USER.md`
- `docs/reference/test.md`
- `docs/reference/token-use.md`
- `docs/reference/transcript-hygiene.md`
- `docs/reference/wizard.md`

### security

documentation group

- `docs/security/CONTRIBUTING-THREAT-MODEL.md`
- `docs/security/README.md`
- `docs/security/THREAT-MODEL-ATLAS.md`
- `docs/security/formal-verification.md`

### start

documentation group

- `docs/start/bootstrapping.md`
- `docs/start/docs-directory.md`
- `docs/start/getting-started.md`
- `docs/start/hubs.md`
- `docs/start/lore.md`
- `docs/start/onboarding-overview.md`
- `docs/start/onboarding.md`
- `docs/start/traversalai.md`
- `docs/start/quickstart.md`
- `docs/start/setup.md`
- `docs/start/showcase.md`
- `docs/start/wizard-cli-automation.md`
- `docs/start/wizard-cli-reference.md`
- `docs/start/wizard.md`

### tools

documentation group

- `docs/tools/acp-agents.md`
- `docs/tools/agent-send.md`
- `docs/tools/apply-patch.md`
- `docs/tools/browser-linux-troubleshooting.md`
- `docs/tools/browser-login.md`
- `docs/tools/browser.md`
- `docs/tools/chrome-extension.md`
- `docs/tools/clawhub.md`
- `docs/tools/creating-skills.md`
- `docs/tools/elevated.md`
- `docs/tools/exec-approvals.md`
- `docs/tools/exec.md`
- `docs/tools/firecrawl.md`
- `docs/tools/index.md`
- `docs/tools/llm-task.md`
- `docs/tools/lobster.md`
- `docs/tools/loop-detection.md`
- `docs/tools/multi-agent-sandbox-tools.md`
- `docs/tools/plugin.md`
- `docs/tools/reactions.md`
- `docs/tools/skills-config.md`
- `docs/tools/skills.md`
- `docs/tools/slash-commands.md`
- `docs/tools/subagents.md`
- `docs/tools/thinking.md`
- `docs/tools/web.md`

### tts.md

documentation group

- `docs/tts.md`

### vps.md

documentation group

- `docs/vps.md`

### web

documentation group

- `docs/web/control-ui.md`
- `docs/web/dashboard.md`
- `docs/web/index.md`
- `docs/web/tui.md`
- `docs/web/webchat.md`

### zh-CN

documentation group

- `docs/zh-CN/AGENTS.md`
- `docs/zh-CN/automation/auth-monitoring.md`
- `docs/zh-CN/automation/cron-jobs.md`
- `docs/zh-CN/automation/cron-vs-heartbeat.md`
- `docs/zh-CN/automation/gmail-pubsub.md`
- `docs/zh-CN/automation/hooks.md`
- `docs/zh-CN/automation/poll.md`
- `docs/zh-CN/automation/troubleshooting.md`
- `docs/zh-CN/automation/webhook.md`
- `docs/zh-CN/brave-search.md`
- `docs/zh-CN/channels/bluebubbles.md`
- `docs/zh-CN/channels/broadcast-groups.md`
- `docs/zh-CN/channels/channel-routing.md`
- `docs/zh-CN/channels/discord.md`
- `docs/zh-CN/channels/feishu.md`
- `docs/zh-CN/channels/googlechat.md`
- `docs/zh-CN/channels/grammy.md`
- `docs/zh-CN/channels/group-messages.md`
- `docs/zh-CN/channels/groups.md`
- `docs/zh-CN/channels/imessage.md`
- `docs/zh-CN/channels/index.md`
- `docs/zh-CN/channels/line.md`
- `docs/zh-CN/channels/location.md`
- `docs/zh-CN/channels/matrix.md`
- `docs/zh-CN/channels/mattermost.md`
- `docs/zh-CN/channels/msteams.md`
- `docs/zh-CN/channels/nextcloud-talk.md`
- `docs/zh-CN/channels/nostr.md`
- `docs/zh-CN/channels/pairing.md`
- `docs/zh-CN/channels/signal.md`
- `docs/zh-CN/channels/slack.md`
- `docs/zh-CN/channels/telegram.md`
- `docs/zh-CN/channels/tlon.md`
- `docs/zh-CN/channels/troubleshooting.md`
- `docs/zh-CN/channels/twitch.md`
- `docs/zh-CN/channels/whatsapp.md`
- `docs/zh-CN/channels/zalo.md`
- `docs/zh-CN/channels/zalouser.md`
- `docs/zh-CN/cli/acp.md`
- `docs/zh-CN/cli/agent.md`
- `docs/zh-CN/cli/agents.md`
- `docs/zh-CN/cli/approvals.md`
- `docs/zh-CN/cli/browser.md`
- `docs/zh-CN/cli/channels.md`
- `docs/zh-CN/cli/config.md`
- `docs/zh-CN/cli/configure.md`
- `docs/zh-CN/cli/cron.md`
- `docs/zh-CN/cli/dashboard.md`
- `docs/zh-CN/cli/devices.md`
- `docs/zh-CN/cli/directory.md`
- `docs/zh-CN/cli/dns.md`
- `docs/zh-CN/cli/docs.md`
- `docs/zh-CN/cli/doctor.md`
- `docs/zh-CN/cli/gateway.md`
- `docs/zh-CN/cli/health.md`
- `docs/zh-CN/cli/hooks.md`
- `docs/zh-CN/cli/index.md`
- `docs/zh-CN/cli/logs.md`
- `docs/zh-CN/cli/memory.md`
- `docs/zh-CN/cli/message.md`
- `docs/zh-CN/cli/models.md`
- `docs/zh-CN/cli/node.md`
- `docs/zh-CN/cli/nodes.md`
- `docs/zh-CN/cli/onboard.md`
- `docs/zh-CN/cli/pairing.md`
- `docs/zh-CN/cli/plugins.md`
- `docs/zh-CN/cli/reset.md`
- `docs/zh-CN/cli/sandbox.md`
- `docs/zh-CN/cli/security.md`
- `docs/zh-CN/cli/sessions.md`
- `docs/zh-CN/cli/setup.md`
- `docs/zh-CN/cli/skills.md`
- `docs/zh-CN/cli/status.md`
- `docs/zh-CN/cli/system.md`
- `docs/zh-CN/cli/tui.md`
- `docs/zh-CN/cli/uninstall.md`
- `docs/zh-CN/cli/update.md`
- `docs/zh-CN/cli/voicecall.md`
- `docs/zh-CN/cli/webhooks.md`
- `docs/zh-CN/concepts/agent-loop.md`
- `docs/zh-CN/concepts/agent-workspace.md`
- `docs/zh-CN/concepts/agent.md`
- `docs/zh-CN/concepts/architecture.md`
- `docs/zh-CN/concepts/compaction.md`
- `docs/zh-CN/concepts/context.md`
- `docs/zh-CN/concepts/features.md`
- `docs/zh-CN/concepts/markdown-formatting.md`
- `docs/zh-CN/concepts/memory.md`
- `docs/zh-CN/concepts/messages.md`
- `docs/zh-CN/concepts/model-failover.md`
- `docs/zh-CN/concepts/model-providers.md`
- `docs/zh-CN/concepts/models.md`
- `docs/zh-CN/concepts/multi-agent.md`
- `docs/zh-CN/concepts/oauth.md`
- `docs/zh-CN/concepts/presence.md`
- `docs/zh-CN/concepts/queue.md`
- `docs/zh-CN/concepts/retry.md`
- `docs/zh-CN/concepts/session-pruning.md`
- `docs/zh-CN/concepts/session-tool.md`
- `docs/zh-CN/concepts/session.md`
- `docs/zh-CN/concepts/sessions.md`
- `docs/zh-CN/concepts/streaming.md`
- `docs/zh-CN/concepts/system-prompt.md`
- `docs/zh-CN/concepts/timezone.md`
- `docs/zh-CN/concepts/typebox.md`
- `docs/zh-CN/concepts/typing-indicators.md`
- `docs/zh-CN/concepts/usage-tracking.md`
- `docs/zh-CN/date-time.md`
- `docs/zh-CN/debug/node-issue.md`
- `docs/zh-CN/diagnostics/flags.md`
- `docs/zh-CN/experiments/onboarding-config-protocol.md`
- `docs/zh-CN/experiments/plans/cron-add-hardening.md`
- `docs/zh-CN/experiments/plans/group-policy-hardening.md`
- `docs/zh-CN/experiments/plans/openresponses-gateway.md`
- `docs/zh-CN/experiments/proposals/model-config.md`
- `docs/zh-CN/experiments/research/memory.md`
- `docs/zh-CN/gateway/authentication.md`
- `docs/zh-CN/gateway/background-process.md`
- `docs/zh-CN/gateway/bonjour.md`
- `docs/zh-CN/gateway/bridge-protocol.md`
- `docs/zh-CN/gateway/cli-backends.md`
- `docs/zh-CN/gateway/configuration-examples.md`
- `docs/zh-CN/gateway/configuration.md`
- `docs/zh-CN/gateway/discovery.md`
- `docs/zh-CN/gateway/doctor.md`
- `docs/zh-CN/gateway/gateway-lock.md`
- `docs/zh-CN/gateway/health.md`
- `docs/zh-CN/gateway/heartbeat.md`
- `docs/zh-CN/gateway/index.md`
- `docs/zh-CN/gateway/local-models.md`
- `docs/zh-CN/gateway/logging.md`
- `docs/zh-CN/gateway/multiple-gateways.md`
- `docs/zh-CN/gateway/network-model.md`
- `docs/zh-CN/gateway/openai-http-api.md`
- `docs/zh-CN/gateway/openresponses-http-api.md`
- `docs/zh-CN/gateway/pairing.md`
- `docs/zh-CN/gateway/protocol.md`
- `docs/zh-CN/gateway/remote-gateway-readme.md`
- `docs/zh-CN/gateway/remote.md`
- `docs/zh-CN/gateway/sandbox-vs-tool-policy-vs-elevated.md`
- `docs/zh-CN/gateway/sandboxing.md`
- `docs/zh-CN/gateway/security/index.md`
- `docs/zh-CN/gateway/tailscale.md`
- `docs/zh-CN/gateway/tools-invoke-http-api.md`
- `docs/zh-CN/gateway/troubleshooting.md`
- `docs/zh-CN/help/debugging.md`
- `docs/zh-CN/help/environment.md`
- `docs/zh-CN/help/faq.md`
- `docs/zh-CN/help/index.md`
- `docs/zh-CN/help/scripts.md`
- `docs/zh-CN/help/testing.md`
- `docs/zh-CN/help/troubleshooting.md`
- `docs/zh-CN/index.md`
- `docs/zh-CN/install/ansible.md`
- `docs/zh-CN/install/bun.md`
- `docs/zh-CN/install/development-channels.md`
- `docs/zh-CN/install/docker.md`
- `docs/zh-CN/install/exe-dev.md`
- `docs/zh-CN/install/fly.md`
- `docs/zh-CN/install/gcp.md`
- `docs/zh-CN/install/hetzner.md`
- `docs/zh-CN/install/index.md`
- `docs/zh-CN/install/installer.md`
- `docs/zh-CN/install/macos-vm.md`
- `docs/zh-CN/install/migrating.md`
- `docs/zh-CN/install/nix.md`
- `docs/zh-CN/install/node.md`
- `docs/zh-CN/install/northflank.mdx`
- `docs/zh-CN/install/railway.mdx`
- `docs/zh-CN/install/render.mdx`
- `docs/zh-CN/install/uninstall.md`
- `docs/zh-CN/install/updating.md`
- `docs/zh-CN/logging.md`
- `docs/zh-CN/network.md`
- `docs/zh-CN/nodes/audio.md`
- `docs/zh-CN/nodes/camera.md`
- `docs/zh-CN/nodes/images.md`
- `docs/zh-CN/nodes/index.md`
- `docs/zh-CN/nodes/location-command.md`
- `docs/zh-CN/nodes/media-understanding.md`
- `docs/zh-CN/nodes/talk.md`
- `docs/zh-CN/nodes/troubleshooting.md`
- `docs/zh-CN/nodes/voicewake.md`
- `docs/zh-CN/perplexity.md`
- `docs/zh-CN/pi-dev.md`
- `docs/zh-CN/pi.md`
- `docs/zh-CN/platforms/android.md`
- `docs/zh-CN/platforms/digitalocean.md`
- `docs/zh-CN/platforms/index.md`
- `docs/zh-CN/platforms/ios.md`
- `docs/zh-CN/platforms/linux.md`
- `docs/zh-CN/platforms/mac/bundled-gateway.md`
- `docs/zh-CN/platforms/mac/canvas.md`
- `docs/zh-CN/platforms/mac/child-process.md`
- `docs/zh-CN/platforms/mac/dev-setup.md`
- `docs/zh-CN/platforms/mac/health.md`
- `docs/zh-CN/platforms/mac/icon.md`
- `docs/zh-CN/platforms/mac/logging.md`
- `docs/zh-CN/platforms/mac/menu-bar.md`
- `docs/zh-CN/platforms/mac/peekaboo.md`
- `docs/zh-CN/platforms/mac/permissions.md`
- `docs/zh-CN/platforms/mac/release.md`
- `docs/zh-CN/platforms/mac/remote.md`
- `docs/zh-CN/platforms/mac/signing.md`
- `docs/zh-CN/platforms/mac/skills.md`
- `docs/zh-CN/platforms/mac/voice-overlay.md`
- `docs/zh-CN/platforms/mac/voicewake.md`
- `docs/zh-CN/platforms/mac/webchat.md`
- `docs/zh-CN/platforms/mac/xpc.md`
- `docs/zh-CN/platforms/macos.md`
- `docs/zh-CN/platforms/oracle.md`
- `docs/zh-CN/platforms/raspberry-pi.md`
- `docs/zh-CN/platforms/windows.md`
- `docs/zh-CN/plugins/agent-tools.md`
- `docs/zh-CN/plugins/manifest.md`
- `docs/zh-CN/plugins/voice-call.md`
- `docs/zh-CN/plugins/zalouser.md`
- `docs/zh-CN/prose.md`
- `docs/zh-CN/providers/anthropic.md`
- `docs/zh-CN/providers/bedrock.md`
- `docs/zh-CN/providers/claude-max-api-proxy.md`
- `docs/zh-CN/providers/deepgram.md`
- `docs/zh-CN/providers/github-copilot.md`
- `docs/zh-CN/providers/glm.md`
- `docs/zh-CN/providers/index.md`
- `docs/zh-CN/providers/minimax.md`
- `docs/zh-CN/providers/models.md`
- `docs/zh-CN/providers/moonshot.md`
- `docs/zh-CN/providers/ollama.md`
- `docs/zh-CN/providers/openai.md`
- `docs/zh-CN/providers/opencode.md`
- `docs/zh-CN/providers/openrouter.md`
- `docs/zh-CN/providers/qianfan.md`
- `docs/zh-CN/providers/qwen.md`
- `docs/zh-CN/providers/synthetic.md`
- `docs/zh-CN/providers/venice.md`
- `docs/zh-CN/providers/vercel-ai-gateway.md`
- `docs/zh-CN/providers/xiaomi.md`
- `docs/zh-CN/providers/zai.md`
- `docs/zh-CN/refactor/clawnet.md`
- `docs/zh-CN/refactor/exec-host.md`
- `docs/zh-CN/refactor/outbound-session-mirroring.md`
- `docs/zh-CN/refactor/plugin-sdk.md`
- `docs/zh-CN/refactor/strict-config.md`
- `docs/zh-CN/reference/AGENTS.default.md`
- `docs/zh-CN/reference/RELEASING.md`
- `docs/zh-CN/reference/api-usage-costs.md`
- `docs/zh-CN/reference/credits.md`
- `docs/zh-CN/reference/device-models.md`
- `docs/zh-CN/reference/rpc.md`
- `docs/zh-CN/reference/session-management-compaction.md`
- `docs/zh-CN/reference/templates/AGENTS.dev.md`
- `docs/zh-CN/reference/templates/AGENTS.md`
- `docs/zh-CN/reference/templates/BOOT.md`
- `docs/zh-CN/reference/templates/BOOTSTRAP.md`
- `docs/zh-CN/reference/templates/HEARTBEAT.md`
- `docs/zh-CN/reference/templates/IDENTITY.dev.md`
- `docs/zh-CN/reference/templates/IDENTITY.md`
- `docs/zh-CN/reference/templates/SOUL.dev.md`
- `docs/zh-CN/reference/templates/SOUL.md`
- `docs/zh-CN/reference/templates/TOOLS.dev.md`
- `docs/zh-CN/reference/templates/TOOLS.md`
- `docs/zh-CN/reference/templates/USER.dev.md`
- `docs/zh-CN/reference/templates/USER.md`
- `docs/zh-CN/reference/test.md`
- `docs/zh-CN/reference/token-use.md`
- `docs/zh-CN/reference/transcript-hygiene.md`
- `docs/zh-CN/reference/wizard.md`
- `docs/zh-CN/security/formal-verification.md`
- `docs/zh-CN/start/bootstrapping.md`
- `docs/zh-CN/start/docs-directory.md`
- `docs/zh-CN/start/getting-started.md`
- `docs/zh-CN/start/hubs.md`
- `docs/zh-CN/start/lore.md`
- `docs/zh-CN/start/onboarding.md`
- `docs/zh-CN/start/traversalai.md`
- `docs/zh-CN/start/quickstart.md`
- `docs/zh-CN/start/setup.md`
- `docs/zh-CN/start/showcase.md`
- `docs/zh-CN/start/wizard.md`
- `docs/zh-CN/tools/agent-send.md`
- `docs/zh-CN/tools/apply-patch.md`
- `docs/zh-CN/tools/browser-linux-troubleshooting.md`
- `docs/zh-CN/tools/browser-login.md`
- `docs/zh-CN/tools/browser.md`
- `docs/zh-CN/tools/chrome-extension.md`
- `docs/zh-CN/tools/clawhub.md`
- `docs/zh-CN/tools/creating-skills.md`
- `docs/zh-CN/tools/elevated.md`
- `docs/zh-CN/tools/exec-approvals.md`
- `docs/zh-CN/tools/exec.md`
- `docs/zh-CN/tools/firecrawl.md`
- `docs/zh-CN/tools/index.md`
- `docs/zh-CN/tools/llm-task.md`
- `docs/zh-CN/tools/lobster.md`
- `docs/zh-CN/tools/multi-agent-sandbox-tools.md`
- `docs/zh-CN/tools/plugin.md`
- `docs/zh-CN/tools/reactions.md`
- `docs/zh-CN/tools/skills-config.md`
- `docs/zh-CN/tools/skills.md`
- `docs/zh-CN/tools/slash-commands.md`
- `docs/zh-CN/tools/subagents.md`
- `docs/zh-CN/tools/thinking.md`
- `docs/zh-CN/tools/web.md`
- `docs/zh-CN/tts.md`
- `docs/zh-CN/vps.md`
- `docs/zh-CN/web/control-ui.md`
- `docs/zh-CN/web/dashboard.md`
- `docs/zh-CN/web/index.md`
- `docs/zh-CN/web/tui.md`
- `docs/zh-CN/web/webchat.md`

## CLI Documentation Coverage

- `docs/cli/acp.md`
- `docs/cli/agent.md`
- `docs/cli/agents.md`
- `docs/cli/approvals.md`
- `docs/cli/browser.md`
- `docs/cli/channels.md`
- `docs/cli/clawbot.md`
- `docs/cli/completion.md`
- `docs/cli/config.md`
- `docs/cli/configure.md`
- `docs/cli/cron.md`
- `docs/cli/daemon.md`
- `docs/cli/dashboard.md`
- `docs/cli/devices.md`
- `docs/cli/directory.md`
- `docs/cli/dns.md`
- `docs/cli/docs.md`
- `docs/cli/doctor.md`
- `docs/cli/gateway.md`
- `docs/cli/health.md`
- `docs/cli/hooks.md`
- `docs/cli/index.md`
- `docs/cli/logs.md`
- `docs/cli/memory.md`
- `docs/cli/message.md`
- `docs/cli/models.md`
- `docs/cli/node.md`
- `docs/cli/nodes.md`
- `docs/cli/onboard.md`
- `docs/cli/pairing.md`
- `docs/cli/plugins.md`
- `docs/cli/qr.md`
- `docs/cli/reset.md`
- `docs/cli/sandbox.md`
- `docs/cli/secrets.md`
- `docs/cli/security.md`
- `docs/cli/sessions.md`
- `docs/cli/setup.md`
- `docs/cli/skills.md`
- `docs/cli/status.md`
- `docs/cli/system.md`
- `docs/cli/tui.md`
- `docs/cli/uninstall.md`
- `docs/cli/update.md`
- `docs/cli/voicecall.md`
- `docs/cli/webhooks.md`

## Gateway Documentation Coverage

- `docs/gateway/authentication.md`
- `docs/gateway/background-process.md`
- `docs/gateway/bonjour.md`
- `docs/gateway/bridge-protocol.md`
- `docs/gateway/cli-backends.md`
- `docs/gateway/configuration-examples.md`
- `docs/gateway/configuration-reference.md`
- `docs/gateway/configuration.md`
- `docs/gateway/discovery.md`
- `docs/gateway/doctor.md`
- `docs/gateway/gateway-lock.md`
- `docs/gateway/health.md`
- `docs/gateway/heartbeat.md`
- `docs/gateway/index.md`
- `docs/gateway/local-models.md`
- `docs/gateway/logging.md`
- `docs/gateway/multiple-gateways.md`
- `docs/gateway/network-model.md`
- `docs/gateway/openai-http-api.md`
- `docs/gateway/openresponses-http-api.md`
- `docs/gateway/pairing.md`
- `docs/gateway/protocol.md`
- `docs/gateway/remote-gateway-readme.md`
- `docs/gateway/remote.md`
- `docs/gateway/sandbox-vs-tool-policy-vs-elevated.md`
- `docs/gateway/sandboxing.md`
- `docs/gateway/secrets-plan-contract.md`
- `docs/gateway/secrets.md`
- `docs/gateway/security/index.md`
- `docs/gateway/tailscale.md`
- `docs/gateway/tools-invoke-http-api.md`
- `docs/gateway/troubleshooting.md`
- `docs/gateway/trusted-proxy-auth.md`

## Concepts Documentation Coverage

- `docs/concepts/agent-loop.md`
- `docs/concepts/agent-workspace.md`
- `docs/concepts/agent.md`
- `docs/concepts/architecture.md`
- `docs/concepts/compaction.md`
- `docs/concepts/context.md`
- `docs/concepts/features.md`
- `docs/concepts/markdown-formatting.md`
- `docs/concepts/memory.md`
- `docs/concepts/messages.md`
- `docs/concepts/model-failover.md`
- `docs/concepts/model-providers.md`
- `docs/concepts/models.md`
- `docs/concepts/multi-agent.md`
- `docs/concepts/oauth.md`
- `docs/concepts/presence.md`
- `docs/concepts/queue.md`
- `docs/concepts/retry.md`
- `docs/concepts/session-pruning.md`
- `docs/concepts/session-tool.md`
- `docs/concepts/session.md`
- `docs/concepts/sessions.md`
- `docs/concepts/streaming.md`
- `docs/concepts/system-prompt.md`
- `docs/concepts/timezone.md`
- `docs/concepts/typebox.md`
- `docs/concepts/typing-indicators.md`
- `docs/concepts/usage-tracking.md`

## Channel Documentation Coverage

- `docs/channels/bluebubbles.md`
- `docs/channels/broadcast-groups.md`
- `docs/channels/channel-routing.md`
- `docs/channels/discord.md`
- `docs/channels/feishu.md`
- `docs/channels/googlechat.md`
- `docs/channels/grammy.md`
- `docs/channels/group-messages.md`
- `docs/channels/groups.md`
- `docs/channels/imessage.md`
- `docs/channels/index.md`
- `docs/channels/irc.md`
- `docs/channels/line.md`
- `docs/channels/location.md`
- `docs/channels/matrix.md`
- `docs/channels/mattermost.md`
- `docs/channels/msteams.md`
- `docs/channels/nextcloud-talk.md`
- `docs/channels/nostr.md`
- `docs/channels/pairing.md`
- `docs/channels/signal.md`
- `docs/channels/slack.md`
- `docs/channels/synology-chat.md`
- `docs/channels/telegram.md`
- `docs/channels/tlon.md`
- `docs/channels/troubleshooting.md`
- `docs/channels/twitch.md`
- `docs/channels/whatsapp.md`
- `docs/channels/zalo.md`
- `docs/channels/zalouser.md`

## Provider Documentation Coverage

- `docs/providers/anthropic.md`
- `docs/providers/bedrock.md`
- `docs/providers/claude-max-api-proxy.md`
- `docs/providers/cloudflare-ai-gateway.md`
- `docs/providers/deepgram.md`
- `docs/providers/github-copilot.md`
- `docs/providers/glm.md`
- `docs/providers/huggingface.md`
- `docs/providers/index.md`
- `docs/providers/kilocode.md`
- `docs/providers/litellm.md`
- `docs/providers/minimax.md`
- `docs/providers/mistral.md`
- `docs/providers/models.md`
- `docs/providers/moonshot.md`
- `docs/providers/nvidia.md`
- `docs/providers/ollama.md`
- `docs/providers/openai.md`
- `docs/providers/opencode.md`
- `docs/providers/openrouter.md`
- `docs/providers/qianfan.md`
- `docs/providers/qwen.md`
- `docs/providers/synthetic.md`
- `docs/providers/together.md`
- `docs/providers/venice.md`
- `docs/providers/vercel-ai-gateway.md`
- `docs/providers/vllm.md`
- `docs/providers/xiaomi.md`
- `docs/providers/zai.md`

## Full Documentation Appendix

```text
docs/.i18n/README.md
docs/FULL_DOCUMENTATION.md
docs/automation/auth-monitoring.md
docs/automation/cron-jobs.md
docs/automation/cron-vs-heartbeat.md
docs/automation/gmail-pubsub.md
docs/automation/hooks.md
docs/automation/poll.md
docs/automation/troubleshooting.md
docs/automation/webhook.md
docs/brave-search.md
docs/channels/bluebubbles.md
docs/channels/broadcast-groups.md
docs/channels/channel-routing.md
docs/channels/discord.md
docs/channels/feishu.md
docs/channels/googlechat.md
docs/channels/grammy.md
docs/channels/group-messages.md
docs/channels/groups.md
docs/channels/imessage.md
docs/channels/index.md
docs/channels/irc.md
docs/channels/line.md
docs/channels/location.md
docs/channels/matrix.md
docs/channels/mattermost.md
docs/channels/msteams.md
docs/channels/nextcloud-talk.md
docs/channels/nostr.md
docs/channels/pairing.md
docs/channels/signal.md
docs/channels/slack.md
docs/channels/synology-chat.md
docs/channels/telegram.md
docs/channels/tlon.md
docs/channels/troubleshooting.md
docs/channels/twitch.md
docs/channels/whatsapp.md
docs/channels/zalo.md
docs/channels/zalouser.md
docs/ci.md
docs/cli/acp.md
docs/cli/agent.md
docs/cli/agents.md
docs/cli/approvals.md
docs/cli/browser.md
docs/cli/channels.md
docs/cli/clawbot.md
docs/cli/completion.md
docs/cli/config.md
docs/cli/configure.md
docs/cli/cron.md
docs/cli/daemon.md
docs/cli/dashboard.md
docs/cli/devices.md
docs/cli/directory.md
docs/cli/dns.md
docs/cli/docs.md
docs/cli/doctor.md
docs/cli/gateway.md
docs/cli/health.md
docs/cli/hooks.md
docs/cli/index.md
docs/cli/logs.md
docs/cli/memory.md
docs/cli/message.md
docs/cli/models.md
docs/cli/node.md
docs/cli/nodes.md
docs/cli/onboard.md
docs/cli/pairing.md
docs/cli/plugins.md
docs/cli/qr.md
docs/cli/reset.md
docs/cli/sandbox.md
docs/cli/secrets.md
docs/cli/security.md
docs/cli/sessions.md
docs/cli/setup.md
docs/cli/skills.md
docs/cli/status.md
docs/cli/system.md
docs/cli/tui.md
docs/cli/uninstall.md
docs/cli/update.md
docs/cli/voicecall.md
docs/cli/webhooks.md
docs/concepts/agent-loop.md
docs/concepts/agent-workspace.md
docs/concepts/agent.md
docs/concepts/architecture.md
docs/concepts/compaction.md
docs/concepts/context.md
docs/concepts/features.md
docs/concepts/markdown-formatting.md
docs/concepts/memory.md
docs/concepts/messages.md
docs/concepts/model-failover.md
docs/concepts/model-providers.md
docs/concepts/models.md
docs/concepts/multi-agent.md
docs/concepts/oauth.md
docs/concepts/presence.md
docs/concepts/queue.md
docs/concepts/retry.md
docs/concepts/session-pruning.md
docs/concepts/session-tool.md
docs/concepts/session.md
docs/concepts/sessions.md
docs/concepts/streaming.md
docs/concepts/system-prompt.md
docs/concepts/timezone.md
docs/concepts/typebox.md
docs/concepts/typing-indicators.md
docs/concepts/usage-tracking.md
docs/date-time.md
docs/debug/node-issue.md
docs/design/kilo-gateway-integration.md
docs/diagnostics/flags.md
docs/experiments/onboarding-config-protocol.md
docs/experiments/plans/acp-thread-bound-agents.md
docs/experiments/plans/acp-unified-streaming-refactor.md
docs/experiments/plans/browser-evaluate-cdp-refactor.md
docs/experiments/plans/openresponses-gateway.md
docs/experiments/plans/pty-process-supervision.md
docs/experiments/plans/session-binding-channel-agnostic.md
docs/experiments/proposals/model-config.md
docs/experiments/research/memory.md
docs/gateway/authentication.md
docs/gateway/background-process.md
docs/gateway/bonjour.md
docs/gateway/bridge-protocol.md
docs/gateway/cli-backends.md
docs/gateway/configuration-examples.md
docs/gateway/configuration-reference.md
docs/gateway/configuration.md
docs/gateway/discovery.md
docs/gateway/doctor.md
docs/gateway/gateway-lock.md
docs/gateway/health.md
docs/gateway/heartbeat.md
docs/gateway/index.md
docs/gateway/local-models.md
docs/gateway/logging.md
docs/gateway/multiple-gateways.md
docs/gateway/network-model.md
docs/gateway/openai-http-api.md
docs/gateway/openresponses-http-api.md
docs/gateway/pairing.md
docs/gateway/protocol.md
docs/gateway/remote-gateway-readme.md
docs/gateway/remote.md
docs/gateway/sandbox-vs-tool-policy-vs-elevated.md
docs/gateway/sandboxing.md
docs/gateway/secrets-plan-contract.md
docs/gateway/secrets.md
docs/gateway/security/index.md
docs/gateway/tailscale.md
docs/gateway/tools-invoke-http-api.md
docs/gateway/troubleshooting.md
docs/gateway/trusted-proxy-auth.md
docs/help/debugging.md
docs/help/environment.md
docs/help/faq.md
docs/help/index.md
docs/help/scripts.md
docs/help/testing.md
docs/help/troubleshooting.md
docs/index.md
docs/install/ansible.md
docs/install/bun.md
docs/install/development-channels.md
docs/install/docker.md
docs/install/exe-dev.md
docs/install/fly.md
docs/install/gcp.md
docs/install/hetzner.md
docs/install/index.md
docs/install/installer.md
docs/install/macos-vm.md
docs/install/migrating.md
docs/install/nix.md
docs/install/node.md
docs/install/northflank.mdx
docs/install/podman.md
docs/install/railway.mdx
docs/install/render.mdx
docs/install/uninstall.md
docs/install/updating.md
docs/ja-JP/AGENTS.md
docs/ja-JP/index.md
docs/ja-JP/start/getting-started.md
docs/ja-JP/start/wizard.md
docs/logging.md
docs/network.md
docs/nodes/audio.md
docs/nodes/camera.md
docs/nodes/images.md
docs/nodes/index.md
docs/nodes/location-command.md
docs/nodes/media-understanding.md
docs/nodes/talk.md
docs/nodes/troubleshooting.md
docs/nodes/voicewake.md
docs/perplexity.md
docs/pi-dev.md
docs/pi.md
docs/platforms/android.md
docs/platforms/digitalocean.md
docs/platforms/index.md
docs/platforms/ios.md
docs/platforms/linux.md
docs/platforms/mac/bundled-gateway.md
docs/platforms/mac/canvas.md
docs/platforms/mac/child-process.md
docs/platforms/mac/dev-setup.md
docs/platforms/mac/health.md
docs/platforms/mac/icon.md
docs/platforms/mac/logging.md
docs/platforms/mac/menu-bar.md
docs/platforms/mac/peekaboo.md
docs/platforms/mac/permissions.md
docs/platforms/mac/release.md
docs/platforms/mac/remote.md
docs/platforms/mac/signing.md
docs/platforms/mac/skills.md
docs/platforms/mac/voice-overlay.md
docs/platforms/mac/voicewake.md
docs/platforms/mac/webchat.md
docs/platforms/mac/xpc.md
docs/platforms/macos.md
docs/platforms/oracle.md
docs/platforms/raspberry-pi.md
docs/platforms/windows.md
docs/plugins/agent-tools.md
docs/plugins/community.md
docs/plugins/manifest.md
docs/plugins/voice-call.md
docs/plugins/zalouser.md
docs/prose.md
docs/providers/anthropic.md
docs/providers/bedrock.md
docs/providers/claude-max-api-proxy.md
docs/providers/cloudflare-ai-gateway.md
docs/providers/deepgram.md
docs/providers/github-copilot.md
docs/providers/glm.md
docs/providers/huggingface.md
docs/providers/index.md
docs/providers/kilocode.md
docs/providers/litellm.md
docs/providers/minimax.md
docs/providers/mistral.md
docs/providers/models.md
docs/providers/moonshot.md
docs/providers/nvidia.md
docs/providers/ollama.md
docs/providers/openai.md
docs/providers/opencode.md
docs/providers/openrouter.md
docs/providers/qianfan.md
docs/providers/qwen.md
docs/providers/synthetic.md
docs/providers/together.md
docs/providers/venice.md
docs/providers/vercel-ai-gateway.md
docs/providers/vllm.md
docs/providers/xiaomi.md
docs/providers/zai.md
docs/refactor/clawnet.md
docs/refactor/exec-host.md
docs/refactor/outbound-session-mirroring.md
docs/refactor/plugin-sdk.md
docs/refactor/strict-config.md
docs/reference/AGENTS.default.md
docs/reference/RELEASING.md
docs/reference/api-usage-costs.md
docs/reference/codebase-overview.md
docs/reference/credits.md
docs/reference/device-models.md
docs/reference/prompt-caching.md
docs/reference/rpc.md
docs/reference/session-management-compaction.md
docs/reference/templates/AGENTS.dev.md
docs/reference/templates/AGENTS.md
docs/reference/templates/BOOT.md
docs/reference/templates/BOOTSTRAP.md
docs/reference/templates/HEARTBEAT.md
docs/reference/templates/IDENTITY.dev.md
docs/reference/templates/IDENTITY.md
docs/reference/templates/SOUL.dev.md
docs/reference/templates/SOUL.md
docs/reference/templates/TOOLS.dev.md
docs/reference/templates/TOOLS.md
docs/reference/templates/USER.dev.md
docs/reference/templates/USER.md
docs/reference/test.md
docs/reference/token-use.md
docs/reference/transcript-hygiene.md
docs/reference/wizard.md
docs/security/CONTRIBUTING-THREAT-MODEL.md
docs/security/README.md
docs/security/THREAT-MODEL-ATLAS.md
docs/security/formal-verification.md
docs/start/bootstrapping.md
docs/start/docs-directory.md
docs/start/getting-started.md
docs/start/hubs.md
docs/start/lore.md
docs/start/onboarding-overview.md
docs/start/onboarding.md
docs/start/traversalai.md
docs/start/quickstart.md
docs/start/setup.md
docs/start/showcase.md
docs/start/wizard-cli-automation.md
docs/start/wizard-cli-reference.md
docs/start/wizard.md
docs/tools/acp-agents.md
docs/tools/agent-send.md
docs/tools/apply-patch.md
docs/tools/browser-linux-troubleshooting.md
docs/tools/browser-login.md
docs/tools/browser.md
docs/tools/chrome-extension.md
docs/tools/clawhub.md
docs/tools/creating-skills.md
docs/tools/elevated.md
docs/tools/exec-approvals.md
docs/tools/exec.md
docs/tools/firecrawl.md
docs/tools/index.md
docs/tools/llm-task.md
docs/tools/lobster.md
docs/tools/loop-detection.md
docs/tools/multi-agent-sandbox-tools.md
docs/tools/plugin.md
docs/tools/reactions.md
docs/tools/skills-config.md
docs/tools/skills.md
docs/tools/slash-commands.md
docs/tools/subagents.md
docs/tools/thinking.md
docs/tools/web.md
docs/tts.md
docs/vps.md
docs/web/control-ui.md
docs/web/dashboard.md
docs/web/index.md
docs/web/tui.md
docs/web/webchat.md
docs/zh-CN/AGENTS.md
docs/zh-CN/automation/auth-monitoring.md
docs/zh-CN/automation/cron-jobs.md
docs/zh-CN/automation/cron-vs-heartbeat.md
docs/zh-CN/automation/gmail-pubsub.md
docs/zh-CN/automation/hooks.md
docs/zh-CN/automation/poll.md
docs/zh-CN/automation/troubleshooting.md
docs/zh-CN/automation/webhook.md
docs/zh-CN/brave-search.md
docs/zh-CN/channels/bluebubbles.md
docs/zh-CN/channels/broadcast-groups.md
docs/zh-CN/channels/channel-routing.md
docs/zh-CN/channels/discord.md
docs/zh-CN/channels/feishu.md
docs/zh-CN/channels/googlechat.md
docs/zh-CN/channels/grammy.md
docs/zh-CN/channels/group-messages.md
docs/zh-CN/channels/groups.md
docs/zh-CN/channels/imessage.md
docs/zh-CN/channels/index.md
docs/zh-CN/channels/line.md
docs/zh-CN/channels/location.md
docs/zh-CN/channels/matrix.md
docs/zh-CN/channels/mattermost.md
docs/zh-CN/channels/msteams.md
docs/zh-CN/channels/nextcloud-talk.md
docs/zh-CN/channels/nostr.md
docs/zh-CN/channels/pairing.md
docs/zh-CN/channels/signal.md
docs/zh-CN/channels/slack.md
docs/zh-CN/channels/telegram.md
docs/zh-CN/channels/tlon.md
docs/zh-CN/channels/troubleshooting.md
docs/zh-CN/channels/twitch.md
docs/zh-CN/channels/whatsapp.md
docs/zh-CN/channels/zalo.md
docs/zh-CN/channels/zalouser.md
docs/zh-CN/cli/acp.md
docs/zh-CN/cli/agent.md
docs/zh-CN/cli/agents.md
docs/zh-CN/cli/approvals.md
docs/zh-CN/cli/browser.md
docs/zh-CN/cli/channels.md
docs/zh-CN/cli/config.md
docs/zh-CN/cli/configure.md
docs/zh-CN/cli/cron.md
docs/zh-CN/cli/dashboard.md
docs/zh-CN/cli/devices.md
docs/zh-CN/cli/directory.md
docs/zh-CN/cli/dns.md
docs/zh-CN/cli/docs.md
docs/zh-CN/cli/doctor.md
docs/zh-CN/cli/gateway.md
docs/zh-CN/cli/health.md
docs/zh-CN/cli/hooks.md
docs/zh-CN/cli/index.md
docs/zh-CN/cli/logs.md
docs/zh-CN/cli/memory.md
docs/zh-CN/cli/message.md
docs/zh-CN/cli/models.md
docs/zh-CN/cli/node.md
docs/zh-CN/cli/nodes.md
docs/zh-CN/cli/onboard.md
docs/zh-CN/cli/pairing.md
docs/zh-CN/cli/plugins.md
docs/zh-CN/cli/reset.md
docs/zh-CN/cli/sandbox.md
docs/zh-CN/cli/security.md
docs/zh-CN/cli/sessions.md
docs/zh-CN/cli/setup.md
docs/zh-CN/cli/skills.md
docs/zh-CN/cli/status.md
docs/zh-CN/cli/system.md
docs/zh-CN/cli/tui.md
docs/zh-CN/cli/uninstall.md
docs/zh-CN/cli/update.md
docs/zh-CN/cli/voicecall.md
docs/zh-CN/cli/webhooks.md
docs/zh-CN/concepts/agent-loop.md
docs/zh-CN/concepts/agent-workspace.md
docs/zh-CN/concepts/agent.md
docs/zh-CN/concepts/architecture.md
docs/zh-CN/concepts/compaction.md
docs/zh-CN/concepts/context.md
docs/zh-CN/concepts/features.md
docs/zh-CN/concepts/markdown-formatting.md
docs/zh-CN/concepts/memory.md
docs/zh-CN/concepts/messages.md
docs/zh-CN/concepts/model-failover.md
docs/zh-CN/concepts/model-providers.md
docs/zh-CN/concepts/models.md
docs/zh-CN/concepts/multi-agent.md
docs/zh-CN/concepts/oauth.md
docs/zh-CN/concepts/presence.md
docs/zh-CN/concepts/queue.md
docs/zh-CN/concepts/retry.md
docs/zh-CN/concepts/session-pruning.md
docs/zh-CN/concepts/session-tool.md
docs/zh-CN/concepts/session.md
docs/zh-CN/concepts/sessions.md
docs/zh-CN/concepts/streaming.md
docs/zh-CN/concepts/system-prompt.md
docs/zh-CN/concepts/timezone.md
docs/zh-CN/concepts/typebox.md
docs/zh-CN/concepts/typing-indicators.md
docs/zh-CN/concepts/usage-tracking.md
docs/zh-CN/date-time.md
docs/zh-CN/debug/node-issue.md
docs/zh-CN/diagnostics/flags.md
docs/zh-CN/experiments/onboarding-config-protocol.md
docs/zh-CN/experiments/plans/cron-add-hardening.md
docs/zh-CN/experiments/plans/group-policy-hardening.md
docs/zh-CN/experiments/plans/openresponses-gateway.md
docs/zh-CN/experiments/proposals/model-config.md
docs/zh-CN/experiments/research/memory.md
docs/zh-CN/gateway/authentication.md
docs/zh-CN/gateway/background-process.md
docs/zh-CN/gateway/bonjour.md
docs/zh-CN/gateway/bridge-protocol.md
docs/zh-CN/gateway/cli-backends.md
docs/zh-CN/gateway/configuration-examples.md
docs/zh-CN/gateway/configuration.md
docs/zh-CN/gateway/discovery.md
docs/zh-CN/gateway/doctor.md
docs/zh-CN/gateway/gateway-lock.md
docs/zh-CN/gateway/health.md
docs/zh-CN/gateway/heartbeat.md
docs/zh-CN/gateway/index.md
docs/zh-CN/gateway/local-models.md
docs/zh-CN/gateway/logging.md
docs/zh-CN/gateway/multiple-gateways.md
docs/zh-CN/gateway/network-model.md
docs/zh-CN/gateway/openai-http-api.md
docs/zh-CN/gateway/openresponses-http-api.md
docs/zh-CN/gateway/pairing.md
docs/zh-CN/gateway/protocol.md
docs/zh-CN/gateway/remote-gateway-readme.md
docs/zh-CN/gateway/remote.md
docs/zh-CN/gateway/sandbox-vs-tool-policy-vs-elevated.md
docs/zh-CN/gateway/sandboxing.md
docs/zh-CN/gateway/security/index.md
docs/zh-CN/gateway/tailscale.md
docs/zh-CN/gateway/tools-invoke-http-api.md
docs/zh-CN/gateway/troubleshooting.md
docs/zh-CN/help/debugging.md
docs/zh-CN/help/environment.md
docs/zh-CN/help/faq.md
docs/zh-CN/help/index.md
docs/zh-CN/help/scripts.md
docs/zh-CN/help/testing.md
docs/zh-CN/help/troubleshooting.md
docs/zh-CN/index.md
docs/zh-CN/install/ansible.md
docs/zh-CN/install/bun.md
docs/zh-CN/install/development-channels.md
docs/zh-CN/install/docker.md
docs/zh-CN/install/exe-dev.md
docs/zh-CN/install/fly.md
docs/zh-CN/install/gcp.md
docs/zh-CN/install/hetzner.md
docs/zh-CN/install/index.md
docs/zh-CN/install/installer.md
docs/zh-CN/install/macos-vm.md
docs/zh-CN/install/migrating.md
docs/zh-CN/install/nix.md
docs/zh-CN/install/node.md
docs/zh-CN/install/northflank.mdx
docs/zh-CN/install/railway.mdx
docs/zh-CN/install/render.mdx
docs/zh-CN/install/uninstall.md
docs/zh-CN/install/updating.md
docs/zh-CN/logging.md
docs/zh-CN/network.md
docs/zh-CN/nodes/audio.md
docs/zh-CN/nodes/camera.md
docs/zh-CN/nodes/images.md
docs/zh-CN/nodes/index.md
docs/zh-CN/nodes/location-command.md
docs/zh-CN/nodes/media-understanding.md
docs/zh-CN/nodes/talk.md
docs/zh-CN/nodes/troubleshooting.md
docs/zh-CN/nodes/voicewake.md
docs/zh-CN/perplexity.md
docs/zh-CN/pi-dev.md
docs/zh-CN/pi.md
docs/zh-CN/platforms/android.md
docs/zh-CN/platforms/digitalocean.md
docs/zh-CN/platforms/index.md
docs/zh-CN/platforms/ios.md
docs/zh-CN/platforms/linux.md
docs/zh-CN/platforms/mac/bundled-gateway.md
docs/zh-CN/platforms/mac/canvas.md
docs/zh-CN/platforms/mac/child-process.md
docs/zh-CN/platforms/mac/dev-setup.md
docs/zh-CN/platforms/mac/health.md
docs/zh-CN/platforms/mac/icon.md
docs/zh-CN/platforms/mac/logging.md
docs/zh-CN/platforms/mac/menu-bar.md
docs/zh-CN/platforms/mac/peekaboo.md
docs/zh-CN/platforms/mac/permissions.md
docs/zh-CN/platforms/mac/release.md
docs/zh-CN/platforms/mac/remote.md
docs/zh-CN/platforms/mac/signing.md
docs/zh-CN/platforms/mac/skills.md
docs/zh-CN/platforms/mac/voice-overlay.md
docs/zh-CN/platforms/mac/voicewake.md
docs/zh-CN/platforms/mac/webchat.md
docs/zh-CN/platforms/mac/xpc.md
docs/zh-CN/platforms/macos.md
docs/zh-CN/platforms/oracle.md
docs/zh-CN/platforms/raspberry-pi.md
docs/zh-CN/platforms/windows.md
docs/zh-CN/plugins/agent-tools.md
docs/zh-CN/plugins/manifest.md
docs/zh-CN/plugins/voice-call.md
docs/zh-CN/plugins/zalouser.md
docs/zh-CN/prose.md
docs/zh-CN/providers/anthropic.md
docs/zh-CN/providers/bedrock.md
docs/zh-CN/providers/claude-max-api-proxy.md
docs/zh-CN/providers/deepgram.md
docs/zh-CN/providers/github-copilot.md
docs/zh-CN/providers/glm.md
docs/zh-CN/providers/index.md
docs/zh-CN/providers/minimax.md
docs/zh-CN/providers/models.md
docs/zh-CN/providers/moonshot.md
docs/zh-CN/providers/ollama.md
docs/zh-CN/providers/openai.md
docs/zh-CN/providers/opencode.md
docs/zh-CN/providers/openrouter.md
docs/zh-CN/providers/qianfan.md
docs/zh-CN/providers/qwen.md
docs/zh-CN/providers/synthetic.md
docs/zh-CN/providers/venice.md
docs/zh-CN/providers/vercel-ai-gateway.md
docs/zh-CN/providers/xiaomi.md
docs/zh-CN/providers/zai.md
docs/zh-CN/refactor/clawnet.md
docs/zh-CN/refactor/exec-host.md
docs/zh-CN/refactor/outbound-session-mirroring.md
docs/zh-CN/refactor/plugin-sdk.md
docs/zh-CN/refactor/strict-config.md
docs/zh-CN/reference/AGENTS.default.md
docs/zh-CN/reference/RELEASING.md
docs/zh-CN/reference/api-usage-costs.md
docs/zh-CN/reference/credits.md
docs/zh-CN/reference/device-models.md
docs/zh-CN/reference/rpc.md
docs/zh-CN/reference/session-management-compaction.md
docs/zh-CN/reference/templates/AGENTS.dev.md
docs/zh-CN/reference/templates/AGENTS.md
docs/zh-CN/reference/templates/BOOT.md
docs/zh-CN/reference/templates/BOOTSTRAP.md
docs/zh-CN/reference/templates/HEARTBEAT.md
docs/zh-CN/reference/templates/IDENTITY.dev.md
docs/zh-CN/reference/templates/IDENTITY.md
docs/zh-CN/reference/templates/SOUL.dev.md
docs/zh-CN/reference/templates/SOUL.md
docs/zh-CN/reference/templates/TOOLS.dev.md
docs/zh-CN/reference/templates/TOOLS.md
docs/zh-CN/reference/templates/USER.dev.md
docs/zh-CN/reference/templates/USER.md
docs/zh-CN/reference/test.md
docs/zh-CN/reference/token-use.md
docs/zh-CN/reference/transcript-hygiene.md
docs/zh-CN/reference/wizard.md
docs/zh-CN/security/formal-verification.md
docs/zh-CN/start/bootstrapping.md
docs/zh-CN/start/docs-directory.md
docs/zh-CN/start/getting-started.md
docs/zh-CN/start/hubs.md
docs/zh-CN/start/lore.md
docs/zh-CN/start/onboarding.md
docs/zh-CN/start/traversalai.md
docs/zh-CN/start/quickstart.md
docs/zh-CN/start/setup.md
docs/zh-CN/start/showcase.md
docs/zh-CN/start/wizard.md
docs/zh-CN/tools/agent-send.md
docs/zh-CN/tools/apply-patch.md
docs/zh-CN/tools/browser-linux-troubleshooting.md
docs/zh-CN/tools/browser-login.md
docs/zh-CN/tools/browser.md
docs/zh-CN/tools/chrome-extension.md
docs/zh-CN/tools/clawhub.md
docs/zh-CN/tools/creating-skills.md
docs/zh-CN/tools/elevated.md
docs/zh-CN/tools/exec-approvals.md
docs/zh-CN/tools/exec.md
docs/zh-CN/tools/firecrawl.md
docs/zh-CN/tools/index.md
docs/zh-CN/tools/llm-task.md
docs/zh-CN/tools/lobster.md
docs/zh-CN/tools/multi-agent-sandbox-tools.md
docs/zh-CN/tools/plugin.md
docs/zh-CN/tools/reactions.md
docs/zh-CN/tools/skills-config.md
docs/zh-CN/tools/skills.md
docs/zh-CN/tools/slash-commands.md
docs/zh-CN/tools/subagents.md
docs/zh-CN/tools/thinking.md
docs/zh-CN/tools/web.md
docs/zh-CN/tts.md
docs/zh-CN/vps.md
docs/zh-CN/web/control-ui.md
docs/zh-CN/web/dashboard.md
docs/zh-CN/web/index.md
docs/zh-CN/web/tui.md
docs/zh-CN/web/webchat.md
```

## Source Cross-Reference

Use the code explanation bundle for runtime architecture and source-layer rationale. This documentation bundle focuses on operator setup, configuration, and discoverability.

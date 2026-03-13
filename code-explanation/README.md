# TraversalAI Full Codebase Explanation

Generated: 2026-03-13T07:44:14.621Z

## Executive Summary

TraversalAI is a local-first AI gateway and multi-surface agent runtime. This bundle explains the codebase as a system instead of treating it as a loose collection of commands and integrations.

The architecture is organized around a few stable layers:

- configuration and migrations in `src/config`
- runtime agents, tools, sandboxing, and workspaces in `src/agents`
- gateway transport and RPC in `src/gateway`
- command orchestration in `src/commands` and `src/cli`
- app surfaces such as the standalone chat GUI in `apps/standalone-chat` and `src/chat-server`

## Runtime Design

### Entry and Boot

- `traversalai.mjs` sets TraversalAI-branded runtime variables and delegates to `traversalai.mjs`
- `traversalai.mjs` loads the compiled runtime from `dist/entry.js`
- the compiled runtime fans into CLI, gateway, automation, UI, and channel services depending on the chosen command

### Configuration and State

- config schema, migrations, validation, and writes are centralized in `src/config`
- workspace paths and session stores derive from state directory resolution
- runtime code consumes normalized config rather than ad hoc env lookups

### Agent Execution

- agents have identities, workspaces, tool policies, model settings, skill filters, and sandbox controls
- session keys and agent scope determine where conversations and artifacts live
- tools and model execution are mediated by the gateway/runtime boundary, not by UI-specific code

### Gateway and UI

- the gateway is the stable RPC boundary for sessions, chat, tools, skills, agents, and models
- the standalone GUI now routes strictly through the gateway-backed chat server bridge
- history, switching, tools, and skills are all surfaced through gateway methods and streamed events

## Built-in Agent Provisioning

TraversalAI now provisions three built-in agents automatically during setup and onboarding when the TraversalAI runtime is active:

- `main` -> `Master Control Agent`
- `email` -> `Email Agent`
- `social-media` -> `Social Media Agent`

Provisioning is additive and preserves operator overrides. Missing built-ins are inserted, missing defaults are filled in, and the related workspaces and session directories are created during setup and onboarding.

## Data Flow

### Message to Model

1. inbound message or UI send event enters a command, channel provider, or gateway method
2. routing resolves session key, agent id, and effective runtime policy
3. config and agent-scope helpers resolve model, workspace, tool profile, and skill filter
4. model execution occurs inside the embedded agent runtime
5. tool requests are validated through policy and sandbox layers
6. transcript updates and session state are persisted
7. final text and tool events stream back to the caller

### Standalone Chat

1. browser connects to the local chat server over HTTP and WebSocket
2. chat server proxies all RPC and event traffic through the gateway
3. browser state is updated from gateway session history and gateway event streams
4. saved chats, tools, skills, agents, and models stay in sync with gateway state

## Security and Control Model

- TraversalAI is personal-by-default, not a hostile multi-tenant boundary by default
- tool access is controlled by explicit config and per-runtime policy
- exec and filesystem actions are mediated by sandbox and safety policy layers
- session visibility and agent routing are explicit, not implicit

## Source Tree Inventory

The following sections list the codebase structure so the explanation remains exhaustive and current.

### Top-Level Source Modules

- `acp/client.test.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/client.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/commands.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/control-plane` (12 entries): agent control plane protocol and runtime surfaces
- `acp/event-mapper.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/meta.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/policy.test.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/policy.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/runtime` (12 entries): agent control plane protocol and runtime surfaces
- `acp/secret-file.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/server.startup.test.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/server.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/session-mapper.test.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/session-mapper.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/session.test.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/session.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/translator.prompt-prefix.test.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/translator.session-rate-limit.test.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/translator.test-helpers.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/translator.ts` (1 entries): agent control plane protocol and runtime surfaces
- `acp/types.ts` (1 entries): agent control plane protocol and runtime surfaces
- `agents/acp-binding-architecture.guardrail.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/acp-spawn.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/acp-spawn.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/agent-paths.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/agent-paths.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/agent-scope.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/agent-scope.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/announce-idempotency.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/anthropic-payload-log.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/anthropic.setup-token.live.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/api-key-rotation.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/apply-patch-update.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/apply-patch.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/apply-patch.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-health.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-health.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles` (17 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.chutes.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.cooldown-auto-expiry.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.ensureauthprofilestore.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.getsoonestcooldownexpiry.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.markauthprofilefailure.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.readonly-sync.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.resolve-auth-profile-order.does-not-prioritize-lastgood-round-robin-ordering.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.resolve-auth-profile-order.fixtures.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.resolve-auth-profile-order.normalizes-z-ai-aliases-auth-order.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.resolve-auth-profile-order.orders-by-lastused-no-explicit-order-exists.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.resolve-auth-profile-order.uses-stored-profiles-no-config-exists.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.runtime-snapshot-save.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.store.save.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/auth-profiles.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-process-registry.test-helpers.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-process-registry.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-process-registry.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.build-docker-exec-args.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec-approval-request.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec-approval-request.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec-host-gateway.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec-host-node.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec-runtime.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec-types.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.approval-id.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.background-abort.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.path.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.pty-cleanup.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.pty-fallback-failure.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.pty-fallback.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.pty.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.script-preflight.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.exec.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.process.poll-timeout.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.process.send-keys.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.process.supervisor.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.process.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.shared.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bash-tools.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bedrock-discovery.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bedrock-discovery.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bootstrap-cache.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bootstrap-cache.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bootstrap-files.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bootstrap-files.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bootstrap-hooks.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/bootstrap-hooks.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/builtins.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/byteplus-models.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/byteplus.live.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cache-trace.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cache-trace.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/channel-tools.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/channel-tools.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/chutes-oauth.flow.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/chutes-oauth.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/chutes-oauth.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/claude-cli-runner.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/claude-cli-runner.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-backends.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-backends.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-credentials.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-credentials.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-runner` (2 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-runner.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-runner.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-session.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cli-watchdog-defaults.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/cloudflare-ai-gateway.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/command-poll-backoff.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/command-poll-backoff.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/compaction.retry.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/compaction.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/compaction.token-sanitize.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/compaction.tool-result-details.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/compaction.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/content-blocks.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/content-blocks.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/context-window-guard.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/context-window-guard.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/context.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/context.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/current-time.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/date-time.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/defaults.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/docs-path.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/doubao-models.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/failover-error.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/failover-error.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/glob-pattern.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/google-gemini-switch.live.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/huggingface-models.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/huggingface-models.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/identity-avatar.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/identity-avatar.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/identity-file.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/identity-file.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/identity.human-delay.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/identity.per-channel-prefix.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/identity.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/identity.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/image-sanitization.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/image-sanitization.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/lanes.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/live-auth-keys.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/live-model-filter.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/memory-search.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/memory-search.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/minimax-vlm.normalizes-api-key.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/minimax-vlm.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/minimax.live.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-alias-lines.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-auth-label.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-auth-label.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-auth.profiles.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-auth.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-auth.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-catalog.test-harness.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-catalog.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-catalog.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-compat.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-compat.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-fallback.probe.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-fallback.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-fallback.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-forward-compat.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-ref-profile.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-ref-profile.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-scan.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-scan.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-selection.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/model-selection.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.auto-injects-github-copilot-provider-token-is.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.e2e-harness.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.falls-back-default-baseurl-token-exchange-fails.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.fills-missing-provider-apikey-from-env-var.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.normalizes-gemini-3-ids-preview-google-providers.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.preserves-explicit-reasoning-override.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.providers.kilocode.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.providers.kimi-coding.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.providers.nvidia.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.providers.ollama.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.providers.qianfan.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.providers.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.providers.volcengine-byteplus.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.skips-writing-models-json-no-env-token.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.test-utils.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models-config.uses-first-github-copilot-profile-env-tokens.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/models.profiles.live.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/moonshot.live.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/ollama-stream.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/ollama-stream.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/openai-responses.reasoning-replay.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-gateway-tool.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.agents.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.camera.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.session-status.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.sessions-visibility.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.sessions.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn-applies-thinking-default.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn-default-timeout-absent.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn-default-timeout.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn-depth-limits.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn.allowlist.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn.cron-note.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn.lifecycle.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn.model.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.sessions-spawn.test-harness.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.steer-failure-clears-suppression.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.subagents.test-harness.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/traversalai-tools.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/opencode-zen-models.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/opencode-zen-models.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/owner-display.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/owner-display.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-auth-credentials.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-auth-json.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-auth-json.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-block-chunker.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-block-chunker.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-helpers` (9 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-helpers.buildbootstrapcontextfiles.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-helpers.formatassistanterrortext.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-helpers.isbillingerrormessage.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-helpers.sanitize-session-messages-images.removes-empty-assistant-text-blocks-but-preserves.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-helpers.sanitizeuserfacingtext.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-helpers.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-helpers.validate-turns.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-messaging.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-payloads.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner` (59 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner-extraparams.live.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner-extraparams.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.applygoogleturnorderingfix.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.buildembeddedsandboxinfo.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.compaction-safety-timeout.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.createsystempromptoverride.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.get-dm-history-limit-from-session-key.falls-back-provider-default-per-dm-not.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.get-dm-history-limit-from-session-key.returns-undefined-sessionkey-is-undefined.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.guard.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.guard.waitforidle-before-flush.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.history-limit-from-session-key.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.limithistoryturns.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.openai-tool-id-preservation.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.resolvesessionagentids.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.run-embedded-pi-agent.auth-profile-rotation.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.sanitize-session-history.policy.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.sanitize-session-history.test-harness.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.sanitize-session-history.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.splitsdktools.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-runner.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.code-span-awareness.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.e2e-harness.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.compaction.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.lifecycle.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.lifecycle.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.messages.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.messages.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.tools.media.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.tools.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.tools.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.handlers.types.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.lifecycle-billing-error.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.raw-stream.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.reply-tags.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.calls-onblockreplyflush-before-tool-execution-start-preserve.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-append-text-end-content-is.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-call-onblockreplyflush-callback-is-not.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-duplicate-text-end-repeats-full.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-emit-duplicate-block-replies-text.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.emits-block-replies-text-end-does-not.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.emits-reasoning-as-separate-message-enabled.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.filters-final-suppresses-output-without-start-tag.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.includes-canvas-action-metadata-tool-summaries.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.keeps-assistanttexts-final-answer-block-replies-are.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.keeps-indented-fenced-blocks-intact.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.reopens-fenced-blocks-splitting-inside-them.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.splits-long-single-line-fenced-blocks-reopen.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.streams-soft-chunks-paragraph-preference.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.subscribeembeddedpisession.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.suppresses-message-end-block-replies-message-tool.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.subscribe-embedded-pi-session.waits-multiple-compaction-retries-before-resolving.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.tools.extract.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.tools.media.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.tools.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.tools.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-subscribe.types.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-utils.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded-utils.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-embedded.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-extensions` (11 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-model-discovery.auth.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-model-discovery.compat.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-model-discovery.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-project-settings.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-project-settings.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-settings.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-settings.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tool-definition-adapter.after-tool-call.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tool-definition-adapter.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tool-definition-adapter.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools-agent-config.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.abort.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.before-tool-call.integration.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.before-tool-call.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.before-tool-call.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.create-traversalai-coding-tools.adds-claude-style-aliases-schemas-without-dropping-b.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.create-traversalai-coding-tools.adds-claude-style-aliases-schemas-without-dropping-d.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.create-traversalai-coding-tools.adds-claude-style-aliases-schemas-without-dropping-f.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.create-traversalai-coding-tools.adds-claude-style-aliases-schemas-without-dropping.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.message-provider-policy.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.policy.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.policy.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.read.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.read.workspace-root-guard.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.safe-bins.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.sandbox-mounted-paths.workspace-only.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.schema.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.types.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.whatsapp-login-gating.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pi-tools.workspace-paths.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pty-dsr.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pty-keys.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/pty-keys.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/queued-file-writer.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox` (39 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-agent-config.agent-specific-sandbox-config.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-create-args.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-explain.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-media-paths.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-merge.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-paths.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-paths.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-skills.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox-tool-policy.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox.resolveSandboxContext.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sandbox.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sanitize-for-prompt.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sanitize-for-prompt.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/schema` (2 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-dirs.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-file-repair.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-file-repair.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-slug.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-slug.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-tool-result-guard-wrapper.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-tool-result-guard.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-tool-result-guard.tool-result-persist-hook.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-tool-result-guard.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-transcript-repair.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-transcript-repair.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-write-lock.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/session-write-lock.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sessions-spawn-hooks.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/sessions-spawn-threadid.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/shell-utils.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/shell-utils.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills` (17 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-install-download.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-install-fallback.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-install-output.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-install.download-test-utils.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-install.download.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-install.test-mocks.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-install.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-install.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-status.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills-status.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.agents-skills-directory.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.build-workspace-skills-prompt.applies-bundled-allowlist-without-affecting-workspace-skills.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.build-workspace-skills-prompt.prefers-workspace-skills-managed-skills.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.build-workspace-skills-prompt.syncs-merged-skills-into-target-workspace.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.buildworkspaceskillsnapshot.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.buildworkspaceskillstatus.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.compact-skill-paths.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.e2e-test-helpers.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.e2e-test-helpers.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.loadworkspaceskillentries.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.resolveskillspromptforrun.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.summarize-skill-description.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.test-helpers.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/skills.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/stable-stringify.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-announce-dispatch.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-announce-dispatch.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-announce-queue.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-announce-queue.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-announce.format.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-announce.timeout.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-announce.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-depth.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-depth.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-lifecycle-events.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry-cleanup.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry-completion.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry-completion.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry-queries.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry-state.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.announce-loop-guard.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.archive.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.lifecycle-retry-grace.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.mocks.shared.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.nested.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.persistence.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.steer-restart.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.store.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-registry.types.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/subagent-spawn.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/synthetic-models.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/system-prompt-params.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/system-prompt-params.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/system-prompt-report.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/system-prompt-report.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/system-prompt-stability.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/system-prompt.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/system-prompt.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/test-helpers` (11 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/timeout.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/together-models.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-call-id.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-call-id.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-catalog.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-display-common.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-display.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-display.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-fs-policy.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-fs-policy.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-images.log.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-images.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-images.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-loop-detection.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-loop-detection.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-mutation.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-mutation.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-policy-pipeline.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-policy-pipeline.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-policy-shared.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-policy.conformance.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-policy.plugin-only-allowlist.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-policy.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-policy.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tool-summaries.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/tools` (78 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/transcript-policy.policy.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/transcript-policy.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/transcript-policy.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/usage.normalization.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/usage.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/usage.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/venice-models.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/volc-models.shared.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace-dir.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace-dirs.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace-run.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace-run.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace-templates.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace-templates.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace.bootstrap-cache.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace.defaults.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace.load-extra-bootstrap-files.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/workspace.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `agents/zai.live.test.ts` (1 entries): agent runtime, tools, models, workspaces, identities, and sandbox policies
- `auto-reply/chunk.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/chunk.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/command-auth.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/command-control.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/command-detection.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/commands-args.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/commands-args.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/commands-registry.data.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/commands-registry.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/commands-registry.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/commands-registry.types.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/dispatch.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/dispatch.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/envelope.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/envelope.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/fallback-state.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/fallback-state.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/group-activation.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/heartbeat-reply-payload.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/heartbeat.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/heartbeat.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/inbound-debounce.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/inbound.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/media-note.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/media-note.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/media-understanding.test-fixtures.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/model-runtime.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/model.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/model.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply` (186 entries): reply orchestration and automation entry points
- `auto-reply/reply.block-streaming.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.directive.directive-behavior.applies-inline-reasoning-mixed-messages-acks-immediately.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.directive.directive-behavior.defaults-think-low-reasoning-capable-models-no.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.directive.directive-behavior.e2e-harness.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.directive.directive-behavior.e2e-mocks.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.directive.directive-behavior.model-directive-test-utils.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.directive.directive-behavior.prefers-alias-matches-fuzzy-selection-is-ambiguous.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.directive.directive-behavior.shows-current-verbose-level-verbose-has-no.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.directive.parse.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.heartbeat-typing.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.media-note.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.raw-body.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.test-harness.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.triggers.group-intro-prompts.cases.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.triggers.trigger-handling.filters-usage-summary-current-model-provider.cases.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.triggers.trigger-handling.stages-inbound-media-into-sandbox-workspace.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.triggers.trigger-handling.targets-active-session-native-stop.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.triggers.trigger-handling.test-harness.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/reply.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/send-policy.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/skill-commands.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/skill-commands.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/stage-sandbox-media.test-harness.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/status.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/status.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/templating.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/thinking.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/thinking.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/tokens.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/tokens.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/tool-meta.test.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/tool-meta.ts` (1 entries): reply orchestration and automation entry points
- `auto-reply/types.ts` (1 entries): reply orchestration and automation entry points
- `browser/bridge-auth-registry.ts` (1 entries): browser automation and browser-facing routes
- `browser/bridge-server.auth.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/bridge-server.ts` (1 entries): browser automation and browser-facing routes
- `browser/browser-utils.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/cdp.helpers.ts` (1 entries): browser automation and browser-facing routes
- `browser/cdp.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/cdp.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome-extension-background-utils.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome-extension-manifest.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome-extension-options-validation.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome-user-data-dir.test-harness.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome.default-browser.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome.executables.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome.profile-decoration.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/chrome.ts` (1 entries): browser automation and browser-facing routes
- `browser/client-actions-core.ts` (1 entries): browser automation and browser-facing routes
- `browser/client-actions-observe.ts` (1 entries): browser automation and browser-facing routes
- `browser/client-actions-state.ts` (1 entries): browser automation and browser-facing routes
- `browser/client-actions-types.ts` (1 entries): browser automation and browser-facing routes
- `browser/client-actions-url.ts` (1 entries): browser automation and browser-facing routes
- `browser/client-actions.ts` (1 entries): browser automation and browser-facing routes
- `browser/client-fetch.loopback-auth.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/client-fetch.ts` (1 entries): browser automation and browser-facing routes
- `browser/client.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/client.ts` (1 entries): browser automation and browser-facing routes
- `browser/config.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/config.ts` (1 entries): browser automation and browser-facing routes
- `browser/constants.ts` (1 entries): browser automation and browser-facing routes
- `browser/control-auth.auto-token.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/control-auth.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/control-auth.ts` (1 entries): browser automation and browser-facing routes
- `browser/control-service.ts` (1 entries): browser automation and browser-facing routes
- `browser/csrf.ts` (1 entries): browser automation and browser-facing routes
- `browser/extension-relay-auth.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/extension-relay-auth.ts` (1 entries): browser automation and browser-facing routes
- `browser/extension-relay.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/extension-relay.ts` (1 entries): browser automation and browser-facing routes
- `browser/form-fields.ts` (1 entries): browser automation and browser-facing routes
- `browser/http-auth.ts` (1 entries): browser automation and browser-facing routes
- `browser/navigation-guard.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/navigation-guard.ts` (1 entries): browser automation and browser-facing routes
- `browser/paths.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/paths.ts` (1 entries): browser automation and browser-facing routes
- `browser/profiles-service.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/profiles-service.ts` (1 entries): browser automation and browser-facing routes
- `browser/profiles.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/profiles.ts` (1 entries): browser automation and browser-facing routes
- `browser/proxy-files.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-ai-module.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-ai-state.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-ai.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-ai.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-role-snapshot.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-role-snapshot.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-session.browserless.live.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-session.create-page.navigation-guard.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-session.get-page-for-targetid.extension-fallback.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-session.mock-setup.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-session.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-session.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.activity.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.clamps-timeoutms-scrollintoview.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.downloads.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.interactions.evaluate.abort.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.interactions.set-input-files.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.interactions.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.last-file-chooser-arm-wins.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.responses.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.screenshots-element-selector.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.shared.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.snapshot.navigate-guard.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.snapshot.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.state.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.storage.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.test-harness.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.trace.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.ts` (1 entries): browser automation and browser-facing routes
- `browser/pw-tools-core.waits-next-download-saves-it.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/resolved-config-refresh.ts` (1 entries): browser automation and browser-facing routes
- `browser/routes` (20 entries): browser automation and browser-facing routes
- `browser/screenshot.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/screenshot.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-context.chrome-test-harness.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-context.ensure-tab-available.prefers-last-target.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-context.hot-reload-profiles.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-context.remote-tab-ops.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-context.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-context.types.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-lifecycle.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-lifecycle.ts` (1 entries): browser automation and browser-facing routes
- `browser/server-middleware.ts` (1 entries): browser automation and browser-facing routes
- `browser/server.agent-contract-form-layout-act-commands.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server.agent-contract-snapshot-endpoints.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server.agent-contract.test-harness.ts` (1 entries): browser automation and browser-facing routes
- `browser/server.auth-token-gates-http.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server.control-server.test-harness.ts` (1 entries): browser automation and browser-facing routes
- `browser/server.evaluate-disabled-does-not-block-storage.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server.post-tabs-open-profile-unknown-returns-404.test.ts` (1 entries): browser automation and browser-facing routes
- `browser/server.ts` (1 entries): browser automation and browser-facing routes
- `browser/target-id.ts` (1 entries): browser automation and browser-facing routes
- `browser/test-port.ts` (1 entries): browser automation and browser-facing routes
- `browser/trash.ts` (1 entries): browser automation and browser-facing routes
- `canvas-host/a2ui.ts` (1 entries): canvas and embedded UI host surfaces
- `canvas-host/file-resolver.ts` (1 entries): canvas and embedded UI host surfaces
- `canvas-host/server.state-dir.test.ts` (1 entries): canvas and embedded UI host surfaces
- `canvas-host/server.test.ts` (1 entries): canvas and embedded UI host surfaces
- `canvas-host/server.ts` (1 entries): canvas and embedded UI host surfaces
- `channel-web.ts` (1 entries): supporting runtime logic
- `channels/account-summary.ts` (1 entries): shared channel abstractions and plugins
- `channels/ack-reactions.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/ack-reactions.ts` (1 entries): shared channel abstractions and plugins
- `channels/allow-from.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/allow-from.ts` (1 entries): shared channel abstractions and plugins
- `channels/allowlist-match.ts` (1 entries): shared channel abstractions and plugins
- `channels/allowlists` (2 entries): shared channel abstractions and plugins
- `channels/channel-config.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/channel-config.ts` (1 entries): shared channel abstractions and plugins
- `channels/channels-misc.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/chat-type.ts` (1 entries): shared channel abstractions and plugins
- `channels/command-gating.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/command-gating.ts` (1 entries): shared channel abstractions and plugins
- `channels/conversation-label.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/conversation-label.ts` (1 entries): shared channel abstractions and plugins
- `channels/dock.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/dock.ts` (1 entries): shared channel abstractions and plugins
- `channels/draft-stream-controls.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/draft-stream-controls.ts` (1 entries): shared channel abstractions and plugins
- `channels/draft-stream-loop.ts` (1 entries): shared channel abstractions and plugins
- `channels/location.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/location.ts` (1 entries): shared channel abstractions and plugins
- `channels/logging.ts` (1 entries): shared channel abstractions and plugins
- `channels/mention-gating.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/mention-gating.ts` (1 entries): shared channel abstractions and plugins
- `channels/model-overrides.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/model-overrides.ts` (1 entries): shared channel abstractions and plugins
- `channels/plugins` (93 entries): shared channel abstractions and plugins
- `channels/registry.helpers.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/registry.ts` (1 entries): shared channel abstractions and plugins
- `channels/reply-prefix.ts` (1 entries): shared channel abstractions and plugins
- `channels/sender-identity.ts` (1 entries): shared channel abstractions and plugins
- `channels/sender-label.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/sender-label.ts` (1 entries): shared channel abstractions and plugins
- `channels/session.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/session.ts` (1 entries): shared channel abstractions and plugins
- `channels/status-reactions.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/status-reactions.ts` (1 entries): shared channel abstractions and plugins
- `channels/targets.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/targets.ts` (1 entries): shared channel abstractions and plugins
- `channels/telegram` (4 entries): shared channel abstractions and plugins
- `channels/thread-bindings-messages.ts` (1 entries): shared channel abstractions and plugins
- `channels/thread-bindings-policy.ts` (1 entries): shared channel abstractions and plugins
- `channels/typing-lifecycle.ts` (1 entries): shared channel abstractions and plugins
- `channels/typing-start-guard.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/typing-start-guard.ts` (1 entries): shared channel abstractions and plugins
- `channels/typing.test.ts` (1 entries): shared channel abstractions and plugins
- `channels/typing.ts` (1 entries): shared channel abstractions and plugins
- `channels/web` (1 entries): shared channel abstractions and plugins
- `chat-server/chat-events.test.ts` (1 entries): standalone chat GUI backend bridge
- `chat-server/gateway-session.test.ts` (1 entries): standalone chat GUI backend bridge
- `chat-server/server.test.ts` (1 entries): standalone chat GUI backend bridge
- `chat-server/server.ts` (1 entries): standalone chat GUI backend bridge
- `cli/acp-cli.option-collisions.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/acp-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/argv.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/argv.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/banner.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-actions-input` (7 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-actions-input.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-actions-observe.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-debug.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-examples.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-extension.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-extension.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-inspect.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-inspect.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-manage.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-resize.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-shared.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-state.cookies-storage.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-state.option-collisions.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli-state.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/browser-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/channel-auth.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/channel-auth.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/channel-options.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/channels-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/clawbot-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/cli-name.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/cli-utils.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/cli-utils.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/command-format.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/command-options.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/command-options.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/completion-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/completion-fish.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/completion-fish.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/config-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/config-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/cron-cli` (6 entries): command registration, command context, and CLI UX helpers
- `cli/cron-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/cron-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/daemon-cli` (20 entries): command registration, command context, and CLI UX helpers
- `cli/daemon-cli-compat.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/daemon-cli-compat.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/daemon-cli.coverage.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/daemon-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/deps.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/deps.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/devices-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/devices-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/directory-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/dns-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/docs-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/exec-approvals-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/exec-approvals-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/gateway-cli` (10 entries): command registration, command context, and CLI UX helpers
- `cli/gateway-cli.coverage.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/gateway-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/gateway-rpc.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/gateway.sigterm.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/help-format.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/hooks-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/hooks-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/log-level-option.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/log-level-option.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/logs-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/logs-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/memory-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/memory-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/models-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/models-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/node-cli` (2 entries): command registration, command context, and CLI UX helpers
- `cli/node-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-camera.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-camera.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-canvas.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-cli` (17 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-cli.coverage.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-media-utils.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-media-utils.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-run.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/nodes-screen.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/npm-resolution.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/npm-resolution.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/outbound-send-deps.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/outbound-send-mapping.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/outbound-send-mapping.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/pairing-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/pairing-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/parse-bytes.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/parse-duration.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/parse-timeout.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/plugin-registry.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/plugins-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/plugins-config.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/plugins-config.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/ports.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/profile-utils.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/profile.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/profile.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/program` (51 entries): command registration, command context, and CLI UX helpers
- `cli/program.force.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/program.nodes-basic.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/program.nodes-media.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/program.nodes-test-helpers.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/program.nodes-test-helpers.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/program.smoke.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/program.test-mocks.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/program.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/progress.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/progress.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/prompt.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/prompt.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/qr-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/qr-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/requirements-test-fixtures.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/respawn-policy.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/route.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/run-main.exit.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/run-main.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/run-main.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/sandbox-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/secrets-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/secrets-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/security-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/shared` (1 entries): command registration, command context, and CLI UX helpers
- `cli/skills-cli.commands.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/skills-cli.format.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/skills-cli.formatting.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/skills-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/skills-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/standalone-chat-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/standalone-chat-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/system-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/system-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/tagline.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/test-runtime-capture.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/tui-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/update-cli` (9 entries): command registration, command context, and CLI UX helpers
- `cli/update-cli.option-collisions.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/update-cli.test.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/update-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/wait.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/webhooks-cli.ts` (1 entries): command registration, command context, and CLI UX helpers
- `cli/windows-argv.ts` (1 entries): command registration, command context, and CLI UX helpers
- `commands/agent` (7 entries): user-facing command implementations
- `commands/agent-via-gateway.test.ts` (1 entries): user-facing command implementations
- `commands/agent-via-gateway.ts` (1 entries): user-facing command implementations
- `commands/agent.acp.test.ts` (1 entries): user-facing command implementations
- `commands/agent.delivery.test.ts` (1 entries): user-facing command implementations
- `commands/agent.test.ts` (1 entries): user-facing command implementations
- `commands/agent.ts` (1 entries): user-facing command implementations
- `commands/agents.add.test.ts` (1 entries): user-facing command implementations
- `commands/agents.bind.commands.test.ts` (1 entries): user-facing command implementations
- `commands/agents.bindings.ts` (1 entries): user-facing command implementations
- `commands/agents.command-shared.ts` (1 entries): user-facing command implementations
- `commands/agents.commands.add.ts` (1 entries): user-facing command implementations
- `commands/agents.commands.bind.ts` (1 entries): user-facing command implementations
- `commands/agents.commands.delete.ts` (1 entries): user-facing command implementations
- `commands/agents.commands.identity.ts` (1 entries): user-facing command implementations
- `commands/agents.commands.list.ts` (1 entries): user-facing command implementations
- `commands/agents.config.ts` (1 entries): user-facing command implementations
- `commands/agents.identity.test.ts` (1 entries): user-facing command implementations
- `commands/agents.providers.ts` (1 entries): user-facing command implementations
- `commands/agents.test.ts` (1 entries): user-facing command implementations
- `commands/agents.ts` (1 entries): user-facing command implementations
- `commands/auth-choice-legacy.ts` (1 entries): user-facing command implementations
- `commands/auth-choice-options.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice-options.ts` (1 entries): user-facing command implementations
- `commands/auth-choice-prompt.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.api-key.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply-helpers.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply-helpers.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.anthropic.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.api-providers.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.byteplus.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.copilot-proxy.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.github-copilot.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.google-gemini-cli.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.google-gemini-cli.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.huggingface.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.huggingface.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.minimax.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.minimax.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.oauth.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.openai.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.openai.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.openrouter.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.plugin-provider.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.qwen-portal.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.vllm.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.volcengine-byteplus.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.volcengine.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.apply.xai.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.default-model.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.model-check.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.moonshot.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.preferred-provider.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.test.ts` (1 entries): user-facing command implementations
- `commands/auth-choice.ts` (1 entries): user-facing command implementations
- `commands/auth-token.ts` (1 entries): user-facing command implementations
- `commands/channel-account-context.test.ts` (1 entries): user-facing command implementations
- `commands/channel-account-context.ts` (1 entries): user-facing command implementations
- `commands/channel-test-helpers.ts` (1 entries): user-facing command implementations
- `commands/channels` (10 entries): user-facing command implementations
- `commands/channels.add.test.ts` (1 entries): user-facing command implementations
- `commands/channels.adds-non-default-telegram-account.test.ts` (1 entries): user-facing command implementations
- `commands/channels.mock-harness.ts` (1 entries): user-facing command implementations
- `commands/channels.surfaces-signal-runtime-errors-channels-status-output.test.ts` (1 entries): user-facing command implementations
- `commands/channels.ts` (1 entries): user-facing command implementations
- `commands/chutes-oauth.test.ts` (1 entries): user-facing command implementations
- `commands/chutes-oauth.ts` (1 entries): user-facing command implementations
- `commands/cleanup-plan.ts` (1 entries): user-facing command implementations
- `commands/cleanup-utils.test.ts` (1 entries): user-facing command implementations
- `commands/cleanup-utils.ts` (1 entries): user-facing command implementations
- `commands/config-validation.ts` (1 entries): user-facing command implementations
- `commands/configure.channels.ts` (1 entries): user-facing command implementations
- `commands/configure.commands.ts` (1 entries): user-facing command implementations
- `commands/configure.daemon.ts` (1 entries): user-facing command implementations
- `commands/configure.gateway-auth.prompt-auth-config.test.ts` (1 entries): user-facing command implementations
- `commands/configure.gateway-auth.test.ts` (1 entries): user-facing command implementations
- `commands/configure.gateway-auth.ts` (1 entries): user-facing command implementations
- `commands/configure.gateway.test.ts` (1 entries): user-facing command implementations
- `commands/configure.gateway.ts` (1 entries): user-facing command implementations
- `commands/configure.shared.ts` (1 entries): user-facing command implementations
- `commands/configure.ts` (1 entries): user-facing command implementations
- `commands/configure.wizard.test.ts` (1 entries): user-facing command implementations
- `commands/configure.wizard.ts` (1 entries): user-facing command implementations
- `commands/daemon-install-helpers.test.ts` (1 entries): user-facing command implementations
- `commands/daemon-install-helpers.ts` (1 entries): user-facing command implementations
- `commands/daemon-install-runtime-warning.test.ts` (1 entries): user-facing command implementations
- `commands/daemon-install-runtime-warning.ts` (1 entries): user-facing command implementations
- `commands/daemon-runtime.ts` (1 entries): user-facing command implementations
- `commands/dashboard.links.test.ts` (1 entries): user-facing command implementations
- `commands/dashboard.test.ts` (1 entries): user-facing command implementations
- `commands/dashboard.ts` (1 entries): user-facing command implementations
- `commands/docs.ts` (1 entries): user-facing command implementations
- `commands/doctor-auth.deprecated-cli-profiles.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-auth.hints.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-auth.ts` (1 entries): user-facing command implementations
- `commands/doctor-completion.ts` (1 entries): user-facing command implementations
- `commands/doctor-config-flow.include-warning.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-config-flow.missing-default-account-bindings.integration.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-config-flow.missing-default-account-bindings.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-config-flow.safe-bins.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-config-flow.test-utils.ts` (1 entries): user-facing command implementations
- `commands/doctor-config-flow.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-config-flow.ts` (1 entries): user-facing command implementations
- `commands/doctor-format.ts` (1 entries): user-facing command implementations
- `commands/doctor-gateway-daemon-flow.ts` (1 entries): user-facing command implementations
- `commands/doctor-gateway-health.ts` (1 entries): user-facing command implementations
- `commands/doctor-gateway-services.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-gateway-services.ts` (1 entries): user-facing command implementations
- `commands/doctor-install.ts` (1 entries): user-facing command implementations
- `commands/doctor-legacy-config.migrations.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-legacy-config.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-legacy-config.ts` (1 entries): user-facing command implementations
- `commands/doctor-memory-search.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-memory-search.ts` (1 entries): user-facing command implementations
- `commands/doctor-platform-notes.launchctl-env-overrides.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-platform-notes.ts` (1 entries): user-facing command implementations
- `commands/doctor-prompter.ts` (1 entries): user-facing command implementations
- `commands/doctor-sandbox.ts` (1 entries): user-facing command implementations
- `commands/doctor-sandbox.warns-sandbox-enabled-without-docker.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-security.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-security.ts` (1 entries): user-facing command implementations
- `commands/doctor-session-locks.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-session-locks.ts` (1 entries): user-facing command implementations
- `commands/doctor-state-integrity.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-state-integrity.ts` (1 entries): user-facing command implementations
- `commands/doctor-state-migrations.test.ts` (1 entries): user-facing command implementations
- `commands/doctor-state-migrations.ts` (1 entries): user-facing command implementations
- `commands/doctor-ui.ts` (1 entries): user-facing command implementations
- `commands/doctor-update.ts` (1 entries): user-facing command implementations
- `commands/doctor-workspace-status.ts` (1 entries): user-facing command implementations
- `commands/doctor-workspace.ts` (1 entries): user-facing command implementations
- `commands/doctor.e2e-harness.ts` (1 entries): user-facing command implementations
- `commands/doctor.fast-path-mocks.ts` (1 entries): user-facing command implementations
- `commands/doctor.migrates-routing-allowfrom-channels-whatsapp-allowfrom.test.ts` (1 entries): user-facing command implementations
- `commands/doctor.migrates-slack-discord-dm-policy-aliases.test.ts` (1 entries): user-facing command implementations
- `commands/doctor.runs-legacy-state-migrations-yes-mode-without.test.ts` (1 entries): user-facing command implementations
- `commands/doctor.ts` (1 entries): user-facing command implementations
- `commands/doctor.warns-per-agent-sandbox-docker-browser-prune.test.ts` (1 entries): user-facing command implementations
- `commands/doctor.warns-state-directory-is-missing.test.ts` (1 entries): user-facing command implementations
- `commands/gateway-presence.ts` (1 entries): user-facing command implementations
- `commands/gateway-status` (1 entries): user-facing command implementations
- `commands/gateway-status.test.ts` (1 entries): user-facing command implementations
- `commands/gateway-status.ts` (1 entries): user-facing command implementations
- `commands/google-gemini-model-default.ts` (1 entries): user-facing command implementations
- `commands/health-format.ts` (1 entries): user-facing command implementations
- `commands/health.command.coverage.test.ts` (1 entries): user-facing command implementations
- `commands/health.snapshot.test.ts` (1 entries): user-facing command implementations
- `commands/health.test.ts` (1 entries): user-facing command implementations
- `commands/health.ts` (1 entries): user-facing command implementations
- `commands/message-format.ts` (1 entries): user-facing command implementations
- `commands/message.test.ts` (1 entries): user-facing command implementations
- `commands/message.ts` (1 entries): user-facing command implementations
- `commands/model-allowlist.ts` (1 entries): user-facing command implementations
- `commands/model-default.ts` (1 entries): user-facing command implementations
- `commands/model-picker.test.ts` (1 entries): user-facing command implementations
- `commands/model-picker.ts` (1 entries): user-facing command implementations
- `commands/models` (26 entries): user-facing command implementations
- `commands/models.auth.provider-resolution.test.ts` (1 entries): user-facing command implementations
- `commands/models.list.auth-sync.test.ts` (1 entries): user-facing command implementations
- `commands/models.list.test.ts` (1 entries): user-facing command implementations
- `commands/models.set.test.ts` (1 entries): user-facing command implementations
- `commands/models.ts` (1 entries): user-facing command implementations
- `commands/node-daemon-install-helpers.ts` (1 entries): user-facing command implementations
- `commands/node-daemon-runtime.ts` (1 entries): user-facing command implementations
- `commands/oauth-env.ts` (1 entries): user-facing command implementations
- `commands/oauth-flow.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.config-core.kilocode.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.config-core.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.config-gateways.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.config-litellm.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.config-minimax.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.config-opencode.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.config-shared.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.config-shared.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.credentials.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.credentials.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.models.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-auth.ts` (1 entries): user-facing command implementations
- `commands/onboard-channels.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-channels.ts` (1 entries): user-facing command implementations
- `commands/onboard-config.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-config.ts` (1 entries): user-facing command implementations
- `commands/onboard-custom.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-custom.ts` (1 entries): user-facing command implementations
- `commands/onboard-helpers.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-helpers.ts` (1 entries): user-facing command implementations
- `commands/onboard-hooks.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-hooks.ts` (1 entries): user-facing command implementations
- `commands/onboard-interactive.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-interactive.ts` (1 entries): user-facing command implementations
- `commands/onboard-non-interactive` (10 entries): user-facing command implementations
- `commands/onboard-non-interactive.gateway.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-non-interactive.provider-auth.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-non-interactive.test-helpers.ts` (1 entries): user-facing command implementations
- `commands/onboard-non-interactive.ts` (1 entries): user-facing command implementations
- `commands/onboard-provider-auth-flags.ts` (1 entries): user-facing command implementations
- `commands/onboard-remote.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-remote.ts` (1 entries): user-facing command implementations
- `commands/onboard-skills.test.ts` (1 entries): user-facing command implementations
- `commands/onboard-skills.ts` (1 entries): user-facing command implementations
- `commands/onboard-types.ts` (1 entries): user-facing command implementations
- `commands/onboard.test.ts` (1 entries): user-facing command implementations
- `commands/onboard.ts` (1 entries): user-facing command implementations
- `commands/onboarding` (5 entries): user-facing command implementations
- `commands/openai-codex-model-default.ts` (1 entries): user-facing command implementations
- `commands/openai-codex-oauth.test.ts` (1 entries): user-facing command implementations
- `commands/openai-codex-oauth.ts` (1 entries): user-facing command implementations
- `commands/openai-model-default.test.ts` (1 entries): user-facing command implementations
- `commands/openai-model-default.ts` (1 entries): user-facing command implementations
- `commands/opencode-zen-model-default.ts` (1 entries): user-facing command implementations
- `commands/provider-auth-helpers.ts` (1 entries): user-facing command implementations
- `commands/reset.ts` (1 entries): user-facing command implementations
- `commands/sandbox-display.ts` (1 entries): user-facing command implementations
- `commands/sandbox-explain.test.ts` (1 entries): user-facing command implementations
- `commands/sandbox-explain.ts` (1 entries): user-facing command implementations
- `commands/sandbox-formatters.test.ts` (1 entries): user-facing command implementations
- `commands/sandbox-formatters.ts` (1 entries): user-facing command implementations
- `commands/sandbox.test.ts` (1 entries): user-facing command implementations
- `commands/sandbox.ts` (1 entries): user-facing command implementations
- `commands/session-store-targets.test.ts` (1 entries): user-facing command implementations
- `commands/session-store-targets.ts` (1 entries): user-facing command implementations
- `commands/sessions-cleanup.test.ts` (1 entries): user-facing command implementations
- `commands/sessions-cleanup.ts` (1 entries): user-facing command implementations
- `commands/sessions-table.ts` (1 entries): user-facing command implementations
- `commands/sessions.default-agent-store.test.ts` (1 entries): user-facing command implementations
- `commands/sessions.model-resolution.test.ts` (1 entries): user-facing command implementations
- `commands/sessions.test-helpers.ts` (1 entries): user-facing command implementations
- `commands/sessions.test.ts` (1 entries): user-facing command implementations
- `commands/sessions.ts` (1 entries): user-facing command implementations
- `commands/setup.ts` (1 entries): user-facing command implementations
- `commands/signal-install.test.ts` (1 entries): user-facing command implementations
- `commands/signal-install.ts` (1 entries): user-facing command implementations
- `commands/status-all` (8 entries): user-facing command implementations
- `commands/status-all.ts` (1 entries): user-facing command implementations
- `commands/status.agent-local.ts` (1 entries): user-facing command implementations
- `commands/status.command.ts` (1 entries): user-facing command implementations
- `commands/status.daemon.ts` (1 entries): user-facing command implementations
- `commands/status.format.ts` (1 entries): user-facing command implementations
- `commands/status.gateway-probe.ts` (1 entries): user-facing command implementations
- `commands/status.link-channel.ts` (1 entries): user-facing command implementations
- `commands/status.scan.ts` (1 entries): user-facing command implementations
- `commands/status.summary.redaction.test.ts` (1 entries): user-facing command implementations
- `commands/status.summary.ts` (1 entries): user-facing command implementations
- `commands/status.test.ts` (1 entries): user-facing command implementations
- `commands/status.ts` (1 entries): user-facing command implementations
- `commands/status.types.ts` (1 entries): user-facing command implementations
- `commands/status.update.test.ts` (1 entries): user-facing command implementations
- `commands/status.update.ts` (1 entries): user-facing command implementations
- `commands/systemd-linger.ts` (1 entries): user-facing command implementations
- `commands/test-runtime-config-helpers.ts` (1 entries): user-facing command implementations
- `commands/test-wizard-helpers.ts` (1 entries): user-facing command implementations
- `commands/text-format.test.ts` (1 entries): user-facing command implementations
- `commands/text-format.ts` (1 entries): user-facing command implementations
- `commands/uninstall.ts` (1 entries): user-facing command implementations
- `commands/vllm-setup.ts` (1 entries): user-facing command implementations
- `commands/zai-endpoint-detect.test.ts` (1 entries): user-facing command implementations
- `commands/zai-endpoint-detect.ts` (1 entries): user-facing command implementations
- `compat/legacy-names.ts` (1 entries): supporting runtime logic
- `config/agent-dirs.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/agent-dirs.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/agent-limits.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/backup-rotation.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/cache-utils.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/channel-capabilities.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/channel-capabilities.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/commands.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/commands.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config-misc.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config-paths.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.agent-concurrency-defaults.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.allowlist-requires-allowfrom.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.backup-rotation.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.compaction-settings.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.discord-presence.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.discord.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.dm-policy-alias.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.env-vars.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.hooks-module-paths.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.identity-avatar.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.identity-defaults.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.irc.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.legacy-config-detection.accepts-imessage-dmpolicy.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.legacy-config-detection.rejects-routing-allowfrom.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.meta-timestamp-coercion.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.msteams.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.multi-agent-agentdir-validation.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.nix-integration-u3-u5-u9.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.plugin-validation.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.pruning-defaults.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.sandbox-docker.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.schema-regressions.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.secrets-schema.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.skills-entries-config.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.talk-api-key-fallback.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.telegram-custom-commands.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.tools-alsoAllow.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/config.web-search-provider.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/dangerous-name-matching.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/defaults.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/discord-preview-streaming.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/env-preserve-io.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/env-preserve.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/env-preserve.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/env-substitution.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/env-substitution.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/env-vars.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/group-policy.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/group-policy.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/home-env.test-harness.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/includes-scan.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/includes.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/includes.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/io.compat.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/io.eacces.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/io.owner-display-secret.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/io.runtime-snapshot-write.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/io.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/io.write-config.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy-migrate.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy-migrate.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy.migrations.part-1.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy.migrations.part-2.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy.migrations.part-3.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy.migrations.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy.rules.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy.shared.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy.shared.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/legacy.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/logging-max-file-bytes.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/logging.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/markdown-tables.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/merge-config.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/merge-patch.proto-pollution.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/merge-patch.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/merge-patch.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/model-alias-defaults.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/model-input.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/normalize-exec-safe-bin.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/normalize-paths.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/normalize-paths.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/paths.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/paths.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/plugin-auto-enable.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/plugin-auto-enable.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/plugins-allowlist.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/plugins-runtime-boundary.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/port-defaults.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/prototype-keys.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/redact-snapshot.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/redact-snapshot.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/runtime-group-policy-provider.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/runtime-group-policy.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/runtime-group-policy.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/runtime-overrides.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/runtime-overrides.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.help.quality.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.help.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.hints.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.hints.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.irc.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.labels.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.tags.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.tags.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/schema.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/sessions` (21 entries): config schema, validation, migrations, IO, and session path resolution
- `config/sessions.cache.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/sessions.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/sessions.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/slack-http-config.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/slack-token-validation.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/talk.normalize.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/talk.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/telegram-custom-commands.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/telegram-webhook-port.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/telegram-webhook-secret.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/test-helpers.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.acp.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.agent-defaults.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.agents-shared.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.agents.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.approvals.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.auth.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.base.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.browser.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.channel-messaging-common.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.channels.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.cron.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.discord.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.gateway.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.googlechat.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.hooks.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.imessage.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.installs.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.irc.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.memory.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.messages.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.models.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.msteams.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.node-host.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.traversalai.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.plugins.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.queue.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.sandbox.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.secrets.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.signal.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.skills.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.slack.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.telegram.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.tools.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.tts.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/types.whatsapp.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/validation.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/version.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.agent-defaults.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.agent-model.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.agent-runtime.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.agents.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.allowdeny.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.approvals.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.channels.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.core.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.cron-retention.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.hooks.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.installs.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.logging-levels.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.providers-core.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.providers-whatsapp.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.providers.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.sensitive.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.session-maintenance-extensions.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.session.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `config/zod-schema.typing-mode.test.ts` (1 entries): config schema, validation, migrations, IO, and session path resolution
- `cron/cron-protocol-conformance.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/delivery.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/delivery.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent` (12 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.auth-profile-propagation.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.delivers-response-has-heartbeat-ok-but-includes.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.delivery-target-thread-session.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.delivery.test-helpers.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.direct-delivery-forum-topics.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.mocks.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.skips-delivery-without-whatsapp-recipient-besteffortdeliver-true.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.test-harness.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.test-setup.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/isolated-agent.uses-last-non-empty-agent-text-as.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/legacy-delivery.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/normalize.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/normalize.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/parse.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/payload-migration.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/run-log.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/run-log.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/schedule.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/schedule.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service` (10 entries): scheduled and isolated-agent job execution
- `cron/service.delivery-plan.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.every-jobs-fire.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.get-job.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.issue-13992-regression.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.issue-16156-list-skips-cron.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.issue-17852-daily-skip.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.issue-22895-every-next-run.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.issue-regressions.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.jobs.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.jobs.top-of-hour-stagger.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.persists-delivered-status.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.prevents-duplicate-timers.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.read-ops-nonblocking.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.rearm-timer-when-running.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.restart-catchup.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.runs-one-shot-main-job-disables-it.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.skips-main-jobs-empty-systemevent-text.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.store-migration.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.store.migration.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.test-harness.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/service.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/session-reaper.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/session-reaper.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/stagger.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/stagger.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/store.test.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/store.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/types.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/validate-timestamp.ts` (1 entries): scheduled and isolated-agent job execution
- `cron/webhook-url.ts` (1 entries): scheduled and isolated-agent job execution
- `daemon/arg-split.ts` (1 entries): background service install and lifecycle logic
- `daemon/cmd-argv.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/cmd-argv.ts` (1 entries): background service install and lifecycle logic
- `daemon/cmd-set.ts` (1 entries): background service install and lifecycle logic
- `daemon/constants.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/constants.ts` (1 entries): background service install and lifecycle logic
- `daemon/diagnostics.ts` (1 entries): background service install and lifecycle logic
- `daemon/exec-file.ts` (1 entries): background service install and lifecycle logic
- `daemon/inspect.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/inspect.ts` (1 entries): background service install and lifecycle logic
- `daemon/launchd-plist.ts` (1 entries): background service install and lifecycle logic
- `daemon/launchd.integration.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/launchd.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/launchd.ts` (1 entries): background service install and lifecycle logic
- `daemon/node-service.ts` (1 entries): background service install and lifecycle logic
- `daemon/output.ts` (1 entries): background service install and lifecycle logic
- `daemon/paths.ts` (1 entries): background service install and lifecycle logic
- `daemon/program-args.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/program-args.ts` (1 entries): background service install and lifecycle logic
- `daemon/runtime-binary.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/runtime-binary.ts` (1 entries): background service install and lifecycle logic
- `daemon/runtime-format.ts` (1 entries): background service install and lifecycle logic
- `daemon/runtime-parse.ts` (1 entries): background service install and lifecycle logic
- `daemon/runtime-paths.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/runtime-paths.ts` (1 entries): background service install and lifecycle logic
- `daemon/schtasks-exec.ts` (1 entries): background service install and lifecycle logic
- `daemon/schtasks.install.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/schtasks.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/schtasks.ts` (1 entries): background service install and lifecycle logic
- `daemon/service-audit.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/service-audit.ts` (1 entries): background service install and lifecycle logic
- `daemon/service-env.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/service-env.ts` (1 entries): background service install and lifecycle logic
- `daemon/service-runtime.ts` (1 entries): background service install and lifecycle logic
- `daemon/service-types.ts` (1 entries): background service install and lifecycle logic
- `daemon/service.ts` (1 entries): background service install and lifecycle logic
- `daemon/systemd-hints.ts` (1 entries): background service install and lifecycle logic
- `daemon/systemd-linger.ts` (1 entries): background service install and lifecycle logic
- `daemon/systemd-unit.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/systemd-unit.ts` (1 entries): background service install and lifecycle logic
- `daemon/systemd.test.ts` (1 entries): background service install and lifecycle logic
- `daemon/systemd.ts` (1 entries): background service install and lifecycle logic
- `discord/accounts.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/accounts.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/api.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/api.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/audit.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/audit.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/chunk.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/chunk.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/client.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/components-registry.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/components.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/components.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/directory-live.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/directory-live.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/draft-chunking.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/draft-stream.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/gateway-logging.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/gateway-logging.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/guilds.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/monitor` (66 entries): Discord provider, monitor, and voice integration
- `discord/monitor.gateway.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/monitor.gateway.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/monitor.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/monitor.tool-result.accepts-guild-messages-mentionpatterns-match.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/monitor.tool-result.sends-status-replies-responseprefix.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/monitor.tool-result.test-harness.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/monitor.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/pluralkit.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/pluralkit.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/probe.intents.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/probe.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/resolve-channels.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/resolve-channels.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/resolve-users.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/resolve-users.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.channels.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.components.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.components.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.creates-thread.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.emojis-stickers.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.guild.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.messages.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.outbound.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.permissions.authz.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.permissions.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.reactions.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.sends-basic-channel-messages.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.shared.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.test-harness.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.types.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/send.webhook-activity.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/targets.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/targets.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/test-http-helpers.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/token.test.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/token.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/ui.ts` (1 entries): Discord provider, monitor, and voice integration
- `discord/voice` (4 entries): Discord provider, monitor, and voice integration
- `discord/voice-message.ts` (1 entries): Discord provider, monitor, and voice integration
- `docker-image-digests.test.ts` (1 entries): supporting runtime logic
- `docker-setup.test.ts` (1 entries): supporting runtime logic
- `dockerfile.test.ts` (1 entries): supporting runtime logic
- `docs/slash-commands-doc.test.ts` (1 entries): internal docs helpers used by the CLI and site toolchain
- `entry.ts` (1 entries): supporting runtime logic
- `extensionAPI.ts` (1 entries): supporting runtime logic
- `gateway/agent-event-assistant-text.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/agent-prompt.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/agent-prompt.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/assistant-identity.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/assistant-identity.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/auth-rate-limit.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/auth-rate-limit.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/auth.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/auth.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/boot.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/boot.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/call.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/call.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/canvas-capability.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/channel-health-monitor.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/channel-health-monitor.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/chat-abort.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/chat-abort.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/chat-attachments.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/chat-attachments.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/chat-sanitize.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/chat-sanitize.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/client.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/client.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/client.watchdog.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/config-reload.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/config-reload.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/control-plane-audit.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/control-plane-rate-limit.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/control-ui-contract.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/control-ui-csp.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/control-ui-csp.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/control-ui-shared.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/control-ui.http.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/control-ui.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/credential-precedence.parity.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/credentials.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/credentials.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/device-auth.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/device-auth.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/events.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/exec-approval-manager.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/gateway-cli-backend.live.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/gateway-config-prompts.shared.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/gateway-connection.test-mocks.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/gateway-misc.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/gateway-models.profiles.live.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/gateway.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/hooks-mapping.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/hooks-mapping.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/hooks.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/hooks.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/http-auth-helpers.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/http-auth-helpers.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/http-common.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/http-endpoint-helpers.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/http-endpoint-helpers.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/http-utils.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/live-image-probe.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/live-tool-probe-utils.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/live-tool-probe-utils.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/method-scopes.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/method-scopes.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/net.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/net.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/node-command-policy.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/node-invoke-sanitize.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/node-invoke-system-run-approval-errors.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/node-invoke-system-run-approval-match.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/node-invoke-system-run-approval-match.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/node-invoke-system-run-approval.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/node-invoke-system-run-approval.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/node-registry.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/open-responses.schema.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/openai-http.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/openai-http.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/openresponses-http.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/openresponses-http.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/openresponses-parity.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/openresponses-prompt.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/origin-check.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/origin-check.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/probe-auth.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/probe.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/probe.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/protocol` (24 entries): gateway RPC server, protocol, methods, and transports
- `gateway/role-policy.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/role-policy.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/security-path.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/security-path.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server` (20 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-broadcast.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-browser.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-channels.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-channels.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-chat.agent-events.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-chat.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-close.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-constants.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-cron.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-cron.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-discovery-runtime.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-discovery.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-discovery.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-http.hooks-request-timeout.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-http.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-lanes.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-maintenance.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-methods` (57 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-methods-list.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-methods.control-plane-rate-limit.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-methods.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-mobile-nodes.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-model-catalog.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-node-events-types.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-node-events.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-node-events.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-node-subscriptions.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-plugins.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-plugins.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-reload-handlers.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-restart-deferral.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-restart-sentinel.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-restart-sentinel.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-runtime-config.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-runtime-config.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-runtime-state.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-session-key.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-shared.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-startup-log.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-startup-log.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-startup-memory.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-startup-memory.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-startup.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-tailscale.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-utils.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-wizard-sessions.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server-ws-runtime.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.agent.gateway-server-agent-a.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.agent.gateway-server-agent-b.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.agent.gateway-server-agent.mocks.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.auth.browser-hardening.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.auth.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.canvas-auth.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.channels.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.chat.gateway-server-chat-b.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.chat.gateway-server-chat.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.config-apply.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.config-patch.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.cron.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.e2e-registry-helpers.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.e2e-ws-harness.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.health.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.hooks.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.impl.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.ios-client-id.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.models-voicewake-misc.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.node-invoke-approval-bypass.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.plugin-http-auth.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.reload.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.roles-allowlist-update.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.sessions-send.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.sessions.gateway-server-sessions-a.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.skills-status.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.talk-config.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.tools-catalog.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/server.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/session-preview.test-helpers.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/session-utils.fs.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/session-utils.fs.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/session-utils.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/session-utils.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/session-utils.types.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/sessions-patch.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/sessions-patch.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/sessions-resolve.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/startup-auth.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/startup-auth.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/system-run-approval-binding.contract.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/system-run-approval-binding.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-helpers.agent-results.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-helpers.e2e.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-helpers.mocks.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-helpers.openai-mock.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-helpers.server.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-helpers.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-http-response.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-openai-responses-model.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-temp-config.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/test-with-server.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/tools-invoke-http.cron-regression.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/tools-invoke-http.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/tools-invoke-http.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/ws-log.test.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/ws-log.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `gateway/ws-logging.ts` (1 entries): gateway RPC server, protocol, methods, and transports
- `globals.ts` (1 entries): supporting runtime logic
- `hooks/bundled` (8 entries): hook runtime and bundled hook handlers
- `hooks/bundled-dir.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/config.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/frontmatter.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/frontmatter.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/gmail-ops.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/gmail-setup-utils.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/gmail-setup-utils.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/gmail-watcher-lifecycle.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/gmail-watcher-lifecycle.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/gmail-watcher.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/gmail.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/gmail.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/hooks-install.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/hooks-status.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/hooks.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/import-url.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/import-url.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/install.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/install.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/installs.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/internal-hooks.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/internal-hooks.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/llm-slug-generator.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/loader.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/loader.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/module-loader.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/module-loader.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/types.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/workspace.test.ts` (1 entries): hook runtime and bundled hook handlers
- `hooks/workspace.ts` (1 entries): hook runtime and bundled hook handlers
- `imessage/accounts.ts` (1 entries): iMessage provider and monitor integration
- `imessage/client.ts` (1 entries): iMessage provider and monitor integration
- `imessage/constants.ts` (1 entries): iMessage provider and monitor integration
- `imessage/monitor` (12 entries): iMessage provider and monitor integration
- `imessage/monitor.gating.test.ts` (1 entries): iMessage provider and monitor integration
- `imessage/monitor.shutdown.unhandled-rejection.test.ts` (1 entries): iMessage provider and monitor integration
- `imessage/monitor.ts` (1 entries): iMessage provider and monitor integration
- `imessage/probe.test.ts` (1 entries): iMessage provider and monitor integration
- `imessage/probe.ts` (1 entries): iMessage provider and monitor integration
- `imessage/send.test.ts` (1 entries): iMessage provider and monitor integration
- `imessage/send.ts` (1 entries): iMessage provider and monitor integration
- `imessage/target-parsing-helpers.ts` (1 entries): iMessage provider and monitor integration
- `imessage/targets.test.ts` (1 entries): iMessage provider and monitor integration
- `imessage/targets.ts` (1 entries): iMessage provider and monitor integration
- `index.ts` (1 entries): supporting runtime logic
- `infra/abort-pattern.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/abort-signal.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/abort-signal.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/agent-events.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/agent-events.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/archive-path.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/archive-path.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/archive.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/archive.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/backoff.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/binaries.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/bonjour-ciao.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/bonjour-discovery.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/bonjour-discovery.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/bonjour-errors.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/bonjour.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/bonjour.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/boundary-file-read.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/boundary-path.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/boundary-path.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/brew.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/brew.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/canvas-host-url.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/channel-activity.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/channel-summary.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/channels-status-issues.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/clipboard.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/control-ui-assets.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/control-ui-assets.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/dedupe.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/detect-package-manager.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/device-auth-store.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/device-identity.state-dir.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/device-identity.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/device-pairing.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/device-pairing.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/diagnostic-events.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/diagnostic-flags.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/dotenv.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/dotenv.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/env-file.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/env.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/env.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/errors.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approval-forwarder.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approval-forwarder.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals-allow-always.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals-allowlist.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals-analysis.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals-config.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals-parity.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals-safe-bins.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals-test-helpers.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-approvals.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-command-resolution.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-host.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-obfuscation-detect.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-obfuscation-detect.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safe-bin-policy-profiles.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safe-bin-policy-validator.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safe-bin-policy.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safe-bin-policy.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safe-bin-runtime-policy.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safe-bin-runtime-policy.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safe-bin-trust.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safe-bin-trust.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-safety.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/exec-wrapper-resolution.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/fetch.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/fetch.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/file-identity.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/file-identity.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/file-lock.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/fixed-window-rate-limit.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/fixed-window-rate-limit.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/format-time` (4 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/fs-safe.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/fs-safe.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/gateway-lock.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/gateway-lock.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/gemini-auth.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/git-commit.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/git-root.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/git-root.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/hardlink-guards.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-active-hours.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-active-hours.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-events-filter.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-events-filter.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-events.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-reason.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-reason.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.ghost-reminder.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.model-override.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.respects-ackmaxchars-heartbeat-acks.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.returns-default-unset.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.scheduler.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.sender-prefers-delivery-target.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.test-harness.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.test-utils.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.transcript-prune.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-runner.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-visibility.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-visibility.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-wake.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/heartbeat-wake.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/home-dir.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/home-dir.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/host-env-security.policy-parity.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/host-env-security.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/host-env-security.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/http-body.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/http-body.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/infra-parsing.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/infra-runtime.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/infra-store.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-flow.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-flow.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-mode-options.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-mode-options.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-package-dir.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-safe-path.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-safe-path.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-source-utils.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/install-source-utils.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/is-main.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/json-file.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/json-files.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/jsonl-socket.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/machine-name.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/map-size.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/net` (7 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/node-commands.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/node-pairing.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/node-pairing.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/node-shell.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/npm-integrity.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/npm-integrity.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/npm-pack-install.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/npm-pack-install.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/npm-registry-spec.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/traversalai-root.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/traversalai-root.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/os-summary.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/outbound` (44 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/package-json.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/pairing-files.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/pairing-pending.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/pairing-token.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/path-alias-guards.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/path-alias-guards.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/path-env.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/path-env.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/path-guards.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/path-prepend.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/path-safety.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/path-safety.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/plain-object.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/plain-object.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ports-format.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ports-inspect.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ports-lsof.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ports-probe.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ports-types.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ports.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ports.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/process-respawn.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/process-respawn.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/prototype-keys.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.auth.normalizes-keys.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.auth.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.claude.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.claude.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.codex.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.codex.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.copilot.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.copilot.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.gemini.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.gemini.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.minimax.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.minimax.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.shared.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.shared.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.zai.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.fetch.zai.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.format.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.format.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.load.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.shared.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.shared.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/provider-usage.types.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/push-apns.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/push-apns.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/restart-sentinel.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/restart-sentinel.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/restart-stale-pids.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/restart.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/restart.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/retry-policy.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/retry.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/retry.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/run-node.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/runtime-guard.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/runtime-guard.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/runtime-status.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/safe-open-sync.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/scp-host.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/scp-host.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/scripts-modules.d.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/secure-random.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/secure-random.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/session-cost-usage.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/session-cost-usage.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/session-cost-usage.types.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/session-maintenance-warning.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/session-maintenance-warning.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/shell-env.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/shell-env.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/skills-remote.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/skills-remote.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ssh-config.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ssh-config.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ssh-tunnel.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/state-migrations.fs.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/state-migrations.state-dir.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/state-migrations.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/supervisor-markers.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-events.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-events.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-message.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-message.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-presence.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-presence.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-presence.version.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-run-approval-binding.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-run-approval-context.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-run-approval-mismatch.contract.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-run-command.contract.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-run-command.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/system-run-command.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/tailnet.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/tailscale.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/tailscale.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/tls` (2 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/tmp-traversalai-dir.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/tmp-traversalai-dir.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/transport-ready.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/transport-ready.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/unhandled-rejections.fatal-detection.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/unhandled-rejections.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/unhandled-rejections.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-channels.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-channels.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-check.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-check.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-global.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-runner.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-runner.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-startup.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/update-startup.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/voicewake.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/warning-filter.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/warning-filter.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/watch-node.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/widearea-dns.test.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/widearea-dns.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/ws.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `infra/wsl.ts` (1 entries): shared infrastructure, formatting, TLS, and outbound helpers
- `line/accounts.test.ts` (1 entries): supporting runtime logic
- `line/accounts.ts` (1 entries): supporting runtime logic
- `line/actions.ts` (1 entries): supporting runtime logic
- `line/auto-reply-delivery.test.ts` (1 entries): supporting runtime logic
- `line/auto-reply-delivery.ts` (1 entries): supporting runtime logic
- `line/bot-access.ts` (1 entries): supporting runtime logic
- `line/bot-handlers.test.ts` (1 entries): supporting runtime logic
- `line/bot-handlers.ts` (1 entries): supporting runtime logic
- `line/bot-message-context.test.ts` (1 entries): supporting runtime logic
- `line/bot-message-context.ts` (1 entries): supporting runtime logic
- `line/bot.ts` (1 entries): supporting runtime logic
- `line/channel-access-token.ts` (1 entries): supporting runtime logic
- `line/config-schema.ts` (1 entries): supporting runtime logic
- `line/download.test.ts` (1 entries): supporting runtime logic
- `line/download.ts` (1 entries): supporting runtime logic
- `line/flex-templates` (6 entries): supporting runtime logic
- `line/flex-templates.test.ts` (1 entries): supporting runtime logic
- `line/flex-templates.ts` (1 entries): supporting runtime logic
- `line/markdown-to-line.test.ts` (1 entries): supporting runtime logic
- `line/markdown-to-line.ts` (1 entries): supporting runtime logic
- `line/monitor.fail-closed.test.ts` (1 entries): supporting runtime logic
- `line/monitor.lifecycle.test.ts` (1 entries): supporting runtime logic
- `line/monitor.read-body.test.ts` (1 entries): supporting runtime logic
- `line/monitor.ts` (1 entries): supporting runtime logic
- `line/probe.test.ts` (1 entries): supporting runtime logic
- `line/probe.ts` (1 entries): supporting runtime logic
- `line/reply-chunks.test.ts` (1 entries): supporting runtime logic
- `line/reply-chunks.ts` (1 entries): supporting runtime logic
- `line/rich-menu.test.ts` (1 entries): supporting runtime logic
- `line/rich-menu.ts` (1 entries): supporting runtime logic
- `line/send.test.ts` (1 entries): supporting runtime logic
- `line/send.ts` (1 entries): supporting runtime logic
- `line/signature.ts` (1 entries): supporting runtime logic
- `line/template-messages.test.ts` (1 entries): supporting runtime logic
- `line/template-messages.ts` (1 entries): supporting runtime logic
- `line/types.ts` (1 entries): supporting runtime logic
- `line/webhook-node.test.ts` (1 entries): supporting runtime logic
- `line/webhook-node.ts` (1 entries): supporting runtime logic
- `line/webhook-utils.ts` (1 entries): supporting runtime logic
- `line/webhook.test.ts` (1 entries): supporting runtime logic
- `line/webhook.ts` (1 entries): supporting runtime logic
- `link-understanding/apply.ts` (1 entries): supporting runtime logic
- `link-understanding/defaults.ts` (1 entries): supporting runtime logic
- `link-understanding/detect.test.ts` (1 entries): supporting runtime logic
- `link-understanding/detect.ts` (1 entries): supporting runtime logic
- `link-understanding/format.ts` (1 entries): supporting runtime logic
- `link-understanding/runner.ts` (1 entries): supporting runtime logic
- `logger.test.ts` (1 entries): supporting runtime logic
- `logger.ts` (1 entries): supporting runtime logic
- `logging.ts` (1 entries): supporting runtime logic
- `logging/config.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/console-capture.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/console-settings.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/console-timestamp.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/console.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/diagnostic-session-state.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/diagnostic.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/diagnostic.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/env-log-level.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/levels.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/log-file-size-cap.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/logger-env.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/logger.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/node-require.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/parse-log-line.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/parse-log-line.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/redact-identifier.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/redact.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/redact.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/state.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/subsystem.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/subsystem.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/timestamps.test.ts` (1 entries): runtime logging primitives and subsystem loggers
- `logging/timestamps.ts` (1 entries): runtime logging primitives and subsystem loggers
- `markdown/code-spans.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/fences.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/frontmatter.test.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/frontmatter.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/ir.blockquote-spacing.test.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/ir.hr-spacing.test.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/ir.nested-lists.test.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/ir.table-bullets.test.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/ir.table-code.test.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/ir.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/render.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/tables.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/whatsapp.test.ts` (1 entries): markdown formatting helpers and parsing support
- `markdown/whatsapp.ts` (1 entries): markdown formatting helpers and parsing support
- `media-understanding/apply.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/apply.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/attachments.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/audio-preflight.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/concurrency.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/defaults.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/defaults.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/errors.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/format.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/format.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/fs.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/media-understanding-misc.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/output-extract.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/providers` (26 entries): vision, audio, and video understanding providers
- `media-understanding/resolve.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/resolve.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/runner.auto-audio.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/runner.deepgram.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/runner.entries.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/runner.test-utils.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/runner.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/runner.video.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/runner.vision-skip.test.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/scope.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/types.ts` (1 entries): vision, audio, and video understanding providers
- `media-understanding/video.ts` (1 entries): vision, audio, and video understanding providers
- `media/audio-tags.ts` (1 entries): media processing primitives
- `media/audio.test.ts` (1 entries): media processing primitives
- `media/audio.ts` (1 entries): media processing primitives
- `media/base64.test.ts` (1 entries): media processing primitives
- `media/base64.ts` (1 entries): media processing primitives
- `media/constants.ts` (1 entries): media processing primitives
- `media/fetch.test.ts` (1 entries): media processing primitives
- `media/fetch.ts` (1 entries): media processing primitives
- `media/host.test.ts` (1 entries): media processing primitives
- `media/host.ts` (1 entries): media processing primitives
- `media/image-ops.helpers.test.ts` (1 entries): media processing primitives
- `media/image-ops.ts` (1 entries): media processing primitives
- `media/inbound-path-policy.test.ts` (1 entries): media processing primitives
- `media/inbound-path-policy.ts` (1 entries): media processing primitives
- `media/input-files.fetch-guard.test.ts` (1 entries): media processing primitives
- `media/input-files.ts` (1 entries): media processing primitives
- `media/local-roots.ts` (1 entries): media processing primitives
- `media/mime.test.ts` (1 entries): media processing primitives
- `media/mime.ts` (1 entries): media processing primitives
- `media/outbound-attachment.ts` (1 entries): media processing primitives
- `media/parse.test.ts` (1 entries): media processing primitives
- `media/parse.ts` (1 entries): media processing primitives
- `media/png-encode.ts` (1 entries): media processing primitives
- `media/read-response-with-limit.ts` (1 entries): media processing primitives
- `media/server.test.ts` (1 entries): media processing primitives
- `media/server.ts` (1 entries): media processing primitives
- `media/sniff-mime-from-base64.ts` (1 entries): media processing primitives
- `media/store.redirect.test.ts` (1 entries): media processing primitives
- `media/store.test.ts` (1 entries): media processing primitives
- `media/store.ts` (1 entries): media processing primitives
- `memory/backend-config.test.ts` (1 entries): memory search and persistence primitives
- `memory/backend-config.ts` (1 entries): memory search and persistence primitives
- `memory/batch-error-utils.test.ts` (1 entries): memory search and persistence primitives
- `memory/batch-error-utils.ts` (1 entries): memory search and persistence primitives
- `memory/batch-gemini.ts` (1 entries): memory search and persistence primitives
- `memory/batch-http.test.ts` (1 entries): memory search and persistence primitives
- `memory/batch-http.ts` (1 entries): memory search and persistence primitives
- `memory/batch-openai.ts` (1 entries): memory search and persistence primitives
- `memory/batch-output.test.ts` (1 entries): memory search and persistence primitives
- `memory/batch-output.ts` (1 entries): memory search and persistence primitives
- `memory/batch-provider-common.ts` (1 entries): memory search and persistence primitives
- `memory/batch-runner.ts` (1 entries): memory search and persistence primitives
- `memory/batch-upload.ts` (1 entries): memory search and persistence primitives
- `memory/batch-utils.ts` (1 entries): memory search and persistence primitives
- `memory/batch-voyage.test.ts` (1 entries): memory search and persistence primitives
- `memory/batch-voyage.ts` (1 entries): memory search and persistence primitives
- `memory/embedding-chunk-limits.test.ts` (1 entries): memory search and persistence primitives
- `memory/embedding-chunk-limits.ts` (1 entries): memory search and persistence primitives
- `memory/embedding-input-limits.ts` (1 entries): memory search and persistence primitives
- `memory/embedding-manager.test-harness.ts` (1 entries): memory search and persistence primitives
- `memory/embedding-model-limits.ts` (1 entries): memory search and persistence primitives
- `memory/embedding.test-mocks.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-debug.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-gemini.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-mistral.test.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-mistral.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-openai.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-remote-client.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-remote-fetch.test.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-remote-fetch.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-remote-provider.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-voyage.test.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings-voyage.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings.test.ts` (1 entries): memory search and persistence primitives
- `memory/embeddings.ts` (1 entries): memory search and persistence primitives
- `memory/fs-utils.ts` (1 entries): memory search and persistence primitives
- `memory/hybrid.test.ts` (1 entries): memory search and persistence primitives
- `memory/hybrid.ts` (1 entries): memory search and persistence primitives
- `memory/index.test.ts` (1 entries): memory search and persistence primitives
- `memory/index.ts` (1 entries): memory search and persistence primitives
- `memory/internal.test.ts` (1 entries): memory search and persistence primitives
- `memory/internal.ts` (1 entries): memory search and persistence primitives
- `memory/manager-embedding-ops.ts` (1 entries): memory search and persistence primitives
- `memory/manager-search.ts` (1 entries): memory search and persistence primitives
- `memory/manager-sync-ops.ts` (1 entries): memory search and persistence primitives
- `memory/manager.async-search.test.ts` (1 entries): memory search and persistence primitives
- `memory/manager.atomic-reindex.test.ts` (1 entries): memory search and persistence primitives
- `memory/manager.batch.test.ts` (1 entries): memory search and persistence primitives
- `memory/manager.embedding-batches.test.ts` (1 entries): memory search and persistence primitives
- `memory/manager.mistral-provider.test.ts` (1 entries): memory search and persistence primitives
- `memory/manager.read-file.test.ts` (1 entries): memory search and persistence primitives
- `memory/manager.sync-errors-do-not-crash.test.ts` (1 entries): memory search and persistence primitives
- `memory/manager.ts` (1 entries): memory search and persistence primitives
- `memory/manager.vector-dedupe.test.ts` (1 entries): memory search and persistence primitives
- `memory/manager.watcher-config.test.ts` (1 entries): memory search and persistence primitives
- `memory/memory-schema.ts` (1 entries): memory search and persistence primitives
- `memory/mmr.test.ts` (1 entries): memory search and persistence primitives
- `memory/mmr.ts` (1 entries): memory search and persistence primitives
- `memory/node-llama.ts` (1 entries): memory search and persistence primitives
- `memory/post-json.test.ts` (1 entries): memory search and persistence primitives
- `memory/post-json.ts` (1 entries): memory search and persistence primitives
- `memory/qmd-manager.test.ts` (1 entries): memory search and persistence primitives
- `memory/qmd-manager.ts` (1 entries): memory search and persistence primitives
- `memory/qmd-query-parser.test.ts` (1 entries): memory search and persistence primitives
- `memory/qmd-query-parser.ts` (1 entries): memory search and persistence primitives
- `memory/qmd-scope.test.ts` (1 entries): memory search and persistence primitives
- `memory/qmd-scope.ts` (1 entries): memory search and persistence primitives
- `memory/query-expansion.test.ts` (1 entries): memory search and persistence primitives
- `memory/query-expansion.ts` (1 entries): memory search and persistence primitives
- `memory/remote-http.ts` (1 entries): memory search and persistence primitives
- `memory/search-manager.test.ts` (1 entries): memory search and persistence primitives
- `memory/search-manager.ts` (1 entries): memory search and persistence primitives
- `memory/session-files.test.ts` (1 entries): memory search and persistence primitives
- `memory/session-files.ts` (1 entries): memory search and persistence primitives
- `memory/sqlite-vec.ts` (1 entries): memory search and persistence primitives
- `memory/sqlite.ts` (1 entries): memory search and persistence primitives
- `memory/status-format.ts` (1 entries): memory search and persistence primitives
- `memory/temporal-decay.test.ts` (1 entries): memory search and persistence primitives
- `memory/temporal-decay.ts` (1 entries): memory search and persistence primitives
- `memory/test-embeddings-mock.ts` (1 entries): memory search and persistence primitives
- `memory/test-manager-helpers.ts` (1 entries): memory search and persistence primitives
- `memory/test-manager.ts` (1 entries): memory search and persistence primitives
- `memory/test-runtime-mocks.ts` (1 entries): memory search and persistence primitives
- `memory/types.ts` (1 entries): memory search and persistence primitives
- `node-host/config.ts` (1 entries): node execution host and transport
- `node-host/exec-policy.test.ts` (1 entries): node execution host and transport
- `node-host/exec-policy.ts` (1 entries): node execution host and transport
- `node-host/invoke-browser.ts` (1 entries): node execution host and transport
- `node-host/invoke-system-run-allowlist.ts` (1 entries): node execution host and transport
- `node-host/invoke-system-run-plan.ts` (1 entries): node execution host and transport
- `node-host/invoke-system-run.test.ts` (1 entries): node execution host and transport
- `node-host/invoke-system-run.ts` (1 entries): node execution host and transport
- `node-host/invoke-types.ts` (1 entries): node execution host and transport
- `node-host/invoke.sanitize-env.test.ts` (1 entries): node execution host and transport
- `node-host/invoke.ts` (1 entries): node execution host and transport
- `node-host/runner.ts` (1 entries): node execution host and transport
- `node-host/with-timeout.ts` (1 entries): node execution host and transport
- `pairing/pairing-challenge.ts` (1 entries): pairing and trust bootstrap flows
- `pairing/pairing-labels.ts` (1 entries): pairing and trust bootstrap flows
- `pairing/pairing-messages.test.ts` (1 entries): pairing and trust bootstrap flows
- `pairing/pairing-messages.ts` (1 entries): pairing and trust bootstrap flows
- `pairing/pairing-store.test.ts` (1 entries): pairing and trust bootstrap flows
- `pairing/pairing-store.ts` (1 entries): pairing and trust bootstrap flows
- `pairing/setup-code.test.ts` (1 entries): pairing and trust bootstrap flows
- `pairing/setup-code.ts` (1 entries): pairing and trust bootstrap flows
- `plugin-sdk/account-id.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/agent-media-payload.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/allow-from.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/allow-from.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/command-auth.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/command-auth.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/config-paths.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/fetch-auth.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/fetch-auth.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/file-lock.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/group-access.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/group-access.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/index.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/index.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/json-store.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/onboarding.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/pairing-access.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/persistent-dedupe.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/persistent-dedupe.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/provider-auth-result.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/reply-payload.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/run-command.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/runtime.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/slack-message-actions.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/ssrf-policy.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/ssrf-policy.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/status-helpers.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/status-helpers.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/temp-path.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/temp-path.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/text-chunking.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/text-chunking.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/tool-send.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/webhook-path.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/webhook-targets.test.ts` (1 entries): extension and plugin SDK surface
- `plugin-sdk/webhook-targets.ts` (1 entries): extension and plugin SDK surface
- `plugins/bundled-dir.ts` (1 entries): plugin runtime and registration
- `plugins/bundled-sources.test.ts` (1 entries): plugin runtime and registration
- `plugins/bundled-sources.ts` (1 entries): plugin runtime and registration
- `plugins/cli.test.ts` (1 entries): plugin runtime and registration
- `plugins/cli.ts` (1 entries): plugin runtime and registration
- `plugins/commands.ts` (1 entries): plugin runtime and registration
- `plugins/config-schema.ts` (1 entries): plugin runtime and registration
- `plugins/config-state.test.ts` (1 entries): plugin runtime and registration
- `plugins/config-state.ts` (1 entries): plugin runtime and registration
- `plugins/discovery.test.ts` (1 entries): plugin runtime and registration
- `plugins/discovery.ts` (1 entries): plugin runtime and registration
- `plugins/enable.test.ts` (1 entries): plugin runtime and registration
- `plugins/enable.ts` (1 entries): plugin runtime and registration
- `plugins/hook-runner-global.ts` (1 entries): plugin runtime and registration
- `plugins/hooks.before-agent-start.test.ts` (1 entries): plugin runtime and registration
- `plugins/hooks.model-override-wiring.test.ts` (1 entries): plugin runtime and registration
- `plugins/hooks.phase-hooks.test.ts` (1 entries): plugin runtime and registration
- `plugins/hooks.test-helpers.ts` (1 entries): plugin runtime and registration
- `plugins/hooks.ts` (1 entries): plugin runtime and registration
- `plugins/http-path.ts` (1 entries): plugin runtime and registration
- `plugins/http-registry.test.ts` (1 entries): plugin runtime and registration
- `plugins/http-registry.ts` (1 entries): plugin runtime and registration
- `plugins/install.test.ts` (1 entries): plugin runtime and registration
- `plugins/install.ts` (1 entries): plugin runtime and registration
- `plugins/installs.test.ts` (1 entries): plugin runtime and registration
- `plugins/installs.ts` (1 entries): plugin runtime and registration
- `plugins/loader.test.ts` (1 entries): plugin runtime and registration
- `plugins/loader.ts` (1 entries): plugin runtime and registration
- `plugins/logger.test.ts` (1 entries): plugin runtime and registration
- `plugins/logger.ts` (1 entries): plugin runtime and registration
- `plugins/manifest-registry.test.ts` (1 entries): plugin runtime and registration
- `plugins/manifest-registry.ts` (1 entries): plugin runtime and registration
- `plugins/manifest.ts` (1 entries): plugin runtime and registration
- `plugins/path-safety.ts` (1 entries): plugin runtime and registration
- `plugins/providers.ts` (1 entries): plugin runtime and registration
- `plugins/registry.ts` (1 entries): plugin runtime and registration
- `plugins/runtime` (4 entries): plugin runtime and registration
- `plugins/runtime.ts` (1 entries): plugin runtime and registration
- `plugins/schema-validator.ts` (1 entries): plugin runtime and registration
- `plugins/services.test.ts` (1 entries): plugin runtime and registration
- `plugins/services.ts` (1 entries): plugin runtime and registration
- `plugins/slots.test.ts` (1 entries): plugin runtime and registration
- `plugins/slots.ts` (1 entries): plugin runtime and registration
- `plugins/source-display.test.ts` (1 entries): plugin runtime and registration
- `plugins/source-display.ts` (1 entries): plugin runtime and registration
- `plugins/status.ts` (1 entries): plugin runtime and registration
- `plugins/toggle-config.ts` (1 entries): plugin runtime and registration
- `plugins/tools.optional.test.ts` (1 entries): plugin runtime and registration
- `plugins/tools.ts` (1 entries): plugin runtime and registration
- `plugins/types.ts` (1 entries): plugin runtime and registration
- `plugins/uninstall.test.ts` (1 entries): plugin runtime and registration
- `plugins/uninstall.ts` (1 entries): plugin runtime and registration
- `plugins/update.ts` (1 entries): plugin runtime and registration
- `plugins/voice-call.plugin.test.ts` (1 entries): plugin runtime and registration
- `plugins/wired-hooks-after-tool-call.test.ts` (1 entries): plugin runtime and registration
- `plugins/wired-hooks-compaction.test.ts` (1 entries): plugin runtime and registration
- `plugins/wired-hooks-gateway.test.ts` (1 entries): plugin runtime and registration
- `plugins/wired-hooks-llm.test.ts` (1 entries): plugin runtime and registration
- `plugins/wired-hooks-message.test.ts` (1 entries): plugin runtime and registration
- `plugins/wired-hooks-session.test.ts` (1 entries): plugin runtime and registration
- `plugins/wired-hooks-subagent.test.ts` (1 entries): plugin runtime and registration
- `polls.test.ts` (1 entries): supporting runtime logic
- `polls.ts` (1 entries): supporting runtime logic
- `process/child-process-bridge.ts` (1 entries): subprocess execution and supervisor helpers
- `process/command-queue.test.ts` (1 entries): subprocess execution and supervisor helpers
- `process/command-queue.ts` (1 entries): subprocess execution and supervisor helpers
- `process/exec.test.ts` (1 entries): subprocess execution and supervisor helpers
- `process/exec.ts` (1 entries): subprocess execution and supervisor helpers
- `process/kill-tree.test.ts` (1 entries): subprocess execution and supervisor helpers
- `process/kill-tree.ts` (1 entries): subprocess execution and supervisor helpers
- `process/lanes.ts` (1 entries): subprocess execution and supervisor helpers
- `process/restart-recovery.ts` (1 entries): subprocess execution and supervisor helpers
- `process/spawn-utils.test.ts` (1 entries): subprocess execution and supervisor helpers
- `process/spawn-utils.ts` (1 entries): subprocess execution and supervisor helpers
- `process/supervisor` (12 entries): subprocess execution and supervisor helpers
- `process/test-timeouts.ts` (1 entries): subprocess execution and supervisor helpers
- `providers/github-copilot-auth.ts` (1 entries): LLM provider integrations
- `providers/github-copilot-models.test.ts` (1 entries): LLM provider integrations
- `providers/github-copilot-models.ts` (1 entries): LLM provider integrations
- `providers/github-copilot-token.test.ts` (1 entries): LLM provider integrations
- `providers/github-copilot-token.ts` (1 entries): LLM provider integrations
- `providers/google-shared.ensures-function-call-comes-after-user-turn.test.ts` (1 entries): LLM provider integrations
- `providers/google-shared.preserves-parameters-type-is-missing.test.ts` (1 entries): LLM provider integrations
- `providers/google-shared.test-helpers.ts` (1 entries): LLM provider integrations
- `providers/kilocode-shared.ts` (1 entries): LLM provider integrations
- `providers/qwen-portal-oauth.test.ts` (1 entries): LLM provider integrations
- `providers/qwen-portal-oauth.ts` (1 entries): LLM provider integrations
- `routing/account-id.test.ts` (1 entries): session and agent routing logic
- `routing/account-id.ts` (1 entries): session and agent routing logic
- `routing/account-lookup.test.ts` (1 entries): session and agent routing logic
- `routing/account-lookup.ts` (1 entries): session and agent routing logic
- `routing/bindings.ts` (1 entries): session and agent routing logic
- `routing/resolve-route.test.ts` (1 entries): session and agent routing logic
- `routing/resolve-route.ts` (1 entries): session and agent routing logic
- `routing/session-key.continuity.test.ts` (1 entries): session and agent routing logic
- `routing/session-key.test.ts` (1 entries): session and agent routing logic
- `routing/session-key.ts` (1 entries): session and agent routing logic
- `runtime.ts` (1 entries): supporting runtime logic
- `scripts/canvas-a2ui-copy.test.ts` (1 entries): supporting runtime logic
- `secrets/apply.test.ts` (1 entries): secret storage and resolution helpers
- `secrets/apply.ts` (1 entries): secret storage and resolution helpers
- `secrets/audit.test.ts` (1 entries): secret storage and resolution helpers
- `secrets/audit.ts` (1 entries): secret storage and resolution helpers
- `secrets/config-io.ts` (1 entries): secret storage and resolution helpers
- `secrets/configure.ts` (1 entries): secret storage and resolution helpers
- `secrets/json-pointer.ts` (1 entries): secret storage and resolution helpers
- `secrets/plan.ts` (1 entries): secret storage and resolution helpers
- `secrets/provider-env-vars.ts` (1 entries): secret storage and resolution helpers
- `secrets/ref-contract.ts` (1 entries): secret storage and resolution helpers
- `secrets/resolve.test.ts` (1 entries): secret storage and resolution helpers
- `secrets/resolve.ts` (1 entries): secret storage and resolution helpers
- `secrets/runtime.test.ts` (1 entries): secret storage and resolution helpers
- `secrets/runtime.ts` (1 entries): secret storage and resolution helpers
- `secrets/shared.ts` (1 entries): secret storage and resolution helpers
- `security/audit-channel.ts` (1 entries): security audits, fixes, and policy analysis
- `security/audit-extra.async.ts` (1 entries): security audits, fixes, and policy analysis
- `security/audit-extra.sync.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/audit-extra.sync.ts` (1 entries): security audits, fixes, and policy analysis
- `security/audit-extra.ts` (1 entries): security audits, fixes, and policy analysis
- `security/audit-fs.ts` (1 entries): security audits, fixes, and policy analysis
- `security/audit-tool-policy.ts` (1 entries): security audits, fixes, and policy analysis
- `security/audit.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/audit.ts` (1 entries): security audits, fixes, and policy analysis
- `security/channel-metadata.ts` (1 entries): security audits, fixes, and policy analysis
- `security/dangerous-config-flags.ts` (1 entries): security audits, fixes, and policy analysis
- `security/dangerous-tools.ts` (1 entries): security audits, fixes, and policy analysis
- `security/dm-policy-channel-smoke.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/dm-policy-shared.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/dm-policy-shared.ts` (1 entries): security audits, fixes, and policy analysis
- `security/external-content.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/external-content.ts` (1 entries): security audits, fixes, and policy analysis
- `security/fix.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/fix.ts` (1 entries): security audits, fixes, and policy analysis
- `security/mutable-allowlist-detectors.ts` (1 entries): security audits, fixes, and policy analysis
- `security/safe-regex.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/safe-regex.ts` (1 entries): security audits, fixes, and policy analysis
- `security/scan-paths.ts` (1 entries): security audits, fixes, and policy analysis
- `security/secret-equal.ts` (1 entries): security audits, fixes, and policy analysis
- `security/skill-scanner.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/skill-scanner.ts` (1 entries): security audits, fixes, and policy analysis
- `security/temp-path-guard.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/windows-acl.test.ts` (1 entries): security audits, fixes, and policy analysis
- `security/windows-acl.ts` (1 entries): security audits, fixes, and policy analysis
- `sessions/input-provenance.ts` (1 entries): session runtime helpers
- `sessions/level-overrides.ts` (1 entries): session runtime helpers
- `sessions/model-overrides.ts` (1 entries): session runtime helpers
- `sessions/send-policy.test.ts` (1 entries): session runtime helpers
- `sessions/send-policy.ts` (1 entries): session runtime helpers
- `sessions/session-key-utils.ts` (1 entries): session runtime helpers
- `sessions/session-label.ts` (1 entries): session runtime helpers
- `sessions/transcript-events.ts` (1 entries): session runtime helpers
- `shared/avatar-policy.test.ts` (1 entries): supporting runtime logic
- `shared/avatar-policy.ts` (1 entries): supporting runtime logic
- `shared/chat-content.ts` (1 entries): supporting runtime logic
- `shared/chat-envelope.ts` (1 entries): supporting runtime logic
- `shared/config-eval.test.ts` (1 entries): supporting runtime logic
- `shared/config-eval.ts` (1 entries): supporting runtime logic
- `shared/device-auth.ts` (1 entries): supporting runtime logic
- `shared/entry-metadata.ts` (1 entries): supporting runtime logic
- `shared/entry-status.ts` (1 entries): supporting runtime logic
- `shared/frontmatter.ts` (1 entries): supporting runtime logic
- `shared/gateway-bind-url.ts` (1 entries): supporting runtime logic
- `shared/model-param-b.ts` (1 entries): supporting runtime logic
- `shared/net` (4 entries): supporting runtime logic
- `shared/node-list-parse.test.ts` (1 entries): supporting runtime logic
- `shared/node-list-parse.ts` (1 entries): supporting runtime logic
- `shared/node-list-types.ts` (1 entries): supporting runtime logic
- `shared/node-match.ts` (1 entries): supporting runtime logic
- `shared/operator-scope-compat.test.ts` (1 entries): supporting runtime logic
- `shared/operator-scope-compat.ts` (1 entries): supporting runtime logic
- `shared/pid-alive.test.ts` (1 entries): supporting runtime logic
- `shared/pid-alive.ts` (1 entries): supporting runtime logic
- `shared/process-scoped-map.ts` (1 entries): supporting runtime logic
- `shared/requirements.test.ts` (1 entries): supporting runtime logic
- `shared/requirements.ts` (1 entries): supporting runtime logic
- `shared/shared-misc.test.ts` (1 entries): supporting runtime logic
- `shared/string-normalization.test.ts` (1 entries): supporting runtime logic
- `shared/string-normalization.ts` (1 entries): supporting runtime logic
- `shared/subagents-format.ts` (1 entries): supporting runtime logic
- `shared/tailscale-status.ts` (1 entries): supporting runtime logic
- `shared/text` (3 entries): supporting runtime logic
- `shared/text-chunking.ts` (1 entries): supporting runtime logic
- `shared/usage-aggregates.ts` (1 entries): supporting runtime logic
- `signal/accounts.ts` (1 entries): Signal provider integration
- `signal/client.test.ts` (1 entries): Signal provider integration
- `signal/client.ts` (1 entries): Signal provider integration
- `signal/daemon.ts` (1 entries): Signal provider integration
- `signal/format.chunking.test.ts` (1 entries): Signal provider integration
- `signal/format.links.test.ts` (1 entries): Signal provider integration
- `signal/format.test.ts` (1 entries): Signal provider integration
- `signal/format.ts` (1 entries): Signal provider integration
- `signal/format.visual.test.ts` (1 entries): Signal provider integration
- `signal/identity.test.ts` (1 entries): Signal provider integration
- `signal/identity.ts` (1 entries): Signal provider integration
- `signal/index.ts` (1 entries): Signal provider integration
- `signal/monitor` (7 entries): Signal provider integration
- `signal/monitor.test.ts` (1 entries): Signal provider integration
- `signal/monitor.tool-result.pairs-uuid-only-senders-uuid-allowlist-entry.test.ts` (1 entries): Signal provider integration
- `signal/monitor.tool-result.sends-tool-summaries-responseprefix.test.ts` (1 entries): Signal provider integration
- `signal/monitor.tool-result.test-harness.ts` (1 entries): Signal provider integration
- `signal/monitor.ts` (1 entries): Signal provider integration
- `signal/probe.test.ts` (1 entries): Signal provider integration
- `signal/probe.ts` (1 entries): Signal provider integration
- `signal/reaction-level.ts` (1 entries): Signal provider integration
- `signal/rpc-context.ts` (1 entries): Signal provider integration
- `signal/send-reactions.test.ts` (1 entries): Signal provider integration
- `signal/send-reactions.ts` (1 entries): Signal provider integration
- `signal/send.ts` (1 entries): Signal provider integration
- `signal/sse-reconnect.ts` (1 entries): Signal provider integration
- `slack/accounts.test.ts` (1 entries): Slack provider integration
- `slack/accounts.ts` (1 entries): Slack provider integration
- `slack/actions.blocks.test.ts` (1 entries): Slack provider integration
- `slack/actions.read.test.ts` (1 entries): Slack provider integration
- `slack/actions.ts` (1 entries): Slack provider integration
- `slack/blocks-fallback.test.ts` (1 entries): Slack provider integration
- `slack/blocks-fallback.ts` (1 entries): Slack provider integration
- `slack/blocks-input.test.ts` (1 entries): Slack provider integration
- `slack/blocks-input.ts` (1 entries): Slack provider integration
- `slack/blocks.test-helpers.ts` (1 entries): Slack provider integration
- `slack/channel-migration.test.ts` (1 entries): Slack provider integration
- `slack/channel-migration.ts` (1 entries): Slack provider integration
- `slack/client.test.ts` (1 entries): Slack provider integration
- `slack/client.ts` (1 entries): Slack provider integration
- `slack/directory-live.ts` (1 entries): Slack provider integration
- `slack/draft-stream.test.ts` (1 entries): Slack provider integration
- `slack/draft-stream.ts` (1 entries): Slack provider integration
- `slack/format.test.ts` (1 entries): Slack provider integration
- `slack/format.ts` (1 entries): Slack provider integration
- `slack/http` (3 entries): Slack provider integration
- `slack/index.ts` (1 entries): Slack provider integration
- `slack/message-actions.ts` (1 entries): Slack provider integration
- `slack/modal-metadata.test.ts` (1 entries): Slack provider integration
- `slack/modal-metadata.ts` (1 entries): Slack provider integration
- `slack/monitor` (42 entries): Slack provider integration
- `slack/monitor.test-helpers.ts` (1 entries): Slack provider integration
- `slack/monitor.test.ts` (1 entries): Slack provider integration
- `slack/monitor.threading.missing-thread-ts.test.ts` (1 entries): Slack provider integration
- `slack/monitor.tool-result.test.ts` (1 entries): Slack provider integration
- `slack/monitor.ts` (1 entries): Slack provider integration
- `slack/probe.ts` (1 entries): Slack provider integration
- `slack/resolve-channels.test.ts` (1 entries): Slack provider integration
- `slack/resolve-channels.ts` (1 entries): Slack provider integration
- `slack/resolve-users.ts` (1 entries): Slack provider integration
- `slack/scopes.ts` (1 entries): Slack provider integration
- `slack/send.blocks.test.ts` (1 entries): Slack provider integration
- `slack/send.ts` (1 entries): Slack provider integration
- `slack/send.upload.test.ts` (1 entries): Slack provider integration
- `slack/stream-mode.test.ts` (1 entries): Slack provider integration
- `slack/stream-mode.ts` (1 entries): Slack provider integration
- `slack/streaming.ts` (1 entries): Slack provider integration
- `slack/targets.test.ts` (1 entries): Slack provider integration
- `slack/targets.ts` (1 entries): Slack provider integration
- `slack/threading-tool-context.test.ts` (1 entries): Slack provider integration
- `slack/threading-tool-context.ts` (1 entries): Slack provider integration
- `slack/threading.test.ts` (1 entries): Slack provider integration
- `slack/threading.ts` (1 entries): Slack provider integration
- `slack/token.ts` (1 entries): Slack provider integration
- `slack/types.ts` (1 entries): Slack provider integration
- `telegram/accounts.test.ts` (1 entries): Telegram provider integration
- `telegram/accounts.ts` (1 entries): Telegram provider integration
- `telegram/allowed-updates.ts` (1 entries): Telegram provider integration
- `telegram/api-logging.ts` (1 entries): Telegram provider integration
- `telegram/audit.test.ts` (1 entries): Telegram provider integration
- `telegram/audit.ts` (1 entries): Telegram provider integration
- `telegram/bot` (6 entries): Telegram provider integration
- `telegram/bot-access.ts` (1 entries): Telegram provider integration
- `telegram/bot-handlers.ts` (1 entries): Telegram provider integration
- `telegram/bot-message-context.audio-transcript.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-message-context.dm-threads.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-message-context.dm-topic-threadid.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-message-context.sender-prefix.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-message-context.test-harness.ts` (1 entries): Telegram provider integration
- `telegram/bot-message-context.ts` (1 entries): Telegram provider integration
- `telegram/bot-message-dispatch.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-message-dispatch.ts` (1 entries): Telegram provider integration
- `telegram/bot-message.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-message.ts` (1 entries): Telegram provider integration
- `telegram/bot-native-command-menu.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-native-command-menu.ts` (1 entries): Telegram provider integration
- `telegram/bot-native-commands.plugin-auth.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-native-commands.session-meta.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-native-commands.test-helpers.ts` (1 entries): Telegram provider integration
- `telegram/bot-native-commands.test.ts` (1 entries): Telegram provider integration
- `telegram/bot-native-commands.ts` (1 entries): Telegram provider integration
- `telegram/bot-updates.ts` (1 entries): Telegram provider integration
- `telegram/bot.create-telegram-bot.test-harness.ts` (1 entries): Telegram provider integration
- `telegram/bot.create-telegram-bot.test.ts` (1 entries): Telegram provider integration
- `telegram/bot.helpers.test.ts` (1 entries): Telegram provider integration
- `telegram/bot.media.downloads-media-file-path-no-file-download.test.ts` (1 entries): Telegram provider integration
- `telegram/bot.media.e2e-harness.ts` (1 entries): Telegram provider integration
- `telegram/bot.media.stickers-and-fragments.test.ts` (1 entries): Telegram provider integration
- `telegram/bot.media.test-utils.ts` (1 entries): Telegram provider integration
- `telegram/bot.test.ts` (1 entries): Telegram provider integration
- `telegram/bot.ts` (1 entries): Telegram provider integration
- `telegram/button-types.ts` (1 entries): Telegram provider integration
- `telegram/caption.ts` (1 entries): Telegram provider integration
- `telegram/dm-access.ts` (1 entries): Telegram provider integration
- `telegram/draft-chunking.test.ts` (1 entries): Telegram provider integration
- `telegram/draft-chunking.ts` (1 entries): Telegram provider integration
- `telegram/draft-stream.test.ts` (1 entries): Telegram provider integration
- `telegram/draft-stream.ts` (1 entries): Telegram provider integration
- `telegram/fetch.test.ts` (1 entries): Telegram provider integration
- `telegram/fetch.ts` (1 entries): Telegram provider integration
- `telegram/format.test.ts` (1 entries): Telegram provider integration
- `telegram/format.ts` (1 entries): Telegram provider integration
- `telegram/format.wrap-md.test.ts` (1 entries): Telegram provider integration
- `telegram/group-access.base-access.test.ts` (1 entries): Telegram provider integration
- `telegram/group-access.group-policy.test.ts` (1 entries): Telegram provider integration
- `telegram/group-access.ts` (1 entries): Telegram provider integration
- `telegram/group-config-helpers.ts` (1 entries): Telegram provider integration
- `telegram/group-migration.test.ts` (1 entries): Telegram provider integration
- `telegram/group-migration.ts` (1 entries): Telegram provider integration
- `telegram/inline-buttons.test.ts` (1 entries): Telegram provider integration
- `telegram/inline-buttons.ts` (1 entries): Telegram provider integration
- `telegram/lane-delivery.ts` (1 entries): Telegram provider integration
- `telegram/model-buttons.test.ts` (1 entries): Telegram provider integration
- `telegram/model-buttons.ts` (1 entries): Telegram provider integration
- `telegram/monitor.test.ts` (1 entries): Telegram provider integration
- `telegram/monitor.ts` (1 entries): Telegram provider integration
- `telegram/network-config.test.ts` (1 entries): Telegram provider integration
- `telegram/network-config.ts` (1 entries): Telegram provider integration
- `telegram/network-errors.test.ts` (1 entries): Telegram provider integration
- `telegram/network-errors.ts` (1 entries): Telegram provider integration
- `telegram/outbound-params.ts` (1 entries): Telegram provider integration
- `telegram/probe.test.ts` (1 entries): Telegram provider integration
- `telegram/probe.ts` (1 entries): Telegram provider integration
- `telegram/proxy.test.ts` (1 entries): Telegram provider integration
- `telegram/proxy.ts` (1 entries): Telegram provider integration
- `telegram/reaction-level.test.ts` (1 entries): Telegram provider integration
- `telegram/reaction-level.ts` (1 entries): Telegram provider integration
- `telegram/reasoning-lane-coordinator.test.ts` (1 entries): Telegram provider integration
- `telegram/reasoning-lane-coordinator.ts` (1 entries): Telegram provider integration
- `telegram/send.proxy.test.ts` (1 entries): Telegram provider integration
- `telegram/send.test-harness.ts` (1 entries): Telegram provider integration
- `telegram/send.test.ts` (1 entries): Telegram provider integration
- `telegram/send.ts` (1 entries): Telegram provider integration
- `telegram/sendchataction-401-backoff.test.ts` (1 entries): Telegram provider integration
- `telegram/sendchataction-401-backoff.ts` (1 entries): Telegram provider integration
- `telegram/sent-message-cache.ts` (1 entries): Telegram provider integration
- `telegram/status-reaction-variants.test.ts` (1 entries): Telegram provider integration
- `telegram/status-reaction-variants.ts` (1 entries): Telegram provider integration
- `telegram/sticker-cache.test.ts` (1 entries): Telegram provider integration
- `telegram/sticker-cache.ts` (1 entries): Telegram provider integration
- `telegram/target-writeback.test.ts` (1 entries): Telegram provider integration
- `telegram/target-writeback.ts` (1 entries): Telegram provider integration
- `telegram/targets.test.ts` (1 entries): Telegram provider integration
- `telegram/targets.ts` (1 entries): Telegram provider integration
- `telegram/token.test.ts` (1 entries): Telegram provider integration
- `telegram/token.ts` (1 entries): Telegram provider integration
- `telegram/update-offset-store.test.ts` (1 entries): Telegram provider integration
- `telegram/update-offset-store.ts` (1 entries): Telegram provider integration
- `telegram/voice.test.ts` (1 entries): Telegram provider integration
- `telegram/voice.ts` (1 entries): Telegram provider integration
- `telegram/webhook.test.ts` (1 entries): Telegram provider integration
- `telegram/webhook.ts` (1 entries): Telegram provider integration
- `terminal/ansi.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/health-style.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/links.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/note.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/palette.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/progress-line.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/prompt-select-styled.test.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/prompt-select-styled.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/prompt-style.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/restore.test.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/restore.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/stream-writer.test.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/stream-writer.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/table.test.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/table.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `terminal/theme.ts` (1 entries): TTY formatting, tables, palette, and prompts
- `test-helpers/ssrf.ts` (1 entries): supporting runtime logic
- `test-helpers/state-dir-env.test.ts` (1 entries): supporting runtime logic
- `test-helpers/state-dir-env.ts` (1 entries): supporting runtime logic
- `test-helpers/workspace.ts` (1 entries): supporting runtime logic
- `test-utils/auth-token-assertions.ts` (1 entries): supporting runtime logic
- `test-utils/channel-plugins.test.ts` (1 entries): supporting runtime logic
- `test-utils/channel-plugins.ts` (1 entries): supporting runtime logic
- `test-utils/chunk-test-helpers.ts` (1 entries): supporting runtime logic
- `test-utils/command-runner.ts` (1 entries): supporting runtime logic
- `test-utils/env.test.ts` (1 entries): supporting runtime logic
- `test-utils/env.ts` (1 entries): supporting runtime logic
- `test-utils/exec-assertions.ts` (1 entries): supporting runtime logic
- `test-utils/fetch-mock.ts` (1 entries): supporting runtime logic
- `test-utils/fixture-suite.ts` (1 entries): supporting runtime logic
- `test-utils/imessage-test-plugin.ts` (1 entries): supporting runtime logic
- `test-utils/internal-hook-event-payload.ts` (1 entries): supporting runtime logic
- `test-utils/mock-http-response.ts` (1 entries): supporting runtime logic
- `test-utils/model-auth-mock.ts` (1 entries): supporting runtime logic
- `test-utils/model-fallback.mock.ts` (1 entries): supporting runtime logic
- `test-utils/npm-spec-install-test-helpers.ts` (1 entries): supporting runtime logic
- `test-utils/ports.ts` (1 entries): supporting runtime logic
- `test-utils/provider-usage-fetch.ts` (1 entries): supporting runtime logic
- `test-utils/repo-scan.ts` (1 entries): supporting runtime logic
- `test-utils/runtime-source-guardrail-scan.ts` (1 entries): supporting runtime logic
- `test-utils/temp-dir.ts` (1 entries): supporting runtime logic
- `test-utils/temp-home.test.ts` (1 entries): supporting runtime logic
- `test-utils/temp-home.ts` (1 entries): supporting runtime logic
- `test-utils/tracked-temp-dirs.ts` (1 entries): supporting runtime logic
- `test-utils/typed-cases.ts` (1 entries): supporting runtime logic
- `test-utils/vitest-mock-fn.ts` (1 entries): supporting runtime logic
- `tts/prepare-text.test.ts` (1 entries): text-to-speech runtime
- `tts/tts-core.ts` (1 entries): text-to-speech runtime
- `tts/tts.test.ts` (1 entries): text-to-speech runtime
- `tts/tts.ts` (1 entries): text-to-speech runtime
- `tui/commands.test.ts` (1 entries): terminal UI components and themes
- `tui/commands.ts` (1 entries): terminal UI components and themes
- `tui/components` (13 entries): terminal UI components and themes
- `tui/gateway-chat.test.ts` (1 entries): terminal UI components and themes
- `tui/gateway-chat.ts` (1 entries): terminal UI components and themes
- `tui/osc8-hyperlinks.test.ts` (1 entries): terminal UI components and themes
- `tui/osc8-hyperlinks.ts` (1 entries): terminal UI components and themes
- `tui/theme` (3 entries): terminal UI components and themes
- `tui/tui-command-handlers.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-command-handlers.ts` (1 entries): terminal UI components and themes
- `tui/tui-event-handlers.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-event-handlers.ts` (1 entries): terminal UI components and themes
- `tui/tui-formatters.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-formatters.ts` (1 entries): terminal UI components and themes
- `tui/tui-input-history.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-local-shell.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-local-shell.ts` (1 entries): terminal UI components and themes
- `tui/tui-overlays.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-overlays.ts` (1 entries): terminal UI components and themes
- `tui/tui-session-actions.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-session-actions.ts` (1 entries): terminal UI components and themes
- `tui/tui-status-summary.ts` (1 entries): terminal UI components and themes
- `tui/tui-stream-assembler.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-stream-assembler.ts` (1 entries): terminal UI components and themes
- `tui/tui-submit-test-helpers.ts` (1 entries): terminal UI components and themes
- `tui/tui-types.ts` (1 entries): terminal UI components and themes
- `tui/tui-waiting.test.ts` (1 entries): terminal UI components and themes
- `tui/tui-waiting.ts` (1 entries): terminal UI components and themes
- `tui/tui.submit-handler.test.ts` (1 entries): terminal UI components and themes
- `tui/tui.test.ts` (1 entries): terminal UI components and themes
- `tui/tui.ts` (1 entries): terminal UI components and themes
- `types/cli-highlight.d.ts` (1 entries): supporting runtime logic
- `types/lydell-node-pty.d.ts` (1 entries): supporting runtime logic
- `types/napi-rs-canvas.d.ts` (1 entries): supporting runtime logic
- `types/node-edge-tts.d.ts` (1 entries): supporting runtime logic
- `types/node-llama-cpp.d.ts` (1 entries): supporting runtime logic
- `types/osc-progress.d.ts` (1 entries): supporting runtime logic
- `types/pdfjs-dist-legacy.d.ts` (1 entries): supporting runtime logic
- `types/qrcode-terminal.d.ts` (1 entries): supporting runtime logic
- `utils.test.ts` (1 entries): supporting runtime logic
- `utils.ts` (1 entries): supporting runtime logic
- `utils/account-id.ts` (1 entries): cross-cutting utility helpers
- `utils/boolean.ts` (1 entries): cross-cutting utility helpers
- `utils/chunk-items.ts` (1 entries): cross-cutting utility helpers
- `utils/delivery-context.test.ts` (1 entries): cross-cutting utility helpers
- `utils/delivery-context.ts` (1 entries): cross-cutting utility helpers
- `utils/directive-tags.test.ts` (1 entries): cross-cutting utility helpers
- `utils/directive-tags.ts` (1 entries): cross-cutting utility helpers
- `utils/fetch-timeout.ts` (1 entries): cross-cutting utility helpers
- `utils/mask-api-key.test.ts` (1 entries): cross-cutting utility helpers
- `utils/mask-api-key.ts` (1 entries): cross-cutting utility helpers
- `utils/message-channel.test.ts` (1 entries): cross-cutting utility helpers
- `utils/message-channel.ts` (1 entries): cross-cutting utility helpers
- `utils/normalize-secret-input.ts` (1 entries): cross-cutting utility helpers
- `utils/provider-utils.ts` (1 entries): cross-cutting utility helpers
- `utils/queue-helpers.test.ts` (1 entries): cross-cutting utility helpers
- `utils/queue-helpers.ts` (1 entries): cross-cutting utility helpers
- `utils/reaction-level.test.ts` (1 entries): cross-cutting utility helpers
- `utils/reaction-level.ts` (1 entries): cross-cutting utility helpers
- `utils/run-with-concurrency.test.ts` (1 entries): cross-cutting utility helpers
- `utils/run-with-concurrency.ts` (1 entries): cross-cutting utility helpers
- `utils/safe-json.ts` (1 entries): cross-cutting utility helpers
- `utils/shell-argv.ts` (1 entries): cross-cutting utility helpers
- `utils/transcript-tools.test.ts` (1 entries): cross-cutting utility helpers
- `utils/transcript-tools.ts` (1 entries): cross-cutting utility helpers
- `utils/usage-format.test.ts` (1 entries): cross-cutting utility helpers
- `utils/usage-format.ts` (1 entries): cross-cutting utility helpers
- `utils/utils-misc.test.ts` (1 entries): cross-cutting utility helpers
- `utils/with-timeout.ts` (1 entries): cross-cutting utility helpers
- `version.test.ts` (1 entries): supporting runtime logic
- `version.ts` (1 entries): supporting runtime logic
- `web/accounts.test.ts` (1 entries): web provider and web auto-reply flows
- `web/accounts.ts` (1 entries): web provider and web auto-reply flows
- `web/accounts.whatsapp-auth.test.ts` (1 entries): web provider and web auto-reply flows
- `web/active-listener.ts` (1 entries): web provider and web auto-reply flows
- `web/auth-store.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply` (27 entries): web provider and web auto-reply flows
- `web/auto-reply.broadcast-groups.broadcasts-sequentially-configured-order.test.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.broadcast-groups.skips-unknown-broadcast-agent-ids-agents-list.test.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.broadcast-groups.test-harness.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.impl.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.test-harness.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.typing-controller-idle.test.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.web-auto-reply.compresses-common-formats-jpeg-cap.test.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.web-auto-reply.last-route.test.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.web-auto-reply.monitor-logging.test.ts` (1 entries): web provider and web auto-reply flows
- `web/auto-reply.web-auto-reply.reconnects-after-connection-close.test.ts` (1 entries): web provider and web auto-reply flows
- `web/inbound` (12 entries): web provider and web auto-reply flows
- `web/inbound.media.test.ts` (1 entries): web provider and web auto-reply flows
- `web/inbound.test.ts` (1 entries): web provider and web auto-reply flows
- `web/inbound.ts` (1 entries): web provider and web auto-reply flows
- `web/login-qr.test.ts` (1 entries): web provider and web auto-reply flows
- `web/login-qr.ts` (1 entries): web provider and web auto-reply flows
- `web/login.coverage.test.ts` (1 entries): web provider and web auto-reply flows
- `web/login.test.ts` (1 entries): web provider and web auto-reply flows
- `web/login.ts` (1 entries): web provider and web auto-reply flows
- `web/logout.test.ts` (1 entries): web provider and web auto-reply flows
- `web/media.test.ts` (1 entries): web provider and web auto-reply flows
- `web/media.ts` (1 entries): web provider and web auto-reply flows
- `web/monitor-inbox.allows-messages-from-senders-allowfrom-list.test.ts` (1 entries): web provider and web auto-reply flows
- `web/monitor-inbox.blocks-messages-from-unauthorized-senders-not-allowfrom.test.ts` (1 entries): web provider and web auto-reply flows
- `web/monitor-inbox.captures-media-path-image-messages.test.ts` (1 entries): web provider and web auto-reply flows
- `web/monitor-inbox.streams-inbound-messages.test.ts` (1 entries): web provider and web auto-reply flows
- `web/monitor-inbox.test-harness.ts` (1 entries): web provider and web auto-reply flows
- `web/outbound.test.ts` (1 entries): web provider and web auto-reply flows
- `web/outbound.ts` (1 entries): web provider and web auto-reply flows
- `web/qr-image.ts` (1 entries): web provider and web auto-reply flows
- `web/reconnect.test.ts` (1 entries): web provider and web auto-reply flows
- `web/reconnect.ts` (1 entries): web provider and web auto-reply flows
- `web/session.test.ts` (1 entries): web provider and web auto-reply flows
- `web/session.ts` (1 entries): web provider and web auto-reply flows
- `web/test-helpers.ts` (1 entries): web provider and web auto-reply flows
- `web/vcard.ts` (1 entries): web provider and web auto-reply flows
- `whatsapp/normalize.test.ts` (1 entries): WhatsApp-oriented helpers and runtime glue
- `whatsapp/normalize.ts` (1 entries): WhatsApp-oriented helpers and runtime glue
- `whatsapp/resolve-outbound-target.test.ts` (1 entries): WhatsApp-oriented helpers and runtime glue
- `whatsapp/resolve-outbound-target.ts` (1 entries): WhatsApp-oriented helpers and runtime glue
- `wizard/clack-prompter.test.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/clack-prompter.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/onboarding.completion.test.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/onboarding.completion.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/onboarding.finalize.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/onboarding.gateway-config.test.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/onboarding.gateway-config.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/onboarding.test.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/onboarding.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/onboarding.types.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/prompts.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/session.test.ts` (1 entries): interactive onboarding and configuration wizard flows
- `wizard/session.ts` (1 entries): interactive onboarding and configuration wizard flows

### App Surfaces

- `apps/android`
- `apps/android/THIRD_PARTY_LICENSES`
- `apps/android/app`
- `apps/android/app/src`
- `apps/android/app/src/main`
- `apps/android/app/src/main/java`
- `apps/android/app/src/main/java/ai`
- `apps/android/app/src/main/java/ai/traversalai`
- `apps/android/app/src/main/java/ai/traversalai/android`
- `apps/android/app/src/main/java/ai/traversalai/android/chat`
- `apps/android/app/src/main/java/ai/traversalai/android/gateway`
- `apps/android/app/src/main/java/ai/traversalai/android/node`
- `apps/android/app/src/main/java/ai/traversalai/android/protocol`
- `apps/android/app/src/main/java/ai/traversalai/android/tools`
- `apps/android/app/src/main/java/ai/traversalai/android/ui`
- `apps/android/app/src/main/java/ai/traversalai/android/ui/chat`
- `apps/android/app/src/main/java/ai/traversalai/android/voice`
- `apps/android/app/src/main/res`
- `apps/android/app/src/main/res/font`
- `apps/android/app/src/main/res/mipmap-anydpi`
- `apps/android/app/src/main/res/mipmap-hdpi`
- `apps/android/app/src/main/res/mipmap-mdpi`
- `apps/android/app/src/main/res/mipmap-xhdpi`
- `apps/android/app/src/main/res/mipmap-xxhdpi`
- `apps/android/app/src/main/res/mipmap-xxxhdpi`
- `apps/android/app/src/main/res/values`
- `apps/android/app/src/main/res/xml`
- `apps/android/app/src/test`
- `apps/android/app/src/test/java`
- `apps/android/app/src/test/java/ai`
- `apps/android/app/src/test/java/ai/traversalai`
- `apps/android/app/src/test/java/ai/traversalai/android`
- `apps/android/app/src/test/java/ai/traversalai/android/gateway`
- `apps/android/app/src/test/java/ai/traversalai/android/node`
- `apps/android/app/src/test/java/ai/traversalai/android/protocol`
- `apps/android/app/src/test/java/ai/traversalai/android/ui`
- `apps/android/app/src/test/java/ai/traversalai/android/ui/chat`
- `apps/android/app/src/test/java/ai/traversalai/android/voice`
- `apps/android/benchmark`
- `apps/android/benchmark/src`
- `apps/android/benchmark/src/main`
- `apps/android/benchmark/src/main/java`
- `apps/android/benchmark/src/main/java/ai`
- `apps/android/benchmark/src/main/java/ai/traversalai`
- `apps/android/benchmark/src/main/java/ai/traversalai/android`
- `apps/android/benchmark/src/main/java/ai/traversalai/android/benchmark`
- `apps/android/gradle`
- `apps/android/gradle/wrapper`
- `apps/android/scripts`
- `apps/ios`
- `apps/ios/Config`
- `apps/ios/ShareExtension`
- `apps/ios/Sources`
- `apps/ios/Sources/Assets.xcassets`
- `apps/ios/Sources/Assets.xcassets/AppIcon.appiconset`
- `apps/ios/Sources/Calendar`
- `apps/ios/Sources/Camera`
- `apps/ios/Sources/Capabilities`
- `apps/ios/Sources/Chat`
- `apps/ios/Sources/Contacts`
- `apps/ios/Sources/Device`
- `apps/ios/Sources/EventKit`
- `apps/ios/Sources/Gateway`
- `apps/ios/Sources/Location`
- `apps/ios/Sources/Media`
- `apps/ios/Sources/Model`
- `apps/ios/Sources/Motion`
- `apps/ios/Sources/Onboarding`
- `apps/ios/Sources/Reminders`
- `apps/ios/Sources/Screen`
- `apps/ios/Sources/Services`
- `apps/ios/Sources/Settings`
- `apps/ios/Sources/Status`
- `apps/ios/Sources/Voice`
- `apps/ios/Tests`
- `apps/ios/WatchApp`
- `apps/ios/WatchApp/Assets.xcassets`
- `apps/ios/WatchApp/Assets.xcassets/AppIcon.appiconset`
- `apps/ios/WatchExtension`
- `apps/ios/WatchExtension/Sources`
- `apps/ios/fastlane`
- `apps/macos`
- `apps/macos/Icon.icon`
- `apps/macos/Icon.icon/Assets`
- `apps/macos/Sources`
- `apps/macos/Sources/TraversalAI`
- `apps/macos/Sources/TraversalAI/Logging`
- `apps/macos/Sources/TraversalAI/NodeMode`
- `apps/macos/Sources/TraversalAI/Resources`
- `apps/macos/Sources/TraversalAI/Resources/DeviceModels`
- `apps/macos/Sources/TraversalAIDiscovery`
- `apps/macos/Sources/TraversalAIIPC`
- `apps/macos/Sources/TraversalAIMacCLI`
- `apps/macos/Sources/TraversalAIProtocol`
- `apps/macos/Tests`
- `apps/macos/Tests/TraversalAIIPCTests`
- `apps/shared`
- `apps/shared/TraversalAIKit`
- `apps/shared/TraversalAIKit/Sources`
- `apps/shared/TraversalAIKit/Sources/TraversalAIChatUI`
- `apps/shared/TraversalAIKit/Sources/TraversalAIKit`
- `apps/shared/TraversalAIKit/Sources/TraversalAIKit/Resources`
- `apps/shared/TraversalAIKit/Sources/TraversalAIKit/Resources/CanvasScaffold`
- `apps/shared/TraversalAIKit/Sources/TraversalAIProtocol`
- `apps/shared/TraversalAIKit/Tests`
- `apps/shared/TraversalAIKit/Tests/TraversalAIKitTests`
- `apps/shared/TraversalAIKit/Tools`
- `apps/shared/TraversalAIKit/Tools/CanvasA2UI`
- `apps/standalone-chat`
- `apps/standalone-chat/dist`
- `apps/standalone-chat/dist/assets`
- `apps/standalone-chat/logs`
- `apps/standalone-chat/node_modules`
- `apps/standalone-chat/node_modules/.bin`
- `apps/standalone-chat/node_modules/.vite`
- `apps/standalone-chat/node_modules/.vite-temp`
- `apps/standalone-chat/node_modules/.vite/deps`
- `apps/standalone-chat/node_modules/@alloc`
- `apps/standalone-chat/node_modules/@alloc/quick-lru`
- `apps/standalone-chat/node_modules/@anthropic-ai`
- `apps/standalone-chat/node_modules/@babel`
- `apps/standalone-chat/node_modules/@babel/code-frame`
- `apps/standalone-chat/node_modules/@babel/code-frame/lib`
- `apps/standalone-chat/node_modules/@babel/compat-data`
- `apps/standalone-chat/node_modules/@babel/compat-data/data`
- `apps/standalone-chat/node_modules/@babel/core`
- `apps/standalone-chat/node_modules/@babel/core/lib`
- `apps/standalone-chat/node_modules/@babel/core/lib/config`
- `apps/standalone-chat/node_modules/@babel/core/lib/config/files`
- `apps/standalone-chat/node_modules/@babel/core/lib/config/helpers`
- `apps/standalone-chat/node_modules/@babel/core/lib/config/validation`
- `apps/standalone-chat/node_modules/@babel/core/lib/errors`
- `apps/standalone-chat/node_modules/@babel/core/lib/gensync-utils`
- `apps/standalone-chat/node_modules/@babel/core/lib/parser`
- `apps/standalone-chat/node_modules/@babel/core/lib/parser/util`
- `apps/standalone-chat/node_modules/@babel/core/lib/tools`
- `apps/standalone-chat/node_modules/@babel/core/lib/transformation`
- `apps/standalone-chat/node_modules/@babel/core/lib/transformation/file`
- `apps/standalone-chat/node_modules/@babel/core/lib/transformation/util`
- `apps/standalone-chat/node_modules/@babel/core/lib/vendor`
- `apps/standalone-chat/node_modules/@babel/core/src`
- `apps/standalone-chat/node_modules/@babel/core/src/config`
- `apps/standalone-chat/node_modules/@babel/core/src/config/files`
- `apps/standalone-chat/node_modules/@babel/generator`
- `apps/standalone-chat/node_modules/@babel/generator/lib`
- `apps/standalone-chat/node_modules/@babel/generator/lib/generators`
- `apps/standalone-chat/node_modules/@babel/generator/lib/node`
- `apps/standalone-chat/node_modules/@babel/helper-compilation-targets`
- `apps/standalone-chat/node_modules/@babel/helper-compilation-targets/lib`
- `apps/standalone-chat/node_modules/@babel/helper-globals`
- `apps/standalone-chat/node_modules/@babel/helper-globals/data`
- `apps/standalone-chat/node_modules/@babel/helper-module-imports`
- `apps/standalone-chat/node_modules/@babel/helper-module-imports/lib`
- `apps/standalone-chat/node_modules/@babel/helper-module-transforms`
- `apps/standalone-chat/node_modules/@babel/helper-module-transforms/lib`
- `apps/standalone-chat/node_modules/@babel/helper-plugin-utils`
- `apps/standalone-chat/node_modules/@babel/helper-plugin-utils/lib`
- `apps/standalone-chat/node_modules/@babel/helper-string-parser`
- `apps/standalone-chat/node_modules/@babel/helper-string-parser/lib`
- `apps/standalone-chat/node_modules/@babel/helper-validator-identifier`
- `apps/standalone-chat/node_modules/@babel/helper-validator-identifier/lib`
- `apps/standalone-chat/node_modules/@babel/helper-validator-option`
- `apps/standalone-chat/node_modules/@babel/helper-validator-option/lib`
- `apps/standalone-chat/node_modules/@babel/helpers`
- `apps/standalone-chat/node_modules/@babel/helpers/lib`
- `apps/standalone-chat/node_modules/@babel/helpers/lib/helpers`
- `apps/standalone-chat/node_modules/@babel/parser`
- `apps/standalone-chat/node_modules/@babel/parser/bin`
- `apps/standalone-chat/node_modules/@babel/parser/lib`
- `apps/standalone-chat/node_modules/@babel/parser/typings`
- `apps/standalone-chat/node_modules/@babel/plugin-transform-react-jsx-self`
- `apps/standalone-chat/node_modules/@babel/plugin-transform-react-jsx-self/lib`
- `apps/standalone-chat/node_modules/@babel/plugin-transform-react-jsx-source`
- `apps/standalone-chat/node_modules/@babel/plugin-transform-react-jsx-source/lib`
- `apps/standalone-chat/node_modules/@babel/template`
- `apps/standalone-chat/node_modules/@babel/template/lib`
- `apps/standalone-chat/node_modules/@babel/traverse`
- `apps/standalone-chat/node_modules/@babel/traverse/lib`
- `apps/standalone-chat/node_modules/@babel/traverse/lib/path`
- `apps/standalone-chat/node_modules/@babel/traverse/lib/path/inference`
- `apps/standalone-chat/node_modules/@babel/traverse/lib/path/lib`
- `apps/standalone-chat/node_modules/@babel/traverse/lib/scope`
- `apps/standalone-chat/node_modules/@babel/traverse/lib/scope/lib`
- `apps/standalone-chat/node_modules/@babel/types`
- `apps/standalone-chat/node_modules/@babel/types/lib`
- `apps/standalone-chat/node_modules/@babel/types/lib/asserts`
- `apps/standalone-chat/node_modules/@babel/types/lib/asserts/generated`
- `apps/standalone-chat/node_modules/@babel/types/lib/ast-types`
- `apps/standalone-chat/node_modules/@babel/types/lib/ast-types/generated`
- `apps/standalone-chat/node_modules/@babel/types/lib/builders`
- `apps/standalone-chat/node_modules/@babel/types/lib/builders/flow`
- `apps/standalone-chat/node_modules/@babel/types/lib/builders/generated`
- `apps/standalone-chat/node_modules/@babel/types/lib/builders/react`
- `apps/standalone-chat/node_modules/@babel/types/lib/builders/typescript`
- `apps/standalone-chat/node_modules/@babel/types/lib/clone`
- `apps/standalone-chat/node_modules/@babel/types/lib/comments`
- `apps/standalone-chat/node_modules/@babel/types/lib/constants`
- `apps/standalone-chat/node_modules/@babel/types/lib/constants/generated`
- `apps/standalone-chat/node_modules/@babel/types/lib/converters`
- `apps/standalone-chat/node_modules/@babel/types/lib/definitions`
- `apps/standalone-chat/node_modules/@babel/types/lib/modifications`
- `apps/standalone-chat/node_modules/@babel/types/lib/modifications/flow`
- `apps/standalone-chat/node_modules/@babel/types/lib/modifications/typescript`
- `apps/standalone-chat/node_modules/@babel/types/lib/retrievers`
- `apps/standalone-chat/node_modules/@babel/types/lib/traverse`
- `apps/standalone-chat/node_modules/@babel/types/lib/utils`
- `apps/standalone-chat/node_modules/@babel/types/lib/utils/react`
- `apps/standalone-chat/node_modules/@babel/types/lib/validators`
- `apps/standalone-chat/node_modules/@babel/types/lib/validators/generated`
- `apps/standalone-chat/node_modules/@babel/types/lib/validators/react`
- `apps/standalone-chat/node_modules/@esbuild`
- `apps/standalone-chat/node_modules/@eslint`
- `apps/standalone-chat/node_modules/@eslint-community`
- `apps/standalone-chat/node_modules/@hono`
- `apps/standalone-chat/node_modules/@humanfs`
- `apps/standalone-chat/node_modules/@humanwhocodes`
- `apps/standalone-chat/node_modules/@jridgewell`
- `apps/standalone-chat/node_modules/@jridgewell/gen-mapping`
- `apps/standalone-chat/node_modules/@jridgewell/gen-mapping/dist`
- `apps/standalone-chat/node_modules/@jridgewell/gen-mapping/dist/types`
- `apps/standalone-chat/node_modules/@jridgewell/gen-mapping/src`
- `apps/standalone-chat/node_modules/@jridgewell/gen-mapping/types`
- `apps/standalone-chat/node_modules/@jridgewell/remapping`
- `apps/standalone-chat/node_modules/@jridgewell/remapping/dist`
- `apps/standalone-chat/node_modules/@jridgewell/remapping/src`
- `apps/standalone-chat/node_modules/@jridgewell/remapping/types`
- `apps/standalone-chat/node_modules/@jridgewell/resolve-uri`
- `apps/standalone-chat/node_modules/@jridgewell/resolve-uri/dist`
- `apps/standalone-chat/node_modules/@jridgewell/resolve-uri/dist/types`
- `apps/standalone-chat/node_modules/@jridgewell/sourcemap-codec`
- `apps/standalone-chat/node_modules/@jridgewell/sourcemap-codec/dist`
- `apps/standalone-chat/node_modules/@jridgewell/sourcemap-codec/src`
- `apps/standalone-chat/node_modules/@jridgewell/sourcemap-codec/types`
- `apps/standalone-chat/node_modules/@jridgewell/trace-mapping`
- `apps/standalone-chat/node_modules/@jridgewell/trace-mapping/dist`
- `apps/standalone-chat/node_modules/@jridgewell/trace-mapping/src`
- `apps/standalone-chat/node_modules/@jridgewell/trace-mapping/types`
- `apps/standalone-chat/node_modules/@modelcontextprotocol`
- `apps/standalone-chat/node_modules/@nodelib`
- `apps/standalone-chat/node_modules/@nodelib/fs.scandir`
- `apps/standalone-chat/node_modules/@nodelib/fs.scandir/out`
- `apps/standalone-chat/node_modules/@nodelib/fs.scandir/out/adapters`
- `apps/standalone-chat/node_modules/@nodelib/fs.scandir/out/providers`
- `apps/standalone-chat/node_modules/@nodelib/fs.scandir/out/types`
- `apps/standalone-chat/node_modules/@nodelib/fs.scandir/out/utils`
- `apps/standalone-chat/node_modules/@nodelib/fs.stat`
- `apps/standalone-chat/node_modules/@nodelib/fs.stat/out`
- `apps/standalone-chat/node_modules/@nodelib/fs.stat/out/adapters`
- `apps/standalone-chat/node_modules/@nodelib/fs.stat/out/providers`
- `apps/standalone-chat/node_modules/@nodelib/fs.stat/out/types`
- `apps/standalone-chat/node_modules/@nodelib/fs.walk`
- `apps/standalone-chat/node_modules/@nodelib/fs.walk/out`
- `apps/standalone-chat/node_modules/@nodelib/fs.walk/out/providers`
- `apps/standalone-chat/node_modules/@nodelib/fs.walk/out/readers`
- `apps/standalone-chat/node_modules/@nodelib/fs.walk/out/types`
- `apps/standalone-chat/node_modules/@rolldown`
- `apps/standalone-chat/node_modules/@rolldown/pluginutils`
- `apps/standalone-chat/node_modules/@rolldown/pluginutils/dist`
- `apps/standalone-chat/node_modules/@rollup`
- `apps/standalone-chat/node_modules/@rollup/rollup-linux-x64-gnu`
- `apps/standalone-chat/node_modules/@rollup/rollup-linux-x64-musl`
- `apps/standalone-chat/node_modules/@types`
- `apps/standalone-chat/node_modules/@types/babel__core`
- `apps/standalone-chat/node_modules/@types/babel__generator`
- `apps/standalone-chat/node_modules/@types/babel__template`
- `apps/standalone-chat/node_modules/@types/babel__traverse`
- `apps/standalone-chat/node_modules/@types/debug`
- `apps/standalone-chat/node_modules/@types/estree`
- `apps/standalone-chat/node_modules/@types/estree-jsx`
- `apps/standalone-chat/node_modules/@types/hast`
- `apps/standalone-chat/node_modules/@types/mdast`
- `apps/standalone-chat/node_modules/@types/ms`
- `apps/standalone-chat/node_modules/@types/prop-types`
- `apps/standalone-chat/node_modules/@types/react`
- `apps/standalone-chat/node_modules/@types/react-dom`
- `apps/standalone-chat/node_modules/@types/react-dom/test-utils`
- `apps/standalone-chat/node_modules/@types/react/ts5.0`
- `apps/standalone-chat/node_modules/@types/unist`
- `apps/standalone-chat/node_modules/@typescript-eslint`
- `apps/standalone-chat/node_modules/@ungap`
- `apps/standalone-chat/node_modules/@ungap/structured-clone`
- `apps/standalone-chat/node_modules/@ungap/structured-clone/.github`
- `apps/standalone-chat/node_modules/@ungap/structured-clone/.github/workflows`
- `apps/standalone-chat/node_modules/@ungap/structured-clone/cjs`
- `apps/standalone-chat/node_modules/@ungap/structured-clone/esm`
- `apps/standalone-chat/node_modules/@vitejs`
- `apps/standalone-chat/node_modules/@vitejs/plugin-react`
- `apps/standalone-chat/node_modules/@vitejs/plugin-react/dist`
- `apps/standalone-chat/node_modules/any-promise`
- `apps/standalone-chat/node_modules/any-promise/register`
- `apps/standalone-chat/node_modules/anymatch`
- `apps/standalone-chat/node_modules/arg`
- `apps/standalone-chat/node_modules/autoprefixer`
- `apps/standalone-chat/node_modules/autoprefixer/bin`
- `apps/standalone-chat/node_modules/autoprefixer/data`
- `apps/standalone-chat/node_modules/autoprefixer/lib`
- `apps/standalone-chat/node_modules/autoprefixer/lib/hacks`
- `apps/standalone-chat/node_modules/bail`
- `apps/standalone-chat/node_modules/baseline-browser-mapping`
- `apps/standalone-chat/node_modules/baseline-browser-mapping/dist`
- `apps/standalone-chat/node_modules/binary-extensions`
- `apps/standalone-chat/node_modules/braces`
- `apps/standalone-chat/node_modules/braces/lib`
- `apps/standalone-chat/node_modules/browserslist`
- `apps/standalone-chat/node_modules/camelcase-css`
- `apps/standalone-chat/node_modules/caniuse-lite`
- `apps/standalone-chat/node_modules/caniuse-lite/data`
- `apps/standalone-chat/node_modules/caniuse-lite/data/features`
- `apps/standalone-chat/node_modules/caniuse-lite/data/regions`
- `apps/standalone-chat/node_modules/caniuse-lite/dist`
- `apps/standalone-chat/node_modules/caniuse-lite/dist/lib`
- `apps/standalone-chat/node_modules/caniuse-lite/dist/unpacker`
- `apps/standalone-chat/node_modules/ccount`
- `apps/standalone-chat/node_modules/character-entities`
- `apps/standalone-chat/node_modules/character-entities-html4`
- `apps/standalone-chat/node_modules/character-entities-legacy`
- `apps/standalone-chat/node_modules/character-reference-invalid`
- `apps/standalone-chat/node_modules/chokidar`
- `apps/standalone-chat/node_modules/chokidar/lib`
- `apps/standalone-chat/node_modules/chokidar/node_modules`
- `apps/standalone-chat/node_modules/chokidar/node_modules/glob-parent`
- `apps/standalone-chat/node_modules/chokidar/types`
- `apps/standalone-chat/node_modules/comma-separated-tokens`
- `apps/standalone-chat/node_modules/commander`
- `apps/standalone-chat/node_modules/commander/typings`
- `apps/standalone-chat/node_modules/convert-source-map`
- `apps/standalone-chat/node_modules/cssesc`
- `apps/standalone-chat/node_modules/cssesc/bin`
- `apps/standalone-chat/node_modules/cssesc/man`
- `apps/standalone-chat/node_modules/csstype`
- `apps/standalone-chat/node_modules/debug`
- `apps/standalone-chat/node_modules/debug/src`
- `apps/standalone-chat/node_modules/decode-named-character-reference`
- `apps/standalone-chat/node_modules/dequal`
- `apps/standalone-chat/node_modules/dequal/dist`
- `apps/standalone-chat/node_modules/dequal/lite`
- `apps/standalone-chat/node_modules/devlop`
- `apps/standalone-chat/node_modules/devlop/lib`
- `apps/standalone-chat/node_modules/didyoumean`
- `apps/standalone-chat/node_modules/dlv`
- `apps/standalone-chat/node_modules/dlv/dist`
- `apps/standalone-chat/node_modules/electron-to-chromium`
- `apps/standalone-chat/node_modules/escalade`
- `apps/standalone-chat/node_modules/escalade/dist`
- `apps/standalone-chat/node_modules/escalade/sync`
- `apps/standalone-chat/node_modules/estree-util-is-identifier-name`
- `apps/standalone-chat/node_modules/estree-util-is-identifier-name/lib`
- `apps/standalone-chat/node_modules/extend`
- `apps/standalone-chat/node_modules/fast-glob`
- `apps/standalone-chat/node_modules/fast-glob/node_modules`
- `apps/standalone-chat/node_modules/fast-glob/node_modules/glob-parent`
- `apps/standalone-chat/node_modules/fast-glob/out`
- `apps/standalone-chat/node_modules/fast-glob/out/managers`
- `apps/standalone-chat/node_modules/fast-glob/out/providers`
- `apps/standalone-chat/node_modules/fast-glob/out/providers/filters`
- `apps/standalone-chat/node_modules/fast-glob/out/providers/matchers`
- `apps/standalone-chat/node_modules/fast-glob/out/providers/transformers`
- `apps/standalone-chat/node_modules/fast-glob/out/readers`
- `apps/standalone-chat/node_modules/fast-glob/out/types`
- `apps/standalone-chat/node_modules/fast-glob/out/utils`
- `apps/standalone-chat/node_modules/fastq`
- `apps/standalone-chat/node_modules/fastq/test`
- `apps/standalone-chat/node_modules/fill-range`
- `apps/standalone-chat/node_modules/fraction.js`
- `apps/standalone-chat/node_modules/fraction.js/dist`
- `apps/standalone-chat/node_modules/fraction.js/examples`
- `apps/standalone-chat/node_modules/fraction.js/src`
- `apps/standalone-chat/node_modules/fraction.js/tests`
- `apps/standalone-chat/node_modules/function-bind`
- `apps/standalone-chat/node_modules/function-bind/.github`
- `apps/standalone-chat/node_modules/function-bind/test`
- `apps/standalone-chat/node_modules/gensync`
- `apps/standalone-chat/node_modules/gensync/test`
- `apps/standalone-chat/node_modules/glob-parent`
- `apps/standalone-chat/node_modules/hasown`
- `apps/standalone-chat/node_modules/hasown/.github`
- `apps/standalone-chat/node_modules/hast-util-to-jsx-runtime`
- `apps/standalone-chat/node_modules/hast-util-to-jsx-runtime/lib`
- `apps/standalone-chat/node_modules/hast-util-whitespace`
- `apps/standalone-chat/node_modules/hast-util-whitespace/lib`
- `apps/standalone-chat/node_modules/html-url-attributes`
- `apps/standalone-chat/node_modules/html-url-attributes/lib`
- `apps/standalone-chat/node_modules/inline-style-parser`
- `apps/standalone-chat/node_modules/inline-style-parser/cjs`
- `apps/standalone-chat/node_modules/inline-style-parser/dist`
- `apps/standalone-chat/node_modules/inline-style-parser/esm`
- `apps/standalone-chat/node_modules/is-alphabetical`
- `apps/standalone-chat/node_modules/is-alphanumerical`
- `apps/standalone-chat/node_modules/is-binary-path`
- `apps/standalone-chat/node_modules/is-core-module`
- `apps/standalone-chat/node_modules/is-core-module/test`
- `apps/standalone-chat/node_modules/is-decimal`
- `apps/standalone-chat/node_modules/is-extglob`
- `apps/standalone-chat/node_modules/is-glob`
- `apps/standalone-chat/node_modules/is-hexadecimal`
- `apps/standalone-chat/node_modules/is-number`
- `apps/standalone-chat/node_modules/is-plain-obj`
- `apps/standalone-chat/node_modules/jiti`
- `apps/standalone-chat/node_modules/jiti/bin`
- `apps/standalone-chat/node_modules/jiti/dist`
- `apps/standalone-chat/node_modules/jiti/dist/plugins`
- `apps/standalone-chat/node_modules/jiti/lib`
- `apps/standalone-chat/node_modules/js-tokens`
- `apps/standalone-chat/node_modules/jsesc`
- `apps/standalone-chat/node_modules/jsesc/bin`
- `apps/standalone-chat/node_modules/jsesc/man`
- `apps/standalone-chat/node_modules/json5`
- `apps/standalone-chat/node_modules/json5/dist`
- `apps/standalone-chat/node_modules/json5/lib`
- `apps/standalone-chat/node_modules/lilconfig`
- `apps/standalone-chat/node_modules/lilconfig/src`
- `apps/standalone-chat/node_modules/lines-and-columns`
- `apps/standalone-chat/node_modules/lines-and-columns/build`
- `apps/standalone-chat/node_modules/longest-streak`
- `apps/standalone-chat/node_modules/loose-envify`
- `apps/standalone-chat/node_modules/lru-cache`
- `apps/standalone-chat/node_modules/lucide-react`
- `apps/standalone-chat/node_modules/lucide-react/dist`
- `apps/standalone-chat/node_modules/lucide-react/dist/cjs`
- `apps/standalone-chat/node_modules/lucide-react/dist/esm`
- `apps/standalone-chat/node_modules/lucide-react/dist/esm/icons`
- `apps/standalone-chat/node_modules/lucide-react/dist/esm/shared`
- `apps/standalone-chat/node_modules/lucide-react/dist/esm/shared/src`
- `apps/standalone-chat/node_modules/lucide-react/dist/umd`
- `apps/standalone-chat/node_modules/markdown-table`
- `apps/standalone-chat/node_modules/mdast-util-find-and-replace`
- `apps/standalone-chat/node_modules/mdast-util-find-and-replace/lib`
- `apps/standalone-chat/node_modules/mdast-util-find-and-replace/node_modules`
- `apps/standalone-chat/node_modules/mdast-util-find-and-replace/node_modules/escape-string-regexp`
- `apps/standalone-chat/node_modules/mdast-util-from-markdown`
- `apps/standalone-chat/node_modules/mdast-util-from-markdown/dev`
- `apps/standalone-chat/node_modules/mdast-util-from-markdown/dev/lib`
- `apps/standalone-chat/node_modules/mdast-util-from-markdown/lib`
- `apps/standalone-chat/node_modules/mdast-util-gfm`
- `apps/standalone-chat/node_modules/mdast-util-gfm-autolink-literal`
- `apps/standalone-chat/node_modules/mdast-util-gfm-autolink-literal/lib`
- `apps/standalone-chat/node_modules/mdast-util-gfm-footnote`
- `apps/standalone-chat/node_modules/mdast-util-gfm-footnote/lib`
- `apps/standalone-chat/node_modules/mdast-util-gfm-strikethrough`
- `apps/standalone-chat/node_modules/mdast-util-gfm-strikethrough/lib`
- `apps/standalone-chat/node_modules/mdast-util-gfm-table`
- `apps/standalone-chat/node_modules/mdast-util-gfm-table/lib`
- `apps/standalone-chat/node_modules/mdast-util-gfm-task-list-item`
- `apps/standalone-chat/node_modules/mdast-util-gfm-task-list-item/lib`
- `apps/standalone-chat/node_modules/mdast-util-gfm/lib`
- `apps/standalone-chat/node_modules/mdast-util-mdx-expression`
- `apps/standalone-chat/node_modules/mdast-util-mdx-expression/lib`
- `apps/standalone-chat/node_modules/mdast-util-mdx-jsx`
- `apps/standalone-chat/node_modules/mdast-util-mdx-jsx/lib`
- `apps/standalone-chat/node_modules/mdast-util-mdxjs-esm`
- `apps/standalone-chat/node_modules/mdast-util-mdxjs-esm/lib`
- `apps/standalone-chat/node_modules/mdast-util-phrasing`
- `apps/standalone-chat/node_modules/mdast-util-phrasing/lib`
- `apps/standalone-chat/node_modules/mdast-util-to-hast`
- `apps/standalone-chat/node_modules/mdast-util-to-hast/lib`
- `apps/standalone-chat/node_modules/mdast-util-to-hast/lib/handlers`
- `apps/standalone-chat/node_modules/mdast-util-to-markdown`
- `apps/standalone-chat/node_modules/mdast-util-to-markdown/lib`
- `apps/standalone-chat/node_modules/mdast-util-to-markdown/lib/handle`
- `apps/standalone-chat/node_modules/mdast-util-to-markdown/lib/util`
- `apps/standalone-chat/node_modules/mdast-util-to-string`
- `apps/standalone-chat/node_modules/mdast-util-to-string/lib`
- `apps/standalone-chat/node_modules/merge2`
- `apps/standalone-chat/node_modules/micromark`
- `apps/standalone-chat/node_modules/micromark-core-commonmark`
- `apps/standalone-chat/node_modules/micromark-core-commonmark/dev`
- `apps/standalone-chat/node_modules/micromark-core-commonmark/dev/lib`
- `apps/standalone-chat/node_modules/micromark-core-commonmark/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-autolink-literal`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-autolink-literal/dev`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-autolink-literal/dev/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-autolink-literal/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-footnote`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-footnote/dev`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-footnote/dev/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-footnote/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-strikethrough`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-strikethrough/dev`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-strikethrough/dev/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-strikethrough/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-table`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-table/dev`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-table/dev/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-table/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-tagfilter`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-tagfilter/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-task-list-item`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-task-list-item/dev`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-task-list-item/dev/lib`
- `apps/standalone-chat/node_modules/micromark-extension-gfm-task-list-item/lib`
- `apps/standalone-chat/node_modules/micromark-factory-destination`
- `apps/standalone-chat/node_modules/micromark-factory-destination/dev`
- `apps/standalone-chat/node_modules/micromark-factory-label`
- `apps/standalone-chat/node_modules/micromark-factory-label/dev`
- `apps/standalone-chat/node_modules/micromark-factory-space`
- `apps/standalone-chat/node_modules/micromark-factory-space/dev`
- `apps/standalone-chat/node_modules/micromark-factory-title`
- `apps/standalone-chat/node_modules/micromark-factory-title/dev`
- `apps/standalone-chat/node_modules/micromark-factory-whitespace`
- `apps/standalone-chat/node_modules/micromark-factory-whitespace/dev`
- `apps/standalone-chat/node_modules/micromark-util-character`
- `apps/standalone-chat/node_modules/micromark-util-character/dev`
- `apps/standalone-chat/node_modules/micromark-util-chunked`
- `apps/standalone-chat/node_modules/micromark-util-chunked/dev`
- `apps/standalone-chat/node_modules/micromark-util-classify-character`
- `apps/standalone-chat/node_modules/micromark-util-classify-character/dev`
- `apps/standalone-chat/node_modules/micromark-util-combine-extensions`
- `apps/standalone-chat/node_modules/micromark-util-decode-numeric-character-reference`
- `apps/standalone-chat/node_modules/micromark-util-decode-numeric-character-reference/dev`
- `apps/standalone-chat/node_modules/micromark-util-decode-string`
- `apps/standalone-chat/node_modules/micromark-util-decode-string/dev`
- `apps/standalone-chat/node_modules/micromark-util-encode`
- `apps/standalone-chat/node_modules/micromark-util-html-tag-name`
- `apps/standalone-chat/node_modules/micromark-util-normalize-identifier`
- `apps/standalone-chat/node_modules/micromark-util-normalize-identifier/dev`
- `apps/standalone-chat/node_modules/micromark-util-resolve-all`
- `apps/standalone-chat/node_modules/micromark-util-sanitize-uri`
- `apps/standalone-chat/node_modules/micromark-util-sanitize-uri/dev`
- `apps/standalone-chat/node_modules/micromark-util-subtokenize`
- `apps/standalone-chat/node_modules/micromark-util-subtokenize/dev`
- `apps/standalone-chat/node_modules/micromark-util-subtokenize/dev/lib`
- `apps/standalone-chat/node_modules/micromark-util-subtokenize/lib`
- `apps/standalone-chat/node_modules/micromark-util-symbol`
- `apps/standalone-chat/node_modules/micromark-util-symbol/lib`
- `apps/standalone-chat/node_modules/micromark-util-types`
- `apps/standalone-chat/node_modules/micromark/dev`
- `apps/standalone-chat/node_modules/micromark/dev/lib`
- `apps/standalone-chat/node_modules/micromark/dev/lib/initialize`
- `apps/standalone-chat/node_modules/micromark/lib`
- `apps/standalone-chat/node_modules/micromark/lib/initialize`
- `apps/standalone-chat/node_modules/micromatch`
- `apps/standalone-chat/node_modules/ms`
- `apps/standalone-chat/node_modules/mz`
- `apps/standalone-chat/node_modules/nanoid`
- `apps/standalone-chat/node_modules/nanoid/async`
- `apps/standalone-chat/node_modules/nanoid/bin`
- `apps/standalone-chat/node_modules/nanoid/non-secure`
- `apps/standalone-chat/node_modules/nanoid/url-alphabet`
- `apps/standalone-chat/node_modules/node-releases`
- `apps/standalone-chat/node_modules/node-releases/data`
- `apps/standalone-chat/node_modules/node-releases/data/processed`
- `apps/standalone-chat/node_modules/node-releases/data/release-schedule`
- `apps/standalone-chat/node_modules/normalize-path`
- `apps/standalone-chat/node_modules/object-assign`
- `apps/standalone-chat/node_modules/object-hash`
- `apps/standalone-chat/node_modules/object-hash/dist`
- `apps/standalone-chat/node_modules/parse-entities`
- `apps/standalone-chat/node_modules/parse-entities/lib`
- `apps/standalone-chat/node_modules/parse-entities/node_modules`
- `apps/standalone-chat/node_modules/parse-entities/node_modules/@types`
- `apps/standalone-chat/node_modules/parse-entities/node_modules/@types/unist`
- `apps/standalone-chat/node_modules/path-parse`
- `apps/standalone-chat/node_modules/picocolors`
- `apps/standalone-chat/node_modules/picomatch`
- `apps/standalone-chat/node_modules/picomatch/lib`
- `apps/standalone-chat/node_modules/pify`
- `apps/standalone-chat/node_modules/pirates`
- `apps/standalone-chat/node_modules/pirates/lib`
- `apps/standalone-chat/node_modules/postcss`
- `apps/standalone-chat/node_modules/postcss-import`
- `apps/standalone-chat/node_modules/postcss-import/lib`
- `apps/standalone-chat/node_modules/postcss-js`
- `apps/standalone-chat/node_modules/postcss-load-config`
- `apps/standalone-chat/node_modules/postcss-load-config/src`
- `apps/standalone-chat/node_modules/postcss-nested`
- `apps/standalone-chat/node_modules/postcss-selector-parser`
- `apps/standalone-chat/node_modules/postcss-selector-parser/dist`
- `apps/standalone-chat/node_modules/postcss-selector-parser/dist/selectors`
- `apps/standalone-chat/node_modules/postcss-selector-parser/dist/util`
- `apps/standalone-chat/node_modules/postcss-value-parser`
- `apps/standalone-chat/node_modules/postcss-value-parser/lib`
- `apps/standalone-chat/node_modules/postcss/lib`
- `apps/standalone-chat/node_modules/property-information`
- `apps/standalone-chat/node_modules/property-information/lib`
- `apps/standalone-chat/node_modules/property-information/lib/util`
- `apps/standalone-chat/node_modules/queue-microtask`
- `apps/standalone-chat/node_modules/react`
- `apps/standalone-chat/node_modules/react-dom`
- `apps/standalone-chat/node_modules/react-dom/cjs`
- `apps/standalone-chat/node_modules/react-dom/umd`
- `apps/standalone-chat/node_modules/react-markdown`
- `apps/standalone-chat/node_modules/react-markdown/lib`
- `apps/standalone-chat/node_modules/react-refresh`
- `apps/standalone-chat/node_modules/react-refresh/cjs`
- `apps/standalone-chat/node_modules/react/cjs`
- `apps/standalone-chat/node_modules/react/umd`
- `apps/standalone-chat/node_modules/read-cache`
- `apps/standalone-chat/node_modules/readdirp`
- `apps/standalone-chat/node_modules/remark-gfm`
- `apps/standalone-chat/node_modules/remark-gfm/lib`
- `apps/standalone-chat/node_modules/remark-parse`
- `apps/standalone-chat/node_modules/remark-parse/lib`
- `apps/standalone-chat/node_modules/remark-rehype`
- `apps/standalone-chat/node_modules/remark-rehype/lib`
- `apps/standalone-chat/node_modules/remark-stringify`
- `apps/standalone-chat/node_modules/remark-stringify/lib`
- `apps/standalone-chat/node_modules/resolve`
- `apps/standalone-chat/node_modules/resolve/.github`
- `apps/standalone-chat/node_modules/resolve/bin`
- `apps/standalone-chat/node_modules/resolve/example`
- `apps/standalone-chat/node_modules/resolve/lib`
- `apps/standalone-chat/node_modules/resolve/test`
- `apps/standalone-chat/node_modules/resolve/test/dotdot`
- `apps/standalone-chat/node_modules/resolve/test/dotdot/abc`
- `apps/standalone-chat/node_modules/resolve/test/module_dir`
- `apps/standalone-chat/node_modules/resolve/test/module_dir/xmodules`
- `apps/standalone-chat/node_modules/resolve/test/module_dir/xmodules/aaa`
- `apps/standalone-chat/node_modules/resolve/test/module_dir/ymodules`
- `apps/standalone-chat/node_modules/resolve/test/module_dir/ymodules/aaa`
- `apps/standalone-chat/node_modules/resolve/test/module_dir/zmodules`
- `apps/standalone-chat/node_modules/resolve/test/module_dir/zmodules/bbb`
- `apps/standalone-chat/node_modules/resolve/test/node_path`
- `apps/standalone-chat/node_modules/resolve/test/node_path/x`
- `apps/standalone-chat/node_modules/resolve/test/node_path/x/aaa`
- `apps/standalone-chat/node_modules/resolve/test/node_path/x/ccc`
- `apps/standalone-chat/node_modules/resolve/test/node_path/y`
- `apps/standalone-chat/node_modules/resolve/test/node_path/y/bbb`
- `apps/standalone-chat/node_modules/resolve/test/node_path/y/ccc`
- `apps/standalone-chat/node_modules/resolve/test/pathfilter`
- `apps/standalone-chat/node_modules/resolve/test/pathfilter/deep_ref`
- `apps/standalone-chat/node_modules/resolve/test/precedence`
- `apps/standalone-chat/node_modules/resolve/test/precedence/aaa`
- `apps/standalone-chat/node_modules/resolve/test/precedence/bbb`
- `apps/standalone-chat/node_modules/resolve/test/resolver`
- `apps/standalone-chat/node_modules/resolve/test/resolver/baz`
- `apps/standalone-chat/node_modules/resolve/test/resolver/browser_field`
- `apps/standalone-chat/node_modules/resolve/test/resolver/dot_main`
- `apps/standalone-chat/node_modules/resolve/test/resolver/dot_slash_main`
- `apps/standalone-chat/node_modules/resolve/test/resolver/false_main`
- `apps/standalone-chat/node_modules/resolve/test/resolver/incorrect_main`
- `apps/standalone-chat/node_modules/resolve/test/resolver/invalid_main`
- `apps/standalone-chat/node_modules/resolve/test/resolver/multirepo`
- `apps/standalone-chat/node_modules/resolve/test/resolver/multirepo/packages`
- `apps/standalone-chat/node_modules/resolve/test/resolver/multirepo/packages/package-a`
- `apps/standalone-chat/node_modules/resolve/test/resolver/multirepo/packages/package-b`
- `apps/standalone-chat/node_modules/resolve/test/resolver/nested_symlinks`
- `apps/standalone-chat/node_modules/resolve/test/resolver/nested_symlinks/mylib`
- `apps/standalone-chat/node_modules/resolve/test/resolver/other_path`
- `apps/standalone-chat/node_modules/resolve/test/resolver/other_path/lib`
- `apps/standalone-chat/node_modules/resolve/test/resolver/quux`
- `apps/standalone-chat/node_modules/resolve/test/resolver/quux/foo`
- `apps/standalone-chat/node_modules/resolve/test/resolver/same_names`
- `apps/standalone-chat/node_modules/resolve/test/resolver/same_names/foo`
- `apps/standalone-chat/node_modules/resolve/test/resolver/symlinked`
- `apps/standalone-chat/node_modules/resolve/test/resolver/symlinked/_`
- `apps/standalone-chat/node_modules/resolve/test/resolver/symlinked/_/node_modules`
- `apps/standalone-chat/node_modules/resolve/test/resolver/symlinked/_/symlink_target`
- `apps/standalone-chat/node_modules/resolve/test/resolver/symlinked/package`
- `apps/standalone-chat/node_modules/resolve/test/resolver/without_basedir`
- `apps/standalone-chat/node_modules/resolve/test/shadowed_core`
- `apps/standalone-chat/node_modules/resolve/test/shadowed_core/node_modules`
- `apps/standalone-chat/node_modules/resolve/test/shadowed_core/node_modules/util`
- `apps/standalone-chat/node_modules/reusify`
- `apps/standalone-chat/node_modules/reusify/.github`
- `apps/standalone-chat/node_modules/reusify/.github/workflows`
- `apps/standalone-chat/node_modules/reusify/benchmarks`
- `apps/standalone-chat/node_modules/rollup`
- `apps/standalone-chat/node_modules/rollup/dist`
- `apps/standalone-chat/node_modules/rollup/dist/bin`
- `apps/standalone-chat/node_modules/rollup/dist/es`
- `apps/standalone-chat/node_modules/rollup/dist/es/shared`
- `apps/standalone-chat/node_modules/rollup/dist/shared`
- `apps/standalone-chat/node_modules/run-parallel`
- `apps/standalone-chat/node_modules/scheduler`
- `apps/standalone-chat/node_modules/scheduler/cjs`
- `apps/standalone-chat/node_modules/scheduler/umd`
- `apps/standalone-chat/node_modules/semver`
- `apps/standalone-chat/node_modules/semver/bin`
- `apps/standalone-chat/node_modules/source-map-js`
- `apps/standalone-chat/node_modules/source-map-js/lib`
- `apps/standalone-chat/node_modules/space-separated-tokens`
- `apps/standalone-chat/node_modules/stringify-entities`
- `apps/standalone-chat/node_modules/stringify-entities/lib`
- `apps/standalone-chat/node_modules/stringify-entities/lib/constant`
- `apps/standalone-chat/node_modules/stringify-entities/lib/util`
- `apps/standalone-chat/node_modules/style-to-js`
- `apps/standalone-chat/node_modules/style-to-js/cjs`
- `apps/standalone-chat/node_modules/style-to-js/src`
- `apps/standalone-chat/node_modules/style-to-js/umd`
- `apps/standalone-chat/node_modules/style-to-object`
- `apps/standalone-chat/node_modules/style-to-object/cjs`
- `apps/standalone-chat/node_modules/style-to-object/dist`
- `apps/standalone-chat/node_modules/style-to-object/esm`
- `apps/standalone-chat/node_modules/style-to-object/src`
- `apps/standalone-chat/node_modules/sucrase`
- `apps/standalone-chat/node_modules/sucrase/bin`
- `apps/standalone-chat/node_modules/sucrase/dist`
- `apps/standalone-chat/node_modules/sucrase/dist/esm`
- `apps/standalone-chat/node_modules/sucrase/dist/esm/parser`
- `apps/standalone-chat/node_modules/sucrase/dist/esm/parser/plugins`
- `apps/standalone-chat/node_modules/sucrase/dist/esm/parser/plugins/jsx`
- `apps/standalone-chat/node_modules/sucrase/dist/esm/parser/tokenizer`
- `apps/standalone-chat/node_modules/sucrase/dist/esm/parser/traverser`
- `apps/standalone-chat/node_modules/sucrase/dist/esm/parser/util`
- `apps/standalone-chat/node_modules/sucrase/dist/esm/transformers`
- `apps/standalone-chat/node_modules/sucrase/dist/esm/util`
- `apps/standalone-chat/node_modules/sucrase/dist/parser`
- `apps/standalone-chat/node_modules/sucrase/dist/parser/plugins`
- `apps/standalone-chat/node_modules/sucrase/dist/parser/plugins/jsx`
- `apps/standalone-chat/node_modules/sucrase/dist/parser/tokenizer`
- `apps/standalone-chat/node_modules/sucrase/dist/parser/traverser`
- `apps/standalone-chat/node_modules/sucrase/dist/parser/util`
- `apps/standalone-chat/node_modules/sucrase/dist/transformers`
- `apps/standalone-chat/node_modules/sucrase/dist/types`
- `apps/standalone-chat/node_modules/sucrase/dist/types/parser`
- `apps/standalone-chat/node_modules/sucrase/dist/types/parser/plugins`
- `apps/standalone-chat/node_modules/sucrase/dist/types/parser/plugins/jsx`
- `apps/standalone-chat/node_modules/sucrase/dist/types/parser/tokenizer`
- `apps/standalone-chat/node_modules/sucrase/dist/types/parser/traverser`
- `apps/standalone-chat/node_modules/sucrase/dist/types/parser/util`
- `apps/standalone-chat/node_modules/sucrase/dist/types/transformers`
- `apps/standalone-chat/node_modules/sucrase/dist/types/util`
- `apps/standalone-chat/node_modules/sucrase/dist/util`
- `apps/standalone-chat/node_modules/sucrase/register`
- `apps/standalone-chat/node_modules/sucrase/ts-node-plugin`
- `apps/standalone-chat/node_modules/supports-preserve-symlinks-flag`
- `apps/standalone-chat/node_modules/supports-preserve-symlinks-flag/.github`
- `apps/standalone-chat/node_modules/supports-preserve-symlinks-flag/test`
- `apps/standalone-chat/node_modules/tailwindcss`
- `apps/standalone-chat/node_modules/tailwindcss/lib`
- `apps/standalone-chat/node_modules/tailwindcss/lib/cli`
- `apps/standalone-chat/node_modules/tailwindcss/lib/cli/build`
- `apps/standalone-chat/node_modules/tailwindcss/lib/cli/help`
- `apps/standalone-chat/node_modules/tailwindcss/lib/cli/init`
- `apps/standalone-chat/node_modules/tailwindcss/lib/css`
- `apps/standalone-chat/node_modules/tailwindcss/lib/lib`
- `apps/standalone-chat/node_modules/tailwindcss/lib/postcss-plugins`
- `apps/standalone-chat/node_modules/tailwindcss/lib/postcss-plugins/nesting`
- `apps/standalone-chat/node_modules/tailwindcss/lib/public`
- `apps/standalone-chat/node_modules/tailwindcss/lib/util`
- `apps/standalone-chat/node_modules/tailwindcss/lib/value-parser`
- `apps/standalone-chat/node_modules/tailwindcss/nesting`
- `apps/standalone-chat/node_modules/tailwindcss/peers`
- `apps/standalone-chat/node_modules/tailwindcss/scripts`
- `apps/standalone-chat/node_modules/tailwindcss/src`
- `apps/standalone-chat/node_modules/tailwindcss/src/cli`
- `apps/standalone-chat/node_modules/tailwindcss/src/cli/build`
- `apps/standalone-chat/node_modules/tailwindcss/src/cli/help`
- `apps/standalone-chat/node_modules/tailwindcss/src/cli/init`
- `apps/standalone-chat/node_modules/tailwindcss/src/css`
- `apps/standalone-chat/node_modules/tailwindcss/src/lib`
- `apps/standalone-chat/node_modules/tailwindcss/src/postcss-plugins`
- `apps/standalone-chat/node_modules/tailwindcss/src/postcss-plugins/nesting`
- `apps/standalone-chat/node_modules/tailwindcss/src/public`
- `apps/standalone-chat/node_modules/tailwindcss/src/util`
- `apps/standalone-chat/node_modules/tailwindcss/src/value-parser`
- `apps/standalone-chat/node_modules/tailwindcss/stubs`
- `apps/standalone-chat/node_modules/tailwindcss/types`
- `apps/standalone-chat/node_modules/tailwindcss/types/generated`
- `apps/standalone-chat/node_modules/thenify`
- `apps/standalone-chat/node_modules/thenify-all`
- `apps/standalone-chat/node_modules/tinyglobby`
- `apps/standalone-chat/node_modules/tinyglobby/dist`
- `apps/standalone-chat/node_modules/tinyglobby/node_modules`
- `apps/standalone-chat/node_modules/tinyglobby/node_modules/fdir`
- `apps/standalone-chat/node_modules/tinyglobby/node_modules/fdir/dist`
- `apps/standalone-chat/node_modules/tinyglobby/node_modules/picomatch`
- `apps/standalone-chat/node_modules/tinyglobby/node_modules/picomatch/lib`
- `apps/standalone-chat/node_modules/to-regex-range`
- `apps/standalone-chat/node_modules/trim-lines`
- `apps/standalone-chat/node_modules/trough`
- `apps/standalone-chat/node_modules/trough/lib`
- `apps/standalone-chat/node_modules/ts-interface-checker`
- `apps/standalone-chat/node_modules/ts-interface-checker/dist`
- `apps/standalone-chat/node_modules/typescript`
- `apps/standalone-chat/node_modules/typescript/bin`
- `apps/standalone-chat/node_modules/typescript/lib`
- `apps/standalone-chat/node_modules/typescript/lib/cs`
- `apps/standalone-chat/node_modules/typescript/lib/de`
- `apps/standalone-chat/node_modules/typescript/lib/es`
- `apps/standalone-chat/node_modules/typescript/lib/fr`
- `apps/standalone-chat/node_modules/typescript/lib/it`
- `apps/standalone-chat/node_modules/typescript/lib/ja`
- `apps/standalone-chat/node_modules/typescript/lib/ko`
- `apps/standalone-chat/node_modules/typescript/lib/pl`
- `apps/standalone-chat/node_modules/typescript/lib/pt-br`
- `apps/standalone-chat/node_modules/typescript/lib/ru`
- `apps/standalone-chat/node_modules/typescript/lib/tr`
- `apps/standalone-chat/node_modules/typescript/lib/zh-cn`
- `apps/standalone-chat/node_modules/typescript/lib/zh-tw`
- `apps/standalone-chat/node_modules/unified`
- `apps/standalone-chat/node_modules/unified/lib`
- `apps/standalone-chat/node_modules/unist-util-is`
- `apps/standalone-chat/node_modules/unist-util-is/lib`
- `apps/standalone-chat/node_modules/unist-util-position`
- `apps/standalone-chat/node_modules/unist-util-position/lib`
- `apps/standalone-chat/node_modules/unist-util-stringify-position`
- `apps/standalone-chat/node_modules/unist-util-stringify-position/lib`
- `apps/standalone-chat/node_modules/unist-util-visit`
- `apps/standalone-chat/node_modules/unist-util-visit-parents`
- `apps/standalone-chat/node_modules/unist-util-visit-parents/lib`
- `apps/standalone-chat/node_modules/unist-util-visit/lib`
- `apps/standalone-chat/node_modules/update-browserslist-db`
- `apps/standalone-chat/node_modules/util-deprecate`
- `apps/standalone-chat/node_modules/vfile`
- `apps/standalone-chat/node_modules/vfile-message`
- `apps/standalone-chat/node_modules/vfile-message/lib`
- `apps/standalone-chat/node_modules/vfile/lib`
- `apps/standalone-chat/node_modules/vite`
- `apps/standalone-chat/node_modules/vite/bin`
- `apps/standalone-chat/node_modules/vite/dist`
- `apps/standalone-chat/node_modules/vite/dist/client`
- `apps/standalone-chat/node_modules/vite/dist/node`
- `apps/standalone-chat/node_modules/vite/dist/node-cjs`
- `apps/standalone-chat/node_modules/vite/dist/node/chunks`
- `apps/standalone-chat/node_modules/vite/misc`
- `apps/standalone-chat/node_modules/vite/node_modules`
- `apps/standalone-chat/node_modules/vite/node_modules/.bin`
- `apps/standalone-chat/node_modules/vite/node_modules/@esbuild`
- `apps/standalone-chat/node_modules/vite/node_modules/@esbuild/linux-x64`
- `apps/standalone-chat/node_modules/vite/node_modules/@esbuild/linux-x64/bin`
- `apps/standalone-chat/node_modules/vite/node_modules/esbuild`
- `apps/standalone-chat/node_modules/vite/node_modules/esbuild/bin`
- `apps/standalone-chat/node_modules/vite/node_modules/esbuild/lib`
- `apps/standalone-chat/node_modules/vite/node_modules/fdir`
- `apps/standalone-chat/node_modules/vite/node_modules/fdir/dist`
- `apps/standalone-chat/node_modules/vite/node_modules/picomatch`
- `apps/standalone-chat/node_modules/vite/node_modules/picomatch/lib`
- `apps/standalone-chat/node_modules/vite/types`
- `apps/standalone-chat/node_modules/vite/types/internal`
- `apps/standalone-chat/node_modules/yallist`
- `apps/standalone-chat/node_modules/zwitch`
- `apps/standalone-chat/server`
- `apps/standalone-chat/src`
- `apps/standalone-chat/src/components`

### Extension Packages

- `extensions/acpx`
- `extensions/bluebubbles`
- `extensions/copilot-proxy`
- `extensions/device-pair`
- `extensions/diagnostics-otel`
- `extensions/discord`
- `extensions/feishu`
- `extensions/google-gemini-cli-auth`
- `extensions/googlechat`
- `extensions/imessage`
- `extensions/irc`
- `extensions/line`
- `extensions/llm-task`
- `extensions/lobster`
- `extensions/matrix`
- `extensions/mattermost`
- `extensions/memory-core`
- `extensions/memory-lancedb`
- `extensions/minimax-portal-auth`
- `extensions/msteams`
- `extensions/nextcloud-talk`
- `extensions/nostr`
- `extensions/open-prose`
- `extensions/phone-control`
- `extensions/qwen-portal-auth`
- `extensions/shared`
- `extensions/signal`
- `extensions/slack`
- `extensions/synology-chat`
- `extensions/talk-voice`
- `extensions/telegram`
- `extensions/test-utils`
- `extensions/thread-ownership`
- `extensions/tlon`
- `extensions/twitch`
- `extensions/voice-call`
- `extensions/whatsapp`
- `extensions/zalo`
- `extensions/zalouser`

### Full Source Directory Appendix

```text
src/acp
src/acp/control-plane
src/acp/runtime
src/agents
src/agents/auth-profiles
src/agents/cli-runner
src/agents/pi-embedded-helpers
src/agents/pi-embedded-runner
src/agents/pi-embedded-runner/run
src/agents/pi-extensions
src/agents/pi-extensions/context-pruning
src/agents/sandbox
src/agents/schema
src/agents/skills
src/agents/test-helpers
src/agents/tools
src/auto-reply
src/auto-reply/reply
src/auto-reply/reply/commands-acp
src/auto-reply/reply/commands-subagents
src/auto-reply/reply/exec
src/auto-reply/reply/export-html
src/auto-reply/reply/export-html/vendor
src/auto-reply/reply/queue
src/browser
src/browser/routes
src/canvas-host
src/canvas-host/a2ui
src/channels
src/channels/allowlists
src/channels/plugins
src/channels/plugins/actions
src/channels/plugins/actions/discord
src/channels/plugins/agent-tools
src/channels/plugins/normalize
src/channels/plugins/onboarding
src/channels/plugins/outbound
src/channels/plugins/status-issues
src/channels/telegram
src/channels/web
src/chat-server
src/cli
src/cli/browser-cli-actions-input
src/cli/cron-cli
src/cli/daemon-cli
src/cli/gateway-cli
src/cli/node-cli
src/cli/nodes-cli
src/cli/program
src/cli/program/message
src/cli/shared
src/cli/update-cli
src/commands
src/commands/agent
src/commands/channels
src/commands/gateway-status
src/commands/models
src/commands/onboard-non-interactive
src/commands/onboard-non-interactive/local
src/commands/onboarding
src/commands/onboarding/__tests__
src/commands/status-all
src/compat
src/config
src/config/sessions
src/cron
src/cron/isolated-agent
src/cron/service
src/daemon
src/discord
src/discord/monitor
src/discord/voice
src/docs
src/gateway
src/gateway/protocol
src/gateway/protocol/schema
src/gateway/server
src/gateway/server-methods
src/gateway/server/__tests__
src/gateway/server/ws-connection
src/hooks
src/hooks/bundled
src/hooks/bundled/boot-md
src/hooks/bundled/bootstrap-extra-files
src/hooks/bundled/command-logger
src/hooks/bundled/session-memory
src/imessage
src/imessage/monitor
src/infra
src/infra/format-time
src/infra/net
src/infra/outbound
src/infra/tls
src/line
src/line/flex-templates
src/link-understanding
src/logging
src/markdown
src/media
src/media-understanding
src/media-understanding/providers
src/media-understanding/providers/anthropic
src/media-understanding/providers/deepgram
src/media-understanding/providers/google
src/media-understanding/providers/groq
src/media-understanding/providers/minimax
src/media-understanding/providers/mistral
src/media-understanding/providers/moonshot
src/media-understanding/providers/openai
src/media-understanding/providers/zai
src/memory
src/node-host
src/pairing
src/plugin-sdk
src/plugins
src/plugins/runtime
src/process
src/process/supervisor
src/process/supervisor/adapters
src/providers
src/routing
src/scripts
src/secrets
src/security
src/sessions
src/shared
src/shared/net
src/shared/text
src/signal
src/signal/monitor
src/slack
src/slack/http
src/slack/monitor
src/slack/monitor/events
src/slack/monitor/message-handler
src/telegram
src/telegram/bot
src/terminal
src/test-helpers
src/test-utils
src/tts
src/tui
src/tui/components
src/tui/theme
src/types
src/utils
src/web
src/web/auto-reply
src/web/auto-reply/monitor
src/web/inbound
src/whatsapp
src/wizard
```

## Code Explanation Coverage Map

```text
src/acp/client.test.ts
src/acp/client.ts
src/acp/commands.ts
src/acp/control-plane/manager.core.ts
src/acp/control-plane/manager.identity-reconcile.ts
src/acp/control-plane/manager.runtime-controls.ts
src/acp/control-plane/manager.test.ts
src/acp/control-plane/manager.ts
src/acp/control-plane/manager.types.ts
src/acp/control-plane/manager.utils.ts
src/acp/control-plane/runtime-cache.test.ts
src/acp/control-plane/runtime-cache.ts
src/acp/control-plane/runtime-options.ts
src/acp/control-plane/session-actor-queue.ts
src/acp/control-plane/spawn.ts
src/acp/event-mapper.ts
src/acp/meta.ts
src/acp/policy.test.ts
src/acp/policy.ts
src/acp/runtime/adapter-contract.testkit.ts
src/acp/runtime/error-text.test.ts
src/acp/runtime/error-text.ts
src/acp/runtime/errors.test.ts
src/acp/runtime/errors.ts
src/acp/runtime/registry.test.ts
src/acp/runtime/registry.ts
src/acp/runtime/session-identifiers.test.ts
src/acp/runtime/session-identifiers.ts
src/acp/runtime/session-identity.ts
src/acp/runtime/session-meta.ts
src/acp/runtime/types.ts
src/acp/secret-file.ts
src/acp/server.startup.test.ts
src/acp/server.ts
src/acp/session-mapper.test.ts
src/acp/session-mapper.ts
src/acp/session.test.ts
src/acp/session.ts
src/acp/translator.prompt-prefix.test.ts
src/acp/translator.session-rate-limit.test.ts
src/acp/translator.test-helpers.ts
src/acp/translator.ts
src/acp/types.ts
src/agents/acp-binding-architecture.guardrail.test.ts
src/agents/acp-spawn.test.ts
src/agents/acp-spawn.ts
src/agents/agent-paths.test.ts
src/agents/agent-paths.ts
src/agents/agent-scope.test.ts
src/agents/agent-scope.ts
src/agents/announce-idempotency.ts
src/agents/anthropic-payload-log.ts
src/agents/anthropic.setup-token.live.test.ts
src/agents/api-key-rotation.ts
src/agents/apply-patch-update.ts
src/agents/apply-patch.test.ts
src/agents/apply-patch.ts
src/agents/auth-health.test.ts
src/agents/auth-health.ts
src/agents/auth-profiles.chutes.test.ts
src/agents/auth-profiles.cooldown-auto-expiry.test.ts
src/agents/auth-profiles.ensureauthprofilestore.test.ts
src/agents/auth-profiles.getsoonestcooldownexpiry.test.ts
src/agents/auth-profiles.markauthprofilefailure.test.ts
src/agents/auth-profiles.readonly-sync.test.ts
src/agents/auth-profiles.resolve-auth-profile-order.does-not-prioritize-lastgood-round-robin-ordering.test.ts
src/agents/auth-profiles.resolve-auth-profile-order.fixtures.ts
src/agents/auth-profiles.resolve-auth-profile-order.normalizes-z-ai-aliases-auth-order.test.ts
src/agents/auth-profiles.resolve-auth-profile-order.orders-by-lastused-no-explicit-order-exists.test.ts
src/agents/auth-profiles.resolve-auth-profile-order.uses-stored-profiles-no-config-exists.test.ts
src/agents/auth-profiles.runtime-snapshot-save.test.ts
src/agents/auth-profiles.store.save.test.ts
src/agents/auth-profiles.ts
src/agents/auth-profiles/constants.ts
src/agents/auth-profiles/display.ts
src/agents/auth-profiles/doctor.ts
src/agents/auth-profiles/external-cli-sync.ts
src/agents/auth-profiles/oauth.fallback-to-main-agent.test.ts
src/agents/auth-profiles/oauth.test.ts
src/agents/auth-profiles/oauth.ts
src/agents/auth-profiles/order.ts
src/agents/auth-profiles/paths.ts
src/agents/auth-profiles/profiles.ts
src/agents/auth-profiles/repair.ts
src/agents/auth-profiles/session-override.test.ts
src/agents/auth-profiles/session-override.ts
src/agents/auth-profiles/store.ts
src/agents/auth-profiles/types.ts
src/agents/auth-profiles/usage.test.ts
src/agents/auth-profiles/usage.ts
src/agents/bash-process-registry.test-helpers.ts
src/agents/bash-process-registry.test.ts
src/agents/bash-process-registry.ts
src/agents/bash-tools.build-docker-exec-args.test.ts
src/agents/bash-tools.exec-approval-request.test.ts
src/agents/bash-tools.exec-approval-request.ts
src/agents/bash-tools.exec-host-gateway.ts
src/agents/bash-tools.exec-host-node.ts
src/agents/bash-tools.exec-runtime.ts
src/agents/bash-tools.exec-types.ts
src/agents/bash-tools.exec.approval-id.test.ts
src/agents/bash-tools.exec.background-abort.test.ts
src/agents/bash-tools.exec.path.test.ts
src/agents/bash-tools.exec.pty-cleanup.test.ts
src/agents/bash-tools.exec.pty-fallback-failure.test.ts
src/agents/bash-tools.exec.pty-fallback.test.ts
src/agents/bash-tools.exec.pty.test.ts
src/agents/bash-tools.exec.script-preflight.test.ts
src/agents/bash-tools.exec.ts
src/agents/bash-tools.process.poll-timeout.test.ts
src/agents/bash-tools.process.send-keys.test.ts
src/agents/bash-tools.process.supervisor.test.ts
src/agents/bash-tools.process.ts
src/agents/bash-tools.shared.ts
src/agents/bash-tools.test.ts
src/agents/bash-tools.ts
src/agents/bedrock-discovery.test.ts
src/agents/bedrock-discovery.ts
src/agents/bootstrap-cache.test.ts
src/agents/bootstrap-cache.ts
src/agents/bootstrap-files.test.ts
src/agents/bootstrap-files.ts
src/agents/bootstrap-hooks.test.ts
src/agents/bootstrap-hooks.ts
src/agents/builtins.ts
src/agents/byteplus-models.ts
src/agents/byteplus.live.test.ts
src/agents/cache-trace.test.ts
src/agents/cache-trace.ts
src/agents/channel-tools.test.ts
src/agents/channel-tools.ts
src/agents/chutes-oauth.flow.test.ts
src/agents/chutes-oauth.test.ts
src/agents/chutes-oauth.ts
src/agents/claude-cli-runner.test.ts
src/agents/claude-cli-runner.ts
src/agents/cli-backends.test.ts
src/agents/cli-backends.ts
src/agents/cli-credentials.test.ts
src/agents/cli-credentials.ts
src/agents/cli-runner.test.ts
src/agents/cli-runner.ts
src/agents/cli-runner/helpers.ts
src/agents/cli-runner/reliability.ts
src/agents/cli-session.ts
src/agents/cli-watchdog-defaults.ts
src/agents/cloudflare-ai-gateway.ts
src/agents/command-poll-backoff.test.ts
src/agents/command-poll-backoff.ts
src/agents/compaction.retry.test.ts
src/agents/compaction.test.ts
src/agents/compaction.token-sanitize.test.ts
src/agents/compaction.tool-result-details.test.ts
src/agents/compaction.ts
src/agents/content-blocks.test.ts
src/agents/content-blocks.ts
src/agents/context-window-guard.test.ts
src/agents/context-window-guard.ts
src/agents/context.test.ts
src/agents/context.ts
src/agents/current-time.ts
src/agents/date-time.ts
src/agents/defaults.ts
src/agents/docs-path.ts
src/agents/doubao-models.ts
src/agents/failover-error.test.ts
src/agents/failover-error.ts
src/agents/glob-pattern.ts
src/agents/google-gemini-switch.live.test.ts
src/agents/huggingface-models.test.ts
src/agents/huggingface-models.ts
src/agents/identity-avatar.test.ts
src/agents/identity-avatar.ts
src/agents/identity-file.test.ts
src/agents/identity-file.ts
src/agents/identity.human-delay.test.ts
src/agents/identity.per-channel-prefix.test.ts
src/agents/identity.test.ts
src/agents/identity.ts
src/agents/image-sanitization.test.ts
src/agents/image-sanitization.ts
src/agents/lanes.ts
src/agents/live-auth-keys.ts
src/agents/live-model-filter.ts
src/agents/memory-search.test.ts
src/agents/memory-search.ts
src/agents/minimax-vlm.normalizes-api-key.test.ts
src/agents/minimax-vlm.ts
src/agents/minimax.live.test.ts
src/agents/model-alias-lines.ts
src/agents/model-auth-label.test.ts
src/agents/model-auth-label.ts
src/agents/model-auth.profiles.test.ts
src/agents/model-auth.test.ts
src/agents/model-auth.ts
src/agents/model-catalog.test-harness.ts
src/agents/model-catalog.test.ts
src/agents/model-catalog.ts
src/agents/model-compat.test.ts
src/agents/model-compat.ts
src/agents/model-fallback.probe.test.ts
src/agents/model-fallback.test.ts
src/agents/model-fallback.ts
src/agents/model-forward-compat.ts
src/agents/model-ref-profile.test.ts
src/agents/model-ref-profile.ts
src/agents/model-scan.test.ts
src/agents/model-scan.ts
src/agents/model-selection.test.ts
src/agents/model-selection.ts
src/agents/models-config.auto-injects-github-copilot-provider-token-is.test.ts
src/agents/models-config.e2e-harness.ts
src/agents/models-config.falls-back-default-baseurl-token-exchange-fails.test.ts
src/agents/models-config.fills-missing-provider-apikey-from-env-var.test.ts
src/agents/models-config.normalizes-gemini-3-ids-preview-google-providers.test.ts
src/agents/models-config.preserves-explicit-reasoning-override.test.ts
src/agents/models-config.providers.kilocode.test.ts
src/agents/models-config.providers.kimi-coding.test.ts
src/agents/models-config.providers.nvidia.test.ts
src/agents/models-config.providers.ollama.test.ts
src/agents/models-config.providers.qianfan.test.ts
src/agents/models-config.providers.ts
src/agents/models-config.providers.volcengine-byteplus.test.ts
src/agents/models-config.skips-writing-models-json-no-env-token.test.ts
src/agents/models-config.test-utils.ts
src/agents/models-config.ts
src/agents/models-config.uses-first-github-copilot-profile-env-tokens.test.ts
src/agents/models.profiles.live.test.ts
src/agents/moonshot.live.test.ts
src/agents/ollama-stream.test.ts
src/agents/ollama-stream.ts
src/agents/openai-responses.reasoning-replay.test.ts
src/agents/traversalai-gateway-tool.test.ts
src/agents/traversalai-tools.agents.test.ts
src/agents/traversalai-tools.camera.test.ts
src/agents/traversalai-tools.session-status.test.ts
src/agents/traversalai-tools.sessions-visibility.test.ts
src/agents/traversalai-tools.sessions.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn-applies-thinking-default.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn-default-timeout-absent.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn-default-timeout.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn-depth-limits.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn.allowlist.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn.cron-note.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn.lifecycle.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn.model.test.ts
src/agents/traversalai-tools.subagents.sessions-spawn.test-harness.ts
src/agents/traversalai-tools.subagents.steer-failure-clears-suppression.test.ts
src/agents/traversalai-tools.subagents.test-harness.ts
src/agents/traversalai-tools.ts
src/agents/opencode-zen-models.test.ts
src/agents/opencode-zen-models.ts
src/agents/owner-display.test.ts
src/agents/owner-display.ts
src/agents/pi-auth-credentials.ts
src/agents/pi-auth-json.test.ts
src/agents/pi-auth-json.ts
src/agents/pi-embedded-block-chunker.test.ts
src/agents/pi-embedded-block-chunker.ts
src/agents/pi-embedded-helpers.buildbootstrapcontextfiles.test.ts
src/agents/pi-embedded-helpers.formatassistanterrortext.test.ts
src/agents/pi-embedded-helpers.isbillingerrormessage.test.ts
src/agents/pi-embedded-helpers.sanitize-session-messages-images.removes-empty-assistant-text-blocks-but-preserves.test.ts
src/agents/pi-embedded-helpers.sanitizeuserfacingtext.test.ts
src/agents/pi-embedded-helpers.ts
src/agents/pi-embedded-helpers.validate-turns.test.ts
src/agents/pi-embedded-helpers/bootstrap.ts
src/agents/pi-embedded-helpers/errors.ts
src/agents/pi-embedded-helpers/google.ts
src/agents/pi-embedded-helpers/images.ts
src/agents/pi-embedded-helpers/messaging-dedupe.ts
src/agents/pi-embedded-helpers/openai.ts
src/agents/pi-embedded-helpers/thinking.ts
src/agents/pi-embedded-helpers/turns.ts
src/agents/pi-embedded-helpers/types.ts
src/agents/pi-embedded-messaging.ts
src/agents/pi-embedded-payloads.ts
src/agents/pi-embedded-runner-extraparams.live.test.ts
src/agents/pi-embedded-runner-extraparams.test.ts
src/agents/pi-embedded-runner.applygoogleturnorderingfix.test.ts
src/agents/pi-embedded-runner.buildembeddedsandboxinfo.test.ts
src/agents/pi-embedded-runner.compaction-safety-timeout.test.ts
src/agents/pi-embedded-runner.createsystempromptoverride.test.ts
src/agents/pi-embedded-runner.get-dm-history-limit-from-session-key.falls-back-provider-default-per-dm-not.test.ts
src/agents/pi-embedded-runner.get-dm-history-limit-from-session-key.returns-undefined-sessionkey-is-undefined.test.ts
src/agents/pi-embedded-runner.guard.test.ts
src/agents/pi-embedded-runner.guard.waitforidle-before-flush.test.ts
src/agents/pi-embedded-runner.history-limit-from-session-key.test.ts
src/agents/pi-embedded-runner.limithistoryturns.test.ts
src/agents/pi-embedded-runner.openai-tool-id-preservation.test.ts
src/agents/pi-embedded-runner.resolvesessionagentids.test.ts
src/agents/pi-embedded-runner.run-embedded-pi-agent.auth-profile-rotation.test.ts
src/agents/pi-embedded-runner.sanitize-session-history.policy.test.ts
src/agents/pi-embedded-runner.sanitize-session-history.test-harness.ts
src/agents/pi-embedded-runner.sanitize-session-history.test.ts
src/agents/pi-embedded-runner.splitsdktools.test.ts
src/agents/pi-embedded-runner.test.ts
src/agents/pi-embedded-runner.ts
src/agents/pi-embedded-runner/abort.ts
src/agents/pi-embedded-runner/cache-ttl.test.ts
src/agents/pi-embedded-runner/cache-ttl.ts
src/agents/pi-embedded-runner/compact.ts
src/agents/pi-embedded-runner/compaction-safety-timeout.ts
src/agents/pi-embedded-runner/extensions.ts
src/agents/pi-embedded-runner/extra-params.cache-retention-default.test.ts
src/agents/pi-embedded-runner/extra-params.openrouter-cache-control.test.ts
src/agents/pi-embedded-runner/extra-params.ts
src/agents/pi-embedded-runner/extra-params.zai-tool-stream.test.ts
src/agents/pi-embedded-runner/google.test.ts
src/agents/pi-embedded-runner/google.ts
src/agents/pi-embedded-runner/history.ts
src/agents/pi-embedded-runner/kilocode.test.ts
src/agents/pi-embedded-runner/lanes.ts
src/agents/pi-embedded-runner/logger.ts
src/agents/pi-embedded-runner/model.forward-compat.test.ts
src/agents/pi-embedded-runner/model.test-harness.ts
src/agents/pi-embedded-runner/model.test.ts
src/agents/pi-embedded-runner/model.ts
src/agents/pi-embedded-runner/run.overflow-compaction.fixture.ts
src/agents/pi-embedded-runner/run.overflow-compaction.loop.test.ts
src/agents/pi-embedded-runner/run.overflow-compaction.mocks.shared.ts
src/agents/pi-embedded-runner/run.overflow-compaction.shared-test.ts
src/agents/pi-embedded-runner/run.overflow-compaction.test.ts
src/agents/pi-embedded-runner/run.ts
src/agents/pi-embedded-runner/run/attempt.test.ts
src/agents/pi-embedded-runner/run/attempt.ts
src/agents/pi-embedded-runner/run/compaction-timeout.test.ts
src/agents/pi-embedded-runner/run/compaction-timeout.ts
src/agents/pi-embedded-runner/run/history-image-prune.test.ts
src/agents/pi-embedded-runner/run/history-image-prune.ts
src/agents/pi-embedded-runner/run/images.test.ts
src/agents/pi-embedded-runner/run/images.ts
src/agents/pi-embedded-runner/run/params.ts
src/agents/pi-embedded-runner/run/payloads.errors.test.ts
src/agents/pi-embedded-runner/run/payloads.test-helpers.ts
src/agents/pi-embedded-runner/run/payloads.test.ts
src/agents/pi-embedded-runner/run/payloads.ts
src/agents/pi-embedded-runner/run/types.ts
src/agents/pi-embedded-runner/runs.ts
src/agents/pi-embedded-runner/sandbox-info.ts
src/agents/pi-embedded-runner/sanitize-session-history.tool-result-details.test.ts
src/agents/pi-embedded-runner/session-manager-cache.ts
src/agents/pi-embedded-runner/session-manager-init.ts
src/agents/pi-embedded-runner/system-prompt.test.ts
src/agents/pi-embedded-runner/system-prompt.ts
src/agents/pi-embedded-runner/thinking.test.ts
src/agents/pi-embedded-runner/thinking.ts
src/agents/pi-embedded-runner/tool-name-allowlist.ts
src/agents/pi-embedded-runner/tool-result-context-guard.test.ts
src/agents/pi-embedded-runner/tool-result-context-guard.ts
src/agents/pi-embedded-runner/tool-result-truncation.test.ts
src/agents/pi-embedded-runner/tool-result-truncation.ts
src/agents/pi-embedded-runner/tool-split.ts
src/agents/pi-embedded-runner/types.ts
src/agents/pi-embedded-runner/usage-reporting.test.ts
src/agents/pi-embedded-runner/utils.ts
src/agents/pi-embedded-runner/wait-for-idle-before-flush.ts
src/agents/pi-embedded-subscribe.code-span-awareness.test.ts
src/agents/pi-embedded-subscribe.e2e-harness.ts
src/agents/pi-embedded-subscribe.handlers.compaction.ts
src/agents/pi-embedded-subscribe.handlers.lifecycle.test.ts
src/agents/pi-embedded-subscribe.handlers.lifecycle.ts
src/agents/pi-embedded-subscribe.handlers.messages.test.ts
src/agents/pi-embedded-subscribe.handlers.messages.ts
src/agents/pi-embedded-subscribe.handlers.tools.media.test.ts
src/agents/pi-embedded-subscribe.handlers.tools.test.ts
src/agents/pi-embedded-subscribe.handlers.tools.ts
src/agents/pi-embedded-subscribe.handlers.ts
src/agents/pi-embedded-subscribe.handlers.types.ts
src/agents/pi-embedded-subscribe.lifecycle-billing-error.test.ts
src/agents/pi-embedded-subscribe.raw-stream.ts
src/agents/pi-embedded-subscribe.reply-tags.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.calls-onblockreplyflush-before-tool-execution-start-preserve.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-append-text-end-content-is.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-call-onblockreplyflush-callback-is-not.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-duplicate-text-end-repeats-full.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.does-not-emit-duplicate-block-replies-text.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.emits-block-replies-text-end-does-not.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.emits-reasoning-as-separate-message-enabled.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.filters-final-suppresses-output-without-start-tag.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.includes-canvas-action-metadata-tool-summaries.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.keeps-assistanttexts-final-answer-block-replies-are.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.keeps-indented-fenced-blocks-intact.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.reopens-fenced-blocks-splitting-inside-them.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.splits-long-single-line-fenced-blocks-reopen.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.streams-soft-chunks-paragraph-preference.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.subscribeembeddedpisession.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.suppresses-message-end-block-replies-message-tool.test.ts
src/agents/pi-embedded-subscribe.subscribe-embedded-pi-session.waits-multiple-compaction-retries-before-resolving.test.ts
src/agents/pi-embedded-subscribe.tools.extract.test.ts
src/agents/pi-embedded-subscribe.tools.media.test.ts
src/agents/pi-embedded-subscribe.tools.test.ts
src/agents/pi-embedded-subscribe.tools.ts
src/agents/pi-embedded-subscribe.ts
src/agents/pi-embedded-subscribe.types.ts
src/agents/pi-embedded-utils.test.ts
src/agents/pi-embedded-utils.ts
src/agents/pi-embedded.ts
src/agents/pi-extensions/compaction-safeguard-runtime.ts
src/agents/pi-extensions/compaction-safeguard.test.ts
src/agents/pi-extensions/compaction-safeguard.ts
src/agents/pi-extensions/context-pruning.test.ts
src/agents/pi-extensions/context-pruning.ts
src/agents/pi-extensions/context-pruning/extension.ts
src/agents/pi-extensions/context-pruning/pruner.ts
src/agents/pi-extensions/context-pruning/runtime.ts
src/agents/pi-extensions/context-pruning/settings.ts
src/agents/pi-extensions/context-pruning/tools.ts
src/agents/pi-extensions/session-manager-runtime-registry.ts
src/agents/pi-model-discovery.auth.test.ts
src/agents/pi-model-discovery.compat.test.ts
src/agents/pi-model-discovery.ts
src/agents/pi-project-settings.test.ts
src/agents/pi-project-settings.ts
src/agents/pi-settings.test.ts
src/agents/pi-settings.ts
src/agents/pi-tool-definition-adapter.after-tool-call.test.ts
src/agents/pi-tool-definition-adapter.test.ts
src/agents/pi-tool-definition-adapter.ts
src/agents/pi-tools-agent-config.test.ts
src/agents/pi-tools.abort.ts
src/agents/pi-tools.before-tool-call.integration.test.ts
src/agents/pi-tools.before-tool-call.test.ts
src/agents/pi-tools.before-tool-call.ts
src/agents/pi-tools.create-traversalai-coding-tools.adds-claude-style-aliases-schemas-without-dropping-b.test.ts
src/agents/pi-tools.create-traversalai-coding-tools.adds-claude-style-aliases-schemas-without-dropping-d.test.ts
src/agents/pi-tools.create-traversalai-coding-tools.adds-claude-style-aliases-schemas-without-dropping-f.test.ts
src/agents/pi-tools.create-traversalai-coding-tools.adds-claude-style-aliases-schemas-without-dropping.test.ts
src/agents/pi-tools.message-provider-policy.test.ts
src/agents/pi-tools.policy.test.ts
src/agents/pi-tools.policy.ts
src/agents/pi-tools.read.ts
src/agents/pi-tools.read.workspace-root-guard.test.ts
src/agents/pi-tools.safe-bins.test.ts
src/agents/pi-tools.sandbox-mounted-paths.workspace-only.test.ts
src/agents/pi-tools.schema.ts
src/agents/pi-tools.ts
src/agents/pi-tools.types.ts
src/agents/pi-tools.whatsapp-login-gating.test.ts
src/agents/pi-tools.workspace-paths.test.ts
src/agents/pty-dsr.ts
src/agents/pty-keys.test.ts
src/agents/pty-keys.ts
src/agents/queued-file-writer.ts
src/agents/sandbox-agent-config.agent-specific-sandbox-config.test.ts
src/agents/sandbox-create-args.test.ts
src/agents/sandbox-explain.test.ts
src/agents/sandbox-media-paths.ts
src/agents/sandbox-merge.test.ts
src/agents/sandbox-paths.test.ts
src/agents/sandbox-paths.ts
src/agents/sandbox-skills.test.ts
src/agents/sandbox-tool-policy.ts
src/agents/sandbox.resolveSandboxContext.test.ts
src/agents/sandbox.ts
src/agents/sandbox/bind-spec.test.ts
src/agents/sandbox/bind-spec.ts
src/agents/sandbox/browser-bridges.ts
src/agents/sandbox/browser.create.test.ts
src/agents/sandbox/browser.novnc-url.test.ts
src/agents/sandbox/browser.ts
src/agents/sandbox/config-hash.test.ts
src/agents/sandbox/config-hash.ts
src/agents/sandbox/config.ts
src/agents/sandbox/constants.ts
src/agents/sandbox/context.ts
src/agents/sandbox/context.user-fallback.test.ts
src/agents/sandbox/docker.config-hash-recreate.test.ts
src/agents/sandbox/docker.ts
src/agents/sandbox/fs-bridge.test.ts
src/agents/sandbox/fs-bridge.ts
src/agents/sandbox/fs-paths.test.ts
src/agents/sandbox/fs-paths.ts
src/agents/sandbox/hash.ts
src/agents/sandbox/host-paths.test.ts
src/agents/sandbox/host-paths.ts
src/agents/sandbox/manage.ts
src/agents/sandbox/network-mode.ts
src/agents/sandbox/novnc-auth.ts
src/agents/sandbox/path-utils.ts
src/agents/sandbox/prune.ts
src/agents/sandbox/registry.test.ts
src/agents/sandbox/registry.ts
src/agents/sandbox/runtime-status.ts
src/agents/sandbox/sanitize-env-vars.test.ts
src/agents/sandbox/sanitize-env-vars.ts
src/agents/sandbox/shared.ts
src/agents/sandbox/test-fixtures.ts
src/agents/sandbox/tool-policy.ts
src/agents/sandbox/types.docker.ts
src/agents/sandbox/types.ts
src/agents/sandbox/validate-sandbox-security.test.ts
src/agents/sandbox/validate-sandbox-security.ts
src/agents/sandbox/workspace.ts
src/agents/sanitize-for-prompt.test.ts
src/agents/sanitize-for-prompt.ts
src/agents/schema/clean-for-gemini.ts
src/agents/schema/typebox.ts
src/agents/session-dirs.ts
src/agents/session-file-repair.test.ts
src/agents/session-file-repair.ts
src/agents/session-slug.test.ts
src/agents/session-slug.ts
src/agents/session-tool-result-guard-wrapper.ts
src/agents/session-tool-result-guard.test.ts
src/agents/session-tool-result-guard.tool-result-persist-hook.test.ts
src/agents/session-tool-result-guard.ts
src/agents/session-transcript-repair.test.ts
src/agents/session-transcript-repair.ts
src/agents/session-write-lock.test.ts
src/agents/session-write-lock.ts
src/agents/sessions-spawn-hooks.test.ts
src/agents/sessions-spawn-threadid.test.ts
src/agents/shell-utils.test.ts
src/agents/shell-utils.ts
src/agents/skills-install-download.ts
src/agents/skills-install-fallback.test.ts
src/agents/skills-install-output.ts
src/agents/skills-install.download-test-utils.ts
src/agents/skills-install.download.test.ts
src/agents/skills-install.test-mocks.ts
src/agents/skills-install.test.ts
src/agents/skills-install.ts
src/agents/skills-status.test.ts
src/agents/skills-status.ts
src/agents/skills.agents-skills-directory.test.ts
src/agents/skills.build-workspace-skills-prompt.applies-bundled-allowlist-without-affecting-workspace-skills.test.ts
src/agents/skills.build-workspace-skills-prompt.prefers-workspace-skills-managed-skills.test.ts
src/agents/skills.build-workspace-skills-prompt.syncs-merged-skills-into-target-workspace.test.ts
src/agents/skills.buildworkspaceskillsnapshot.test.ts
src/agents/skills.buildworkspaceskillstatus.test.ts
src/agents/skills.compact-skill-paths.test.ts
src/agents/skills.e2e-test-helpers.test.ts
src/agents/skills.e2e-test-helpers.ts
src/agents/skills.loadworkspaceskillentries.test.ts
src/agents/skills.resolveskillspromptforrun.test.ts
src/agents/skills.summarize-skill-description.test.ts
src/agents/skills.test-helpers.ts
src/agents/skills.test.ts
src/agents/skills.ts
src/agents/skills/bundled-context.ts
src/agents/skills/bundled-dir.test.ts
src/agents/skills/bundled-dir.ts
src/agents/skills/config.ts
src/agents/skills/env-overrides.ts
src/agents/skills/filter.test.ts
src/agents/skills/filter.ts
src/agents/skills/frontmatter.test.ts
src/agents/skills/frontmatter.ts
src/agents/skills/plugin-skills.test.ts
src/agents/skills/plugin-skills.ts
src/agents/skills/refresh.test.ts
src/agents/skills/refresh.ts
src/agents/skills/serialize.ts
src/agents/skills/tools-dir.ts
src/agents/skills/types.ts
src/agents/skills/workspace.ts
src/agents/stable-stringify.ts
src/agents/subagent-announce-dispatch.test.ts
src/agents/subagent-announce-dispatch.ts
src/agents/subagent-announce-queue.test.ts
src/agents/subagent-announce-queue.ts
src/agents/subagent-announce.format.test.ts
src/agents/subagent-announce.timeout.test.ts
src/agents/subagent-announce.ts
src/agents/subagent-depth.test.ts
src/agents/subagent-depth.ts
src/agents/subagent-lifecycle-events.ts
src/agents/subagent-registry-cleanup.ts
src/agents/subagent-registry-completion.test.ts
src/agents/subagent-registry-completion.ts
src/agents/subagent-registry-queries.ts
src/agents/subagent-registry-state.ts
src/agents/subagent-registry.announce-loop-guard.test.ts
src/agents/subagent-registry.archive.test.ts
src/agents/subagent-registry.lifecycle-retry-grace.test.ts
src/agents/subagent-registry.mocks.shared.ts
src/agents/subagent-registry.nested.test.ts
src/agents/subagent-registry.persistence.test.ts
src/agents/subagent-registry.steer-restart.test.ts
src/agents/subagent-registry.store.ts
src/agents/subagent-registry.ts
src/agents/subagent-registry.types.ts
src/agents/subagent-spawn.ts
src/agents/synthetic-models.ts
src/agents/system-prompt-params.test.ts
src/agents/system-prompt-params.ts
src/agents/system-prompt-report.test.ts
src/agents/system-prompt-report.ts
src/agents/system-prompt-stability.test.ts
src/agents/system-prompt.test.ts
src/agents/system-prompt.ts
src/agents/test-helpers/assistant-message-fixtures.ts
src/agents/test-helpers/fast-coding-tools.ts
src/agents/test-helpers/fast-core-tools.ts
src/agents/test-helpers/fast-tool-stubs.ts
src/agents/test-helpers/host-sandbox-fs-bridge.ts
src/agents/test-helpers/model-fallback-config-fixture.ts
src/agents/test-helpers/pi-tools-fs-helpers.ts
src/agents/test-helpers/pi-tools-sandbox-context.test.ts
src/agents/test-helpers/pi-tools-sandbox-context.ts
src/agents/test-helpers/sandbox-agent-config-fixtures.ts
src/agents/test-helpers/unsafe-mounted-sandbox.ts
src/agents/timeout.ts
src/agents/together-models.ts
src/agents/tool-call-id.test.ts
src/agents/tool-call-id.ts
src/agents/tool-catalog.ts
src/agents/tool-display-common.ts
src/agents/tool-display.test.ts
src/agents/tool-display.ts
src/agents/tool-fs-policy.test.ts
src/agents/tool-fs-policy.ts
src/agents/tool-images.log.test.ts
src/agents/tool-images.test.ts
src/agents/tool-images.ts
src/agents/tool-loop-detection.test.ts
src/agents/tool-loop-detection.ts
src/agents/tool-mutation.test.ts
src/agents/tool-mutation.ts
src/agents/tool-policy-pipeline.test.ts
src/agents/tool-policy-pipeline.ts
src/agents/tool-policy-shared.ts
src/agents/tool-policy.conformance.ts
src/agents/tool-policy.plugin-only-allowlist.test.ts
src/agents/tool-policy.test.ts
src/agents/tool-policy.ts
src/agents/tool-summaries.ts
src/agents/tools/agent-step.test.ts
src/agents/tools/agent-step.ts
src/agents/tools/agents-list-tool.ts
src/agents/tools/browser-tool.schema.ts
src/agents/tools/browser-tool.test.ts
src/agents/tools/browser-tool.ts
src/agents/tools/canvas-tool.ts
src/agents/tools/common.params.test.ts
src/agents/tools/common.test.ts
src/agents/tools/common.ts
src/agents/tools/cron-tool.flat-params.test.ts
src/agents/tools/cron-tool.test.ts
src/agents/tools/cron-tool.ts
src/agents/tools/discord-actions-guild.ts
src/agents/tools/discord-actions-messaging.ts
src/agents/tools/discord-actions-moderation-shared.ts
src/agents/tools/discord-actions-moderation.authz.test.ts
src/agents/tools/discord-actions-moderation.ts
src/agents/tools/discord-actions-presence.test.ts
src/agents/tools/discord-actions-presence.ts
src/agents/tools/discord-actions.test.ts
src/agents/tools/discord-actions.ts
src/agents/tools/gateway-tool.ts
src/agents/tools/gateway.test.ts
src/agents/tools/gateway.ts
src/agents/tools/image-tool.helpers.ts
src/agents/tools/image-tool.test.ts
src/agents/tools/image-tool.ts
src/agents/tools/memory-tool.citations.test.ts
src/agents/tools/memory-tool.test.ts
src/agents/tools/memory-tool.ts
src/agents/tools/message-tool.test.ts
src/agents/tools/message-tool.ts
src/agents/tools/nodes-tool.ts
src/agents/tools/nodes-utils.test.ts
src/agents/tools/nodes-utils.ts
src/agents/tools/session-status-tool.ts
src/agents/tools/sessions-access.test.ts
src/agents/tools/sessions-access.ts
src/agents/tools/sessions-announce-target.ts
src/agents/tools/sessions-helpers.ts
src/agents/tools/sessions-history-tool.ts
src/agents/tools/sessions-list-tool.ts
src/agents/tools/sessions-resolution.test.ts
src/agents/tools/sessions-resolution.ts
src/agents/tools/sessions-send-helpers.ts
src/agents/tools/sessions-send-tool.a2a.ts
src/agents/tools/sessions-send-tool.ts
src/agents/tools/sessions-spawn-tool.test.ts
src/agents/tools/sessions-spawn-tool.ts
src/agents/tools/sessions.test.ts
src/agents/tools/slack-actions.test.ts
src/agents/tools/slack-actions.ts
src/agents/tools/subagents-tool.ts
src/agents/tools/telegram-actions.test.ts
src/agents/tools/telegram-actions.ts
src/agents/tools/tts-tool.test.ts
src/agents/tools/tts-tool.ts
src/agents/tools/web-fetch-utils.ts
src/agents/tools/web-fetch-visibility.test.ts
src/agents/tools/web-fetch-visibility.ts
src/agents/tools/web-fetch.cf-markdown.test.ts
src/agents/tools/web-fetch.ssrf.test.ts
src/agents/tools/web-fetch.test-harness.ts
src/agents/tools/web-fetch.test-mocks.ts
src/agents/tools/web-fetch.ts
src/agents/tools/web-guarded-fetch.ts
src/agents/tools/web-search.redirect.test.ts
src/agents/tools/web-search.test.ts
src/agents/tools/web-search.ts
src/agents/tools/web-shared.ts
src/agents/tools/web-tools.enabled-defaults.test.ts
src/agents/tools/web-tools.fetch.test.ts
src/agents/tools/web-tools.readability.test.ts
src/agents/tools/web-tools.ts
src/agents/tools/whatsapp-actions.test.ts
src/agents/tools/whatsapp-actions.ts
src/agents/tools/whatsapp-target-auth.ts
src/agents/transcript-policy.policy.test.ts
src/agents/transcript-policy.test.ts
src/agents/transcript-policy.ts
src/agents/usage.normalization.test.ts
src/agents/usage.test.ts
src/agents/usage.ts
src/agents/venice-models.ts
src/agents/volc-models.shared.ts
src/agents/workspace-dir.ts
src/agents/workspace-dirs.ts
src/agents/workspace-run.test.ts
src/agents/workspace-run.ts
src/agents/workspace-templates.test.ts
src/agents/workspace-templates.ts
src/agents/workspace.bootstrap-cache.test.ts
src/agents/workspace.defaults.test.ts
src/agents/workspace.load-extra-bootstrap-files.test.ts
src/agents/workspace.test.ts
src/agents/workspace.ts
src/agents/zai.live.test.ts
src/auto-reply/chunk.test.ts
src/auto-reply/chunk.ts
src/auto-reply/command-auth.ts
src/auto-reply/command-control.test.ts
src/auto-reply/command-detection.ts
src/auto-reply/commands-args.test.ts
src/auto-reply/commands-args.ts
src/auto-reply/commands-registry.data.ts
src/auto-reply/commands-registry.test.ts
src/auto-reply/commands-registry.ts
src/auto-reply/commands-registry.types.ts
src/auto-reply/dispatch.test.ts
src/auto-reply/dispatch.ts
src/auto-reply/envelope.test.ts
src/auto-reply/envelope.ts
src/auto-reply/fallback-state.test.ts
src/auto-reply/fallback-state.ts
src/auto-reply/group-activation.ts
src/auto-reply/heartbeat-reply-payload.ts
src/auto-reply/heartbeat.test.ts
src/auto-reply/heartbeat.ts
src/auto-reply/inbound-debounce.ts
src/auto-reply/inbound.test.ts
src/auto-reply/media-note.test.ts
src/auto-reply/media-note.ts
src/auto-reply/media-understanding.test-fixtures.ts
src/auto-reply/model-runtime.ts
src/auto-reply/model.test.ts
src/auto-reply/model.ts
src/auto-reply/reply.block-streaming.test.ts
src/auto-reply/reply.directive.directive-behavior.applies-inline-reasoning-mixed-messages-acks-immediately.test.ts
src/auto-reply/reply.directive.directive-behavior.defaults-think-low-reasoning-capable-models-no.test.ts
src/auto-reply/reply.directive.directive-behavior.e2e-harness.ts
src/auto-reply/reply.directive.directive-behavior.e2e-mocks.ts
src/auto-reply/reply.directive.directive-behavior.model-directive-test-utils.ts
src/auto-reply/reply.directive.directive-behavior.prefers-alias-matches-fuzzy-selection-is-ambiguous.test.ts
src/auto-reply/reply.directive.directive-behavior.shows-current-verbose-level-verbose-has-no.test.ts
src/auto-reply/reply.directive.parse.test.ts
src/auto-reply/reply.heartbeat-typing.test.ts
src/auto-reply/reply.media-note.test.ts
src/auto-reply/reply.raw-body.test.ts
src/auto-reply/reply.test-harness.ts
src/auto-reply/reply.triggers.group-intro-prompts.cases.ts
src/auto-reply/reply.triggers.trigger-handling.filters-usage-summary-current-model-provider.cases.ts
src/auto-reply/reply.triggers.trigger-handling.stages-inbound-media-into-sandbox-workspace.test.ts
src/auto-reply/reply.triggers.trigger-handling.targets-active-session-native-stop.test.ts
src/auto-reply/reply.triggers.trigger-handling.test-harness.ts
src/auto-reply/reply.ts
src/auto-reply/reply/abort-cutoff.ts
src/auto-reply/reply/abort.test.ts
src/auto-reply/reply/abort.ts
src/auto-reply/reply/acp-projector.test.ts
src/auto-reply/reply/acp-projector.ts
src/auto-reply/reply/agent-runner-execution.ts
src/auto-reply/reply/agent-runner-helpers.test.ts
src/auto-reply/reply/agent-runner-helpers.ts
src/auto-reply/reply/agent-runner-memory.ts
src/auto-reply/reply/agent-runner-payloads.test.ts
src/auto-reply/reply/agent-runner-payloads.ts
src/auto-reply/reply/agent-runner-utils.test.ts
src/auto-reply/reply/agent-runner-utils.ts
src/auto-reply/reply/agent-runner.misc.runreplyagent.test.ts
src/auto-reply/reply/agent-runner.runreplyagent.test.ts
src/auto-reply/reply/agent-runner.ts
src/auto-reply/reply/audio-tags.ts
src/auto-reply/reply/bash-command.ts
src/auto-reply/reply/block-reply-coalescer.ts
src/auto-reply/reply/block-reply-pipeline.ts
src/auto-reply/reply/block-streaming.test.ts
src/auto-reply/reply/block-streaming.ts
src/auto-reply/reply/body.ts
src/auto-reply/reply/command-gates.ts
src/auto-reply/reply/commands-acp.test.ts
src/auto-reply/reply/commands-acp.ts
src/auto-reply/reply/commands-acp/context.test.ts
src/auto-reply/reply/commands-acp/context.ts
src/auto-reply/reply/commands-acp/diagnostics.ts
src/auto-reply/reply/commands-acp/lifecycle.ts
src/auto-reply/reply/commands-acp/runtime-options.ts
src/auto-reply/reply/commands-acp/shared.ts
src/auto-reply/reply/commands-acp/targets.ts
src/auto-reply/reply/commands-allowlist.ts
src/auto-reply/reply/commands-approve.ts
src/auto-reply/reply/commands-bash.ts
src/auto-reply/reply/commands-compact.ts
src/auto-reply/reply/commands-config.ts
src/auto-reply/reply/commands-context-report.test.ts
src/auto-reply/reply/commands-context-report.ts
src/auto-reply/reply/commands-context.ts
src/auto-reply/reply/commands-core.ts
src/auto-reply/reply/commands-export-session.ts
src/auto-reply/reply/commands-info.ts
src/auto-reply/reply/commands-models.ts
src/auto-reply/reply/commands-plugin.ts
src/auto-reply/reply/commands-session-abort.ts
src/auto-reply/reply/commands-session-store.ts
src/auto-reply/reply/commands-session-ttl.test.ts
src/auto-reply/reply/commands-session.ts
src/auto-reply/reply/commands-setunset-standard.ts
src/auto-reply/reply/commands-setunset.test.ts
src/auto-reply/reply/commands-setunset.ts
src/auto-reply/reply/commands-slash-parse.ts
src/auto-reply/reply/commands-spawn.test-harness.ts
src/auto-reply/reply/commands-status.ts
src/auto-reply/reply/commands-subagents-focus.test.ts
src/auto-reply/reply/commands-subagents-spawn.test.ts
src/auto-reply/reply/commands-subagents.test-mocks.ts
src/auto-reply/reply/commands-subagents.ts
src/auto-reply/reply/commands-subagents/action-agents.ts
src/auto-reply/reply/commands-subagents/action-focus.ts
src/auto-reply/reply/commands-subagents/action-help.ts
src/auto-reply/reply/commands-subagents/action-info.ts
src/auto-reply/reply/commands-subagents/action-kill.ts
src/auto-reply/reply/commands-subagents/action-list.ts
src/auto-reply/reply/commands-subagents/action-log.ts
src/auto-reply/reply/commands-subagents/action-send.ts
src/auto-reply/reply/commands-subagents/action-spawn.ts
src/auto-reply/reply/commands-subagents/action-unfocus.ts
src/auto-reply/reply/commands-subagents/shared.ts
src/auto-reply/reply/commands-system-prompt.ts
src/auto-reply/reply/commands-tts.ts
src/auto-reply/reply/commands-types.ts
src/auto-reply/reply/commands.test-harness.ts
src/auto-reply/reply/commands.test.ts
src/auto-reply/reply/commands.ts
src/auto-reply/reply/config-commands.ts
src/auto-reply/reply/config-value.ts
src/auto-reply/reply/debug-commands.ts
src/auto-reply/reply/directive-handling.auth.ts
src/auto-reply/reply/directive-handling.fast-lane.ts
src/auto-reply/reply/directive-handling.impl.ts
src/auto-reply/reply/directive-handling.levels.ts
src/auto-reply/reply/directive-handling.model-picker.ts
src/auto-reply/reply/directive-handling.model.test.ts
src/auto-reply/reply/directive-handling.model.ts
src/auto-reply/reply/directive-handling.params.ts
src/auto-reply/reply/directive-handling.parse.ts
src/auto-reply/reply/directive-handling.persist.ts
src/auto-reply/reply/directive-handling.queue-validation.ts
src/auto-reply/reply/directive-handling.shared.ts
src/auto-reply/reply/directive-handling.ts
src/auto-reply/reply/directive-parsing.ts
src/auto-reply/reply/directives.ts
src/auto-reply/reply/dispatch-acp.ts
src/auto-reply/reply/dispatch-from-config.test.ts
src/auto-reply/reply/dispatch-from-config.ts
src/auto-reply/reply/dispatcher-registry.ts
src/auto-reply/reply/elevated-allowlist-matcher.ts
src/auto-reply/reply/elevated-unavailable.ts
src/auto-reply/reply/exec.ts
src/auto-reply/reply/exec/directive.ts
src/auto-reply/reply/export-html/template.security.test.ts
src/auto-reply/reply/followup-runner.test.ts
src/auto-reply/reply/followup-runner.ts
src/auto-reply/reply/get-reply-directives-apply.ts
src/auto-reply/reply/get-reply-directives-utils.ts
src/auto-reply/reply/get-reply-directives.ts
src/auto-reply/reply/get-reply-inline-actions.skip-when-config-empty.test.ts
src/auto-reply/reply/get-reply-inline-actions.ts
src/auto-reply/reply/get-reply-run.media-only.test.ts
src/auto-reply/reply/get-reply-run.ts
src/auto-reply/reply/get-reply.reset-hooks-fallback.test.ts
src/auto-reply/reply/get-reply.ts
src/auto-reply/reply/groups.ts
src/auto-reply/reply/history.ts
src/auto-reply/reply/inbound-context.ts
src/auto-reply/reply/inbound-dedupe.ts
src/auto-reply/reply/inbound-meta.test.ts
src/auto-reply/reply/inbound-meta.ts
src/auto-reply/reply/inbound-text.ts
src/auto-reply/reply/line-directives.ts
src/auto-reply/reply/memory-flush.test.ts
src/auto-reply/reply/memory-flush.ts
src/auto-reply/reply/mentions.ts
src/auto-reply/reply/model-selection.test.ts
src/auto-reply/reply/model-selection.ts
src/auto-reply/reply/normalize-reply.ts
src/auto-reply/reply/origin-routing.test.ts
src/auto-reply/reply/origin-routing.ts
src/auto-reply/reply/post-compaction-audit.test.ts
src/auto-reply/reply/post-compaction-audit.ts
src/auto-reply/reply/post-compaction-context.test.ts
src/auto-reply/reply/post-compaction-context.ts
src/auto-reply/reply/provider-dispatcher.ts
src/auto-reply/reply/queue-policy.test.ts
src/auto-reply/reply/queue-policy.ts
src/auto-reply/reply/queue.ts
src/auto-reply/reply/queue/cleanup.ts
src/auto-reply/reply/queue/directive.ts
src/auto-reply/reply/queue/drain.ts
src/auto-reply/reply/queue/enqueue.ts
src/auto-reply/reply/queue/normalize.ts
src/auto-reply/reply/queue/settings.ts
src/auto-reply/reply/queue/state.ts
src/auto-reply/reply/queue/types.ts
src/auto-reply/reply/reply-delivery.ts
src/auto-reply/reply/reply-directives.ts
src/auto-reply/reply/reply-dispatcher.ts
src/auto-reply/reply/reply-elevated.test.ts
src/auto-reply/reply/reply-elevated.ts
src/auto-reply/reply/reply-flow.test.ts
src/auto-reply/reply/reply-inline.ts
src/auto-reply/reply/reply-payloads.test.ts
src/auto-reply/reply/reply-payloads.ts
src/auto-reply/reply/reply-plumbing.test.ts
src/auto-reply/reply/reply-reference.ts
src/auto-reply/reply/reply-state.test.ts
src/auto-reply/reply/reply-tags.ts
src/auto-reply/reply/reply-threading.ts
src/auto-reply/reply/reply-utils.test.ts
src/auto-reply/reply/response-prefix-template.ts
src/auto-reply/reply/route-reply.test.ts
src/auto-reply/reply/route-reply.ts
src/auto-reply/reply/session-reset-model.ts
src/auto-reply/reply/session-reset-prompt.ts
src/auto-reply/reply/session-run-accounting.ts
src/auto-reply/reply/session-updates.ts
src/auto-reply/reply/session-usage.ts
src/auto-reply/reply/session.test.ts
src/auto-reply/reply/session.ts
src/auto-reply/reply/stage-sandbox-media.ts
src/auto-reply/reply/streaming-directives.ts
src/auto-reply/reply/strip-inbound-meta.test.ts
src/auto-reply/reply/strip-inbound-meta.ts
src/auto-reply/reply/subagents-utils.test.ts
src/auto-reply/reply/subagents-utils.ts
src/auto-reply/reply/test-ctx.ts
src/auto-reply/reply/test-helpers.ts
src/auto-reply/reply/typing-mode.ts
src/auto-reply/reply/typing-persistence.test.ts
src/auto-reply/reply/typing-policy.test.ts
src/auto-reply/reply/typing-policy.ts
src/auto-reply/reply/typing.ts
src/auto-reply/reply/untrusted-context.ts
src/auto-reply/send-policy.ts
src/auto-reply/skill-commands.test.ts
src/auto-reply/skill-commands.ts
src/auto-reply/stage-sandbox-media.test-harness.ts
src/auto-reply/status.test.ts
src/auto-reply/status.ts
src/auto-reply/templating.ts
src/auto-reply/thinking.test.ts
src/auto-reply/thinking.ts
src/auto-reply/tokens.test.ts
src/auto-reply/tokens.ts
src/auto-reply/tool-meta.test.ts
src/auto-reply/tool-meta.ts
src/auto-reply/types.ts
src/browser/bridge-auth-registry.ts
src/browser/bridge-server.auth.test.ts
src/browser/bridge-server.ts
src/browser/browser-utils.test.ts
src/browser/cdp.helpers.ts
src/browser/cdp.test.ts
src/browser/cdp.ts
src/browser/chrome-extension-background-utils.test.ts
src/browser/chrome-extension-manifest.test.ts
src/browser/chrome-extension-options-validation.test.ts
src/browser/chrome-user-data-dir.test-harness.ts
src/browser/chrome.default-browser.test.ts
src/browser/chrome.executables.ts
src/browser/chrome.profile-decoration.ts
src/browser/chrome.test.ts
src/browser/chrome.ts
src/browser/client-actions-core.ts
src/browser/client-actions-observe.ts
src/browser/client-actions-state.ts
src/browser/client-actions-types.ts
src/browser/client-actions-url.ts
src/browser/client-actions.ts
src/browser/client-fetch.loopback-auth.test.ts
src/browser/client-fetch.ts
src/browser/client.test.ts
src/browser/client.ts
src/browser/config.test.ts
src/browser/config.ts
src/browser/constants.ts
src/browser/control-auth.auto-token.test.ts
src/browser/control-auth.test.ts
src/browser/control-auth.ts
src/browser/control-service.ts
src/browser/csrf.ts
src/browser/extension-relay-auth.test.ts
src/browser/extension-relay-auth.ts
src/browser/extension-relay.test.ts
src/browser/extension-relay.ts
src/browser/form-fields.ts
src/browser/http-auth.ts
src/browser/navigation-guard.test.ts
src/browser/navigation-guard.ts
src/browser/paths.test.ts
src/browser/paths.ts
src/browser/profiles-service.test.ts
src/browser/profiles-service.ts
src/browser/profiles.test.ts
src/browser/profiles.ts
src/browser/proxy-files.ts
src/browser/pw-ai-module.ts
src/browser/pw-ai-state.ts
src/browser/pw-ai.test.ts
src/browser/pw-ai.ts
src/browser/pw-role-snapshot.test.ts
src/browser/pw-role-snapshot.ts
src/browser/pw-session.browserless.live.test.ts
src/browser/pw-session.create-page.navigation-guard.test.ts
src/browser/pw-session.get-page-for-targetid.extension-fallback.test.ts
src/browser/pw-session.mock-setup.ts
src/browser/pw-session.test.ts
src/browser/pw-session.ts
src/browser/pw-tools-core.activity.ts
src/browser/pw-tools-core.clamps-timeoutms-scrollintoview.test.ts
src/browser/pw-tools-core.downloads.ts
src/browser/pw-tools-core.interactions.evaluate.abort.test.ts
src/browser/pw-tools-core.interactions.set-input-files.test.ts
src/browser/pw-tools-core.interactions.ts
src/browser/pw-tools-core.last-file-chooser-arm-wins.test.ts
src/browser/pw-tools-core.responses.ts
src/browser/pw-tools-core.screenshots-element-selector.test.ts
src/browser/pw-tools-core.shared.ts
src/browser/pw-tools-core.snapshot.navigate-guard.test.ts
src/browser/pw-tools-core.snapshot.ts
src/browser/pw-tools-core.state.ts
src/browser/pw-tools-core.storage.ts
src/browser/pw-tools-core.test-harness.ts
src/browser/pw-tools-core.trace.ts
src/browser/pw-tools-core.ts
src/browser/pw-tools-core.waits-next-download-saves-it.test.ts
src/browser/resolved-config-refresh.ts
src/browser/routes/agent.act.download.ts
src/browser/routes/agent.act.hooks.ts
src/browser/routes/agent.act.shared.ts
src/browser/routes/agent.act.ts
src/browser/routes/agent.debug.ts
src/browser/routes/agent.shared.test.ts
src/browser/routes/agent.shared.ts
src/browser/routes/agent.snapshot.ts
src/browser/routes/agent.storage.test.ts
src/browser/routes/agent.storage.ts
src/browser/routes/agent.ts
src/browser/routes/basic.ts
src/browser/routes/dispatcher.abort.test.ts
src/browser/routes/dispatcher.ts
src/browser/routes/index.ts
src/browser/routes/output-paths.ts
src/browser/routes/path-output.ts
src/browser/routes/tabs.ts
src/browser/routes/types.ts
src/browser/routes/utils.ts
src/browser/screenshot.test.ts
src/browser/screenshot.ts
src/browser/server-context.chrome-test-harness.ts
src/browser/server-context.ensure-tab-available.prefers-last-target.test.ts
src/browser/server-context.hot-reload-profiles.test.ts
src/browser/server-context.remote-tab-ops.test.ts
src/browser/server-context.ts
src/browser/server-context.types.ts
src/browser/server-lifecycle.test.ts
src/browser/server-lifecycle.ts
src/browser/server-middleware.ts
src/browser/server.agent-contract-form-layout-act-commands.test.ts
src/browser/server.agent-contract-snapshot-endpoints.test.ts
src/browser/server.agent-contract.test-harness.ts
src/browser/server.auth-token-gates-http.test.ts
src/browser/server.control-server.test-harness.ts
src/browser/server.evaluate-disabled-does-not-block-storage.test.ts
src/browser/server.post-tabs-open-profile-unknown-returns-404.test.ts
src/browser/server.ts
src/browser/target-id.ts
src/browser/test-port.ts
src/browser/trash.ts
src/canvas-host/a2ui.ts
src/canvas-host/file-resolver.ts
src/canvas-host/server.state-dir.test.ts
src/canvas-host/server.test.ts
src/canvas-host/server.ts
src/channel-web.ts
src/channels/account-summary.ts
src/channels/ack-reactions.test.ts
src/channels/ack-reactions.ts
src/channels/allow-from.test.ts
src/channels/allow-from.ts
src/channels/allowlist-match.ts
src/channels/allowlists/resolve-utils.test.ts
src/channels/allowlists/resolve-utils.ts
src/channels/channel-config.test.ts
src/channels/channel-config.ts
src/channels/channels-misc.test.ts
src/channels/chat-type.ts
src/channels/command-gating.test.ts
src/channels/command-gating.ts
src/channels/conversation-label.test.ts
src/channels/conversation-label.ts
src/channels/dock.test.ts
src/channels/dock.ts
src/channels/draft-stream-controls.test.ts
src/channels/draft-stream-controls.ts
src/channels/draft-stream-loop.ts
src/channels/location.test.ts
src/channels/location.ts
src/channels/logging.ts
src/channels/mention-gating.test.ts
src/channels/mention-gating.ts
src/channels/model-overrides.test.ts
src/channels/model-overrides.ts
src/channels/plugins/account-action-gate.test.ts
src/channels/plugins/account-action-gate.ts
src/channels/plugins/account-helpers.test.ts
src/channels/plugins/account-helpers.ts
src/channels/plugins/actions/actions.test.ts
src/channels/plugins/actions/discord.ts
src/channels/plugins/actions/discord/handle-action.guild-admin.ts
src/channels/plugins/actions/discord/handle-action.ts
src/channels/plugins/actions/shared.ts
src/channels/plugins/actions/signal.ts
src/channels/plugins/actions/telegram.ts
src/channels/plugins/agent-tools/whatsapp-login.ts
src/channels/plugins/allowlist-match.ts
src/channels/plugins/bluebubbles-actions.ts
src/channels/plugins/catalog.ts
src/channels/plugins/channel-config.ts
src/channels/plugins/config-helpers.ts
src/channels/plugins/config-schema.test.ts
src/channels/plugins/config-schema.ts
src/channels/plugins/config-writes.ts
src/channels/plugins/directory-config.ts
src/channels/plugins/group-mentions.test.ts
src/channels/plugins/group-mentions.ts
src/channels/plugins/helpers.ts
src/channels/plugins/index.ts
src/channels/plugins/load.ts
src/channels/plugins/media-limits.ts
src/channels/plugins/media-payload.ts
src/channels/plugins/message-action-names.ts
src/channels/plugins/message-actions.security.test.ts
src/channels/plugins/message-actions.test.ts
src/channels/plugins/message-actions.ts
src/channels/plugins/normalize/discord.ts
src/channels/plugins/normalize/imessage.ts
src/channels/plugins/normalize/shared.ts
src/channels/plugins/normalize/signal.ts
src/channels/plugins/normalize/slack.ts
src/channels/plugins/normalize/targets.test.ts
src/channels/plugins/normalize/telegram.test.ts
src/channels/plugins/normalize/telegram.ts
src/channels/plugins/normalize/whatsapp.ts
src/channels/plugins/onboarding-types.ts
src/channels/plugins/onboarding/channel-access-configure.test.ts
src/channels/plugins/onboarding/channel-access-configure.ts
src/channels/plugins/onboarding/channel-access.test.ts
src/channels/plugins/onboarding/channel-access.ts
src/channels/plugins/onboarding/discord.ts
src/channels/plugins/onboarding/helpers.test.ts
src/channels/plugins/onboarding/helpers.ts
src/channels/plugins/onboarding/imessage.test.ts
src/channels/plugins/onboarding/imessage.ts
src/channels/plugins/onboarding/signal.test.ts
src/channels/plugins/onboarding/signal.ts
src/channels/plugins/onboarding/slack.ts
src/channels/plugins/onboarding/telegram.test.ts
src/channels/plugins/onboarding/telegram.ts
src/channels/plugins/onboarding/whatsapp.test.ts
src/channels/plugins/onboarding/whatsapp.ts
src/channels/plugins/outbound/direct-text-media.ts
src/channels/plugins/outbound/discord.test.ts
src/channels/plugins/outbound/discord.ts
src/channels/plugins/outbound/imessage.test.ts
src/channels/plugins/outbound/imessage.ts
src/channels/plugins/outbound/load.ts
src/channels/plugins/outbound/signal.test.ts
src/channels/plugins/outbound/signal.ts
src/channels/plugins/outbound/slack.test.ts
src/channels/plugins/outbound/slack.ts
src/channels/plugins/outbound/telegram.test.ts
src/channels/plugins/outbound/telegram.ts
src/channels/plugins/outbound/whatsapp.ts
src/channels/plugins/pairing-message.ts
src/channels/plugins/pairing.ts
src/channels/plugins/plugins-channel.test.ts
src/channels/plugins/plugins-core.test.ts
src/channels/plugins/registry-loader.ts
src/channels/plugins/setup-helpers.ts
src/channels/plugins/slack.actions.ts
src/channels/plugins/status-issues/bluebubbles.test.ts
src/channels/plugins/status-issues/bluebubbles.ts
src/channels/plugins/status-issues/discord.ts
src/channels/plugins/status-issues/shared.ts
src/channels/plugins/status-issues/telegram.ts
src/channels/plugins/status-issues/whatsapp.test.ts
src/channels/plugins/status-issues/whatsapp.ts
src/channels/plugins/status.ts
src/channels/plugins/types.adapters.ts
src/channels/plugins/types.core.ts
src/channels/plugins/types.plugin.ts
src/channels/plugins/types.ts
src/channels/plugins/whatsapp-heartbeat.test.ts
src/channels/plugins/whatsapp-heartbeat.ts
src/channels/plugins/whatsapp-shared.ts
src/channels/registry.helpers.test.ts
src/channels/registry.ts
src/channels/reply-prefix.ts
src/channels/sender-identity.ts
src/channels/sender-label.test.ts
src/channels/sender-label.ts
src/channels/session.test.ts
src/channels/session.ts
src/channels/status-reactions.test.ts
src/channels/status-reactions.ts
src/channels/targets.test.ts
src/channels/targets.ts
src/channels/telegram/allow-from.test.ts
src/channels/telegram/allow-from.ts
src/channels/telegram/api.test.ts
src/channels/telegram/api.ts
src/channels/thread-bindings-messages.ts
src/channels/thread-bindings-policy.ts
src/channels/typing-lifecycle.ts
src/channels/typing-start-guard.test.ts
src/channels/typing-start-guard.ts
src/channels/typing.test.ts
src/channels/typing.ts
src/channels/web/index.ts
src/chat-server/chat-events.test.ts
src/chat-server/gateway-session.test.ts
src/chat-server/server.test.ts
src/chat-server/server.ts
src/cli/acp-cli.option-collisions.test.ts
src/cli/acp-cli.ts
src/cli/argv.test.ts
src/cli/argv.ts
src/cli/banner.ts
src/cli/browser-cli-actions-input.ts
src/cli/browser-cli-actions-input/register.element.ts
src/cli/browser-cli-actions-input/register.files-downloads.ts
src/cli/browser-cli-actions-input/register.form-wait-eval.ts
src/cli/browser-cli-actions-input/register.navigation.ts
src/cli/browser-cli-actions-input/register.ts
src/cli/browser-cli-actions-input/shared.test.ts
src/cli/browser-cli-actions-input/shared.ts
src/cli/browser-cli-actions-observe.ts
src/cli/browser-cli-debug.ts
src/cli/browser-cli-examples.ts
src/cli/browser-cli-extension.test.ts
src/cli/browser-cli-extension.ts
src/cli/browser-cli-inspect.test.ts
src/cli/browser-cli-inspect.ts
src/cli/browser-cli-manage.ts
src/cli/browser-cli-resize.ts
src/cli/browser-cli-shared.ts
src/cli/browser-cli-state.cookies-storage.ts
src/cli/browser-cli-state.option-collisions.test.ts
src/cli/browser-cli-state.ts
src/cli/browser-cli.test.ts
src/cli/browser-cli.ts
src/cli/channel-auth.test.ts
src/cli/channel-auth.ts
src/cli/channel-options.ts
src/cli/channels-cli.ts
src/cli/clawbot-cli.ts
src/cli/cli-name.ts
src/cli/cli-utils.test.ts
src/cli/cli-utils.ts
src/cli/command-format.ts
src/cli/command-options.test.ts
src/cli/command-options.ts
src/cli/completion-cli.ts
src/cli/completion-fish.test.ts
src/cli/completion-fish.ts
src/cli/config-cli.test.ts
src/cli/config-cli.ts
src/cli/cron-cli.test.ts
src/cli/cron-cli.ts
src/cli/cron-cli/register.cron-add.ts
src/cli/cron-cli/register.cron-edit.ts
src/cli/cron-cli/register.cron-simple.ts
src/cli/cron-cli/register.ts
src/cli/cron-cli/shared.test.ts
src/cli/cron-cli/shared.ts
src/cli/daemon-cli-compat.test.ts
src/cli/daemon-cli-compat.ts
src/cli/daemon-cli.coverage.test.ts
src/cli/daemon-cli.ts
src/cli/daemon-cli/install.ts
src/cli/daemon-cli/lifecycle-core.test.ts
src/cli/daemon-cli/lifecycle-core.ts
src/cli/daemon-cli/lifecycle.test.ts
src/cli/daemon-cli/lifecycle.ts
src/cli/daemon-cli/probe.ts
src/cli/daemon-cli/register-service-commands.test.ts
src/cli/daemon-cli/register-service-commands.ts
src/cli/daemon-cli/register.ts
src/cli/daemon-cli/response.ts
src/cli/daemon-cli/restart-health.test.ts
src/cli/daemon-cli/restart-health.ts
src/cli/daemon-cli/runners.ts
src/cli/daemon-cli/shared.test.ts
src/cli/daemon-cli/shared.ts
src/cli/daemon-cli/status.gather.test.ts
src/cli/daemon-cli/status.gather.ts
src/cli/daemon-cli/status.print.ts
src/cli/daemon-cli/status.ts
src/cli/daemon-cli/types.ts
src/cli/deps.test.ts
src/cli/deps.ts
src/cli/devices-cli.test.ts
src/cli/devices-cli.ts
src/cli/directory-cli.ts
src/cli/dns-cli.ts
src/cli/docs-cli.ts
src/cli/exec-approvals-cli.test.ts
src/cli/exec-approvals-cli.ts
src/cli/gateway-cli.coverage.test.ts
src/cli/gateway-cli.ts
src/cli/gateway-cli/call.ts
src/cli/gateway-cli/dev.ts
src/cli/gateway-cli/discover.ts
src/cli/gateway-cli/register.option-collisions.test.ts
src/cli/gateway-cli/register.ts
src/cli/gateway-cli/run-loop.test.ts
src/cli/gateway-cli/run-loop.ts
src/cli/gateway-cli/run.option-collisions.test.ts
src/cli/gateway-cli/run.ts
src/cli/gateway-cli/shared.ts
src/cli/gateway-rpc.ts
src/cli/gateway.sigterm.test.ts
src/cli/help-format.ts
src/cli/hooks-cli.test.ts
src/cli/hooks-cli.ts
src/cli/log-level-option.test.ts
src/cli/log-level-option.ts
src/cli/logs-cli.test.ts
src/cli/logs-cli.ts
src/cli/memory-cli.test.ts
src/cli/memory-cli.ts
src/cli/models-cli.test.ts
src/cli/models-cli.ts
src/cli/node-cli.ts
src/cli/node-cli/daemon.ts
src/cli/node-cli/register.ts
src/cli/nodes-camera.test.ts
src/cli/nodes-camera.ts
src/cli/nodes-canvas.ts
src/cli/nodes-cli.coverage.test.ts
src/cli/nodes-cli.ts
src/cli/nodes-cli/a2ui-jsonl.ts
src/cli/nodes-cli/cli-utils.ts
src/cli/nodes-cli/format.ts
src/cli/nodes-cli/pairing-render.ts
src/cli/nodes-cli/register.camera.ts
src/cli/nodes-cli/register.canvas.ts
src/cli/nodes-cli/register.invoke.nodes-run-approval-timeout.test.ts
src/cli/nodes-cli/register.invoke.ts
src/cli/nodes-cli/register.location.ts
src/cli/nodes-cli/register.notify.ts
src/cli/nodes-cli/register.pairing.ts
src/cli/nodes-cli/register.push.ts
src/cli/nodes-cli/register.screen.ts
src/cli/nodes-cli/register.status.ts
src/cli/nodes-cli/register.ts
src/cli/nodes-cli/rpc.ts
src/cli/nodes-cli/types.ts
src/cli/nodes-media-utils.test.ts
src/cli/nodes-media-utils.ts
src/cli/nodes-run.ts
src/cli/nodes-screen.ts
src/cli/npm-resolution.test.ts
src/cli/npm-resolution.ts
src/cli/outbound-send-deps.ts
src/cli/outbound-send-mapping.test.ts
src/cli/outbound-send-mapping.ts
src/cli/pairing-cli.test.ts
src/cli/pairing-cli.ts
src/cli/parse-bytes.ts
src/cli/parse-duration.ts
src/cli/parse-timeout.ts
src/cli/plugin-registry.ts
src/cli/plugins-cli.ts
src/cli/plugins-config.test.ts
src/cli/plugins-config.ts
src/cli/ports.ts
src/cli/profile-utils.ts
src/cli/profile.test.ts
src/cli/profile.ts
src/cli/program.force.test.ts
src/cli/program.nodes-basic.test.ts
src/cli/program.nodes-media.test.ts
src/cli/program.nodes-test-helpers.test.ts
src/cli/program.nodes-test-helpers.ts
src/cli/program.smoke.test.ts
src/cli/program.test-mocks.ts
src/cli/program.ts
src/cli/program/action-reparse.test.ts
src/cli/program/action-reparse.ts
src/cli/program/build-program.test.ts
src/cli/program/build-program.ts
src/cli/program/build-program.version-alias.test.ts
src/cli/program/command-registry.test.ts
src/cli/program/command-registry.ts
src/cli/program/command-tree.test.ts
src/cli/program/command-tree.ts
src/cli/program/config-guard.test.ts
src/cli/program/config-guard.ts
src/cli/program/context.test.ts
src/cli/program/context.ts
src/cli/program/help.test.ts
src/cli/program/help.ts
src/cli/program/helpers.test.ts
src/cli/program/helpers.ts
src/cli/program/message/helpers.test.ts
src/cli/program/message/helpers.ts
src/cli/program/message/register.broadcast.ts
src/cli/program/message/register.discord-admin.ts
src/cli/program/message/register.emoji-sticker.ts
src/cli/program/message/register.permissions-search.ts
src/cli/program/message/register.pins.ts
src/cli/program/message/register.poll.ts
src/cli/program/message/register.reactions.ts
src/cli/program/message/register.read-edit-delete.ts
src/cli/program/message/register.send.ts
src/cli/program/message/register.thread.ts
src/cli/program/preaction.test.ts
src/cli/program/preaction.ts
src/cli/program/program-context.test.ts
src/cli/program/program-context.ts
src/cli/program/register.agent.test.ts
src/cli/program/register.agent.ts
src/cli/program/register.configure.test.ts
src/cli/program/register.configure.ts
src/cli/program/register.maintenance.test.ts
src/cli/program/register.maintenance.ts
src/cli/program/register.message.test.ts
src/cli/program/register.message.ts
src/cli/program/register.onboard.test.ts
src/cli/program/register.onboard.ts
src/cli/program/register.setup.test.ts
src/cli/program/register.setup.ts
src/cli/program/register.status-health-sessions.test.ts
src/cli/program/register.status-health-sessions.ts
src/cli/program/register.subclis.test.ts
src/cli/program/register.subclis.ts
src/cli/program/routes.test.ts
src/cli/program/routes.ts
src/cli/progress.test.ts
src/cli/progress.ts
src/cli/prompt.test.ts
src/cli/prompt.ts
src/cli/qr-cli.test.ts
src/cli/qr-cli.ts
src/cli/requirements-test-fixtures.ts
src/cli/respawn-policy.ts
src/cli/route.ts
src/cli/run-main.exit.test.ts
src/cli/run-main.test.ts
src/cli/run-main.ts
src/cli/sandbox-cli.ts
src/cli/secrets-cli.test.ts
src/cli/secrets-cli.ts
src/cli/security-cli.ts
src/cli/shared/parse-port.ts
src/cli/skills-cli.commands.test.ts
src/cli/skills-cli.format.ts
src/cli/skills-cli.formatting.test.ts
src/cli/skills-cli.test.ts
src/cli/skills-cli.ts
src/cli/standalone-chat-cli.test.ts
src/cli/standalone-chat-cli.ts
src/cli/system-cli.test.ts
src/cli/system-cli.ts
src/cli/tagline.ts
src/cli/test-runtime-capture.ts
src/cli/tui-cli.ts
src/cli/update-cli.option-collisions.test.ts
src/cli/update-cli.test.ts
src/cli/update-cli.ts
src/cli/update-cli/progress.ts
src/cli/update-cli/restart-helper.test.ts
src/cli/update-cli/restart-helper.ts
src/cli/update-cli/shared.command-runner.test.ts
src/cli/update-cli/shared.ts
src/cli/update-cli/status.ts
src/cli/update-cli/suppress-deprecations.ts
src/cli/update-cli/update-command.ts
src/cli/update-cli/wizard.ts
src/cli/wait.ts
src/cli/webhooks-cli.ts
src/cli/windows-argv.ts
src/commands/agent-via-gateway.test.ts
src/commands/agent-via-gateway.ts
src/commands/agent.acp.test.ts
src/commands/agent.delivery.test.ts
src/commands/agent.test.ts
src/commands/agent.ts
src/commands/agent/delivery.ts
src/commands/agent/run-context.ts
src/commands/agent/session-store.test.ts
src/commands/agent/session-store.ts
src/commands/agent/session.test.ts
src/commands/agent/session.ts
src/commands/agent/types.ts
src/commands/agents.add.test.ts
src/commands/agents.bind.commands.test.ts
src/commands/agents.bindings.ts
src/commands/agents.command-shared.ts
src/commands/agents.commands.add.ts
src/commands/agents.commands.bind.ts
src/commands/agents.commands.delete.ts
src/commands/agents.commands.identity.ts
src/commands/agents.commands.list.ts
src/commands/agents.config.ts
src/commands/agents.identity.test.ts
src/commands/agents.providers.ts
src/commands/agents.test.ts
src/commands/agents.ts
src/commands/auth-choice-legacy.ts
src/commands/auth-choice-options.test.ts
src/commands/auth-choice-options.ts
src/commands/auth-choice-prompt.ts
src/commands/auth-choice.api-key.ts
src/commands/auth-choice.apply-helpers.test.ts
src/commands/auth-choice.apply-helpers.ts
src/commands/auth-choice.apply.anthropic.ts
src/commands/auth-choice.apply.api-providers.ts
src/commands/auth-choice.apply.byteplus.ts
src/commands/auth-choice.apply.copilot-proxy.ts
src/commands/auth-choice.apply.github-copilot.ts
src/commands/auth-choice.apply.google-gemini-cli.test.ts
src/commands/auth-choice.apply.google-gemini-cli.ts
src/commands/auth-choice.apply.huggingface.test.ts
src/commands/auth-choice.apply.huggingface.ts
src/commands/auth-choice.apply.minimax.test.ts
src/commands/auth-choice.apply.minimax.ts
src/commands/auth-choice.apply.oauth.ts
src/commands/auth-choice.apply.openai.test.ts
src/commands/auth-choice.apply.openai.ts
src/commands/auth-choice.apply.openrouter.ts
src/commands/auth-choice.apply.plugin-provider.ts
src/commands/auth-choice.apply.qwen-portal.ts
src/commands/auth-choice.apply.ts
src/commands/auth-choice.apply.vllm.ts
src/commands/auth-choice.apply.volcengine-byteplus.test.ts
src/commands/auth-choice.apply.volcengine.ts
src/commands/auth-choice.apply.xai.ts
src/commands/auth-choice.default-model.ts
src/commands/auth-choice.model-check.ts
src/commands/auth-choice.moonshot.test.ts
src/commands/auth-choice.preferred-provider.ts
src/commands/auth-choice.test.ts
src/commands/auth-choice.ts
src/commands/auth-token.ts
src/commands/channel-account-context.test.ts
src/commands/channel-account-context.ts
src/commands/channel-test-helpers.ts
src/commands/channels.add.test.ts
src/commands/channels.adds-non-default-telegram-account.test.ts
src/commands/channels.mock-harness.ts
src/commands/channels.surfaces-signal-runtime-errors-channels-status-output.test.ts
src/commands/channels.ts
src/commands/channels/add-mutators.ts
src/commands/channels/add.ts
src/commands/channels/capabilities.test.ts
src/commands/channels/capabilities.ts
src/commands/channels/list.ts
src/commands/channels/logs.ts
src/commands/channels/remove.ts
src/commands/channels/resolve.ts
src/commands/channels/shared.ts
src/commands/channels/status.ts
src/commands/chutes-oauth.test.ts
src/commands/chutes-oauth.ts
src/commands/cleanup-plan.ts
src/commands/cleanup-utils.test.ts
src/commands/cleanup-utils.ts
src/commands/config-validation.ts
src/commands/configure.channels.ts
src/commands/configure.commands.ts
src/commands/configure.daemon.ts
src/commands/configure.gateway-auth.prompt-auth-config.test.ts
src/commands/configure.gateway-auth.test.ts
src/commands/configure.gateway-auth.ts
src/commands/configure.gateway.test.ts
src/commands/configure.gateway.ts
src/commands/configure.shared.ts
src/commands/configure.ts
src/commands/configure.wizard.test.ts
src/commands/configure.wizard.ts
src/commands/daemon-install-helpers.test.ts
src/commands/daemon-install-helpers.ts
src/commands/daemon-install-runtime-warning.test.ts
src/commands/daemon-install-runtime-warning.ts
src/commands/daemon-runtime.ts
src/commands/dashboard.links.test.ts
src/commands/dashboard.test.ts
src/commands/dashboard.ts
src/commands/docs.ts
src/commands/doctor-auth.deprecated-cli-profiles.test.ts
src/commands/doctor-auth.hints.test.ts
src/commands/doctor-auth.ts
src/commands/doctor-completion.ts
src/commands/doctor-config-flow.include-warning.test.ts
src/commands/doctor-config-flow.missing-default-account-bindings.integration.test.ts
src/commands/doctor-config-flow.missing-default-account-bindings.test.ts
src/commands/doctor-config-flow.safe-bins.test.ts
src/commands/doctor-config-flow.test-utils.ts
src/commands/doctor-config-flow.test.ts
src/commands/doctor-config-flow.ts
src/commands/doctor-format.ts
src/commands/doctor-gateway-daemon-flow.ts
src/commands/doctor-gateway-health.ts
src/commands/doctor-gateway-services.test.ts
src/commands/doctor-gateway-services.ts
src/commands/doctor-install.ts
src/commands/doctor-legacy-config.migrations.test.ts
src/commands/doctor-legacy-config.test.ts
src/commands/doctor-legacy-config.ts
src/commands/doctor-memory-search.test.ts
src/commands/doctor-memory-search.ts
src/commands/doctor-platform-notes.launchctl-env-overrides.test.ts
src/commands/doctor-platform-notes.ts
src/commands/doctor-prompter.ts
src/commands/doctor-sandbox.ts
src/commands/doctor-sandbox.warns-sandbox-enabled-without-docker.test.ts
src/commands/doctor-security.test.ts
src/commands/doctor-security.ts
src/commands/doctor-session-locks.test.ts
src/commands/doctor-session-locks.ts
src/commands/doctor-state-integrity.test.ts
src/commands/doctor-state-integrity.ts
src/commands/doctor-state-migrations.test.ts
src/commands/doctor-state-migrations.ts
src/commands/doctor-ui.ts
src/commands/doctor-update.ts
src/commands/doctor-workspace-status.ts
src/commands/doctor-workspace.ts
src/commands/doctor.e2e-harness.ts
src/commands/doctor.fast-path-mocks.ts
src/commands/doctor.migrates-routing-allowfrom-channels-whatsapp-allowfrom.test.ts
src/commands/doctor.migrates-slack-discord-dm-policy-aliases.test.ts
src/commands/doctor.runs-legacy-state-migrations-yes-mode-without.test.ts
src/commands/doctor.ts
src/commands/doctor.warns-per-agent-sandbox-docker-browser-prune.test.ts
src/commands/doctor.warns-state-directory-is-missing.test.ts
src/commands/gateway-presence.ts
src/commands/gateway-status.test.ts
src/commands/gateway-status.ts
src/commands/gateway-status/helpers.ts
src/commands/google-gemini-model-default.ts
src/commands/health-format.ts
src/commands/health.command.coverage.test.ts
src/commands/health.snapshot.test.ts
src/commands/health.test.ts
src/commands/health.ts
src/commands/message-format.ts
src/commands/message.test.ts
src/commands/message.ts
src/commands/model-allowlist.ts
src/commands/model-default.ts
src/commands/model-picker.test.ts
src/commands/model-picker.ts
src/commands/models.auth.provider-resolution.test.ts
src/commands/models.list.auth-sync.test.ts
src/commands/models.list.test.ts
src/commands/models.set.test.ts
src/commands/models.ts
src/commands/models/aliases.ts
src/commands/models/auth-order.ts
src/commands/models/auth.ts
src/commands/models/fallbacks-shared.ts
src/commands/models/fallbacks.ts
src/commands/models/image-fallbacks.ts
src/commands/models/list.auth-overview.test.ts
src/commands/models/list.auth-overview.ts
src/commands/models/list.configured.ts
src/commands/models/list.errors.ts
src/commands/models/list.format.ts
src/commands/models/list.list-command.forward-compat.test.ts
src/commands/models/list.list-command.ts
src/commands/models/list.probe.test.ts
src/commands/models/list.probe.ts
src/commands/models/list.registry.ts
src/commands/models/list.status-command.ts
src/commands/models/list.status.test.ts
src/commands/models/list.table.ts
src/commands/models/list.ts
src/commands/models/list.types.ts
src/commands/models/scan.ts
src/commands/models/set-image.ts
src/commands/models/set.ts
src/commands/models/shared.test.ts
src/commands/models/shared.ts
src/commands/node-daemon-install-helpers.ts
src/commands/node-daemon-runtime.ts
src/commands/oauth-env.ts
src/commands/oauth-flow.ts
src/commands/onboard-auth.config-core.kilocode.test.ts
src/commands/onboard-auth.config-core.ts
src/commands/onboard-auth.config-gateways.ts
src/commands/onboard-auth.config-litellm.ts
src/commands/onboard-auth.config-minimax.ts
src/commands/onboard-auth.config-opencode.ts
src/commands/onboard-auth.config-shared.test.ts
src/commands/onboard-auth.config-shared.ts
src/commands/onboard-auth.credentials.test.ts
src/commands/onboard-auth.credentials.ts
src/commands/onboard-auth.models.ts
src/commands/onboard-auth.test.ts
src/commands/onboard-auth.ts
src/commands/onboard-channels.test.ts
src/commands/onboard-channels.ts
src/commands/onboard-config.test.ts
src/commands/onboard-config.ts
src/commands/onboard-custom.test.ts
src/commands/onboard-custom.ts
src/commands/onboard-helpers.test.ts
src/commands/onboard-helpers.ts
src/commands/onboard-hooks.test.ts
src/commands/onboard-hooks.ts
src/commands/onboard-interactive.test.ts
src/commands/onboard-interactive.ts
src/commands/onboard-non-interactive.gateway.test.ts
src/commands/onboard-non-interactive.provider-auth.test.ts
src/commands/onboard-non-interactive.test-helpers.ts
src/commands/onboard-non-interactive.ts
src/commands/onboard-non-interactive/api-keys.ts
src/commands/onboard-non-interactive/local.ts
src/commands/onboard-non-interactive/local/auth-choice-inference.ts
src/commands/onboard-non-interactive/local/auth-choice.ts
src/commands/onboard-non-interactive/local/daemon-install.ts
src/commands/onboard-non-interactive/local/gateway-config.ts
src/commands/onboard-non-interactive/local/output.ts
src/commands/onboard-non-interactive/local/skills-config.ts
src/commands/onboard-non-interactive/local/workspace.ts
src/commands/onboard-non-interactive/remote.ts
src/commands/onboard-provider-auth-flags.ts
src/commands/onboard-remote.test.ts
src/commands/onboard-remote.ts
src/commands/onboard-skills.test.ts
src/commands/onboard-skills.ts
src/commands/onboard-types.ts
src/commands/onboard.test.ts
src/commands/onboard.ts
src/commands/onboarding/__tests__/test-utils.ts
src/commands/onboarding/plugin-install.test.ts
src/commands/onboarding/plugin-install.ts
src/commands/onboarding/registry.ts
src/commands/onboarding/types.ts
src/commands/openai-codex-model-default.ts
src/commands/openai-codex-oauth.test.ts
src/commands/openai-codex-oauth.ts
src/commands/openai-model-default.test.ts
src/commands/openai-model-default.ts
src/commands/opencode-zen-model-default.ts
src/commands/provider-auth-helpers.ts
src/commands/reset.ts
src/commands/sandbox-display.ts
src/commands/sandbox-explain.test.ts
src/commands/sandbox-explain.ts
src/commands/sandbox-formatters.test.ts
src/commands/sandbox-formatters.ts
src/commands/sandbox.test.ts
src/commands/sandbox.ts
src/commands/session-store-targets.test.ts
src/commands/session-store-targets.ts
src/commands/sessions-cleanup.test.ts
src/commands/sessions-cleanup.ts
src/commands/sessions-table.ts
src/commands/sessions.default-agent-store.test.ts
src/commands/sessions.model-resolution.test.ts
src/commands/sessions.test-helpers.ts
src/commands/sessions.test.ts
src/commands/sessions.ts
src/commands/setup.ts
src/commands/signal-install.test.ts
src/commands/signal-install.ts
src/commands/status-all.ts
src/commands/status-all/agents.ts
src/commands/status-all/channels.mattermost-token-summary.test.ts
src/commands/status-all/channels.ts
src/commands/status-all/diagnosis.ts
src/commands/status-all/format.ts
src/commands/status-all/gateway.ts
src/commands/status-all/report-lines.test.ts
src/commands/status-all/report-lines.ts
src/commands/status.agent-local.ts
src/commands/status.command.ts
src/commands/status.daemon.ts
src/commands/status.format.ts
src/commands/status.gateway-probe.ts
src/commands/status.link-channel.ts
src/commands/status.scan.ts
src/commands/status.summary.redaction.test.ts
src/commands/status.summary.ts
src/commands/status.test.ts
src/commands/status.ts
src/commands/status.types.ts
src/commands/status.update.test.ts
src/commands/status.update.ts
src/commands/systemd-linger.ts
src/commands/test-runtime-config-helpers.ts
src/commands/test-wizard-helpers.ts
src/commands/text-format.test.ts
src/commands/text-format.ts
src/commands/uninstall.ts
src/commands/vllm-setup.ts
src/commands/zai-endpoint-detect.test.ts
src/commands/zai-endpoint-detect.ts
src/compat/legacy-names.ts
src/config/agent-dirs.test.ts
src/config/agent-dirs.ts
src/config/agent-limits.ts
src/config/backup-rotation.ts
src/config/cache-utils.ts
src/config/channel-capabilities.test.ts
src/config/channel-capabilities.ts
src/config/commands.test.ts
src/config/commands.ts
src/config/config-misc.test.ts
src/config/config-paths.ts
src/config/config.agent-concurrency-defaults.test.ts
src/config/config.allowlist-requires-allowfrom.test.ts
src/config/config.backup-rotation.test.ts
src/config/config.compaction-settings.test.ts
src/config/config.discord-presence.test.ts
src/config/config.discord.test.ts
src/config/config.dm-policy-alias.test.ts
src/config/config.env-vars.test.ts
src/config/config.hooks-module-paths.test.ts
src/config/config.identity-avatar.test.ts
src/config/config.identity-defaults.test.ts
src/config/config.irc.test.ts
src/config/config.legacy-config-detection.accepts-imessage-dmpolicy.test.ts
src/config/config.legacy-config-detection.rejects-routing-allowfrom.test.ts
src/config/config.meta-timestamp-coercion.test.ts
src/config/config.msteams.test.ts
src/config/config.multi-agent-agentdir-validation.test.ts
src/config/config.nix-integration-u3-u5-u9.test.ts
src/config/config.plugin-validation.test.ts
src/config/config.pruning-defaults.test.ts
src/config/config.sandbox-docker.test.ts
src/config/config.schema-regressions.test.ts
src/config/config.secrets-schema.test.ts
src/config/config.skills-entries-config.test.ts
src/config/config.talk-api-key-fallback.test.ts
src/config/config.telegram-custom-commands.test.ts
src/config/config.tools-alsoAllow.test.ts
src/config/config.ts
src/config/config.web-search-provider.test.ts
src/config/dangerous-name-matching.ts
src/config/defaults.ts
src/config/discord-preview-streaming.ts
src/config/env-preserve-io.test.ts
src/config/env-preserve.test.ts
src/config/env-preserve.ts
src/config/env-substitution.test.ts
src/config/env-substitution.ts
src/config/env-vars.ts
src/config/group-policy.test.ts
src/config/group-policy.ts
src/config/home-env.test-harness.ts
src/config/includes-scan.ts
src/config/includes.test.ts
src/config/includes.ts
src/config/io.compat.test.ts
src/config/io.eacces.test.ts
src/config/io.owner-display-secret.test.ts
src/config/io.runtime-snapshot-write.test.ts
src/config/io.ts
src/config/io.write-config.test.ts
src/config/legacy-migrate.test.ts
src/config/legacy-migrate.ts
src/config/legacy.migrations.part-1.ts
src/config/legacy.migrations.part-2.ts
src/config/legacy.migrations.part-3.ts
src/config/legacy.migrations.ts
src/config/legacy.rules.ts
src/config/legacy.shared.test.ts
src/config/legacy.shared.ts
src/config/legacy.ts
src/config/logging-max-file-bytes.test.ts
src/config/logging.ts
src/config/markdown-tables.ts
src/config/merge-config.ts
src/config/merge-patch.proto-pollution.test.ts
src/config/merge-patch.test.ts
src/config/merge-patch.ts
src/config/model-alias-defaults.test.ts
src/config/model-input.ts
src/config/normalize-exec-safe-bin.ts
src/config/normalize-paths.test.ts
src/config/normalize-paths.ts
src/config/paths.test.ts
src/config/paths.ts
src/config/plugin-auto-enable.test.ts
src/config/plugin-auto-enable.ts
src/config/plugins-allowlist.ts
src/config/plugins-runtime-boundary.test.ts
src/config/port-defaults.ts
src/config/prototype-keys.ts
src/config/redact-snapshot.test.ts
src/config/redact-snapshot.ts
src/config/runtime-group-policy-provider.ts
src/config/runtime-group-policy.test.ts
src/config/runtime-group-policy.ts
src/config/runtime-overrides.test.ts
src/config/runtime-overrides.ts
src/config/schema.help.quality.test.ts
src/config/schema.help.ts
src/config/schema.hints.test.ts
src/config/schema.hints.ts
src/config/schema.irc.ts
src/config/schema.labels.ts
src/config/schema.tags.test.ts
src/config/schema.tags.ts
src/config/schema.test.ts
src/config/schema.ts
src/config/sessions.cache.test.ts
src/config/sessions.test.ts
src/config/sessions.ts
src/config/sessions/artifacts.test.ts
src/config/sessions/artifacts.ts
src/config/sessions/cache-fields.test.ts
src/config/sessions/delivery-info.test.ts
src/config/sessions/delivery-info.ts
src/config/sessions/disk-budget.test.ts
src/config/sessions/disk-budget.ts
src/config/sessions/group.ts
src/config/sessions/main-session.ts
src/config/sessions/metadata.ts
src/config/sessions/paths.ts
src/config/sessions/reset.ts
src/config/sessions/session-file.ts
src/config/sessions/session-key.ts
src/config/sessions/sessions.test.ts
src/config/sessions/store.pruning.integration.test.ts
src/config/sessions/store.pruning.test.ts
src/config/sessions/store.session-key-normalization.test.ts
src/config/sessions/store.ts
src/config/sessions/transcript.ts
src/config/sessions/types.ts
src/config/slack-http-config.test.ts
src/config/slack-token-validation.test.ts
src/config/talk.normalize.test.ts
src/config/talk.ts
src/config/telegram-custom-commands.ts
src/config/telegram-webhook-port.test.ts
src/config/telegram-webhook-secret.test.ts
src/config/test-helpers.ts
src/config/types.acp.ts
src/config/types.agent-defaults.ts
src/config/types.agents-shared.ts
src/config/types.agents.ts
src/config/types.approvals.ts
src/config/types.auth.ts
src/config/types.base.ts
src/config/types.browser.ts
src/config/types.channel-messaging-common.ts
src/config/types.channels.ts
src/config/types.cron.ts
src/config/types.discord.ts
src/config/types.gateway.ts
src/config/types.googlechat.ts
src/config/types.hooks.ts
src/config/types.imessage.ts
src/config/types.installs.ts
src/config/types.irc.ts
src/config/types.memory.ts
src/config/types.messages.ts
src/config/types.models.ts
src/config/types.msteams.ts
src/config/types.node-host.ts
src/config/types.traversalai.ts
src/config/types.plugins.ts
src/config/types.queue.ts
src/config/types.sandbox.ts
src/config/types.secrets.ts
src/config/types.signal.ts
src/config/types.skills.ts
src/config/types.slack.ts
src/config/types.telegram.ts
src/config/types.tools.ts
src/config/types.ts
src/config/types.tts.ts
src/config/types.whatsapp.ts
src/config/validation.ts
src/config/version.ts
src/config/zod-schema.agent-defaults.ts
src/config/zod-schema.agent-model.ts
src/config/zod-schema.agent-runtime.ts
src/config/zod-schema.agents.ts
src/config/zod-schema.allowdeny.ts
src/config/zod-schema.approvals.ts
src/config/zod-schema.channels.ts
src/config/zod-schema.core.ts
src/config/zod-schema.cron-retention.test.ts
src/config/zod-schema.hooks.ts
src/config/zod-schema.installs.ts
src/config/zod-schema.logging-levels.test.ts
src/config/zod-schema.providers-core.ts
src/config/zod-schema.providers-whatsapp.ts
src/config/zod-schema.providers.ts
src/config/zod-schema.sensitive.ts
src/config/zod-schema.session-maintenance-extensions.test.ts
src/config/zod-schema.session.ts
src/config/zod-schema.ts
src/config/zod-schema.typing-mode.test.ts
src/cron/cron-protocol-conformance.test.ts
src/cron/delivery.test.ts
src/cron/delivery.ts
src/cron/isolated-agent.auth-profile-propagation.test.ts
src/cron/isolated-agent.delivers-response-has-heartbeat-ok-but-includes.test.ts
src/cron/isolated-agent.delivery-target-thread-session.test.ts
src/cron/isolated-agent.delivery.test-helpers.ts
src/cron/isolated-agent.direct-delivery-forum-topics.test.ts
src/cron/isolated-agent.mocks.ts
src/cron/isolated-agent.skips-delivery-without-whatsapp-recipient-besteffortdeliver-true.test.ts
src/cron/isolated-agent.test-harness.ts
src/cron/isolated-agent.test-setup.ts
src/cron/isolated-agent.ts
src/cron/isolated-agent.uses-last-non-empty-agent-text-as.test.ts
src/cron/isolated-agent/delivery-dispatch.ts
src/cron/isolated-agent/delivery-target.test.ts
src/cron/isolated-agent/delivery-target.ts
src/cron/isolated-agent/helpers.ts
src/cron/isolated-agent/run.session-key.test.ts
src/cron/isolated-agent/run.skill-filter.test.ts
src/cron/isolated-agent/run.ts
src/cron/isolated-agent/session-key.ts
src/cron/isolated-agent/session.test.ts
src/cron/isolated-agent/session.ts
src/cron/isolated-agent/skills-snapshot.ts
src/cron/isolated-agent/subagent-followup.ts
src/cron/legacy-delivery.ts
src/cron/normalize.test.ts
src/cron/normalize.ts
src/cron/parse.ts
src/cron/payload-migration.ts
src/cron/run-log.test.ts
src/cron/run-log.ts
src/cron/schedule.test.ts
src/cron/schedule.ts
src/cron/service.delivery-plan.test.ts
src/cron/service.every-jobs-fire.test.ts
src/cron/service.get-job.test.ts
src/cron/service.issue-13992-regression.test.ts
src/cron/service.issue-16156-list-skips-cron.test.ts
src/cron/service.issue-17852-daily-skip.test.ts
src/cron/service.issue-22895-every-next-run.test.ts
src/cron/service.issue-regressions.test.ts
src/cron/service.jobs.test.ts
src/cron/service.jobs.top-of-hour-stagger.test.ts
src/cron/service.persists-delivered-status.test.ts
src/cron/service.prevents-duplicate-timers.test.ts
src/cron/service.read-ops-nonblocking.test.ts
src/cron/service.rearm-timer-when-running.test.ts
src/cron/service.restart-catchup.test.ts
src/cron/service.runs-one-shot-main-job-disables-it.test.ts
src/cron/service.skips-main-jobs-empty-systemevent-text.test.ts
src/cron/service.store-migration.test.ts
src/cron/service.store.migration.test.ts
src/cron/service.test-harness.ts
src/cron/service.ts
src/cron/service/jobs.schedule-error-isolation.test.ts
src/cron/service/jobs.ts
src/cron/service/locked.ts
src/cron/service/normalize.ts
src/cron/service/ops.ts
src/cron/service/state.ts
src/cron/service/store.ts
src/cron/service/timeout-policy.test.ts
src/cron/service/timeout-policy.ts
src/cron/service/timer.ts
src/cron/session-reaper.test.ts
src/cron/session-reaper.ts
src/cron/stagger.test.ts
src/cron/stagger.ts
src/cron/store.test.ts
src/cron/store.ts
src/cron/types.ts
src/cron/validate-timestamp.ts
src/cron/webhook-url.ts
src/daemon/arg-split.ts
src/daemon/cmd-argv.test.ts
src/daemon/cmd-argv.ts
src/daemon/cmd-set.ts
src/daemon/constants.test.ts
src/daemon/constants.ts
src/daemon/diagnostics.ts
src/daemon/exec-file.ts
src/daemon/inspect.test.ts
src/daemon/inspect.ts
src/daemon/launchd-plist.ts
src/daemon/launchd.integration.test.ts
src/daemon/launchd.test.ts
src/daemon/launchd.ts
src/daemon/node-service.ts
src/daemon/output.ts
src/daemon/paths.ts
src/daemon/program-args.test.ts
src/daemon/program-args.ts
src/daemon/runtime-binary.test.ts
src/daemon/runtime-binary.ts
src/daemon/runtime-format.ts
src/daemon/runtime-parse.ts
src/daemon/runtime-paths.test.ts
src/daemon/runtime-paths.ts
src/daemon/schtasks-exec.ts
src/daemon/schtasks.install.test.ts
src/daemon/schtasks.test.ts
src/daemon/schtasks.ts
src/daemon/service-audit.test.ts
src/daemon/service-audit.ts
src/daemon/service-env.test.ts
src/daemon/service-env.ts
src/daemon/service-runtime.ts
src/daemon/service-types.ts
src/daemon/service.ts
src/daemon/systemd-hints.ts
src/daemon/systemd-linger.ts
src/daemon/systemd-unit.test.ts
src/daemon/systemd-unit.ts
src/daemon/systemd.test.ts
src/daemon/systemd.ts
src/discord/accounts.test.ts
src/discord/accounts.ts
src/discord/api.test.ts
src/discord/api.ts
src/discord/audit.test.ts
src/discord/audit.ts
src/discord/chunk.test.ts
src/discord/chunk.ts
src/discord/client.ts
src/discord/components-registry.ts
src/discord/components.test.ts
src/discord/components.ts
src/discord/directory-live.test.ts
src/discord/directory-live.ts
src/discord/draft-chunking.ts
src/discord/draft-stream.ts
src/discord/gateway-logging.test.ts
src/discord/gateway-logging.ts
src/discord/guilds.ts
src/discord/monitor.gateway.test.ts
src/discord/monitor.gateway.ts
src/discord/monitor.test.ts
src/discord/monitor.tool-result.accepts-guild-messages-mentionpatterns-match.test.ts
src/discord/monitor.tool-result.sends-status-replies-responseprefix.test.ts
src/discord/monitor.tool-result.test-harness.ts
src/discord/monitor.ts
src/discord/monitor/agent-components.ts
src/discord/monitor/allow-list.ts
src/discord/monitor/commands.test.ts
src/discord/monitor/commands.ts
src/discord/monitor/exec-approvals.test.ts
src/discord/monitor/exec-approvals.ts
src/discord/monitor/format.ts
src/discord/monitor/gateway-error-guard.test.ts
src/discord/monitor/gateway-error-guard.ts
src/discord/monitor/gateway-plugin.ts
src/discord/monitor/gateway-registry.ts
src/discord/monitor/listeners.ts
src/discord/monitor/message-handler.inbound-contract.test.ts
src/discord/monitor/message-handler.preflight.test.ts
src/discord/monitor/message-handler.preflight.ts
src/discord/monitor/message-handler.preflight.types.ts
src/discord/monitor/message-handler.process.test.ts
src/discord/monitor/message-handler.process.ts
src/discord/monitor/message-handler.test-harness.ts
src/discord/monitor/message-handler.ts
src/discord/monitor/message-utils.test.ts
src/discord/monitor/message-utils.ts
src/discord/monitor/model-picker-preferences.test.ts
src/discord/monitor/model-picker-preferences.ts
src/discord/monitor/model-picker.test-utils.ts
src/discord/monitor/model-picker.test.ts
src/discord/monitor/model-picker.ts
src/discord/monitor/monitor.test.ts
src/discord/monitor/native-command.model-picker.test.ts
src/discord/monitor/native-command.ts
src/discord/monitor/presence-cache.ts
src/discord/monitor/presence.ts
src/discord/monitor/provider.allowlist.test.ts
src/discord/monitor/provider.allowlist.ts
src/discord/monitor/provider.group-policy.test.ts
src/discord/monitor/provider.lifecycle.test.ts
src/discord/monitor/provider.lifecycle.ts
src/discord/monitor/provider.proxy.test.ts
src/discord/monitor/provider.rest-proxy.test.ts
src/discord/monitor/provider.skill-dedupe.test.ts
src/discord/monitor/provider.test.ts
src/discord/monitor/provider.ts
src/discord/monitor/reply-context.ts
src/discord/monitor/reply-delivery.test.ts
src/discord/monitor/reply-delivery.ts
src/discord/monitor/rest-fetch.ts
src/discord/monitor/sender-identity.ts
src/discord/monitor/system-events.ts
src/discord/monitor/thread-bindings.config.ts
src/discord/monitor/thread-bindings.discord-api.test.ts
src/discord/monitor/thread-bindings.discord-api.ts
src/discord/monitor/thread-bindings.lifecycle.ts
src/discord/monitor/thread-bindings.manager.ts
src/discord/monitor/thread-bindings.messages.ts
src/discord/monitor/thread-bindings.persona.test.ts
src/discord/monitor/thread-bindings.persona.ts
src/discord/monitor/thread-bindings.shared-state.test.ts
src/discord/monitor/thread-bindings.state.ts
src/discord/monitor/thread-bindings.ts
src/discord/monitor/thread-bindings.ttl.test.ts
src/discord/monitor/thread-bindings.types.ts
src/discord/monitor/threading.auto-thread.test.ts
src/discord/monitor/threading.parent-info.test.ts
src/discord/monitor/threading.starter.test.ts
src/discord/monitor/threading.ts
src/discord/monitor/typing.ts
src/discord/pluralkit.test.ts
src/discord/pluralkit.ts
src/discord/probe.intents.test.ts
src/discord/probe.ts
src/discord/resolve-channels.test.ts
src/discord/resolve-channels.ts
src/discord/resolve-users.test.ts
src/discord/resolve-users.ts
src/discord/send.channels.ts
src/discord/send.components.test.ts
src/discord/send.components.ts
src/discord/send.creates-thread.test.ts
src/discord/send.emojis-stickers.ts
src/discord/send.guild.ts
src/discord/send.messages.ts
src/discord/send.outbound.ts
src/discord/send.permissions.authz.test.ts
src/discord/send.permissions.ts
src/discord/send.reactions.ts
src/discord/send.sends-basic-channel-messages.test.ts
src/discord/send.shared.ts
src/discord/send.test-harness.ts
src/discord/send.ts
src/discord/send.types.ts
src/discord/send.webhook-activity.test.ts
src/discord/targets.test.ts
src/discord/targets.ts
src/discord/test-http-helpers.ts
src/discord/token.test.ts
src/discord/token.ts
src/discord/ui.ts
src/discord/voice-message.ts
src/discord/voice/command.test.ts
src/discord/voice/command.ts
src/discord/voice/manager.test.ts
src/discord/voice/manager.ts
src/docker-image-digests.test.ts
src/docker-setup.test.ts
src/dockerfile.test.ts
src/docs/slash-commands-doc.test.ts
src/entry.ts
src/extensionAPI.ts
src/gateway/agent-event-assistant-text.ts
src/gateway/agent-prompt.test.ts
src/gateway/agent-prompt.ts
src/gateway/assistant-identity.test.ts
src/gateway/assistant-identity.ts
src/gateway/auth-rate-limit.test.ts
src/gateway/auth-rate-limit.ts
src/gateway/auth.test.ts
src/gateway/auth.ts
src/gateway/boot.test.ts
src/gateway/boot.ts
src/gateway/call.test.ts
src/gateway/call.ts
src/gateway/canvas-capability.ts
src/gateway/channel-health-monitor.test.ts
src/gateway/channel-health-monitor.ts
src/gateway/chat-abort.test.ts
src/gateway/chat-abort.ts
src/gateway/chat-attachments.test.ts
src/gateway/chat-attachments.ts
src/gateway/chat-sanitize.test.ts
src/gateway/chat-sanitize.ts
src/gateway/client.test.ts
src/gateway/client.ts
src/gateway/client.watchdog.test.ts
src/gateway/config-reload.test.ts
src/gateway/config-reload.ts
src/gateway/control-plane-audit.ts
src/gateway/control-plane-rate-limit.ts
src/gateway/control-ui-contract.ts
src/gateway/control-ui-csp.test.ts
src/gateway/control-ui-csp.ts
src/gateway/control-ui-shared.ts
src/gateway/control-ui.http.test.ts
src/gateway/control-ui.ts
src/gateway/credential-precedence.parity.test.ts
src/gateway/credentials.test.ts
src/gateway/credentials.ts
src/gateway/device-auth.test.ts
src/gateway/device-auth.ts
src/gateway/events.ts
src/gateway/exec-approval-manager.ts
src/gateway/gateway-cli-backend.live.test.ts
src/gateway/gateway-config-prompts.shared.ts
src/gateway/gateway-connection.test-mocks.ts
src/gateway/gateway-misc.test.ts
src/gateway/gateway-models.profiles.live.test.ts
src/gateway/gateway.test.ts
src/gateway/hooks-mapping.test.ts
src/gateway/hooks-mapping.ts
src/gateway/hooks.test.ts
src/gateway/hooks.ts
src/gateway/http-auth-helpers.test.ts
src/gateway/http-auth-helpers.ts
src/gateway/http-common.ts
src/gateway/http-endpoint-helpers.test.ts
src/gateway/http-endpoint-helpers.ts
src/gateway/http-utils.ts
src/gateway/live-image-probe.ts
src/gateway/live-tool-probe-utils.test.ts
src/gateway/live-tool-probe-utils.ts
src/gateway/method-scopes.test.ts
src/gateway/method-scopes.ts
src/gateway/net.test.ts
src/gateway/net.ts
src/gateway/node-command-policy.ts
src/gateway/node-invoke-sanitize.ts
src/gateway/node-invoke-system-run-approval-errors.ts
src/gateway/node-invoke-system-run-approval-match.test.ts
src/gateway/node-invoke-system-run-approval-match.ts
src/gateway/node-invoke-system-run-approval.test.ts
src/gateway/node-invoke-system-run-approval.ts
src/gateway/node-registry.ts
src/gateway/open-responses.schema.ts
src/gateway/openai-http.test.ts
src/gateway/openai-http.ts
src/gateway/openresponses-http.test.ts
src/gateway/openresponses-http.ts
src/gateway/openresponses-parity.test.ts
src/gateway/openresponses-prompt.ts
src/gateway/origin-check.test.ts
src/gateway/origin-check.ts
src/gateway/probe-auth.ts
src/gateway/probe.test.ts
src/gateway/probe.ts
src/gateway/protocol/client-info.ts
src/gateway/protocol/connect-error-details.ts
src/gateway/protocol/cron-validators.test.ts
src/gateway/protocol/index.test.ts
src/gateway/protocol/index.ts
src/gateway/protocol/schema.ts
src/gateway/protocol/schema/agent.ts
src/gateway/protocol/schema/agents-models-skills.ts
src/gateway/protocol/schema/channels.ts
src/gateway/protocol/schema/config.ts
src/gateway/protocol/schema/cron.ts
src/gateway/protocol/schema/devices.ts
src/gateway/protocol/schema/error-codes.ts
src/gateway/protocol/schema/exec-approvals.ts
src/gateway/protocol/schema/frames.ts
src/gateway/protocol/schema/logs-chat.ts
src/gateway/protocol/schema/nodes.ts
src/gateway/protocol/schema/primitives.ts
src/gateway/protocol/schema/protocol-schemas.ts
src/gateway/protocol/schema/push.ts
src/gateway/protocol/schema/sessions.ts
src/gateway/protocol/schema/snapshot.ts
src/gateway/protocol/schema/types.ts
src/gateway/protocol/schema/wizard.ts
src/gateway/role-policy.test.ts
src/gateway/role-policy.ts
src/gateway/security-path.test.ts
src/gateway/security-path.ts
src/gateway/server-broadcast.ts
src/gateway/server-browser.ts
src/gateway/server-channels.test.ts
src/gateway/server-channels.ts
src/gateway/server-chat.agent-events.test.ts
src/gateway/server-chat.ts
src/gateway/server-close.ts
src/gateway/server-constants.ts
src/gateway/server-cron.test.ts
src/gateway/server-cron.ts
src/gateway/server-discovery-runtime.ts
src/gateway/server-discovery.test.ts
src/gateway/server-discovery.ts
src/gateway/server-http.hooks-request-timeout.test.ts
src/gateway/server-http.ts
src/gateway/server-lanes.ts
src/gateway/server-maintenance.ts
src/gateway/server-methods-list.ts
src/gateway/server-methods.control-plane-rate-limit.test.ts
src/gateway/server-methods.ts
src/gateway/server-methods/agent-job.ts
src/gateway/server-methods/agent-timestamp.ts
src/gateway/server-methods/agent.test.ts
src/gateway/server-methods/agent.ts
src/gateway/server-methods/agents-mutate.test.ts
src/gateway/server-methods/agents.ts
src/gateway/server-methods/attachment-normalize.ts
src/gateway/server-methods/base-hash.ts
src/gateway/server-methods/browser.ts
src/gateway/server-methods/channels.ts
src/gateway/server-methods/chat-transcript-inject.ts
src/gateway/server-methods/chat.abort-persistence.test.ts
src/gateway/server-methods/chat.directive-tags.test.ts
src/gateway/server-methods/chat.inject.parentid.test.ts
src/gateway/server-methods/chat.test-helpers.ts
src/gateway/server-methods/chat.ts
src/gateway/server-methods/config.ts
src/gateway/server-methods/connect.ts
src/gateway/server-methods/cron.ts
src/gateway/server-methods/devices.ts
src/gateway/server-methods/doctor.test.ts
src/gateway/server-methods/doctor.ts
src/gateway/server-methods/exec-approval.ts
src/gateway/server-methods/exec-approvals.ts
src/gateway/server-methods/health.ts
src/gateway/server-methods/logs.ts
src/gateway/server-methods/models.ts
src/gateway/server-methods/nodes.handlers.invoke-result.ts
src/gateway/server-methods/nodes.helpers.ts
src/gateway/server-methods/nodes.invoke-wake.test.ts
src/gateway/server-methods/nodes.ts
src/gateway/server-methods/push.test.ts
src/gateway/server-methods/push.ts
src/gateway/server-methods/restart-request.ts
src/gateway/server-methods/secrets.test.ts
src/gateway/server-methods/secrets.ts
src/gateway/server-methods/send.test.ts
src/gateway/server-methods/send.ts
src/gateway/server-methods/server-methods.test.ts
src/gateway/server-methods/sessions.ts
src/gateway/server-methods/skills.ts
src/gateway/server-methods/skills.update.normalizes-api-key.test.ts
src/gateway/server-methods/system.ts
src/gateway/server-methods/talk.ts
src/gateway/server-methods/tools-catalog.test.ts
src/gateway/server-methods/tools-catalog.ts
src/gateway/server-methods/tts.ts
src/gateway/server-methods/types.ts
src/gateway/server-methods/update.test.ts
src/gateway/server-methods/update.ts
src/gateway/server-methods/usage.sessions-usage.test.ts
src/gateway/server-methods/usage.test.ts
src/gateway/server-methods/usage.ts
src/gateway/server-methods/validation.ts
src/gateway/server-methods/voicewake.ts
src/gateway/server-methods/web.ts
src/gateway/server-methods/wizard.ts
src/gateway/server-mobile-nodes.ts
src/gateway/server-model-catalog.ts
src/gateway/server-node-events-types.ts
src/gateway/server-node-events.test.ts
src/gateway/server-node-events.ts
src/gateway/server-node-subscriptions.ts
src/gateway/server-plugins.test.ts
src/gateway/server-plugins.ts
src/gateway/server-reload-handlers.ts
src/gateway/server-restart-deferral.test.ts
src/gateway/server-restart-sentinel.test.ts
src/gateway/server-restart-sentinel.ts
src/gateway/server-runtime-config.test.ts
src/gateway/server-runtime-config.ts
src/gateway/server-runtime-state.ts
src/gateway/server-session-key.ts
src/gateway/server-shared.ts
src/gateway/server-startup-log.test.ts
src/gateway/server-startup-log.ts
src/gateway/server-startup-memory.test.ts
src/gateway/server-startup-memory.ts
src/gateway/server-startup.ts
src/gateway/server-tailscale.ts
src/gateway/server-utils.ts
src/gateway/server-wizard-sessions.ts
src/gateway/server-ws-runtime.ts
src/gateway/server.agent.gateway-server-agent-a.test.ts
src/gateway/server.agent.gateway-server-agent-b.test.ts
src/gateway/server.agent.gateway-server-agent.mocks.ts
src/gateway/server.auth.browser-hardening.test.ts
src/gateway/server.auth.test.ts
src/gateway/server.canvas-auth.test.ts
src/gateway/server.channels.test.ts
src/gateway/server.chat.gateway-server-chat-b.test.ts
src/gateway/server.chat.gateway-server-chat.test.ts
src/gateway/server.config-apply.test.ts
src/gateway/server.config-patch.test.ts
src/gateway/server.cron.test.ts
src/gateway/server.e2e-registry-helpers.ts
src/gateway/server.e2e-ws-harness.ts
src/gateway/server.health.test.ts
src/gateway/server.hooks.test.ts
src/gateway/server.impl.ts
src/gateway/server.ios-client-id.test.ts
src/gateway/server.models-voicewake-misc.test.ts
src/gateway/server.node-invoke-approval-bypass.test.ts
src/gateway/server.plugin-http-auth.test.ts
src/gateway/server.reload.test.ts
src/gateway/server.roles-allowlist-update.test.ts
src/gateway/server.sessions-send.test.ts
src/gateway/server.sessions.gateway-server-sessions-a.test.ts
src/gateway/server.skills-status.test.ts
src/gateway/server.talk-config.test.ts
src/gateway/server.tools-catalog.test.ts
src/gateway/server.ts
src/gateway/server/__tests__/test-utils.ts
src/gateway/server/close-reason.ts
src/gateway/server/health-state.ts
src/gateway/server/hooks.ts
src/gateway/server/http-listen.ts
src/gateway/server/plugins-http.test.ts
src/gateway/server/plugins-http.ts
src/gateway/server/presence-events.test.ts
src/gateway/server/presence-events.ts
src/gateway/server/tls.ts
src/gateway/server/ws-connection.ts
src/gateway/server/ws-connection/auth-context.test.ts
src/gateway/server/ws-connection/auth-context.ts
src/gateway/server/ws-connection/auth-messages.ts
src/gateway/server/ws-connection/connect-policy.test.ts
src/gateway/server/ws-connection/connect-policy.ts
src/gateway/server/ws-connection/message-handler.ts
src/gateway/server/ws-connection/unauthorized-flood-guard.test.ts
src/gateway/server/ws-connection/unauthorized-flood-guard.ts
src/gateway/server/ws-types.ts
src/gateway/session-preview.test-helpers.ts
src/gateway/session-utils.fs.test.ts
src/gateway/session-utils.fs.ts
src/gateway/session-utils.test.ts
src/gateway/session-utils.ts
src/gateway/session-utils.types.ts
src/gateway/sessions-patch.test.ts
src/gateway/sessions-patch.ts
src/gateway/sessions-resolve.ts
src/gateway/startup-auth.test.ts
src/gateway/startup-auth.ts
src/gateway/system-run-approval-binding.contract.test.ts
src/gateway/system-run-approval-binding.test.ts
src/gateway/test-helpers.agent-results.ts
src/gateway/test-helpers.e2e.ts
src/gateway/test-helpers.mocks.ts
src/gateway/test-helpers.openai-mock.ts
src/gateway/test-helpers.server.ts
src/gateway/test-helpers.ts
src/gateway/test-http-response.ts
src/gateway/test-openai-responses-model.ts
src/gateway/test-temp-config.ts
src/gateway/test-with-server.ts
src/gateway/tools-invoke-http.cron-regression.test.ts
src/gateway/tools-invoke-http.test.ts
src/gateway/tools-invoke-http.ts
src/gateway/ws-log.test.ts
src/gateway/ws-log.ts
src/gateway/ws-logging.ts
src/globals.ts
src/hooks/bundled-dir.ts
src/hooks/bundled/boot-md/handler.gateway-startup.integration.test.ts
src/hooks/bundled/boot-md/handler.test.ts
src/hooks/bundled/boot-md/handler.ts
src/hooks/bundled/bootstrap-extra-files/handler.test.ts
src/hooks/bundled/bootstrap-extra-files/handler.ts
src/hooks/bundled/command-logger/handler.ts
src/hooks/bundled/session-memory/handler.test.ts
src/hooks/bundled/session-memory/handler.ts
src/hooks/config.ts
src/hooks/frontmatter.test.ts
src/hooks/frontmatter.ts
src/hooks/gmail-ops.ts
src/hooks/gmail-setup-utils.test.ts
src/hooks/gmail-setup-utils.ts
src/hooks/gmail-watcher-lifecycle.test.ts
src/hooks/gmail-watcher-lifecycle.ts
src/hooks/gmail-watcher.ts
src/hooks/gmail.test.ts
src/hooks/gmail.ts
src/hooks/hooks-install.test.ts
src/hooks/hooks-status.ts
src/hooks/hooks.ts
src/hooks/import-url.test.ts
src/hooks/import-url.ts
src/hooks/install.test.ts
src/hooks/install.ts
src/hooks/installs.ts
src/hooks/internal-hooks.test.ts
src/hooks/internal-hooks.ts
src/hooks/llm-slug-generator.ts
src/hooks/loader.test.ts
src/hooks/loader.ts
src/hooks/module-loader.test.ts
src/hooks/module-loader.ts
src/hooks/types.ts
src/hooks/workspace.test.ts
src/hooks/workspace.ts
src/imessage/accounts.ts
src/imessage/client.ts
src/imessage/constants.ts
src/imessage/monitor.gating.test.ts
src/imessage/monitor.shutdown.unhandled-rejection.test.ts
src/imessage/monitor.ts
src/imessage/monitor/abort-handler.ts
src/imessage/monitor/deliver.test.ts
src/imessage/monitor/deliver.ts
src/imessage/monitor/echo-cache.ts
src/imessage/monitor/inbound-processing.test.ts
src/imessage/monitor/inbound-processing.ts
src/imessage/monitor/monitor-provider.echo-cache.test.ts
src/imessage/monitor/monitor-provider.ts
src/imessage/monitor/parse-notification.ts
src/imessage/monitor/provider.group-policy.test.ts
src/imessage/monitor/runtime.ts
src/imessage/monitor/types.ts
src/imessage/probe.test.ts
src/imessage/probe.ts
src/imessage/send.test.ts
src/imessage/send.ts
src/imessage/target-parsing-helpers.ts
src/imessage/targets.test.ts
src/imessage/targets.ts
src/index.ts
src/infra/abort-pattern.test.ts
src/infra/abort-signal.test.ts
src/infra/abort-signal.ts
src/infra/agent-events.test.ts
src/infra/agent-events.ts
src/infra/archive-path.test.ts
src/infra/archive-path.ts
src/infra/archive.test.ts
src/infra/archive.ts
src/infra/backoff.ts
src/infra/binaries.ts
src/infra/bonjour-ciao.ts
src/infra/bonjour-discovery.test.ts
src/infra/bonjour-discovery.ts
src/infra/bonjour-errors.ts
src/infra/bonjour.test.ts
src/infra/bonjour.ts
src/infra/boundary-file-read.ts
src/infra/boundary-path.test.ts
src/infra/boundary-path.ts
src/infra/brew.test.ts
src/infra/brew.ts
src/infra/canvas-host-url.ts
src/infra/channel-activity.ts
src/infra/channel-summary.ts
src/infra/channels-status-issues.ts
src/infra/clipboard.ts
src/infra/control-ui-assets.test.ts
src/infra/control-ui-assets.ts
src/infra/dedupe.ts
src/infra/detect-package-manager.ts
src/infra/device-auth-store.ts
src/infra/device-identity.state-dir.test.ts
src/infra/device-identity.ts
src/infra/device-pairing.test.ts
src/infra/device-pairing.ts
src/infra/diagnostic-events.ts
src/infra/diagnostic-flags.ts
src/infra/dotenv.test.ts
src/infra/dotenv.ts
src/infra/env-file.ts
src/infra/env.test.ts
src/infra/env.ts
src/infra/errors.ts
src/infra/exec-approval-forwarder.test.ts
src/infra/exec-approval-forwarder.ts
src/infra/exec-approvals-allow-always.test.ts
src/infra/exec-approvals-allowlist.ts
src/infra/exec-approvals-analysis.ts
src/infra/exec-approvals-config.test.ts
src/infra/exec-approvals-parity.test.ts
src/infra/exec-approvals-safe-bins.test.ts
src/infra/exec-approvals-test-helpers.ts
src/infra/exec-approvals.test.ts
src/infra/exec-approvals.ts
src/infra/exec-command-resolution.ts
src/infra/exec-host.ts
src/infra/exec-obfuscation-detect.test.ts
src/infra/exec-obfuscation-detect.ts
src/infra/exec-safe-bin-policy-profiles.ts
src/infra/exec-safe-bin-policy-validator.ts
src/infra/exec-safe-bin-policy.test.ts
src/infra/exec-safe-bin-policy.ts
src/infra/exec-safe-bin-runtime-policy.test.ts
src/infra/exec-safe-bin-runtime-policy.ts
src/infra/exec-safe-bin-trust.test.ts
src/infra/exec-safe-bin-trust.ts
src/infra/exec-safety.ts
src/infra/exec-wrapper-resolution.ts
src/infra/fetch.test.ts
src/infra/fetch.ts
src/infra/file-identity.test.ts
src/infra/file-identity.ts
src/infra/file-lock.ts
src/infra/fixed-window-rate-limit.test.ts
src/infra/fixed-window-rate-limit.ts
src/infra/format-time/format-datetime.ts
src/infra/format-time/format-duration.ts
src/infra/format-time/format-relative.ts
src/infra/format-time/format-time.test.ts
src/infra/fs-safe.test.ts
src/infra/fs-safe.ts
src/infra/gateway-lock.test.ts
src/infra/gateway-lock.ts
src/infra/gemini-auth.ts
src/infra/git-commit.ts
src/infra/git-root.test.ts
src/infra/git-root.ts
src/infra/hardlink-guards.ts
src/infra/heartbeat-active-hours.test.ts
src/infra/heartbeat-active-hours.ts
src/infra/heartbeat-events-filter.test.ts
src/infra/heartbeat-events-filter.ts
src/infra/heartbeat-events.ts
src/infra/heartbeat-reason.test.ts
src/infra/heartbeat-reason.ts
src/infra/heartbeat-runner.ghost-reminder.test.ts
src/infra/heartbeat-runner.model-override.test.ts
src/infra/heartbeat-runner.respects-ackmaxchars-heartbeat-acks.test.ts
src/infra/heartbeat-runner.returns-default-unset.test.ts
src/infra/heartbeat-runner.scheduler.test.ts
src/infra/heartbeat-runner.sender-prefers-delivery-target.test.ts
src/infra/heartbeat-runner.test-harness.ts
src/infra/heartbeat-runner.test-utils.ts
src/infra/heartbeat-runner.transcript-prune.test.ts
src/infra/heartbeat-runner.ts
src/infra/heartbeat-visibility.test.ts
src/infra/heartbeat-visibility.ts
src/infra/heartbeat-wake.test.ts
src/infra/heartbeat-wake.ts
src/infra/home-dir.test.ts
src/infra/home-dir.ts
src/infra/host-env-security.policy-parity.test.ts
src/infra/host-env-security.test.ts
src/infra/host-env-security.ts
src/infra/http-body.test.ts
src/infra/http-body.ts
src/infra/infra-parsing.test.ts
src/infra/infra-runtime.test.ts
src/infra/infra-store.test.ts
src/infra/install-flow.test.ts
src/infra/install-flow.ts
src/infra/install-mode-options.test.ts
src/infra/install-mode-options.ts
src/infra/install-package-dir.ts
src/infra/install-safe-path.test.ts
src/infra/install-safe-path.ts
src/infra/install-source-utils.test.ts
src/infra/install-source-utils.ts
src/infra/is-main.ts
src/infra/json-file.ts
src/infra/json-files.ts
src/infra/jsonl-socket.ts
src/infra/machine-name.ts
src/infra/map-size.ts
src/infra/net/fetch-guard.ssrf.test.ts
src/infra/net/fetch-guard.ts
src/infra/net/hostname.ts
src/infra/net/ssrf.dispatcher.test.ts
src/infra/net/ssrf.pinning.test.ts
src/infra/net/ssrf.test.ts
src/infra/net/ssrf.ts
src/infra/node-commands.ts
src/infra/node-pairing.test.ts
src/infra/node-pairing.ts
src/infra/node-shell.ts
src/infra/npm-integrity.test.ts
src/infra/npm-integrity.ts
src/infra/npm-pack-install.test.ts
src/infra/npm-pack-install.ts
src/infra/npm-registry-spec.ts
src/infra/traversalai-root.test.ts
src/infra/traversalai-root.ts
src/infra/os-summary.ts
src/infra/outbound/abort.ts
src/infra/outbound/agent-delivery.test.ts
src/infra/outbound/agent-delivery.ts
src/infra/outbound/bound-delivery-router.test.ts
src/infra/outbound/bound-delivery-router.ts
src/infra/outbound/channel-adapters.ts
src/infra/outbound/channel-resolution.ts
src/infra/outbound/channel-selection.ts
src/infra/outbound/channel-target.ts
src/infra/outbound/conversation-id.test.ts
src/infra/outbound/conversation-id.ts
src/infra/outbound/deliver.test.ts
src/infra/outbound/deliver.ts
src/infra/outbound/delivery-queue.ts
src/infra/outbound/directory-cache.ts
src/infra/outbound/envelope.ts
src/infra/outbound/format.ts
src/infra/outbound/identity.ts
src/infra/outbound/message-action-params.ts
src/infra/outbound/message-action-runner.test.ts
src/infra/outbound/message-action-runner.threading.test.ts
src/infra/outbound/message-action-runner.ts
src/infra/outbound/message-action-spec.ts
src/infra/outbound/message.channels.test.ts
src/infra/outbound/message.test.ts
src/infra/outbound/message.ts
src/infra/outbound/outbound-policy.ts
src/infra/outbound/outbound-send-service.test.ts
src/infra/outbound/outbound-send-service.ts
src/infra/outbound/outbound-session.ts
src/infra/outbound/outbound.test.ts
src/infra/outbound/payloads.ts
src/infra/outbound/session-binding-service.test.ts
src/infra/outbound/session-binding-service.ts
src/infra/outbound/session-context.ts
src/infra/outbound/target-errors.ts
src/infra/outbound/target-normalization.ts
src/infra/outbound/target-resolver.test.ts
src/infra/outbound/target-resolver.ts
src/infra/outbound/targets.channel-resolution.test.ts
src/infra/outbound/targets.shared-test.ts
src/infra/outbound/targets.test.ts
src/infra/outbound/targets.ts
src/infra/outbound/tool-payload.ts
src/infra/package-json.ts
src/infra/pairing-files.ts
src/infra/pairing-pending.ts
src/infra/pairing-token.ts
src/infra/path-alias-guards.test.ts
src/infra/path-alias-guards.ts
src/infra/path-env.test.ts
src/infra/path-env.ts
src/infra/path-guards.ts
src/infra/path-prepend.ts
src/infra/path-safety.test.ts
src/infra/path-safety.ts
src/infra/plain-object.test.ts
src/infra/plain-object.ts
src/infra/ports-format.ts
src/infra/ports-inspect.ts
src/infra/ports-lsof.ts
src/infra/ports-probe.ts
src/infra/ports-types.ts
src/infra/ports.test.ts
src/infra/ports.ts
src/infra/process-respawn.test.ts
src/infra/process-respawn.ts
src/infra/prototype-keys.ts
src/infra/provider-usage.auth.normalizes-keys.test.ts
src/infra/provider-usage.auth.ts
src/infra/provider-usage.fetch.claude.test.ts
src/infra/provider-usage.fetch.claude.ts
src/infra/provider-usage.fetch.codex.test.ts
src/infra/provider-usage.fetch.codex.ts
src/infra/provider-usage.fetch.copilot.test.ts
src/infra/provider-usage.fetch.copilot.ts
src/infra/provider-usage.fetch.gemini.test.ts
src/infra/provider-usage.fetch.gemini.ts
src/infra/provider-usage.fetch.minimax.test.ts
src/infra/provider-usage.fetch.minimax.ts
src/infra/provider-usage.fetch.shared.test.ts
src/infra/provider-usage.fetch.shared.ts
src/infra/provider-usage.fetch.ts
src/infra/provider-usage.fetch.zai.test.ts
src/infra/provider-usage.fetch.zai.ts
src/infra/provider-usage.format.test.ts
src/infra/provider-usage.format.ts
src/infra/provider-usage.load.ts
src/infra/provider-usage.shared.test.ts
src/infra/provider-usage.shared.ts
src/infra/provider-usage.test.ts
src/infra/provider-usage.ts
src/infra/provider-usage.types.ts
src/infra/push-apns.test.ts
src/infra/push-apns.ts
src/infra/restart-sentinel.test.ts
src/infra/restart-sentinel.ts
src/infra/restart-stale-pids.ts
src/infra/restart.test.ts
src/infra/restart.ts
src/infra/retry-policy.ts
src/infra/retry.test.ts
src/infra/retry.ts
src/infra/run-node.test.ts
src/infra/runtime-guard.test.ts
src/infra/runtime-guard.ts
src/infra/runtime-status.ts
src/infra/safe-open-sync.ts
src/infra/scp-host.test.ts
src/infra/scp-host.ts
src/infra/scripts-modules.d.ts
src/infra/secure-random.test.ts
src/infra/secure-random.ts
src/infra/session-cost-usage.test.ts
src/infra/session-cost-usage.ts
src/infra/session-cost-usage.types.ts
src/infra/session-maintenance-warning.test.ts
src/infra/session-maintenance-warning.ts
src/infra/shell-env.test.ts
src/infra/shell-env.ts
src/infra/skills-remote.test.ts
src/infra/skills-remote.ts
src/infra/ssh-config.test.ts
src/infra/ssh-config.ts
src/infra/ssh-tunnel.ts
src/infra/state-migrations.fs.ts
src/infra/state-migrations.state-dir.test.ts
src/infra/state-migrations.ts
src/infra/supervisor-markers.ts
src/infra/system-events.test.ts
src/infra/system-events.ts
src/infra/system-message.test.ts
src/infra/system-message.ts
src/infra/system-presence.test.ts
src/infra/system-presence.ts
src/infra/system-presence.version.test.ts
src/infra/system-run-approval-binding.ts
src/infra/system-run-approval-context.ts
src/infra/system-run-approval-mismatch.contract.test.ts
src/infra/system-run-command.contract.test.ts
src/infra/system-run-command.test.ts
src/infra/system-run-command.ts
src/infra/tailnet.ts
src/infra/tailscale.test.ts
src/infra/tailscale.ts
src/infra/tls/fingerprint.ts
src/infra/tls/gateway.ts
src/infra/tmp-traversalai-dir.test.ts
src/infra/tmp-traversalai-dir.ts
src/infra/transport-ready.test.ts
src/infra/transport-ready.ts
src/infra/unhandled-rejections.fatal-detection.test.ts
src/infra/unhandled-rejections.test.ts
src/infra/unhandled-rejections.ts
src/infra/update-channels.test.ts
src/infra/update-channels.ts
src/infra/update-check.test.ts
src/infra/update-check.ts
src/infra/update-global.ts
src/infra/update-runner.test.ts
src/infra/update-runner.ts
src/infra/update-startup.test.ts
src/infra/update-startup.ts
src/infra/voicewake.ts
src/infra/warning-filter.test.ts
src/infra/warning-filter.ts
src/infra/watch-node.test.ts
src/infra/widearea-dns.test.ts
src/infra/widearea-dns.ts
src/infra/ws.ts
src/infra/wsl.ts
src/line/accounts.test.ts
src/line/accounts.ts
src/line/actions.ts
src/line/auto-reply-delivery.test.ts
src/line/auto-reply-delivery.ts
src/line/bot-access.ts
src/line/bot-handlers.test.ts
src/line/bot-handlers.ts
src/line/bot-message-context.test.ts
src/line/bot-message-context.ts
src/line/bot.ts
src/line/channel-access-token.ts
src/line/config-schema.ts
src/line/download.test.ts
src/line/download.ts
src/line/flex-templates.test.ts
src/line/flex-templates.ts
src/line/flex-templates/basic-cards.ts
src/line/flex-templates/common.ts
src/line/flex-templates/media-control-cards.ts
src/line/flex-templates/message.ts
src/line/flex-templates/schedule-cards.ts
src/line/flex-templates/types.ts
src/line/markdown-to-line.test.ts
src/line/markdown-to-line.ts
src/line/monitor.fail-closed.test.ts
src/line/monitor.lifecycle.test.ts
src/line/monitor.read-body.test.ts
src/line/monitor.ts
src/line/probe.test.ts
src/line/probe.ts
src/line/reply-chunks.test.ts
src/line/reply-chunks.ts
src/line/rich-menu.test.ts
src/line/rich-menu.ts
src/line/send.test.ts
src/line/send.ts
src/line/signature.ts
src/line/template-messages.test.ts
src/line/template-messages.ts
src/line/types.ts
src/line/webhook-node.test.ts
src/line/webhook-node.ts
src/line/webhook-utils.ts
src/line/webhook.test.ts
src/line/webhook.ts
src/link-understanding/apply.ts
src/link-understanding/defaults.ts
src/link-understanding/detect.test.ts
src/link-understanding/detect.ts
src/link-understanding/format.ts
src/link-understanding/runner.ts
src/logger.test.ts
src/logger.ts
src/logging.ts
src/logging/config.ts
src/logging/console-capture.test.ts
src/logging/console-settings.test.ts
src/logging/console-timestamp.test.ts
src/logging/console.ts
src/logging/diagnostic-session-state.ts
src/logging/diagnostic.test.ts
src/logging/diagnostic.ts
src/logging/env-log-level.ts
src/logging/levels.ts
src/logging/log-file-size-cap.test.ts
src/logging/logger-env.test.ts
src/logging/logger.ts
src/logging/node-require.ts
src/logging/parse-log-line.test.ts
src/logging/parse-log-line.ts
src/logging/redact-identifier.ts
src/logging/redact.test.ts
src/logging/redact.ts
src/logging/state.ts
src/logging/subsystem.test.ts
src/logging/subsystem.ts
src/logging/timestamps.test.ts
src/logging/timestamps.ts
src/markdown/code-spans.ts
src/markdown/fences.ts
src/markdown/frontmatter.test.ts
src/markdown/frontmatter.ts
src/markdown/ir.blockquote-spacing.test.ts
src/markdown/ir.hr-spacing.test.ts
src/markdown/ir.nested-lists.test.ts
src/markdown/ir.table-bullets.test.ts
src/markdown/ir.table-code.test.ts
src/markdown/ir.ts
src/markdown/render.ts
src/markdown/tables.ts
src/markdown/whatsapp.test.ts
src/markdown/whatsapp.ts
src/media-understanding/apply.test.ts
src/media-understanding/apply.ts
src/media-understanding/attachments.ts
src/media-understanding/audio-preflight.ts
src/media-understanding/concurrency.ts
src/media-understanding/defaults.test.ts
src/media-understanding/defaults.ts
src/media-understanding/errors.ts
src/media-understanding/format.test.ts
src/media-understanding/format.ts
src/media-understanding/fs.ts
src/media-understanding/media-understanding-misc.test.ts
src/media-understanding/output-extract.ts
src/media-understanding/providers/anthropic/index.ts
src/media-understanding/providers/audio.test-helpers.ts
src/media-understanding/providers/deepgram/audio.live.test.ts
src/media-understanding/providers/deepgram/audio.test.ts
src/media-understanding/providers/deepgram/audio.ts
src/media-understanding/providers/deepgram/index.ts
src/media-understanding/providers/google/audio.ts
src/media-understanding/providers/google/index.ts
src/media-understanding/providers/google/inline-data.ts
src/media-understanding/providers/google/video.test.ts
src/media-understanding/providers/google/video.ts
src/media-understanding/providers/groq/index.ts
src/media-understanding/providers/image.ts
src/media-understanding/providers/index.test.ts
src/media-understanding/providers/index.ts
src/media-understanding/providers/minimax/index.ts
src/media-understanding/providers/mistral/index.test.ts
src/media-understanding/providers/mistral/index.ts
src/media-understanding/providers/moonshot/index.ts
src/media-understanding/providers/moonshot/video.test.ts
src/media-understanding/providers/moonshot/video.ts
src/media-understanding/providers/openai/audio.test.ts
src/media-understanding/providers/openai/audio.ts
src/media-understanding/providers/openai/index.ts
src/media-understanding/providers/shared.ts
src/media-understanding/providers/zai/index.ts
src/media-understanding/resolve.test.ts
src/media-understanding/resolve.ts
src/media-understanding/runner.auto-audio.test.ts
src/media-understanding/runner.deepgram.test.ts
src/media-understanding/runner.entries.ts
src/media-understanding/runner.test-utils.ts
src/media-understanding/runner.ts
src/media-understanding/runner.video.test.ts
src/media-understanding/runner.vision-skip.test.ts
src/media-understanding/scope.ts
src/media-understanding/types.ts
src/media-understanding/video.ts
src/media/audio-tags.ts
src/media/audio.test.ts
src/media/audio.ts
src/media/base64.test.ts
src/media/base64.ts
src/media/constants.ts
src/media/fetch.test.ts
src/media/fetch.ts
src/media/host.test.ts
src/media/host.ts
src/media/image-ops.helpers.test.ts
src/media/image-ops.ts
src/media/inbound-path-policy.test.ts
src/media/inbound-path-policy.ts
src/media/input-files.fetch-guard.test.ts
src/media/input-files.ts
src/media/local-roots.ts
src/media/mime.test.ts
src/media/mime.ts
src/media/outbound-attachment.ts
src/media/parse.test.ts
src/media/parse.ts
src/media/png-encode.ts
src/media/read-response-with-limit.ts
src/media/server.test.ts
src/media/server.ts
src/media/sniff-mime-from-base64.ts
src/media/store.redirect.test.ts
src/media/store.test.ts
src/media/store.ts
src/memory/backend-config.test.ts
src/memory/backend-config.ts
src/memory/batch-error-utils.test.ts
src/memory/batch-error-utils.ts
src/memory/batch-gemini.ts
src/memory/batch-http.test.ts
src/memory/batch-http.ts
src/memory/batch-openai.ts
src/memory/batch-output.test.ts
src/memory/batch-output.ts
src/memory/batch-provider-common.ts
src/memory/batch-runner.ts
src/memory/batch-upload.ts
src/memory/batch-utils.ts
src/memory/batch-voyage.test.ts
src/memory/batch-voyage.ts
src/memory/embedding-chunk-limits.test.ts
src/memory/embedding-chunk-limits.ts
src/memory/embedding-input-limits.ts
src/memory/embedding-manager.test-harness.ts
src/memory/embedding-model-limits.ts
src/memory/embedding.test-mocks.ts
src/memory/embeddings-debug.ts
src/memory/embeddings-gemini.ts
src/memory/embeddings-mistral.test.ts
src/memory/embeddings-mistral.ts
src/memory/embeddings-openai.ts
src/memory/embeddings-remote-client.ts
src/memory/embeddings-remote-fetch.test.ts
src/memory/embeddings-remote-fetch.ts
src/memory/embeddings-remote-provider.ts
src/memory/embeddings-voyage.test.ts
src/memory/embeddings-voyage.ts
src/memory/embeddings.test.ts
src/memory/embeddings.ts
src/memory/fs-utils.ts
src/memory/hybrid.test.ts
src/memory/hybrid.ts
src/memory/index.test.ts
src/memory/index.ts
src/memory/internal.test.ts
src/memory/internal.ts
src/memory/manager-embedding-ops.ts
src/memory/manager-search.ts
src/memory/manager-sync-ops.ts
src/memory/manager.async-search.test.ts
src/memory/manager.atomic-reindex.test.ts
src/memory/manager.batch.test.ts
src/memory/manager.embedding-batches.test.ts
src/memory/manager.mistral-provider.test.ts
src/memory/manager.read-file.test.ts
src/memory/manager.sync-errors-do-not-crash.test.ts
src/memory/manager.ts
src/memory/manager.vector-dedupe.test.ts
src/memory/manager.watcher-config.test.ts
src/memory/memory-schema.ts
src/memory/mmr.test.ts
src/memory/mmr.ts
src/memory/node-llama.ts
src/memory/post-json.test.ts
src/memory/post-json.ts
src/memory/qmd-manager.test.ts
src/memory/qmd-manager.ts
src/memory/qmd-query-parser.test.ts
src/memory/qmd-query-parser.ts
src/memory/qmd-scope.test.ts
src/memory/qmd-scope.ts
src/memory/query-expansion.test.ts
src/memory/query-expansion.ts
src/memory/remote-http.ts
src/memory/search-manager.test.ts
src/memory/search-manager.ts
src/memory/session-files.test.ts
src/memory/session-files.ts
src/memory/sqlite-vec.ts
src/memory/sqlite.ts
src/memory/status-format.ts
src/memory/temporal-decay.test.ts
src/memory/temporal-decay.ts
src/memory/test-embeddings-mock.ts
src/memory/test-manager-helpers.ts
src/memory/test-manager.ts
src/memory/test-runtime-mocks.ts
src/memory/types.ts
src/node-host/config.ts
src/node-host/exec-policy.test.ts
src/node-host/exec-policy.ts
src/node-host/invoke-browser.ts
src/node-host/invoke-system-run-allowlist.ts
src/node-host/invoke-system-run-plan.ts
src/node-host/invoke-system-run.test.ts
src/node-host/invoke-system-run.ts
src/node-host/invoke-types.ts
src/node-host/invoke.sanitize-env.test.ts
src/node-host/invoke.ts
src/node-host/runner.ts
src/node-host/with-timeout.ts
src/pairing/pairing-challenge.ts
src/pairing/pairing-labels.ts
src/pairing/pairing-messages.test.ts
src/pairing/pairing-messages.ts
src/pairing/pairing-store.test.ts
src/pairing/pairing-store.ts
src/pairing/setup-code.test.ts
src/pairing/setup-code.ts
src/plugin-sdk/account-id.ts
src/plugin-sdk/agent-media-payload.ts
src/plugin-sdk/allow-from.test.ts
src/plugin-sdk/allow-from.ts
src/plugin-sdk/command-auth.test.ts
src/plugin-sdk/command-auth.ts
src/plugin-sdk/config-paths.ts
src/plugin-sdk/fetch-auth.test.ts
src/plugin-sdk/fetch-auth.ts
src/plugin-sdk/file-lock.ts
src/plugin-sdk/group-access.test.ts
src/plugin-sdk/group-access.ts
src/plugin-sdk/index.test.ts
src/plugin-sdk/index.ts
src/plugin-sdk/json-store.ts
src/plugin-sdk/onboarding.ts
src/plugin-sdk/pairing-access.ts
src/plugin-sdk/persistent-dedupe.test.ts
src/plugin-sdk/persistent-dedupe.ts
src/plugin-sdk/provider-auth-result.ts
src/plugin-sdk/reply-payload.ts
src/plugin-sdk/run-command.ts
src/plugin-sdk/runtime.ts
src/plugin-sdk/slack-message-actions.ts
src/plugin-sdk/ssrf-policy.test.ts
src/plugin-sdk/ssrf-policy.ts
src/plugin-sdk/status-helpers.test.ts
src/plugin-sdk/status-helpers.ts
src/plugin-sdk/temp-path.test.ts
src/plugin-sdk/temp-path.ts
src/plugin-sdk/text-chunking.test.ts
src/plugin-sdk/text-chunking.ts
src/plugin-sdk/tool-send.ts
src/plugin-sdk/webhook-path.ts
src/plugin-sdk/webhook-targets.test.ts
src/plugin-sdk/webhook-targets.ts
src/plugins/bundled-dir.ts
src/plugins/bundled-sources.test.ts
src/plugins/bundled-sources.ts
src/plugins/cli.test.ts
src/plugins/cli.ts
src/plugins/commands.ts
src/plugins/config-schema.ts
src/plugins/config-state.test.ts
src/plugins/config-state.ts
src/plugins/discovery.test.ts
src/plugins/discovery.ts
src/plugins/enable.test.ts
src/plugins/enable.ts
src/plugins/hook-runner-global.ts
src/plugins/hooks.before-agent-start.test.ts
src/plugins/hooks.model-override-wiring.test.ts
src/plugins/hooks.phase-hooks.test.ts
src/plugins/hooks.test-helpers.ts
src/plugins/hooks.ts
src/plugins/http-path.ts
src/plugins/http-registry.test.ts
src/plugins/http-registry.ts
src/plugins/install.test.ts
src/plugins/install.ts
src/plugins/installs.test.ts
src/plugins/installs.ts
src/plugins/loader.test.ts
src/plugins/loader.ts
src/plugins/logger.test.ts
src/plugins/logger.ts
src/plugins/manifest-registry.test.ts
src/plugins/manifest-registry.ts
src/plugins/manifest.ts
src/plugins/path-safety.ts
src/plugins/providers.ts
src/plugins/registry.ts
src/plugins/runtime.ts
src/plugins/runtime/index.test.ts
src/plugins/runtime/index.ts
src/plugins/runtime/native-deps.ts
src/plugins/runtime/types.ts
src/plugins/schema-validator.ts
src/plugins/services.test.ts
src/plugins/services.ts
src/plugins/slots.test.ts
src/plugins/slots.ts
src/plugins/source-display.test.ts
src/plugins/source-display.ts
src/plugins/status.ts
src/plugins/toggle-config.ts
src/plugins/tools.optional.test.ts
src/plugins/tools.ts
src/plugins/types.ts
src/plugins/uninstall.test.ts
src/plugins/uninstall.ts
src/plugins/update.ts
src/plugins/voice-call.plugin.test.ts
src/plugins/wired-hooks-after-tool-call.test.ts
src/plugins/wired-hooks-compaction.test.ts
src/plugins/wired-hooks-gateway.test.ts
src/plugins/wired-hooks-llm.test.ts
src/plugins/wired-hooks-message.test.ts
src/plugins/wired-hooks-session.test.ts
src/plugins/wired-hooks-subagent.test.ts
src/polls.test.ts
src/polls.ts
src/process/child-process-bridge.ts
src/process/command-queue.test.ts
src/process/command-queue.ts
src/process/exec.test.ts
src/process/exec.ts
src/process/kill-tree.test.ts
src/process/kill-tree.ts
src/process/lanes.ts
src/process/restart-recovery.ts
src/process/spawn-utils.test.ts
src/process/spawn-utils.ts
src/process/supervisor/adapters/child.test.ts
src/process/supervisor/adapters/child.ts
src/process/supervisor/adapters/env.ts
src/process/supervisor/adapters/pty.test.ts
src/process/supervisor/adapters/pty.ts
src/process/supervisor/index.ts
src/process/supervisor/registry.test.ts
src/process/supervisor/registry.ts
src/process/supervisor/supervisor.pty-command.test.ts
src/process/supervisor/supervisor.test.ts
src/process/supervisor/supervisor.ts
src/process/supervisor/types.ts
src/process/test-timeouts.ts
src/providers/github-copilot-auth.ts
src/providers/github-copilot-models.test.ts
src/providers/github-copilot-models.ts
src/providers/github-copilot-token.test.ts
src/providers/github-copilot-token.ts
src/providers/google-shared.ensures-function-call-comes-after-user-turn.test.ts
src/providers/google-shared.preserves-parameters-type-is-missing.test.ts
src/providers/google-shared.test-helpers.ts
src/providers/kilocode-shared.ts
src/providers/qwen-portal-oauth.test.ts
src/providers/qwen-portal-oauth.ts
src/routing/account-id.test.ts
src/routing/account-id.ts
src/routing/account-lookup.test.ts
src/routing/account-lookup.ts
src/routing/bindings.ts
src/routing/resolve-route.test.ts
src/routing/resolve-route.ts
src/routing/session-key.continuity.test.ts
src/routing/session-key.test.ts
src/routing/session-key.ts
src/runtime.ts
src/scripts/canvas-a2ui-copy.test.ts
src/secrets/apply.test.ts
src/secrets/apply.ts
src/secrets/audit.test.ts
src/secrets/audit.ts
src/secrets/config-io.ts
src/secrets/configure.ts
src/secrets/json-pointer.ts
src/secrets/plan.ts
src/secrets/provider-env-vars.ts
src/secrets/ref-contract.ts
src/secrets/resolve.test.ts
src/secrets/resolve.ts
src/secrets/runtime.test.ts
src/secrets/runtime.ts
src/secrets/shared.ts
src/security/audit-channel.ts
src/security/audit-extra.async.ts
src/security/audit-extra.sync.test.ts
src/security/audit-extra.sync.ts
src/security/audit-extra.ts
src/security/audit-fs.ts
src/security/audit-tool-policy.ts
src/security/audit.test.ts
src/security/audit.ts
src/security/channel-metadata.ts
src/security/dangerous-config-flags.ts
src/security/dangerous-tools.ts
src/security/dm-policy-channel-smoke.test.ts
src/security/dm-policy-shared.test.ts
src/security/dm-policy-shared.ts
src/security/external-content.test.ts
src/security/external-content.ts
src/security/fix.test.ts
src/security/fix.ts
src/security/mutable-allowlist-detectors.ts
src/security/safe-regex.test.ts
src/security/safe-regex.ts
src/security/scan-paths.ts
src/security/secret-equal.ts
src/security/skill-scanner.test.ts
src/security/skill-scanner.ts
src/security/temp-path-guard.test.ts
src/security/windows-acl.test.ts
src/security/windows-acl.ts
src/sessions/input-provenance.ts
src/sessions/level-overrides.ts
src/sessions/model-overrides.ts
src/sessions/send-policy.test.ts
src/sessions/send-policy.ts
src/sessions/session-key-utils.ts
src/sessions/session-label.ts
src/sessions/transcript-events.ts
src/shared/avatar-policy.test.ts
src/shared/avatar-policy.ts
src/shared/chat-content.ts
src/shared/chat-envelope.ts
src/shared/config-eval.test.ts
src/shared/config-eval.ts
src/shared/device-auth.ts
src/shared/entry-metadata.ts
src/shared/entry-status.ts
src/shared/frontmatter.ts
src/shared/gateway-bind-url.ts
src/shared/model-param-b.ts
src/shared/net/ip-test-fixtures.ts
src/shared/net/ip.test.ts
src/shared/net/ip.ts
src/shared/net/ipv4.ts
src/shared/node-list-parse.test.ts
src/shared/node-list-parse.ts
src/shared/node-list-types.ts
src/shared/node-match.ts
src/shared/operator-scope-compat.test.ts
src/shared/operator-scope-compat.ts
src/shared/pid-alive.test.ts
src/shared/pid-alive.ts
src/shared/process-scoped-map.ts
src/shared/requirements.test.ts
src/shared/requirements.ts
src/shared/shared-misc.test.ts
src/shared/string-normalization.test.ts
src/shared/string-normalization.ts
src/shared/subagents-format.ts
src/shared/tailscale-status.ts
src/shared/text-chunking.ts
src/shared/text/code-regions.ts
src/shared/text/reasoning-tags.test.ts
src/shared/text/reasoning-tags.ts
src/shared/usage-aggregates.ts
src/signal/accounts.ts
src/signal/client.test.ts
src/signal/client.ts
src/signal/daemon.ts
src/signal/format.chunking.test.ts
src/signal/format.links.test.ts
src/signal/format.test.ts
src/signal/format.ts
src/signal/format.visual.test.ts
src/signal/identity.test.ts
src/signal/identity.ts
src/signal/index.ts
src/signal/monitor.test.ts
src/signal/monitor.tool-result.pairs-uuid-only-senders-uuid-allowlist-entry.test.ts
src/signal/monitor.tool-result.sends-tool-summaries-responseprefix.test.ts
src/signal/monitor.tool-result.test-harness.ts
src/signal/monitor.ts
src/signal/monitor/access-policy.ts
src/signal/monitor/event-handler.inbound-contract.test.ts
src/signal/monitor/event-handler.mention-gating.test.ts
src/signal/monitor/event-handler.test-harness.ts
src/signal/monitor/event-handler.ts
src/signal/monitor/event-handler.types.ts
src/signal/monitor/mentions.ts
src/signal/probe.test.ts
src/signal/probe.ts
src/signal/reaction-level.ts
src/signal/rpc-context.ts
src/signal/send-reactions.test.ts
src/signal/send-reactions.ts
src/signal/send.ts
src/signal/sse-reconnect.ts
src/slack/accounts.test.ts
src/slack/accounts.ts
src/slack/actions.blocks.test.ts
src/slack/actions.read.test.ts
src/slack/actions.ts
src/slack/blocks-fallback.test.ts
src/slack/blocks-fallback.ts
src/slack/blocks-input.test.ts
src/slack/blocks-input.ts
src/slack/blocks.test-helpers.ts
src/slack/channel-migration.test.ts
src/slack/channel-migration.ts
src/slack/client.test.ts
src/slack/client.ts
src/slack/directory-live.ts
src/slack/draft-stream.test.ts
src/slack/draft-stream.ts
src/slack/format.test.ts
src/slack/format.ts
src/slack/http/index.ts
src/slack/http/registry.test.ts
src/slack/http/registry.ts
src/slack/index.ts
src/slack/message-actions.ts
src/slack/modal-metadata.test.ts
src/slack/modal-metadata.ts
src/slack/monitor.test-helpers.ts
src/slack/monitor.test.ts
src/slack/monitor.threading.missing-thread-ts.test.ts
src/slack/monitor.tool-result.test.ts
src/slack/monitor.ts
src/slack/monitor/allow-list.test.ts
src/slack/monitor/allow-list.ts
src/slack/monitor/auth.ts
src/slack/monitor/channel-config.ts
src/slack/monitor/commands.ts
src/slack/monitor/context.ts
src/slack/monitor/dm-auth.ts
src/slack/monitor/events.ts
src/slack/monitor/events/channels.ts
src/slack/monitor/events/interactions.test.ts
src/slack/monitor/events/interactions.ts
src/slack/monitor/events/members.test.ts
src/slack/monitor/events/members.ts
src/slack/monitor/events/messages.test.ts
src/slack/monitor/events/messages.ts
src/slack/monitor/events/pins.test.ts
src/slack/monitor/events/pins.ts
src/slack/monitor/events/reactions.test.ts
src/slack/monitor/events/reactions.ts
src/slack/monitor/events/system-event-context.ts
src/slack/monitor/events/system-event-test-harness.ts
src/slack/monitor/external-arg-menu-store.ts
src/slack/monitor/media.test.ts
src/slack/monitor/media.ts
src/slack/monitor/message-handler.ts
src/slack/monitor/message-handler/dispatch.streaming.test.ts
src/slack/monitor/message-handler/dispatch.ts
src/slack/monitor/message-handler/prepare.test.ts
src/slack/monitor/message-handler/prepare.ts
src/slack/monitor/message-handler/types.ts
src/slack/monitor/monitor.test.ts
src/slack/monitor/mrkdwn.ts
src/slack/monitor/policy.ts
src/slack/monitor/provider.group-policy.test.ts
src/slack/monitor/provider.ts
src/slack/monitor/replies.ts
src/slack/monitor/room-context.ts
src/slack/monitor/slash.test-harness.ts
src/slack/monitor/slash.test.ts
src/slack/monitor/slash.ts
src/slack/monitor/thread-resolution.ts
src/slack/monitor/types.ts
src/slack/probe.ts
src/slack/resolve-channels.test.ts
src/slack/resolve-channels.ts
src/slack/resolve-users.ts
src/slack/scopes.ts
src/slack/send.blocks.test.ts
src/slack/send.ts
src/slack/send.upload.test.ts
src/slack/stream-mode.test.ts
src/slack/stream-mode.ts
src/slack/streaming.ts
src/slack/targets.test.ts
src/slack/targets.ts
src/slack/threading-tool-context.test.ts
src/slack/threading-tool-context.ts
src/slack/threading.test.ts
src/slack/threading.ts
src/slack/token.ts
src/slack/types.ts
src/telegram/accounts.test.ts
src/telegram/accounts.ts
src/telegram/allowed-updates.ts
src/telegram/api-logging.ts
src/telegram/audit.test.ts
src/telegram/audit.ts
src/telegram/bot-access.ts
src/telegram/bot-handlers.ts
src/telegram/bot-message-context.audio-transcript.test.ts
src/telegram/bot-message-context.dm-threads.test.ts
src/telegram/bot-message-context.dm-topic-threadid.test.ts
src/telegram/bot-message-context.sender-prefix.test.ts
src/telegram/bot-message-context.test-harness.ts
src/telegram/bot-message-context.ts
src/telegram/bot-message-dispatch.test.ts
src/telegram/bot-message-dispatch.ts
src/telegram/bot-message.test.ts
src/telegram/bot-message.ts
src/telegram/bot-native-command-menu.test.ts
src/telegram/bot-native-command-menu.ts
src/telegram/bot-native-commands.plugin-auth.test.ts
src/telegram/bot-native-commands.session-meta.test.ts
src/telegram/bot-native-commands.test-helpers.ts
src/telegram/bot-native-commands.test.ts
src/telegram/bot-native-commands.ts
src/telegram/bot-updates.ts
src/telegram/bot.create-telegram-bot.test-harness.ts
src/telegram/bot.create-telegram-bot.test.ts
src/telegram/bot.helpers.test.ts
src/telegram/bot.media.downloads-media-file-path-no-file-download.test.ts
src/telegram/bot.media.e2e-harness.ts
src/telegram/bot.media.stickers-and-fragments.test.ts
src/telegram/bot.media.test-utils.ts
src/telegram/bot.test.ts
src/telegram/bot.ts
src/telegram/bot/delivery.resolve-media-retry.test.ts
src/telegram/bot/delivery.test.ts
src/telegram/bot/delivery.ts
src/telegram/bot/helpers.test.ts
src/telegram/bot/helpers.ts
src/telegram/bot/types.ts
src/telegram/button-types.ts
src/telegram/caption.ts
src/telegram/dm-access.ts
src/telegram/draft-chunking.test.ts
src/telegram/draft-chunking.ts
src/telegram/draft-stream.test.ts
src/telegram/draft-stream.ts
src/telegram/fetch.test.ts
src/telegram/fetch.ts
src/telegram/format.test.ts
src/telegram/format.ts
src/telegram/format.wrap-md.test.ts
src/telegram/group-access.base-access.test.ts
src/telegram/group-access.group-policy.test.ts
src/telegram/group-access.ts
src/telegram/group-config-helpers.ts
src/telegram/group-migration.test.ts
src/telegram/group-migration.ts
src/telegram/inline-buttons.test.ts
src/telegram/inline-buttons.ts
src/telegram/lane-delivery.ts
src/telegram/model-buttons.test.ts
src/telegram/model-buttons.ts
src/telegram/monitor.test.ts
src/telegram/monitor.ts
src/telegram/network-config.test.ts
src/telegram/network-config.ts
src/telegram/network-errors.test.ts
src/telegram/network-errors.ts
src/telegram/outbound-params.ts
src/telegram/probe.test.ts
src/telegram/probe.ts
src/telegram/proxy.test.ts
src/telegram/proxy.ts
src/telegram/reaction-level.test.ts
src/telegram/reaction-level.ts
src/telegram/reasoning-lane-coordinator.test.ts
src/telegram/reasoning-lane-coordinator.ts
src/telegram/send.proxy.test.ts
src/telegram/send.test-harness.ts
src/telegram/send.test.ts
src/telegram/send.ts
src/telegram/sendchataction-401-backoff.test.ts
src/telegram/sendchataction-401-backoff.ts
src/telegram/sent-message-cache.ts
src/telegram/status-reaction-variants.test.ts
src/telegram/status-reaction-variants.ts
src/telegram/sticker-cache.test.ts
src/telegram/sticker-cache.ts
src/telegram/target-writeback.test.ts
src/telegram/target-writeback.ts
src/telegram/targets.test.ts
src/telegram/targets.ts
src/telegram/token.test.ts
src/telegram/token.ts
src/telegram/update-offset-store.test.ts
src/telegram/update-offset-store.ts
src/telegram/voice.test.ts
src/telegram/voice.ts
src/telegram/webhook.test.ts
src/telegram/webhook.ts
src/terminal/ansi.ts
src/terminal/health-style.ts
src/terminal/links.ts
src/terminal/note.ts
src/terminal/palette.ts
src/terminal/progress-line.ts
src/terminal/prompt-select-styled.test.ts
src/terminal/prompt-select-styled.ts
src/terminal/prompt-style.ts
src/terminal/restore.test.ts
src/terminal/restore.ts
src/terminal/stream-writer.test.ts
src/terminal/stream-writer.ts
src/terminal/table.test.ts
src/terminal/table.ts
src/terminal/theme.ts
src/test-helpers/ssrf.ts
src/test-helpers/state-dir-env.test.ts
src/test-helpers/state-dir-env.ts
src/test-helpers/workspace.ts
src/test-utils/auth-token-assertions.ts
src/test-utils/channel-plugins.test.ts
src/test-utils/channel-plugins.ts
src/test-utils/chunk-test-helpers.ts
src/test-utils/command-runner.ts
src/test-utils/env.test.ts
src/test-utils/env.ts
src/test-utils/exec-assertions.ts
src/test-utils/fetch-mock.ts
src/test-utils/fixture-suite.ts
src/test-utils/imessage-test-plugin.ts
src/test-utils/internal-hook-event-payload.ts
src/test-utils/mock-http-response.ts
src/test-utils/model-auth-mock.ts
src/test-utils/model-fallback.mock.ts
src/test-utils/npm-spec-install-test-helpers.ts
src/test-utils/ports.ts
src/test-utils/provider-usage-fetch.ts
src/test-utils/repo-scan.ts
src/test-utils/runtime-source-guardrail-scan.ts
src/test-utils/temp-dir.ts
src/test-utils/temp-home.test.ts
src/test-utils/temp-home.ts
src/test-utils/tracked-temp-dirs.ts
src/test-utils/typed-cases.ts
src/test-utils/vitest-mock-fn.ts
src/tts/prepare-text.test.ts
src/tts/tts-core.ts
src/tts/tts.test.ts
src/tts/tts.ts
src/tui/commands.test.ts
src/tui/commands.ts
src/tui/components/assistant-message.ts
src/tui/components/chat-log.test.ts
src/tui/components/chat-log.ts
src/tui/components/custom-editor.ts
src/tui/components/filterable-select-list.ts
src/tui/components/fuzzy-filter.ts
src/tui/components/hyperlink-markdown.ts
src/tui/components/markdown-message.ts
src/tui/components/searchable-select-list.test.ts
src/tui/components/searchable-select-list.ts
src/tui/components/selectors.ts
src/tui/components/tool-execution.ts
src/tui/components/user-message.ts
src/tui/gateway-chat.test.ts
src/tui/gateway-chat.ts
src/tui/osc8-hyperlinks.test.ts
src/tui/osc8-hyperlinks.ts
src/tui/theme/syntax-theme.ts
src/tui/theme/theme.test.ts
src/tui/theme/theme.ts
src/tui/tui-command-handlers.test.ts
src/tui/tui-command-handlers.ts
src/tui/tui-event-handlers.test.ts
src/tui/tui-event-handlers.ts
src/tui/tui-formatters.test.ts
src/tui/tui-formatters.ts
src/tui/tui-input-history.test.ts
src/tui/tui-local-shell.test.ts
src/tui/tui-local-shell.ts
src/tui/tui-overlays.test.ts
src/tui/tui-overlays.ts
src/tui/tui-session-actions.test.ts
src/tui/tui-session-actions.ts
src/tui/tui-status-summary.ts
src/tui/tui-stream-assembler.test.ts
src/tui/tui-stream-assembler.ts
src/tui/tui-submit-test-helpers.ts
src/tui/tui-types.ts
src/tui/tui-waiting.test.ts
src/tui/tui-waiting.ts
src/tui/tui.submit-handler.test.ts
src/tui/tui.test.ts
src/tui/tui.ts
src/types/cli-highlight.d.ts
src/types/lydell-node-pty.d.ts
src/types/napi-rs-canvas.d.ts
src/types/node-edge-tts.d.ts
src/types/node-llama-cpp.d.ts
src/types/osc-progress.d.ts
src/types/pdfjs-dist-legacy.d.ts
src/types/qrcode-terminal.d.ts
src/utils.test.ts
src/utils.ts
src/utils/account-id.ts
src/utils/boolean.ts
src/utils/chunk-items.ts
src/utils/delivery-context.test.ts
src/utils/delivery-context.ts
src/utils/directive-tags.test.ts
src/utils/directive-tags.ts
src/utils/fetch-timeout.ts
src/utils/mask-api-key.test.ts
src/utils/mask-api-key.ts
src/utils/message-channel.test.ts
src/utils/message-channel.ts
src/utils/normalize-secret-input.ts
src/utils/provider-utils.ts
src/utils/queue-helpers.test.ts
src/utils/queue-helpers.ts
src/utils/reaction-level.test.ts
src/utils/reaction-level.ts
src/utils/run-with-concurrency.test.ts
src/utils/run-with-concurrency.ts
src/utils/safe-json.ts
src/utils/shell-argv.ts
src/utils/transcript-tools.test.ts
src/utils/transcript-tools.ts
src/utils/usage-format.test.ts
src/utils/usage-format.ts
src/utils/utils-misc.test.ts
src/utils/with-timeout.ts
src/version.test.ts
src/version.ts
src/web/accounts.test.ts
src/web/accounts.ts
src/web/accounts.whatsapp-auth.test.ts
src/web/active-listener.ts
src/web/auth-store.ts
src/web/auto-reply.broadcast-groups.broadcasts-sequentially-configured-order.test.ts
src/web/auto-reply.broadcast-groups.skips-unknown-broadcast-agent-ids-agents-list.test.ts
src/web/auto-reply.broadcast-groups.test-harness.ts
src/web/auto-reply.impl.ts
src/web/auto-reply.test-harness.ts
src/web/auto-reply.ts
src/web/auto-reply.typing-controller-idle.test.ts
src/web/auto-reply.web-auto-reply.compresses-common-formats-jpeg-cap.test.ts
src/web/auto-reply.web-auto-reply.last-route.test.ts
src/web/auto-reply.web-auto-reply.monitor-logging.test.ts
src/web/auto-reply.web-auto-reply.reconnects-after-connection-close.test.ts
src/web/auto-reply/constants.ts
src/web/auto-reply/deliver-reply.test.ts
src/web/auto-reply/deliver-reply.ts
src/web/auto-reply/heartbeat-runner.test.ts
src/web/auto-reply/heartbeat-runner.ts
src/web/auto-reply/loggers.ts
src/web/auto-reply/mentions.ts
src/web/auto-reply/monitor.ts
src/web/auto-reply/monitor/ack-reaction.ts
src/web/auto-reply/monitor/broadcast.ts
src/web/auto-reply/monitor/commands.ts
src/web/auto-reply/monitor/echo.ts
src/web/auto-reply/monitor/group-activation.ts
src/web/auto-reply/monitor/group-gating.ts
src/web/auto-reply/monitor/group-members.test.ts
src/web/auto-reply/monitor/group-members.ts
src/web/auto-reply/monitor/last-route.ts
src/web/auto-reply/monitor/message-line.ts
src/web/auto-reply/monitor/on-message.ts
src/web/auto-reply/monitor/peer.ts
src/web/auto-reply/monitor/process-message.inbound-contract.test.ts
src/web/auto-reply/monitor/process-message.ts
src/web/auto-reply/session-snapshot.ts
src/web/auto-reply/types.ts
src/web/auto-reply/util.ts
src/web/auto-reply/web-auto-reply-monitor.test.ts
src/web/auto-reply/web-auto-reply-utils.test.ts
src/web/inbound.media.test.ts
src/web/inbound.test.ts
src/web/inbound.ts
src/web/inbound/access-control.group-policy.test.ts
src/web/inbound/access-control.test-harness.ts
src/web/inbound/access-control.test.ts
src/web/inbound/access-control.ts
src/web/inbound/dedupe.ts
src/web/inbound/extract.ts
src/web/inbound/media.node.test.ts
src/web/inbound/media.ts
src/web/inbound/monitor.ts
src/web/inbound/send-api.test.ts
src/web/inbound/send-api.ts
src/web/inbound/types.ts
src/web/login-qr.test.ts
src/web/login-qr.ts
src/web/login.coverage.test.ts
src/web/login.test.ts
src/web/login.ts
src/web/logout.test.ts
src/web/media.test.ts
src/web/media.ts
src/web/monitor-inbox.allows-messages-from-senders-allowfrom-list.test.ts
src/web/monitor-inbox.blocks-messages-from-unauthorized-senders-not-allowfrom.test.ts
src/web/monitor-inbox.captures-media-path-image-messages.test.ts
src/web/monitor-inbox.streams-inbound-messages.test.ts
src/web/monitor-inbox.test-harness.ts
src/web/outbound.test.ts
src/web/outbound.ts
src/web/qr-image.ts
src/web/reconnect.test.ts
src/web/reconnect.ts
src/web/session.test.ts
src/web/session.ts
src/web/test-helpers.ts
src/web/vcard.ts
src/whatsapp/normalize.test.ts
src/whatsapp/normalize.ts
src/whatsapp/resolve-outbound-target.test.ts
src/whatsapp/resolve-outbound-target.ts
src/wizard/clack-prompter.test.ts
src/wizard/clack-prompter.ts
src/wizard/onboarding.completion.test.ts
src/wizard/onboarding.completion.ts
src/wizard/onboarding.finalize.ts
src/wizard/onboarding.gateway-config.test.ts
src/wizard/onboarding.gateway-config.ts
src/wizard/onboarding.test.ts
src/wizard/onboarding.ts
src/wizard/onboarding.types.ts
src/wizard/prompts.ts
src/wizard/session.test.ts
src/wizard/session.ts
```

## Documentation Cross-Reference

The codebase documentation set that accompanies this explanation is listed below and compiled separately into the documentation bundle PDF.

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

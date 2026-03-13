# TraversalAI

TraversalAI is an AI operations platform for **Tourism Corps** teams.

It helps hospitality organizations run faster by connecting one assistant to the channels they already use, centralizing control in a local gateway, and automating routine workflows.

## What TraversalAI Does

- Operates as a multi-channel AI assistant across chat platforms.
- Provides a control center dashboard and agent-style chat UI.
- Supports tool-driven automations (sessions, messaging, scheduling, browser/tasks).
- Runs with local-first gateway architecture for reliability and control.
- Provisions three built-in agents during setup and onboarding:
  - Master Control Agent
  - Email Agent
  - Social Media Agent

## Core Positioning

TraversalAI is built to accelerate hospitality outcomes:

- Faster guest-response workflows
- Cleaner internal handoffs
- Better operational visibility
- Safer automation with explicit controls

## Quick Start

Runtime: Node 22+

```bash
npm install -g traversalai@latest
traversalai onboard --install-daemon
traversalai dashboard --no-open
```

## From Source

```bash
git clone https://github.com/xplasma0/traversalai.git
cd traversalai
corepack pnpm install
corepack pnpm build
node traversalai.mjs onboard --install-daemon
```

## Docs

- Getting started: https://docs.traversalai.ai/start/getting-started
- Gateway: https://docs.traversalai.ai/gateway
- Channels: https://docs.traversalai.ai/channels
- Security: https://docs.traversalai.ai/gateway/security
- Troubleshooting: https://docs.traversalai.ai/channels/troubleshooting

## Notes

- Product-facing naming in this repo is **TraversalAI**.
- Runtime compatibility remains aligned with existing `traversalai` internals unless migration is explicitly requested.

## Repository

- GitHub: https://github.com/xplasma0/traversalai

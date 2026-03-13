---
summary: "CLI reference for `traversalai voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
title: "voicecall"
---

# `traversalai voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
traversalai voicecall status --call-id <id>
traversalai voicecall call --to "+15555550123" --message "Hello" --mode notify
traversalai voicecall continue --call-id <id> --message "Any questions?"
traversalai voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
traversalai voicecall expose --mode serve
traversalai voicecall expose --mode funnel
traversalai voicecall expose --mode off
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.

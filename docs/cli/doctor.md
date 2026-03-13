---
summary: "CLI reference for `traversalai doctor` (health checks + guided repairs)"
read_when:
  - You have connectivity/auth issues and want guided fixes
  - You updated and want a sanity check
title: "doctor"
---

# `traversalai doctor`

Health checks + quick fixes for the gateway and channels.

Related:

- Troubleshooting: [Troubleshooting](/gateway/troubleshooting)
- Security audit: [Security](/gateway/security)

## Examples

```bash
traversalai doctor
traversalai doctor --repair
traversalai doctor --deep
```

Notes:

- Interactive prompts (like keychain/OAuth fixes) only run when stdin is a TTY and `--non-interactive` is **not** set. Headless runs (cron, Telegram, no terminal) will skip prompts.
- `--fix` (alias for `--repair`) writes a backup to `~/.traversalai/traversalai.json.bak` and drops unknown config keys, listing each removal.
- State integrity checks now detect orphan transcript files in the sessions directory and can archive them as `.deleted.<timestamp>` to reclaim space safely.
- Doctor includes a memory-search readiness check and can recommend `traversalai configure --section model` when embedding credentials are missing.
- If sandbox mode is enabled but Docker is unavailable, doctor reports a high-signal warning with remediation (`install Docker` or `traversalai config set agents.defaults.sandbox.mode off`).

## macOS: `launchctl` env overrides

If you previously ran `launchctl setenv TRAVERSALAI_GATEWAY_TOKEN ...` (or `...PASSWORD`), that value overrides your config file and can cause persistent “unauthorized” errors.

```bash
launchctl getenv TRAVERSALAI_GATEWAY_TOKEN
launchctl getenv TRAVERSALAI_GATEWAY_PASSWORD

launchctl unsetenv TRAVERSALAI_GATEWAY_TOKEN
launchctl unsetenv TRAVERSALAI_GATEWAY_PASSWORD
```

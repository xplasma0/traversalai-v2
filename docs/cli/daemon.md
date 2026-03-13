---
summary: "CLI reference for `traversalai daemon` (legacy alias for gateway service management)"
read_when:
  - You still use `traversalai daemon ...` in scripts
  - You need service lifecycle commands (install/start/stop/restart/status)
title: "daemon"
---

# `traversalai daemon`

Legacy alias for Gateway service management commands.

`traversalai daemon ...` maps to the same service control surface as `traversalai gateway ...` service commands.

## Usage

```bash
traversalai daemon status
traversalai daemon install
traversalai daemon start
traversalai daemon stop
traversalai daemon restart
traversalai daemon uninstall
```

## Subcommands

- `status`: show service install state and probe Gateway health
- `install`: install service (`launchd`/`systemd`/`schtasks`)
- `uninstall`: remove service
- `start`: start service
- `stop`: stop service
- `restart`: restart service

## Common options

- `status`: `--url`, `--token`, `--password`, `--timeout`, `--no-probe`, `--deep`, `--json`
- `install`: `--port`, `--runtime <node|bun>`, `--token`, `--force`, `--json`
- lifecycle (`uninstall|start|stop|restart`): `--json`

## Prefer

Use [`traversalai gateway`](/cli/gateway) for current docs and examples.

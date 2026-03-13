---
summary: "CLI reference for `traversalai config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `traversalai config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `traversalai configure`).

## Examples

```bash
traversalai config get browser.executablePath
traversalai config set browser.executablePath "/usr/bin/google-chrome"
traversalai config set agents.defaults.heartbeat.every "2h"
traversalai config set agents.list[0].tools.exec.node "node-id-or-name"
traversalai config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
traversalai config get agents.defaults.workspace
traversalai config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
traversalai config get agents.list
traversalai config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--strict-json` to require JSON5 parsing. `--json` remains supported as a legacy alias.

```bash
traversalai config set agents.defaults.heartbeat.every "0m"
traversalai config set gateway.port 19001 --strict-json
traversalai config set channels.whatsapp.groups '["*"]' --strict-json
```

Restart the gateway after edits.

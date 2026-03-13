---
summary: "CLI reference for `traversalai logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `traversalai logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
traversalai logs
traversalai logs --follow
traversalai logs --json
traversalai logs --limit 500
traversalai logs --local-time
traversalai logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.

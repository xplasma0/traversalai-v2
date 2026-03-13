---
summary: "CLI reference for `traversalai reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `traversalai reset`

Reset local config/state (keeps the CLI installed).

```bash
traversalai reset
traversalai reset --dry-run
traversalai reset --scope config+creds+sessions --yes --non-interactive
```

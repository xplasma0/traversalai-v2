---
summary: "Uninstall TraversalAI completely (CLI, service, state, workspace)"
read_when:
  - You want to remove TraversalAI from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `traversalai` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
traversalai uninstall
```

Non-interactive (automation / npx):

```bash
traversalai uninstall --all --yes --non-interactive
npx -y traversalai uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
traversalai gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
traversalai gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${TRAVERSALAI_STATE_DIR:-$HOME/.traversalai}"
```

If you set `TRAVERSALAI_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.traversalai/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g traversalai
pnpm remove -g traversalai
bun remove -g traversalai
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/TraversalAI.app
```

Notes:

- If you used profiles (`--profile` / `TRAVERSALAI_PROFILE`), repeat step 3 for each state dir (defaults are `~/.traversalai-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `traversalai` is missing.

### macOS (launchd)

Default label is `ai.traversalai.gateway` (or `ai.traversalai.<profile>`; legacy `com.traversalai.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.traversalai.gateway
rm -f ~/Library/LaunchAgents/ai.traversalai.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.traversalai.<profile>`. Remove any legacy `com.traversalai.*` plists if present.

### Linux (systemd user unit)

Default unit name is `traversalai-gateway.service` (or `traversalai-gateway-<profile>.service`):

```bash
systemctl --user disable --now traversalai-gateway.service
rm -f ~/.config/systemd/user/traversalai-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `TraversalAI Gateway` (or `TraversalAI Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "TraversalAI Gateway"
Remove-Item -Force "$env:USERPROFILE\.traversalai\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.traversalai-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://traversalai.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g traversalai@latest`.
Remove it with `npm rm -g traversalai` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `traversalai ...` / `bun run traversalai ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.

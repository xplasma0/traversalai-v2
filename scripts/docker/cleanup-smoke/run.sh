#!/usr/bin/env bash
set -euo pipefail

cd /repo

export TRAVERSALAI_STATE_DIR="/tmp/traversalai-test"
export TRAVERSALAI_CONFIG_PATH="${TRAVERSALAI_STATE_DIR}/traversalai.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${TRAVERSALAI_STATE_DIR}/credentials"
mkdir -p "${TRAVERSALAI_STATE_DIR}/agents/main/sessions"
echo '{}' >"${TRAVERSALAI_CONFIG_PATH}"
echo 'creds' >"${TRAVERSALAI_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${TRAVERSALAI_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm traversalai reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${TRAVERSALAI_CONFIG_PATH}"
test ! -d "${TRAVERSALAI_STATE_DIR}/credentials"
test ! -d "${TRAVERSALAI_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${TRAVERSALAI_STATE_DIR}/credentials"
echo '{}' >"${TRAVERSALAI_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm traversalai uninstall --state --yes --non-interactive

test ! -d "${TRAVERSALAI_STATE_DIR}"

echo "OK"

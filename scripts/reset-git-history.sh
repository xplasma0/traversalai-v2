#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" != "--yes" ]]; then
  cat <<'EOF'
This script permanently deletes the current .git history, creates a new repository,
and makes a fresh root commit.

Run again with:
  bash scripts/reset-git-history.sh --yes
EOF
  exit 1
fi

if [[ ! -d .git ]]; then
  echo ".git not found in the current directory."
  exit 1
fi

rm -rf .git
git init
git add . --all -- ':!node_modules' ':!dist' ':!coverage' ':!.turbo' ':!.next'
git commit -m "Initial TraversalAI import"

echo "Fresh repository initialized."
echo "Next steps:"
echo "  git remote add origin <new-repo-url>"
echo "  git branch -M main"
echo "  git push -u origin main --force"

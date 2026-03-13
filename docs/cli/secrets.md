---
summary: "CLI reference for `traversalai secrets` (reload, audit, configure, apply)"
read_when:
  - Re-resolving secret refs at runtime
  - Auditing plaintext residues and unresolved refs
  - Configuring SecretRefs and applying one-way scrub changes
title: "secrets"
---

# `traversalai secrets`

Secrets runtime controls.

Related:

- Secrets guide: [Secrets Management](/gateway/secrets)
- Security guide: [Security](/gateway/security)

## Reload runtime snapshot

Re-resolve secret refs and atomically swap runtime snapshot.

```bash
traversalai secrets reload
traversalai secrets reload --json
```

Notes:

- Uses gateway RPC method `secrets.reload`.
- If resolution fails, gateway keeps last-known-good snapshot.
- JSON response includes `warningCount`.

## Audit

Scan TraversalAI state for:

- plaintext secret storage
- unresolved refs
- precedence drift (`auth-profiles` shadowing config refs)
- legacy residues (`auth.json`, OAuth out-of-scope notes)

```bash
traversalai secrets audit
traversalai secrets audit --check
traversalai secrets audit --json
```

Exit behavior:

- `--check` exits non-zero on findings.
- unresolved refs exit with a higher-priority non-zero code.

## Configure (interactive helper)

Build provider + SecretRef changes interactively, run preflight, and optionally apply:

```bash
traversalai secrets configure
traversalai secrets configure --plan-out /tmp/traversalai-secrets-plan.json
traversalai secrets configure --apply --yes
traversalai secrets configure --providers-only
traversalai secrets configure --skip-provider-setup
traversalai secrets configure --json
```

Flow:

- Provider setup first (`add/edit/remove` for `secrets.providers` aliases).
- Credential mapping second (select fields and assign `{source, provider, id}` refs).
- Preflight and optional apply last.

Flags:

- `--providers-only`: configure `secrets.providers` only, skip credential mapping.
- `--skip-provider-setup`: skip provider setup and map credentials to existing providers.

Notes:

- `configure` targets secret-bearing fields in `traversalai.json`.
- Include all secret-bearing fields you intend to migrate (for example both `models.providers.*.apiKey` and `skills.entries.*.apiKey`) so audit can reach a clean state.
- It performs preflight resolution before apply.
- Apply path is one-way for migrated plaintext values.

Exec provider safety note:

- Homebrew installs often expose symlinked binaries under `/opt/homebrew/bin/*`.
- Set `allowSymlinkCommand: true` only when needed for trusted package-manager paths, and pair it with `trustedDirs` (for example `["/opt/homebrew"]`).

## Apply a saved plan

Apply or preflight a plan generated previously:

```bash
traversalai secrets apply --from /tmp/traversalai-secrets-plan.json
traversalai secrets apply --from /tmp/traversalai-secrets-plan.json --dry-run
traversalai secrets apply --from /tmp/traversalai-secrets-plan.json --json
```

Plan contract details (allowed target paths, validation rules, and failure semantics):

- [Secrets Apply Plan Contract](/gateway/secrets-plan-contract)

## Why no rollback backups

`secrets apply` intentionally does not write rollback backups containing old plaintext values.

Safety comes from strict preflight + atomic-ish apply with best-effort in-memory restore on failure.

## Example

```bash
# Audit first, then configure, then confirm clean:
traversalai secrets audit --check
traversalai secrets configure
traversalai secrets audit --check
```

If `audit --check` still reports plaintext findings after a partial migration, verify you also migrated skill keys (`skills.entries.*.apiKey`) and any other reported target paths.

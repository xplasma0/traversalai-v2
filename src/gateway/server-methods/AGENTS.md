# Gateway Server Methods Notes

- TraversalAI branding applies to user-facing docs/UI. Keep wire/runtime compatibility names (`traversalai`, method IDs, config paths) stable unless a dedicated migration is requested.
- Pi session transcripts are a `parentId` chain/DAG; never append Pi `type: "message"` entries via raw JSONL writes (missing `parentId` can sever the leaf path and break compaction/history). Always write transcript messages via `SessionManager.appendMessage(...)` (or a wrapper that uses it).

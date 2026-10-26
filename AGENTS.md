# Repository Agent Instructions

When finishing implementation work in this repository, follow the `progress-ledger` skill at `.agents/skills/progress-ledger/SKILL.md` and update the root `progress.md` in the same task. This applies to changes across the whole repository, including `apps/`, `infra/`, and `docs/`.

Keep ledger entries factual: include a full date/time with timezone, changed paths, context, decision, reason, consequences, and only checks actually run. Use the lightweight micro-ADR format in the skill. When implementation changes affect a user/system interaction flow, also update `docs/interaction-flow-map.md` in the same task and keep it grounded in source. Read existing docs before editing, preserve historical entries, and do not add progress entries for read-only work or advice.

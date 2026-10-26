---
name: progress-ledger
description: Keep the repository's progress.md accurate whenever completing changes to existing project code, configuration, infrastructure, dependencies, or documentation. Use at the end of implementation work in this repository.
---

# Progress Ledger

Whenever you finish modifying existing project code or other project files in this repository, update the root `progress.md` as part of the same task. Do not wait for the user to request the ledger update. Also maintain `docs/interaction-flow-map.md` when the change affects how a user/system interaction travels through frontend handlers, API functions, persistence, external services, queues/workers, or back to the UI.

## When to update

- Update after a completed change to existing code, configuration, infrastructure, dependencies, tests, or project documentation.
- Also update when adding a new feature or file if it changes project behavior or architecture.
- Update `docs/interaction-flow-map.md` when an interaction path, function-to-function call, API request, database operation, async state transition, or user-visible outcome is added, changed, or removed. Keep it source-accurate and mark paths `Implemented` or `Planned`.
- Do not edit the interaction flow map for changes that do not affect a system flow (for example, an isolated typo or formatting-only change).
- Do not make a ledger entry for read-only investigation, advice, or a change limited to `progress.md` itself.
- If work is incomplete, record only the completed portion and clearly state what remains.

## How to update

1. Inspect the actual diff and identify every changed project file. Do not rely on memory or claim changes that were not made.
2. Add a concise timestamped entry under Section 4, `Micro-Changelog & Granular Revision History`. Use `YYYY-MM-DD HH:mm:ss TZ` with the repository owner's local timezone; include the timezone abbreviation or UTC offset (for example, `2026-10-26 21:30:00 IST` or `2026-10-26 16:00:00 UTC`). Get the current time from a reliable clock, not by guessing. Summarize what changed and list the exact file paths. Do not alter timestamps on historical entries unless their original time is known.
3. Include the decision rationale in every entry, using this lightweight ADR structure:
   - **Context:** The problem, constraint, or need that prompted the change.
   - **Decision:** What was changed or chosen.
   - **Reason:** Why this option was chosen, including important tradeoffs when relevant.
   - **Consequences:** Material effects, limitations, or follow-up work introduced by the decision.
   Keep each field brief. For routine changes, one short sentence per field is enough. Do not invent a rationale; use the task context or ask if it is genuinely unavailable.
4. Record checks that were actually run and their result. If no checks were run, say so; never imply tests or lint passed without running them.
5. Update Section 3 audit rows, Section 5 findings, or Section 6 roadmap only when the change actually changes those statuses. Keep unrelated historical information intact.
6. Avoid duplicating an existing entry. If the current task already has an appropriate uncommitted working-tree entry, update it with the new change instead of creating redundant prose.
7. Review the final diff to ensure `progress.md` describes the implementation accurately and does not include secrets or sensitive values.

## Interaction flow map

Treat `docs/interaction-flow-map.md` as a maintained companion document, not an append-only change log. For affected interactions, update the existing flow in place and include the trigger, frontend file/handler, HTTP endpoint, API route/service/repository functions, database or external service calls, async/retry behavior, and UI result. Verify function and file names against source. Clearly label intended-but-unimplemented behavior as `Planned`; never turn PRD requirements into claims about current code.

The ledger is a lightweight project history, not a substitute for the implementation, tests, or documentation. Treat each entry as a micro-ADR: record the context and rationale, but keep it factual and brief. Reserve full standalone ADR documents for consequential architectural decisions that need deeper discussion.

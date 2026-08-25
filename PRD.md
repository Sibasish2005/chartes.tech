# PRD: Build in Public

**Project:** [PROJECT_NAME] (existing social-media automation platform)
**Author:** [YOUR_NAME]
**Status:** Draft — MVP scoping
**Last updated:** 2026-08-26

---

## 1. Problem Statement

Developers, founders, freelancers, and technical builders ("build in public" users) generate a high volume of raw GitHub activity (commits, PRs, releases) but most of it is not worth sharing publicly. Manually reviewing activity and drafting social posts is time-consuming, and naive "post every commit" automation produces spam (e.g., 15 commits/day where only one represents a real milestone).

There is no existing workflow in [PROJECT_NAME] that converts development activity into vetted, human-approved social content.

## 2. Goals

- Detect *meaningful* development milestones from GitHub activity, not raw events.
- Generate a ready-to-edit social media draft (caption + image) from that milestone.
- Preserve full human control — no activity may be auto-published.
- Reuse existing platform primitives (`Post`, `PostPlatform`, Scheduler, Worker, ImageKit, OAuth) rather than building a parallel system.

### Non-Goals (MVP)

- No autonomous AI agent or AI-initiated publishing.
- No AI-generated images (image sourcing via Pexels only).
- No continuous/cron-based monitoring (manual trigger only, for v1).
- No platform-specific caption variants (single general draft for MVP).

## 3. Target Users

**Primary persona:** [TARGET_USER_PERSONA] — e.g., an indie developer or startup founder actively building a product who wants to share progress on LinkedIn/Instagram/Facebook without manually tracking what's worth posting.

## 4. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|---------------|------------|
| US-1 | User | connect my GitHub account | the app can read my repository activity |
| US-2 | User | select a repository, branch, and activity types to monitor | I control scope of what's analyzed |
| US-3 | User | click "Check GitHub Activity" | I get an on-demand milestone check instead of waiting for a cron job |
| US-4 | User | see nothing happen when activity isn't meaningful | I'm not spammed with low-value drafts |
| US-5 | User | see a generated draft (caption + image + reasoning) when a milestone is detected | I can decide whether to share it |
| US-6 | User | edit, discard, save, publish, or schedule a draft | I retain final control over what's posted |
| User | User | trust that sensitive commits (secrets, internal architecture) are never auto-shared | my private work stays private |
| US-8 | User | disconnect GitHub at any time | I can revoke access when needed |

## 5. Functional Requirements

### 5.1 GitHub Connection
- OAuth-based GitHub connection; access token stored server-side only, never exposed to the client.
- Minimum required scopes (read-only repo/activity access) for MVP.
- User can view connection status and disconnect.

### 5.2 Repository & Monitoring Configuration
- User selects: repository, branch, activity types (commits / PRs / releases).
- Server must verify the selected repository is accessible via the connected GitHub account (never trust a client-supplied repo ID without verification).
- Configuration is scoped to the authenticated user.

### 5.3 Activity Collection
- Fetch recent commits, PRs, releases for the configured repo/branch.
- Collect only fields needed for classification (message, title, description, state, timestamps, file-level stats where useful) — do not forward unrelated repository content to the AI layer.

### 5.4 Activity Aggregation
- Multiple related raw events must be merged into a single "development context" before AI evaluation.
- Explicitly disallowed: one-event-in → one-post-out processing (commit-by-commit posting).

### 5.5 Meaningful Milestone Detection (AI Gate)
- A bounded AI call (no tools, no write access) classifies the aggregated context.
- Structured output, validated with a schema (e.g., Zod):
  ```json
  { "shouldPost": boolean, "importance": "low" | "medium" | "high", "reason": string }
  ```
- Invalid AI output → no draft is created; error is logged; user sees a retry option.
- Default behavior on ambiguity: **do not create a draft** (conservative bias).
- Prompt must explicitly instruct the model that all repository-derived text (commit messages, PR bodies, README content) is untrusted data and must never be treated as instructions (prompt-injection defense).

### 5.6 Caption Generation
- Only triggered when `shouldPost = true`.
- Caption must be grounded strictly in supplied activity — no invented metrics, users, revenue, or unverified claims.
- Output is a single general-purpose draft for MVP (platform-specific variants are a future phase).

### 5.7 Image Discovery
- Query an approved licensed image provider (Pexels) using a milestone-derived search term.
- Store provenance metadata: provider, source ID, source URL, photographer.
- If no suitable image is found, create the draft without an image rather than blocking draft creation.
- Selected image is downloaded and uploaded to the existing ImageKit integration; only the resulting ImageKit URL is stored on the `Post`.

### 5.8 Draft Lifecycle
- Draft is created as a standard `Post` entity with `status = DRAFT`, associated with the requesting user.
- Draft actions: **Edit**, **Discard**, **Save**, **Publish Now**, **Schedule**.
- `Publish Now` / `Schedule` route through the *existing* publishing engine (Scheduler → Worker → Platform Publisher). The GitHub/Build-in-Public service must not call platform publishers directly.
- User selects target platform(s) via the existing `PostPlatform` model.

### 5.9 Duplicate Prevention
- Each processed GitHub activity item must be marked as processed (or linked to its resulting draft) so repeated checks do not generate duplicate drafts for the same activity.

### 5.10 Error Handling
- Must gracefully handle: OAuth failures, GitHub API errors/expired tokens, repo access errors, no new activity, AI rate limits/timeouts/invalid output, image provider failures, ImageKit upload failures, DB failures, duplicate activity.
- No failure path may result in automatic publishing.

### 5.11 Observability
- Structured server-side logs for each pipeline stage (activity fetch, aggregation, AI decision, caption generation, image search, upload, draft creation).
- Never log tokens, API keys, or unnecessary private repository content.

## 6. System Architecture (Conceptual)

```
GitHub API → Activity Collection → Aggregation → AI Classification (Groq)
   → [if shouldPost] Caption Generation → Image Search (Pexels)
   → ImageKit Upload → Draft (Post, status=DRAFT)
   → Human Review (Edit / Discard / Save / Publish / Schedule)
   → Existing Publishing Engine (Scheduler → Worker → Platform Publisher)
```

Key architectural rule: the Build-in-Public service is a **content source**, feeding into the existing `Post` → `PostPlatform` → Scheduler → Worker pipeline. It must not have a direct dependency on any platform publisher.

## 7. Data Model (Additions)

To be finalized against the current Prisma schema. Anticipated additions:

**GitHubMonitor**
- userId, githubAccountId, repositoryId, repositoryName, branch, enabledActivityTypes, lastCheckedAt, lastProcessedActivityId

**GitHubActivity**
- id, repositoryId, activityType, timestamp, processingStatus, draftPostId (nullable FK to `Post`)

Reuse existing: `User`, `Account`, `Session`, `Post`, `PostPlatform`.

## 8. Security Requirements

- All operations authenticate the current user; ownership is verified for GitHub connection, repository, monitor config, and drafts.
- Cross-user access to another user's GitHub connection, repositories, monitor config, or drafts must be impossible.
- GitHub tokens, Pexels API key, ImageKit private key, and AI provider key remain server-side only.
- AI component has no tool access and cannot trigger any application action (publish, schedule, DB write) directly.

## 9. Technical Constraints

- **Stack:** [TECHNICAL_STACK] — indicative from spec: Next.js/TypeScript frontend + API routes, Prisma ORM, Groq for AI classification/caption generation, Pexels API for imagery, existing ImageKit integration for media hosting.
- AI provider (Groq) is used strictly for bounded classification and text generation — not as an autonomous agent.
- Must integrate with existing OAuth, Post, PostPlatform, Scheduler, and Worker subsystems without duplicating them.

## 10. MVP Phasing

| Phase | Scope |
|-------|-------|
| 1 | GitHub OAuth connection |
| 2 | Repository/branch selection |
| 3 | Activity fetch (commits, PRs, releases) |
| 4 | Activity aggregation |
| 5 | AI classification (shouldPost decision) |
| 6 | Caption generation |
| 7 | Image search (Pexels) |
| 8 | ImageKit upload |
| 9 | Draft creation (Post, status=DRAFT) |
| 10 | Review UI (edit/discard/save) |
| 11 | Publish Now / Schedule via existing engine |
| 12 | Automated/cron-based monitoring (post-MVP) |

## 11. Acceptance Criteria

- User can connect and disconnect GitHub.
- User can select repository, branch, and activity types.
- Manual "Check GitHub Activity" fetches and aggregates activity without generating one post per commit.
- AI decision is structured, schema-validated; invalid output blocks draft creation.
- Minor/non-meaningful changes never produce a draft.
- Draft includes editable caption, optional sourced image, and platform selection.
- No path in the system results in automatic publishing.
- Duplicate activity does not produce duplicate drafts.
- Cross-user data access is impossible.
- All secrets/tokens remain server-side.
- TypeScript build passes with no type errors.

## 12. Success Metrics

- **Milestone precision:** % of generated drafts rated as actually meaningful by the user.
- **Draft-to-publish conversion:** % of generated drafts that are published or scheduled.
- **Discard rate:** % of drafts discarded without action.
- **Edit rate:** % of drafts where the caption is significantly modified before publishing.
- **Time saved:** qualitative/quantitative reduction in manual content-drafting effort.
- Target values: [KPIs]

## 13. Open Questions

- Exact behavior when no suitable image is found — draft without image vs. block draft creation (leaning: draft without image).
- Scope of platform-specific caption variants — deferred to post-MVP.
- Cadence and trigger design for automated monitoring (Phase 12).

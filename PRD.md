# PRD: GitHub → AI Social Posting Engine

**Project:** `chartes.tech` (`omnicode-beta`)  
**Author:** Core Engineering  
**Status:** Feature Specification & Architecture Roadmap  
**Placement in Roadmap:** Priority Step (Build before Event-Driven AI Job Search & Recruiter Outreach Agent)  

---

## 1. Problem Statement

Developers, founders, freelancers, and technical builders ("build in public" creators) generate continuous GitHub activity (commits, PR merges, releases), but most of it is not worth sharing publicly. Manually reviewing activity and drafting social posts is time-consuming, while naive "post every commit" automation produces spam (e.g. 15 commits/day where only one represents a real milestone).

`chartes.tech` bridges this gap with an intelligent, deterministic AI decision layer and a human-in-the-loop approval gate. When meaningful changes are pushed or merged, the system evaluates significance, generates ready-to-publish social copy, and stops at a review inbox for human approval.

## 2. Goals & Key Principles

- **Deterministic Hard Boundary First:** An LLM alone never decides whether to post. Deterministic rules (branch eligibility, commit relevance, magnitude, sensitive path exclusions, cooldowns) provide the safety boundary before any AI generation.
- **Context-Aware AI Generation:** AI summarizes code changes, extracts key angles, and produces structured, schema-validated social copy (caption + hashtags + media suggestions) without ever exposing private source code or secrets.
- **Mandatory Human-in-the-Loop Approval:** No post is ever published automatically. Every proposal enters `WAITING_FOR_APPROVAL` for human review, editing, scheduling, or rejection.
- **Multi-Platform Reuse:** Approved drafts feed directly into the existing publishing pipeline (`Post` → `PostPlatform` → `Scheduler` / `Worker`) targeting LinkedIn, Facebook Pages, and Instagram.

### Non-Goals

- No autonomous or unverified publishing without human review.
- No raw commit dumping or posting on every trivial push.
- No exposure of private repository secrets or `.env` files to AI models.

## 3. Target Users

Indie hackers, startup founders, open-source maintainers, and developer advocates building in public who want to maintain an active, high-quality social presence on LinkedIn, Facebook, and Instagram without manual drafting friction.

## 4. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|---------------|------------|
| US-1 | User | connect my GitHub account & repositories | the app can receive push and PR events |
| US-2 | User | configure eligible branches, cooldowns, and sensitivity rules | I control which code triggers social evaluations |
| US-3 | User | receive webhook-driven event evaluations automatically | I don't have to manually trigger checks |
| US-4 | User | see trivial commits (docs, locks, formatting) silently ignored | my inbox is only populated with real milestones |
| US-5 | User | see AI-generated post proposals with diff summaries & reasoning | I can quickly assess and refine the content |
| US-6 | User | edit, approve & publish now, schedule, or reject proposals | I retain 100% final authority over published content |
| US-7 | User | trust that secrets and sensitive paths are strictly excluded | my private project details stay secure |

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
GitHub Webhook Event (push / merge)
   → HMAC-SHA256 Signature Verification
   → Normalized Event Persistence (processingStatus: RECEIVED)
   → Deterministic Filter (branch, relevance, magnitude, sensitive paths, cooldown)
   → [if passes] AI Change Analyzer (Zod schema: decision, angle, caption, hashtags)
   → Proposal Created (status: WAITING_FOR_APPROVAL)
   → Human Approval Gate (/dashboard AI Review Inbox)
   → [User Action: Edit / Reject / Approve & Publish / Approve & Schedule]
   → Existing Multi-Platform Publishing Engine (Post → PostPlatform → Worker → LinkedIn / Facebook / Instagram)
```

Key architectural rule: the GitHub Social Posting service is a **content proposal source**, feeding into the existing `Post` → `PostPlatform` → Scheduler → Worker pipeline. It must not have a direct dependency on any platform publisher.

## 7. Data Model (Additions)

Extended in Prisma without altering existing social publisher primitives:

- **`GitHubRepository`**: `id`, `userId`, `providerRepoId`, `owner`, `name`, `fullName`, `defaultBranch`, `enabled`, `createdAt`.
- **`GitHubEvent`**: `id`, `repositoryId`, `eventId`, `eventType`, `commitSha`, `payloadHash`, `receivedAt`, `processingStatus`.
- **`SocialPostProposal`**: `id`, `userId`, `repositoryId`, `eventId`, `decision`, `confidence`, `reason`, `changeSummary`, `draftContent`, `status` (`WAITING_FOR_APPROVAL`, `APPROVED`, `REJECTED`), `createdAt`.
- **`AIReviewAudit`**: `id`, `proposalId`, `model`, `promptVersion`, `ruleResults`, `generatedAt`, `approvedAt`, `rejectedAt`.

Reuse existing: `User`, `Account`, `Session`, `Post`, `PostPlatform`.

## 8. Security Requirements

- All operations authenticate the current user; ownership is verified for GitHub connections, repositories, and proposal approvals.
- Webhook endpoint (`POST /api/integrations/github/webhook`) strictly verifies `x-hub-signature-256` secret tokens before ingestion.
- No repository source code, environment secrets, private keys, or `.env` files are ever sent to LLMs.
- AI output is always validated with Zod and never trusted as authoritative without human approval.

## 9. Technical Constraints

- **Stack:** Next.js 16 (App Router), TypeScript, Prisma 7, Tailwind CSS v4, Redux Toolkit.
- AI analysis produces structured Zod outputs (`{ decision, confidence, reason, projectSummary, changeSummary, postingAngle, draftCaption, hashtags, mediaSuggestion, warnings }`).
- Directly integrates with existing `LinkedIn`, `Facebook`, and `Instagram` publishers and `cron-job.org` background worker without duplication.

## 10. Implementation Order

| Step | Milestone |
|---|---|
| 1 | GitHub OAuth connection & repository discovery (`POST /api/integrations/github/connect`, `GET /api/github/repositories`) |
| 2 | GitHub webhook endpoint with HMAC-SHA256 signature verification & event persistence |
| 3 | Deterministic change-significance engine with configurable rules (branch, magnitude, exclusions, cooldown) |
| 4 | Asynchronous background processing path for GitHub events |
| 5 | AI change analysis with structured Zod output validation |
| 6 | Social draft generation feeding existing Post/Composer schema |
| 7 | Human approval inbox UI & proposal state machine |
| 8 | Seamless handoff of approved proposals to active LinkedIn / Facebook / Instagram publishers |
| 9 | Idempotency, retries, audit logs, and failure handling |
| 10 | End-to-end verification with live GitHub webhooks and test social accounts |

## 11. Acceptance Criteria

- User can connect and disconnect GitHub.
- User can select repositories, branches, and automation settings.
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

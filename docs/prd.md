# Chartes V2 — Product Requirements Document (PRD) & System Design

**Document Version:** 2.0.0  
**Status:** Approved for Implementation  
**Target Milestone:** MVP Weekend Showcase  
**Author:** Staff Software Architect & Product Lead  
**Last Updated:** 2026-10-26  

---

## 1. Executive Summary & Product Vision

### 1.1 Product Overview
**Chartes V2** is an AI-powered social media creation, scheduling, and asynchronous publishing platform designed specifically for individual creators, freelancers, and small business workspaces. It eliminates the fragmented, manual overhead of managing social platforms by unifying AI-assisted caption generation, media asset uploads, draft composition, and reliable background publishing into a single, clean workspace.

### 1.2 Problem Statement
Content creators and small businesses waste dozens of hours every week navigating:
- Manual copy-pasting across disparate social networks (LinkedIn, Instagram, Facebook).
- Fragmented, unreliable scheduling tools that silently drop posts or fail during token expirations without actionable feedback.
- Cumbersome manual composition workflows lacking localized AI text and hashtag suggestions.
- Opacity surrounding the true publishing lifecycle (e.g. distinguishing between what is scheduled, queued, processing, published, or rejected by upstream third-party APIs).

### 1.3 Core Product Vision
Chartes V2 provides an end-to-end, resilient publishing pipeline. The application is architected around an **event-driven, decoupled execution model**: the user creates and schedules content through a snappy web interface; an AWS Serverless API durable-stores the request; Amazon EventBridge Scheduler dispatches the task when due into an Amazon SQS queue; and a dedicated, lightweight Python worker on an Oracle Cloud instance claims, authenticates, and executes the external publishing action with deterministic retry semantics.

### 1.4 Financial & Operational Constraint
**Hosting Budget: ₹0 (Strict Free Tier).**  
Every cloud component is carefully matched to permanent or verified free-tier allowances:
- Frontend: Cloudflare Pages (Unlimited bandwidth, ₹0).
- API: AWS Lambda with Lambda Function URL (1M requests/mo Always Free, ₹0 API Gateway fee).
- Database: Amazon DynamoDB in Provisioned Capacity Mode ($\le 25$ RCU, $\le 25$ WCU, 25 GB storage Always Free).
- Scheduling: Amazon EventBridge Scheduler (14M invocations/mo Always Free).
- Queue: Amazon SQS (1M requests/mo Always Free).
- Storage: Amazon S3 (5 GB Free Tier).
- Worker: Oracle Cloud Always Free Compute (1 GB RAM ARM/AMD VM, ₹0).

---

## 2. Target Personas & Use Cases

| Persona | Description | Primary Needs | Critical Success Factor |
| :--- | :--- | :--- | :--- |
| **Solo Creator** | Independent content creator managing personal brand across LinkedIn and Instagram. | Quick drafting with AI suggestions, simple image attachment, guaranteed scheduled delivery. | Zero friction to publish; self-service LinkedIn personal profile integration without app review hurdles. |
| **Freelance Social Manager** | Manages social media channels for 2–3 small local businesses. | Isolated workspace management, clear audit log of post publication states, error diagnostics. | Multi-tenant workspace isolation so client data never mixes. |
| **Small Business Owner** | Operates a retail or boutique service brand. | "Set-and-forget" weekly scheduling; notifications if a social account token expires. | Clear status reporting; visibility when third-party APIs fail. |

---

## 3. Product Scope & Non-Goals

### 3.1 In-Scope (MVP Release)
1. **Secure Multi-Tenant Auth**: Email/password registration, login, secure HTTP-only JWTs, automatic default workspace creation.
2. **Workspace Management**: Default workspace provisioning, workspace settings, strict tenant isolation across all database operations.
3. **AI Caption & Hashtag Generator**: Pluggable AI text generation (Google Gemini Flash / Groq) producing structured captions, platform adjustments, and hashtag suggestions.
4. **Content Composer**: Rich markdown/text editor, character counter per platform, single image upload via S3 presigned URLs, draft saving, immediate publishing, and future scheduling.
5. **Social Account Connections**:
   - **LinkedIn**: Personal Profile publishing via the self-service "Share on LinkedIn" developer product (`w_member_social`).
   - **Meta (Facebook/Instagram)**: Developer mode connectivity for Page and Instagram Professional publishing.
6. **Durable Asynchronous Publishing**: EventBridge Scheduler $\to$ SQS $\to$ Python Worker on Oracle VM $\to$ Social API $\to$ DynamoDB status reconciliation.
7. **Transparent Status Dashboard**: Real-time status indicators (`DRAFT`, `SCHEDULED`, `QUEUED`, `PROCESSING`, `PUBLISHED`, `FAILED`, `CANCELLED`) with explicit third-party error diagnostics.

### 3.2 Explicit Non-Goals (Out of Scope for MVP)
- **NO** AI image or video generation (DALL-E, Midjourney, Sora).
- **NO** autonomous AI posting agents operating without human review.
- **NO** vector databases, RAG pipelines, or LLM embeddings.
- **NO** Kafka, Kubernetes, or multi-cluster container orchestration.
- **NO** complex billing, Stripe integration, or subscription paywalls.
- **NO** enterprise SAML/SSO or fine-grained role RBAC matrix (Admin/Editor/Viewer).
- **NO** self-hosted Prometheus/Grafana or memory-hungry stacks on the 1 GB Oracle VM.
- **NO** social listening, sentiment analysis, or advanced analytics scrapers.

---

## 4. User Roles, Permissions & Multi-Tenant Isolation

### 4.1 Minimal Pragmatic Role Model
To ensure delivery within the weekend timeframe, the role model is deliberately streamlined:
1. **Individual User (`USER`)**: Authenticated entity owning an account identity.
2. **Workspace Owner (`OWNER`)**: The user who created the workspace. Has full authority to manage connected accounts, create/edit/delete posts, trigger AI generation, and cancel scheduled publishing jobs within that workspace.

### 4.2 Multi-Tenant Data Isolation Invariants
Multi-tenancy is enforced through **Defense-in-Depth** at the API authorization layer and DynamoDB query boundary:
1. **Token Scope**: Every authenticated request yields a validated JWT containing `user_id` and the active `workspace_id`.
2. **Ownership Verification**: Before executing any query or mutation on `posts`, `social_accounts`, `media`, or `jobs`, the backend verifies that the requested entity's `workspace_id` matches the token's `workspace_id`.
3. **Partition Key Isolation**: In DynamoDB, items are partitioned or indexed by `workspace_id`. Cross-workspace queries are architecturally impossible under standard access patterns.
4. **Resource ID Obfuscation**: All resource identifiers use cryptographically random ULIDs/CUIDs (e.g. `post_01HZX8...`), preventing ID enumeration attacks.

---

## 5. Detailed Functional Requirements

### 5.1 Authentication (`FR-AUTH`)

#### `FR-AUTH-001`: User Registration
- **User Story**: As a new user, I want to create an account using my email and a secure password so I can access the platform.
- **Behavior**: The backend receives `email` and `password`. It validates email syntax, hashes the password using Argon2id/bcrypt, verifies email uniqueness in DynamoDB via an atomic conditional write (`attribute_not_exists(pk)` on `USER_EMAIL#<email>`), creates the user profile, creates a default workspace (`<User's Name>'s Workspace`), links the user as `OWNER`, and returns a signed session token.
- **Validation**: Email must be valid RFC 5322 format; password must be $\ge 8$ characters, containing at least 1 number and 1 special character.
- **Errors**: `409 Conflict` if email already registered; `422 Unprocessable Entity` if password criteria fail.
- **Acceptance Criteria**: A new user is created in DynamoDB with a hashed password, a default workspace is provisioned, and the user receives a valid session cookie.

#### `FR-AUTH-002`: User Authentication & Session Management
- **User Story**: As a registered user, I want to log in securely and receive a session token.
- **Behavior**: Verifies credentials against DynamoDB hash. Emits an HTTP-only, Secure, SameSite=Lax JWT cookie with a 7-day expiration.
- **Rate Limit**: Maximum 5 failed attempts per IP/email per 15-minute window.
- **Acceptance Criteria**: Valid credentials yield `200 OK` with session cookie; invalid credentials return generic `401 Unauthorized`.

#### `FR-AUTH-003`: Current User & Workspace Context
- **User Story**: As an authenticated user, the frontend needs to fetch my profile and active workspace context on boot.
- **Behavior**: `GET /api/v1/auth/me` decodes the token, fetches user and workspace records, and returns sanitized profile data (omitting password hash).

---

### 5.2 Workspace Management (`FR-WS`)

#### `FR-WS-001`: Workspace Retrieval & Creation
- **User Story**: As a user, I want to view my current workspace and create an additional workspace if needed.
- **Behavior**: Users can query `GET /api/v1/workspaces` to list workspaces they own. `POST /api/v1/workspaces` allows creating a new named workspace.
- **Validation**: Workspace name must be between 2 and 50 characters. Maximum 5 workspaces per user in the free tier.
- **Acceptance Criteria**: New workspace created with unique ID, linked to the creator's `user_id`.

---

### 5.3 AI Content Generation (`FR-AI`)

#### `FR-AI-001`: AI Text & Caption Generation
- **User Story**: As a creator, I want to generate engaging social media captions from a short prompt, selecting tone and target platform.
- **Behavior**: `POST /api/v1/ai/generate` accepts `prompt`, `platform` (`LINKEDIN`, `INSTAGRAM`, `FACEBOOK`), `tone` (`PROFESSIONAL`, `CASUAL`, `HUMOROUS`, `INSPIRATIONAL`), and `include_hashtags: bool`. The backend invokes the AI Provider adapter (Google Gemini Flash / Groq) with structured system prompts and returns structured text.
- **Rate Limit & Timeout**: 10 requests per minute per user; strict 8-second upstream timeout with fallback error handling.
- **Acceptance Criteria**: Returns generated text, estimated character count, and hashtag array.

---

### 5.4 Content Composer & Post Lifecycle (`FR-POST`)

#### `FR-POST-001`: Draft Management (Create, Read, Update, Delete)
- **User Story**: As a creator, I want to draft post content, edit it over time, and persist it without scheduling.
- **Behavior**: `POST /api/v1/posts` creates a draft with status `DRAFT`. `PUT /api/v1/posts/{id}` updates caption, selected platforms, or attached media URL. `DELETE /api/v1/posts/{id}` soft-deletes or removes the draft.
- **Validation**:
  - LinkedIn: Caption $\le 3,000$ characters.
  - Instagram: Caption $\le 2,200$ characters; media upload **mandatory**.
  - Facebook Page: Caption $\le 5,000$ characters.
- **Acceptance Criteria**: Draft stored in DynamoDB under `POST#<post_id>` with per-platform status objects initialized to `DRAFT`.

#### `FR-POST-002`: Post Scheduling
- **User Story**: As a creator, I want to schedule a post for a specific future date and time.
- **Behavior**: `POST /api/v1/posts/{id}/schedule` accepts `scheduled_at` (ISO 8601 UTC timestamp).
- **Validation**: `scheduled_at` must be at least 5 minutes in the future and no more than 90 days in advance. Target platforms must have active, connected social accounts in the workspace.
- **Action**:
  1. Updates Post status to `SCHEDULED` in DynamoDB.
  2. Creates a publishing job record with status `SCHEDULED`.
  3. Invokes Amazon EventBridge Scheduler `CreateSchedule` API with a one-time trigger targeting the production SQS queue at `scheduled_at`.
- **Acceptance Criteria**: DynamoDB state is `SCHEDULED`, EventBridge schedule ARN is saved on the job item.

#### `FR-POST-003`: Immediate Publishing
- **User Story**: As a creator, I want to publish a draft immediately.
- **Behavior**: `POST /api/v1/posts/{id}/publish-now` validates content, sets status to `QUEUED`, and directly sends a message to the SQS queue with zero delay, bypassing EventBridge Scheduler.
- **Acceptance Criteria**: Message appears in SQS; post status moves to `QUEUED`.

#### `FR-POST-004`: Schedule Cancellation
- **User Story**: As a creator, I want to cancel a scheduled post before it is published.
- **Behavior**: `POST /api/v1/posts/{id}/cancel` checks if status is `SCHEDULED`. Deletes the EventBridge schedule via `DeleteSchedule` and transitions post and job status to `CANCELLED`.
- **Validation**: Cannot cancel if job is already `PROCESSING` or `PUBLISHED`.
- **Acceptance Criteria**: EventBridge schedule deleted; post marked `CANCELLED`.

---

### 5.5 Social Account Integrations (`FR-SOC`)

#### `FR-SOC-001`: LinkedIn Account Connection (OAuth 2.0)
- **User Story**: As a creator, I want to connect my LinkedIn personal profile so Chartes can publish posts on my behalf.
- **Behavior**:
  1. `GET /api/v1/social/linkedin/authorize` generates an OAuth URL with encrypted state containing `workspace_id` and random CSRF nonce.
  2. Redirects user to LinkedIn authorization dialog requesting scope `w_member_social`, `openid`, `profile`.
  3. `GET /api/v1/social/linkedin/callback` validates state, exchanges authorization code for access token, calls LinkedIn UserInfo endpoint to retrieve Person URN (`urn:li:person:<id>`) and display name.
  4. Encrypts token using AES-256 (KMS / Fernet) and stores it in DynamoDB table `chartes_social_accounts`.
- **Acceptance Criteria**: Account record created; token encrypted; workspace dashboard displays connected LinkedIn identity.

#### `FR-SOC-002`: Meta / Instagram Connection (OAuth 2.0)
- **User Story**: As a creator, I want to connect my Facebook Page and linked Instagram Professional account.
- **Behavior**: OAuth flow requesting `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`. Callback fetches managed pages and connected Instagram Business accounts, exchanging short-lived token for long-lived 60-day token.
- **Acceptance Criteria**: Discovers page and IG accounts; stores encrypted access tokens.

#### `FR-SOC-003`: Social Account Disconnection
- **User Story**: As a user, I want to disconnect a social account and purge its tokens.
- **Behavior**: `DELETE /api/v1/social/accounts/{id}` verifies workspace ownership, executes upstream revocation if supported, and deletes the record from DynamoDB.

---

### 5.6 Media Uploads (`FR-MEDIA`)

#### `FR-MEDIA-001`: Presigned URL Generation for S3
- **User Story**: As a creator, I want to upload an image directly to secure cloud storage without sending heavy media payloads through the API Lambda.
- **Behavior**: `POST /api/v1/media/upload-url` accepts `file_name`, `content_type`, `file_size_bytes`.
- **Validation**: `content_type` must be `image/jpeg`, `image/png`, or `image/webp`. `file_size_bytes` must be $\le 10 \text{ MB}$.
- **Backend Action**: Generates an S3 Presigned PUT URL with a 15-minute expiration and exact S3 key `workspaces/{workspace_id}/uploads/{ulid}.{ext}`.
- **Acceptance Criteria**: Client receives presigned URL and public CDN URL; can PUT directly from browser.

---

### 5.7 Asynchronous Publishing Execution (`FR-JOB`)

#### `FR-JOB-001`: Worker Job Claiming & Idempotency
- **User Story**: As a background worker, I need to reliably claim jobs from SQS without double-publishing.
- **Behavior**: Worker receives SQS message: `{"job_id": "...", "post_id": "...", "workspace_id": "..."}`. Worker issues conditional write to DynamoDB:
  ```python
  UpdateExpression="SET #status = :processing, claimed_at = :now, worker_id = :wid"
  ConditionExpression="#status = :queued OR #status = :scheduled"
  ```
- **Acceptance Criteria**: Only 1 worker can claim a job. If duplicate message arrives, condition fails and message is safely discarded.

#### `FR-JOB-002`: Publishing Execution & Error Classification
- **User Story**: As the worker, I execute the platform API call, handle network glitches, and record the exact result.
- **Behavior**:
  - Resolves decrypted access token from DynamoDB.
  - Calls platform adapter (`LinkedInPublisher` or `MetaPublisher`).
  - **Success**: Updates post status to `PUBLISHED`, records platform post URL / external ID, deletes SQS message.
  - **Transient Error (429 Rate Limit, 5xx Server Error)**: Increments attempt count; leaves message in queue for retry up to 3 times with exponential backoff.
  - **Permanent Error (401 Bad Token, 400 Validation Error, Account Suspended)**: Immediately marks job and post `FAILED`, writes detailed error message to DynamoDB, deletes SQS message (no point retrying bad tokens).
  - **Exceeded Retries**: SQS moves message to Dead Letter Queue (DLQ).

---

## 6. Target Technology Stack

| Layer | Selected Technology | Version / Spec | Justification & Free Tier Alignment |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js** | 16.3.8 (React 19) | Modern component architecture, strict TypeScript. Configured with `output: 'export'` for pure static SPA distribution. |
| **Frontend Hosting** | **Cloudflare Pages** | Static CDN | **₹0 Permanent**. Zero cold starts, unlimited bandwidth, instant global asset delivery. |
| **Styling & Icons** | **Tailwind CSS v4 + Lucide** | Tailwind 4.x | High-performance CSS engine with zero runtime overhead. |
| **Backend API** | **FastAPI + Mangum** | Python 3.14, FastAPI 0.142+ | High-speed async ASGI framework. Mangum translates AWS Lambda Function URL events seamlessly. |
| **Backend Compute** | **AWS Lambda** | Python 3.14 (Amazon Linux 2023) | **Always Free**: 1,000,000 requests and 400,000 GB-seconds/month. Configured with Lambda Function URL ($0 API Gateway fee). |
| **Database** | **Amazon DynamoDB** | Managed NoSQL | **Always Free**: Configured with **Provisioned Capacity Mode** ($\le 25$ RCU / $\le 25$ WCU, 25 GB storage). |
| **Queue & Messaging** | **Amazon SQS** | Standard Queue + DLQ | **Always Free**: 1,000,000 requests/month. Decouples API from worker execution. |
| **Job Scheduler** | **Amazon EventBridge Scheduler** | Serverless Scheduler | **Always Free**: 14,000,000 invocations/month permanently free. Reliable one-time post scheduling. |
| **Object Storage** | **Amazon S3** | Standard Storage | 5 GB storage, 20,000 GETs, 2,000 PUTs free tier. Presigned PUT URLs for direct browser uploads. |
| **Worker Host** | **Oracle Cloud VM** | Ubuntu / Linux (1 GB RAM) | **Always Free**: Dedicated compute instance for running the Python SQS consumer 24/7. |
| **Code Quality** | **Ruff + Pytest + ESLint** | Latest | Enforces formatting, import sorting, linting, and automated unit/integration test gates. |

---

## 7. DynamoDB Data Model & Access Patterns

To guarantee ₹0 hosting without risk of On-Demand request fees, we use a **Pragmatic 3-Table Design** in **Provisioned Mode**, allocating capacity safely under the 25 RCU / 25 WCU free limit:

```
Total Provisioned Capacity:
Table 1 (Users & Workspaces):  5 RCU / 5 WCU
Table 2 (Social Accounts):     5 RCU / 5 WCU
Table 3 (Posts & Jobs):       10 RCU / 10 WCU
Total Account Capacity:       20 RCU / 20 WCU  <-- Comfortably under the 25 RCU/WCU Always Free limit!
```

### 7.1 Table 1: `chartes_users_workspaces`
- **Capacity**: 5 RCU / 5 WCU (Provisioned)
- **Primary Key**: `PK` (String), `SK` (String)
- **GSI1**: `GSI1PK` (String), `GSI1SK` (String)

| Entity | `PK` | `SK` | Attributes | Access Pattern |
| :--- | :--- | :--- | :--- | :--- |
| **User Profile** | `USER#<user_id>` | `PROFILE` | `email`, `password_hash`, `name`, `created_at` | Get User by ID (`PK=USER#<id>, SK=PROFILE`) |
| **User Email Lookup** | `USER_EMAIL#<email>` | `LOOKUP` | `user_id`, `created_at` | Login authentication lookup; atomic duplicate email check |
| **Workspace** | `WS#<workspace_id>` | `METADATA` | `name`, `owner_user_id`, `created_at` | Get Workspace details |
| **Workspace Membership** | `USER#<user_id>` | `MEMBER#<ws_id>` | `workspace_id`, `role` (`OWNER`), `joined_at` | List all workspaces a user belongs to (`Query PK=USER#<id>, SK begins_with MEMBER#`) |

---

### 7.2 Table 2: `chartes_social_accounts`
- **Capacity**: 5 RCU / 5 WCU (Provisioned)
- **Primary Key**: `PK` (String), `SK` (String)
- **GSI1**: `GSI1PK` (String), `GSI1SK` (String)

| Entity | `PK` | `SK` | Attributes | Access Pattern |
| :--- | :--- | :--- | :--- | :--- |
| **Connected Account** | `WS#<workspace_id>` | `ACCOUNT#<platform>#<account_id>` | `platform`, `account_id`, `account_name`, `encrypted_access_token`, `token_expires_at`, `connected_at` | List connected accounts for workspace (`Query PK=WS#<id>, SK begins_with ACCOUNT#`) |
| **Account Lookup (GSI1)** | `GSI1PK = ACCOUNT#<account_id>` | `GSI1SK = WS#<workspace_id>` | Same as above | Quick lookup by platform account ID |

---

### 7.3 Table 3: `chartes_posts_jobs`
- **Capacity**: 10 RCU / 10 WCU (Provisioned)
- **Primary Key**: `PK` (String), `SK` (String)
- **GSI1**: `GSI1PK` (String), `GSI1SK` (String)

| Entity | `PK` | `SK` | Attributes | Access Pattern |
| :--- | :--- | :--- | :--- | :--- |
| **Post** | `WS#<workspace_id>` | `POST#<post_id>` | `caption`, `media_urls` (list), `platforms` (list), `status` (`DRAFT`, `SCHEDULED`, `QUEUED`, `PUBLISHED`, `FAILED`), `scheduled_at`, `created_at`, `updated_at` | List posts for workspace sorted by date (`Query PK=WS#<id>, SK begins_with POST#`) |
| **Publishing Job** | `JOB#<job_id>` | `METADATA` | `post_id`, `workspace_id`, `status` (`SCHEDULED`, `QUEUED`, `PROCESSING`, `PUBLISHED`, `FAILED`, `CANCELLED`), `platforms`, `scheduled_at`, `attempt_count`, `last_error`, `scheduler_name` | Direct Job claim and update by worker |
| **Post by Status (GSI1)** | `GSI1PK = WS#<workspace_id>#<status>` | `GSI1SK = <scheduled_at or created_at>` | Post summary attributes | List scheduled or published posts for workspace dashboard |

---

## 8. Asynchronous Publishing Workflow & Reliability

```
[User Schedules Post]
         │
         ▼
[FastAPI on Lambda]
  ├── 1. PutItem Post (status=SCHEDULED) in DynamoDB
  ├── 2. PutItem Job (status=SCHEDULED) in DynamoDB
  └── 3. CreateSchedule in EventBridge (Target=SQS, Time=scheduled_at)
         │
         │ (At scheduled execution time)
         ▼
[EventBridge Scheduler] ───► Sends Minimal Message ───► [Amazon SQS]
                                                            │
                                                            │ (Long Polling)
                                                            ▼
                                                [Oracle Worker Process]
                                                            │
                                        ┌───────────────────┴───────────────────┐
                                        ▼                                       ▼
                             [1. Conditional Write]                    [Conflict / Stale]
                           Claim Job in DynamoDB                          Discard Message
                         (status=QUEUED -> PROCESSING)                          ▲
                                        │                                       │
                                        ▼                                       │
                             [2. Fetch Token & Post]                            │
                           Decrypt Token from DynamoDB                          │
                                        │                                       │
                                        ▼                                       │
                             [3. Execute Social API]                            │
                            Call LinkedIn / Meta API                            │
                                        │                                       │
                       ┌────────────────┴────────────────┐                      │
                       ▼                                 ▼                      │
                   [Success]                          [Failure]                 │
             Update Post: PUBLISHED             Classify Error Code             │
             Update Job: PUBLISHED                       │                      │
             Delete SQS Message               ┌──────────┴──────────┐           │
                                              ▼                     ▼           │
                                         [Transient]           [Permanent]      │
                                       Leave in SQS for      Mark Post: FAILED  │
                                       retry (Max 3 times)   Delete SQS Message │
                                              │                     ▲           │
                                              ▼                     │           │
                                       [Exceeded Max]               │           │
                                       Moves to SQS DLQ ────────────┴───────────┘
```

### 8.1 SQS Message Payload (Strictly Minimal)
```json
{
  "version": "1.0",
  "job_id": "job_01HZX8719KMN",
  "post_id": "post_01HZX8719KMN",
  "workspace_id": "ws_01HZX7621ABC",
  "timestamp": 1792982400
}
```
*Note: The queue message contains NO passwords, NO tokens, and NO post bodies. The worker fetches authoritative data directly from DynamoDB upon claiming.*

### 8.2 State Transition Machine
```
[DRAFT] ──────► [SCHEDULED] ──────► [QUEUED] ──────► [PROCESSING] ──────► [PUBLISHED]
   │                 │                 │                   │
   ▼                 ▼                 ▼                   ▼
[DELETED]       [CANCELLED]       [CANCELLED]          [FAILED] (or [RETRYING] -> [DLQ])
```

---

## 9. API Specification (`/api/v1`)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/health` | `GET` | No | Basic service liveness and runtime metadata. |
| `/api/v1/auth/register` | `POST` | No | Register new user, creates default workspace, sets JWT. |
| `/api/v1/auth/login` | `POST` | No | Authenticate user credentials, returns JWT cookie. |
| `/api/v1/auth/logout` | `POST` | Yes | Invalidate session cookie. |
| `/api/v1/auth/me` | `GET` | Yes | Get current user profile and active workspace. |
| `/api/v1/workspaces` | `GET` / `POST` | Yes | List workspaces / Create new workspace. |
| `/api/v1/ai/generate` | `POST` | Yes | Generate caption and hashtags using AI provider. |
| `/api/v1/media/upload-url` | `POST` | Yes | Generate presigned S3 PUT URL for image attachment. |
| `/api/v1/posts` | `GET` / `POST` | Yes | List workspace posts / Create new draft post. |
| `/api/v1/posts/{id}` | `GET` / `PUT` / `DELETE`| Yes | Fetch post / Update draft / Delete post. |
| `/api/v1/posts/{id}/schedule` | `POST` | Yes | Schedule post for future publication. |
| `/api/v1/posts/{id}/publish-now` | `POST` | Yes | Publish post immediately via SQS queue. |
| `/api/v1/posts/{id}/cancel` | `POST` | Yes | Cancel scheduled post and remove EventBridge schedule. |
| `/api/v1/social/accounts` | `GET` | Yes | List connected social accounts in workspace. |
| `/api/v1/social/accounts/{id}` | `DELETE` | Yes | Disconnect account and purge tokens. |
| `/api/v1/social/linkedin/authorize`| `GET` | Yes | Generate LinkedIn OAuth URL. |
| `/api/v1/social/linkedin/callback` | `GET` | Yes | OAuth callback to exchange and store LinkedIn token. |

---

## 10. Security, Privacy & Tenant Isolation

1. **Token Encryption at Rest**: All third-party access tokens and refresh tokens are encrypted using **AES-256-GCM** (or Fernet) before persisting to DynamoDB. The encryption key is injected via AWS Secrets Manager or KMS-encrypted Lambda environment variable.
2. **Zero Plaintext Secrets**: Source code, git history, and client logs strictly forbid embedding secrets, tokens, or credentials.
3. **S3 Presigned URL Security**: S3 bucket is 100% private. Direct public access is disabled. Presigned PUT URLs expire after 900 seconds (15 minutes). Object keys are prefixed with `workspaces/{workspace_id}/`, ensuring clients cannot overwrite other tenants' media.
4. **IAM Least Privilege**:
   - Lambda Execution Role only has `dynamodb:GetItem/PutItem/UpdateItem/Query` on the 3 designated tables, `sqs:SendMessage` on the publishing queue, and `scheduler:CreateSchedule/DeleteSchedule` on the project namespace.
   - Oracle VM Worker Role (via IAM user with restricted policy) only has `sqs:ReceiveMessage/DeleteMessage/ChangeMessageVisibility` and `dynamodb:GetItem/UpdateItem`.
5. **Safe Logging**: Application logs use structured JSON and scrub authorization headers, session cookies, passwords, and decrypted tokens.

---

## 11. Cost & Free-Tier Guardrails (₹0 Budget Commitment)

| Cloud Resource | Free-Tier Allowance | Expected Chartes V2 MVP Usage | Estimated Monthly Cost |
| :--- | :--- | :--- | :--- |
| **AWS Lambda** | 1,000,000 requests, 400,000 GB-s/mo (Always Free) | ~15,000 requests, 3,000 GB-s | **₹0.00** |
| **Lambda Function URL** | Built into Lambda (No API Gateway required) | 15,000 requests | **₹0.00** |
| **Amazon DynamoDB** | 25 RCU, 25 WCU, 25 GB Storage (Always Free in Provisioned Mode) | **20 RCU / 20 WCU allocated**, < 100 MB | **₹0.00** |
| **Amazon SQS** | 1,000,000 requests/mo (Always Free) | ~5,000 requests (worker polling + messages) | **₹0.00** |
| **EventBridge Scheduler** | 14,000,000 invocations/mo (Always Free) | ~500 scheduled post triggers | **₹0.00** |
| **Amazon S3** | 5 GB storage, 2,000 PUTs, 20,000 GETs (12-Mo Free Tier) | < 1 GB media storage, ~200 uploads | **₹0.00** |
| **Cloudflare Pages** | Unlimited requests & bandwidth (Always Free) | Next.js 16 static export hosting | **₹0.00** |
| **Oracle Cloud Compute** | 1–4 OCPU, 1–24 GB RAM Always Free VM | 1 VM running Python SQS worker | **₹0.00** |
| **Google Gemini Flash API**| Generous free tier via Google AI Studio API | ~500 AI caption requests | **₹0.00** |
| **Total Monthly Cost** | | | **₹0.00** |

---

## 12. Testing Strategy & Quality Gates

The test suite will be located under `apps/api/tests` and `apps/worker/tests`:
1. **Unit Tests (Fast, 0 AWS Credentials)**:
   - Auth password hashing, token validation, JWT expiration.
   - Pydantic schema validation for all post payloads.
   - AI Provider fallback response formatting.
2. **Repository Tests with `moto`**:
   - DynamoDB conditional writes (user duplicate registration, atomic job claim).
   - Multi-tenant query boundary assertions (Workspace A cannot read Workspace B).
3. **Worker Processing Tests**:
   - Simulated SQS message consumption.
   - Mocked LinkedIn API adapter handling `201 Created` vs `429 Rate Limit` vs `401 Expired Token`.
4. **End-to-End Showcase Verification**:
   - Draft Post $\to$ Schedule Post $\to$ EventBridge Triggers SQS $\to$ Worker Claims $\to$ LinkedIn API Receives Payload $\to$ DynamoDB Status Updates to `PUBLISHED`.

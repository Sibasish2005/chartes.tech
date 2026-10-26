# Chartes.Tech - Project Audit & Micro-Progress Ledger

> **Document Purpose**: This file serves as the single source of truth for all changes, architectural milestones, microscopic code adjustments, and technical audit findings across the Chartes.Tech monorepo. Every modification to files, dependencies, database structures, or configurations must be recorded here.

---

## 1. Project Overview & Metadata

| Attribute | Details |
| :--- | :--- |
| **Project Name** | **Chartes.Tech** |
| **Corpus / Repository** | `Sibasish2005/chartes.tech` |
| **Current Active Branch** | `phase-one-backend-foundation` |
| **Primary Remote** | `https://github.com/Sibasish2005/chartes.tech.git` |
| **Architecture Pattern** | Polyglot Monorepo (`apps/api`, `apps/web`, `apps/worker`, `infra`, `docs`) |
| **Audit Timestamp** | 2026-10-25 22:35 IST |
| **Audit Status** | **Phase 1 Backend Foundation in Progress** |

---

## 2. Monorepo Architecture & Directory Inventory

```
chartes.tech/
├── .env.example                # Example environment variables for local development
├── .gitignore                  # Git ignore rules for Python, Node, OS, and env files
├── README.md                   # Repository introduction
├── progress.md                 # [THIS FILE] Comprehensive audit & microscopic change log
├── prd.md                      # Complete PRD & System Design (Root pointer)
├── devOps.md                   # Production DevOps, CI/CD & IaC Architecture (Root pointer)
├── apps/
│   ├── api/                    # FastAPI Backend Service (Python 3.14+, uv)
│   │   ├── .env                # Local environment settings (git-ignored)
│   │   ├── .python-version     # Python version pin (3.14)
│   │   ├── README.md           # API documentation stub
│   │   ├── pyproject.toml      # UV / PEP 621 package metadata & dependencies
│   │   ├── uv.lock             # Exact dependency lockfile for API
│   │   └── app/
│   │       ├── __init__.py     # Package initialization
│   │       ├── core/
│   │       │   └── config.py   # Pydantic Settings configuration loader
│   │       ├── db/             # Database connection & session management [Target for DynamoDB migration]
│   │       │   ├── __init__.py # Database subpackage initialization
│   │       │   ├── dependencies.py # FastAPI session injection dependency (get_db)
│   │       │   └── session.py  # SQLAlchemy engine & SessionLocal factory
│   │       └── main.py         # FastAPI application entrypoint & health routes
│   ├── web/                    # Next.js 16 Web Application (React 19, Tailwind v4)
│   │   ├── .gitignore          # Web specific ignores (.next, node_modules)
│   │   ├── AGENTS.md           # Next.js 16 AI agent guidelines
│   │   ├── CLAUDE.md           # Pointer to AGENTS.md
│   │   ├── README.md           # Web app instructions
│   │   ├── eslint.config.mjs   # Flat ESLint configuration
│   │   ├── next.config.ts      # Next.js configuration
│   │   ├── package.json        # Node dependencies and scripts
│   │   ├── package-lock.json   # NPM lockfile
│   │   ├── postcss.config.mjs  # PostCSS configuration for Tailwind
│   │   ├── tsconfig.json       # TypeScript compiler configuration
│   │   ├── app/                # Next.js App Router
│   │   │   ├── favicon.ico     # Browser favicon
│   │   │   ├── globals.css     # Global CSS and Tailwind directives
│   │   │   ├── layout.tsx      # Root HTML layout with Geist font loading
│   │   │   └── page.tsx        # Starter homepage component
│   │   └── public/             # Static public assets (SVGs)
│   └── worker/                 # Background Job / Worker Service (Python 3.14+, uv)
│       ├── .python-version     # Python version pin (3.14)
│       ├── README.md           # Worker documentation stub
│       ├── pyproject.toml      # UV package metadata for worker
│       ├── uv.lock             # Exact dependency lockfile for worker
│       └── app/
│           ├── __init__.py     # Package initialization
│           └── main.py         # Worker entrypoint (`Worker started` loop)
├── docs/                       # Project documentation
│   ├── prd.md                  # Canonical Product Requirements Document & System Design
│   └── devOps.md               # Canonical Production DevOps, CI/CD & IaC Architecture
└── infra/                      # Infrastructure & deployment manifests (SAM template.yaml)
```

---

## 3. Comprehensive Technical Audit by Component

### 3.1 `apps/api` (FastAPI Backend)

| Item | Status | Details |
| :--- | :--- | :--- |
| **Runtime / Tooling** | Python 3.14.6 via `uv` | Modern, high-speed Python package and project manager. |
| **Dependencies** | FastAPI (0.142.2+), SQLAlchemy (2.1.3+), Alembic (1.20.0+), PyMySQL (1.2.3+), Cryptography (50.0.2+), Pydantic-Settings (2.15.0+), Uvicorn (0.54.0+) | Database driver supports MySQL/MariaDB via PyMySQL; SQLAlchemy 2.0+ ORM. |
| **Dev Dependencies** | HTTPX (0.28.1+), Pytest (9.1.1+), Pytest-Asyncio (1.4.0+), Ruff (0.16.10+) | Linter & testing stack configured. |
| **Configuration (`app/core/config.py`)** | Functional | `Settings` class loads from `.env`. Fields: `app_name`, `app_version`, `app_env`, `debug`, and newly added `database_url: str`. Cached using `@lru_cache`. |
| **Database Connection (`app/db/session.py`)** | Functional | Creates SQLAlchemy engine with `pool_pre_ping=True`. `SessionLocal` created with `autocommit=False, autoflush=False`. |
| **Database Dependency (`app/db/dependencies.py`)** | Functional | `get_db()` generator pattern yields `Session` and ensures `db.close()` in `finally`. |
| **Application Endpoints (`app/main.py`)** | Functional | - `GET /health`: Returns application status and environment.<br>- `GET /health/database`: Validates database connectivity with `SELECT 1`. |
| **Code Quality Audit (Ruff)** | **5 Issues Detected** | - `app/core/config.py:1:1`: `I001` Unsorted imports.<br>- `app/db/dependencies.py:8:17`: `UP043` Redundant type parameters in `Generator[Session, None, None]`.<br>- `app/db/session.py:1:1`: `I001` Unsorted imports.<br>- `app/main.py:1:1`: `I001` Unsorted imports.<br>- `app/main.py:28:47`: `B008` Calling `Depends(get_db)` in argument default (prefer `Annotated[Session, Depends(get_db)]`). |
| **Test Suite** | **0 Tests** | Pytest installed but test directory / test cases have not yet been authored. |
| **Migrations (Alembic)** | **Not Initialized** | Alembic is listed in `pyproject.toml`, but `alembic init` has not been run and no `alembic/` folder exists. |

---

### 3.2 `apps/worker` (Background Worker Service)

| Item | Status | Details |
| :--- | :--- | :--- |
| **Runtime / Tooling** | Python 3.14.6 via `uv` | Matches `apps/api` runtime environment. |
| **Dependencies** | Pydantic-Settings, PyMySQL, SQLAlchemy | Set up to share configuration & database drivers with API. |
| **Dev Dependencies** | Pytest, Ruff | Quality checks configured. |
| **Current Code State (`app/main.py`)** | Stub | Basic console print `Worker started`. No queue consumer (Redis/RabbitMQ/Celery/ARQ/Temporal) implemented yet. |
| **Code Quality Audit (Ruff)** | **Clean** | 0 lint errors found. |

---

### 3.3 `apps/web` (Next.js Frontend)

| Item | Status | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.8 (App Router) | Running modern Next.js 16 canary/release. |
| **UI & Styling** | React 19.2.8, Tailwind CSS v4 | Uses `@tailwindcss/postcss` with CSS `@import "tailwindcss";`. |
| **TypeScript & Tooling** | TypeScript 5, ESLint 9 | Standard Next.js TS configuration with strict type checking. |
| **Current Code State** | Scaffold | Default Next.js boilerplate present in `apps/web/app/page.tsx`. |

---

### 3.4 Root & Repository Level

| Item | Status | Details |
| :--- | :--- | :--- |
| **`.env.example`** | **Discrepancy Detected** | Contains `APP_NAME`, `APP_VERSION`, `APP_ENV`, and `DEBUG`, but **lacks `DATABASE_URL`**, which is now required by `apps/api/app/core/config.py`. |
| **`.gitignore`** | Configured | Properly ignores `.env`, virtualenvs, build artifacts, Node modules. |
| **`docs/`** | Empty | Architecture, system designs, and PRDs have not yet been placed here. |
| **`infra/`** | Empty | Docker Compose, Dockerfiles, or Kubernetes configurations are pending. |

---

## 4. Micro-Changelog & Granular Revision History

### [UNCOMMITTED / WORKING TREE] - Current Branch: `phase-one-backend-foundation`
* **Created Production PRD and System Design Documents (`docs/prd.md` & `prd.md`)**:
  - Authored complete Product Requirements Document (PRD v2.0) defining product vision, user personas, MVP scope vs non-goals.
  - Specified functional requirements with unique IDs: `FR-AUTH-001..003`, `FR-WS-001`, `FR-AI-001`, `FR-POST-001..004`, `FR-SOC-001..003`, `FR-MEDIA-001`, `FR-JOB-001..002`.
  - Modeled the DynamoDB Pragmatic 3-Table Design (`chartes_users_workspaces`, `chartes_social_accounts`, `chartes_posts_jobs`) in Provisioned Capacity Mode (20 RCU / 20 WCU total) to guarantee strict ₹0 Always Free tier.
  - Detailed the asynchronous publishing pipeline using EventBridge Scheduler, SQS with DLQ, and the Oracle VM Python worker.
  - Formulated the REST API contract under `/api/v1` and multi-tenant security/privacy invariants.
* **Created Production DevOps & CI/CD Architecture Documents (`docs/devOps.md` & `devOps.md`)**:
  - Authored AWS SAM IaC specification (`infra/template.yaml`) for serverless deployment (Lambda Function URL, DynamoDB, SQS, S3, EventBridge IAM role).
  - Designed 4 GitHub Actions workflows: PR quality gate, AWS SAM OIDC backend deployment, Cloudflare Pages static export deployment, and Oracle VM worker deployment.
  - Configured Oracle VM systemd service (`chartes-worker.service`) with 350 MB memory ceiling protections for the 1 GB RAM instance.
  - Configured zero-cost CloudWatch monitoring, DLQ alerts, and an emergency $0.01 billing alert.
* **Added Database Connection Layer (`apps/api/app/db/`) [Pending DynamoDB Migration]**:
  - `apps/api/app/db/__init__.py`: Initialized database subpackage.
  - `apps/api/app/db/session.py`: Created SQLAlchemy engine bound to `settings.database_url` with `pool_pre_ping=True`. Created `SessionLocal` with `autoflush=False, autocommit=False`.
  - `apps/api/app/db/dependencies.py`: Created `get_db()` dependency generator to yield and safely close DB sessions.
* **Updated Settings (`apps/api/app/core/config.py`)**:
  - Added required field `database_url: str` to `Settings` class.
* **Updated Application Endpoints (`apps/api/app/main.py`)**:
  - Added imports for `text`, `Session`, `Depends`, and `get_db`.
  - Added `GET /health/database` endpoint that issues `SELECT 1` via `db.execute()`.

---

### Commit `58dbc65` - `feat(api): add application configuration-added`
* **Date**: Sat Oct 3 16:50:38 2026 +0530
* **Author**: sibasish2005 <sibasishchakraborti@gmail.com>
* **Files Modified**:
  - `.env.example` (+4, -1 lines): Added default environment values for `APP_NAME`, `APP_VERSION`, `APP_ENV`, `DEBUG`.

---

### Commit `4725c19` - `feat(api): add application configuration`
* **Date**: Sat Oct 3 16:49:20 2026 +0530
* **Author**: sibasish2005 <sibasishchakraborti@gmail.com>
* **Files Modified**:
  - `apps/api/app/core/config.py` (+23, -0 lines): Introduced `pydantic-settings` based `Settings` class with `get_settings()` helper cached by `@lru_cache`.
  - `apps/api/app/main.py` (+16, -4 lines): Integrated `settings.app_name` and `settings.app_version` into `FastAPI` instance metadata; updated `/health` route to return current `environment`.

---

### Commit `fcb9426` - `chore: initialize project architecture`
* **Date**: Sat Oct 3 15:24:19 2026 +0530
* **Author**: sibasish2005 <sibasishchakraborti@gmail.com>
* **Files Modified**:
  - Root: Created `.env.example`, `.gitignore`.
  - `apps/api`: Initialized FastAPI project structure, `.python-version`, `pyproject.toml`, `uv.lock`, `app/__init__.py`, and initial `app/main.py` with basic `/health`.
  - `apps/web`: Initialized Next.js 16 app with React 19, Tailwind CSS v4, TypeScript, ESLint, PostCSS, SVG assets, and package lockfile.
  - `apps/worker`: Initialized worker project structure, `.python-version`, `pyproject.toml`, `uv.lock`, `app/__init__.py`, and starter `app/main.py`.

---

### Commit `5b05dbd` - `Project Initalized`
* **Date**: Sat Oct 3 14:01:53 2026 +0530
* **Author**: sibasish2005 <sibasishchakraborti@gmail.com>
* **Files Modified**:
  - `README.md` (+1, -0 lines): Added project title `## This  Project is Chartes.Tech`.

---

### Commit `504a259` - `First Commit`
* **Date**: Sat Oct 3 13:59:52 2026 +0530
* **Author**: sibasish2005 <sibasishchakraborti@gmail.com>
* **Files Modified**:
  - Created repository with initial empty `README.md`.

---

## 5. Audit Findings & Gap Analysis

| Category | Finding | Impact | Status / Action |
| :--- | :--- | :--- | :--- |
| **Config Sync** | AWS and DynamoDB settings documented in root .env.example. | Developers and CI pipelines have clear local and cloud env configurations. | **Resolved**: Updated .env.example with AWS_REGION, DYNAMODB_ENDPOINT_URL, and table names. |
| **Lint & Formatting** | Ruff previously reported 5 warnings/errors in pps/api. | Ensures strict quality gates for CI. | **Resolved**: Refactored dependency injection with Annotated, sorted imports, formatted with Ruff. |
| **Database Architecture** | Relational SQLAlchemy/MySQL scaffold replaced with DynamoDB (oto3). | Aligns implementation with PRD Section 7 Pragmatic 3-Table Design for AWS Always Free tier. | **Resolved**: Removed SQL dependencies; added oto3, pps/api/app/db/client.py, and table dependencies. |
| **Automated Testing** | Added test suite covering health endpoints and database connectivity. | Prevents regressions. | **Resolved**: Created pps/api/tests/test_health.py; 3/3 tests passing with pytest. |
| **Documentation & Infra** | Local DynamoDB and table bootstrapper added. | Enables full local offline development without AWS credentials. | **Resolved**: Added infra/docker-compose.yml (DynamoDB Local) and infra/init_dynamodb.py. |

---

## 6. Phase 1 Backend Foundation Roadmap & Next Steps

- [x] **Step 1**: Synchronize .env.example with DynamoDB environment variables.
- [x] **Step 2**: Resolve Ruff lint errors in pps/api and pps/worker (all checks clean).
- [x] **Step 3**: Migrate database layer to native DynamoDB (oto3) and create client/table dependency providers.
- [ ] **Step 4**: Define core DynamoDB repository models & access patterns (Users/Workspaces, Social Accounts, Posts/Jobs) per PRD Section 7.
- [x] **Step 5**: Implement Docker Compose in infra/ for one-command local DynamoDB provisioning and initialization script.
- [x] **Step 6**: Author unit & integration tests in pps/api/tests/ for health endpoints and DynamoDB connectivity.
- [ ] **Step 7**: Implement background task runner / queue worker in pps/worker.

---

## 7. Change Logging Protocol (Rules for updating progress.md)

Whenever ANY change is made in the project, follow these rules to maintain this document:
1. **Always add a record under Section 4** under a new dated entry or under the active commit heading.
2. **Include the exact files altered, lines added/removed, and architectural reason**.
3. **If new dependencies are added**, update Section 3.
4. **If any lint or test status changes**, update the corresponding audit status in Section 3 and Section 5.
5. **Keep the roadmap items in Section 6 updated** with checked boxes [x] as tasks complete.

### 2026-10-26 - Added automatic progress ledger instructions
- Added .agents/skills/progress-ledger/SKILL.md with rules for agents to update progress.md after completed implementation changes, accurately record files and checks, and preserve history.
- Added root AGENTS.md to make the repository-wide requirement discoverable for work across apps, infrastructure, and docs.
- Validation: reviewed the created instruction files and existing progress ledger; no tests or lint checks run (documentation-only change).

### 2026-10-26 - Record change rationale as micro-ADRs
- **Context:** The progress ledger captured implementation changes but did not consistently preserve why decisions were made.
- **Decision:** Updated .agents/skills/progress-ledger/SKILL.md and AGENTS.md to require brief Context, Decision, Reason, and Consequences fields for each implementation entry.
- **Reason:** Capturing rationale alongside the change makes the project history useful for future architectural decisions without requiring a separate ADR document for every small task.
- **Consequences:** Agents should include tradeoffs and follow-up implications when material; existing historical entries remain unchanged.
- **Validation:** Reviewed the updated instructions; no tests or lint checks run (documentation-only change).

### 2026-10-26 01:32:37 IST - Add interaction-to-database flow map
- **Context:** The PRD describes product behavior, but there was no single place tracing a user action through frontend code, API functions, persistence, async workers, and the UI result; current code is still mostly scaffold.
- **Decision:** Added docs/interaction-flow-map.md with verified implemented paths, clearly labeled planned PRD flows, failure cases, and a current ownership map. Updated .agents/skills/progress-ledger/SKILL.md and AGENTS.md so agents maintain this map whenever implementation changes affect an interaction flow.
- **Reason:** A source-grounded flow map makes end-to-end behavior and missing implementation visible while preventing planned architecture from being mistaken for existing code.
- **Consequences:** Flow-changing implementation work now updates both progress.md and the flow map; unrelated edits do not require flow-map churn.
- **Validation:** Compared documented implemented paths against current API, web, DB session, and worker source; no tests or lint checks run (documentation-only change).

### 2026-10-26 01:32:45 IST - Timestamp progress entries
- **Context:** Progress entries had dates but lacked time and timezone, making it harder to order multiple changes on the same day.
- **Decision:** Updated .agents/skills/progress-ledger/SKILL.md and AGENTS.md to require YYYY-MM-DD HH:mm:ss TZ on future entries; preserved older entries whose original times are unknown.
- **Reason:** A full timestamp provides reliable chronological ordering while the explicit timezone avoids ambiguity across environments.
- **Consequences:** Agents must read a reliable clock when logging work; previous entries remain date-only because their exact times cannot be recovered.
- **Validation:** Reviewed the instruction changes and timestamp format; no tests or lint checks run (documentation-only change).

### 2026-10-26 15:06:00 IST - Migrate database layer to Amazon DynamoDB
- **Context:** The repository had an initial relational DB scaffold (sqlalchemy, pymysql, lembic), but the approved PRD (Section 7) and architectural budget require Amazon DynamoDB in Provisioned Capacity Mode (20 RCU / 20 WCU across 3 tables) to guarantee zero hosting fees.
- **Decision:** Removed SQL dependencies (pymysql, sqlalchemy, lembic) from pps/api and pps/worker. Added oto3. Replaced SQLAlchemy session management with pps/api/app/db/client.py and pps/api/app/db/dependencies.py providing cached DynamoDB client/resource and table accessors. Updated /health/database in pps/api/app/main.py to ping DynamoDB via describe_limits(). Added infra/docker-compose.yml (DynamoDB Local) and infra/init_dynamodb.py table bootstrapper. Updated .env.example, docs/interaction-flow-map.md, and added pytest coverage in pps/api/tests/test_health.py.
- **Reason:** Aligns backend persistence directly with PRD Section 7 (3-table design), ensures zero database runtime fees, and simplifies deployment to AWS Lambda Function URLs without relational connection pool exhaustion.
- **Consequences:** Relational migrations via Alembic are discontinued; table schemas and GSIs are managed via IaC / initialization scripts. Future repository methods will use DynamoDB partition/sort key access patterns.
- **Validation:** Executed uv run ruff check . and uv run ruff format . (all clean). Executed uv run pytest in pps/api (3 tests passed).

### 2026-10-26 16:47:00 IST - Provision local DynamoDB container and bootstrap PRD tables
- **Context:** The DynamoDB local development container encountered SQLite file lock errors when mounting host volumes on Windows, and required initialization of the 3 PRD tables.
- **Decision:** Updated `infra/docker-compose.yml` to run `amazon/dynamodb-local` with `-inMemory` to avoid volume permissions conflicts. Updated `infra/init_dynamodb.py` to target `http://127.0.0.1:8000` to avoid Windows IPv6 resolution latency. Successfully executed `infra/init_dynamodb.py`, creating `chartes_users_workspaces`, `chartes_social_accounts`, and `chartes_posts_jobs`. Updated `apps/api/.env` with local DynamoDB connection settings.
- **Reason:** Provides an instant, zero-friction local development environment matching production DynamoDB schema without requiring AWS account credentials.
- **Consequences:** Developers can run the full backend stack locally against real DynamoDB semantics. In-memory mode resets data when the container stops; can be persisted later or re-seeded by running `python infra/init_dynamodb.py`.
- **Validation:** Live execution of `/health/database` returned HTTP 200 with `{"status": "ok", "database": "dynamodb", "connected": True}`. Tested table creation and verified all 3 tables with boto3.

### 2026-10-26 16:55:40 IST - Enable persistent volume storage for DynamoDB container
- **Context:** Previously, in-memory mode meant tables would be wiped whenever the container stopped or the host system restarted.
- **Decision:** Configured `infra/docker-compose.yml` with `user: root`, persistent named volume `dynamodb-data:/home/dynamodblocal/data`, and `-dbPath ./data`.
- **Reason:** Guarantees all tables and developer test data survive container stops and system restarts without permission errors.
- **Consequences:** Developer data is preserved on disk until explicitly pruned (`docker compose down -v`).
- **Validation:** Executed `docker restart chartes-dynamodb-local` and verified all 3 tables remained present and accessible immediately after restart.

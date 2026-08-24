# Omnicode - Project Build Steps & Architecture Roadmap

This document provides a comprehensive log of all implementation steps, architectural decisions, completed API routes, database schemas, and current progress for the Omnicode marketing & automation platform.

---

## 📊 Current Status Overview

```
Landing Page & Visuals      ✅ DONE (Lenis, GSAP, Framer Motion, AccordionGallery)
       ↓
Dashboard UI (`/automation`) ✅ DONE (Stats Cards, Recent Posts, Auth Guards)
       ↓
Database & ORM Setup        ✅ DONE (PostgreSQL + Prisma 7 + Driver Adapter)
       ↓
Custom Session Auth System  ✅ DONE (bcryptjs, crypto session tokens, HTTP-only cookies)
       ↓
Email Signup & Login APIs   ✅ DONE (`/api/auth/signup`, `/api/auth/signin`)
       ↓
Google OAuth 2.0 / OIDC     ✅ DONE (`/api/auth/google`, `/api/auth/google/callback`, redirect URI guides)
       ↓
Logout Flow & Component     ✅ DONE (`/api/auth/logout`, `LogoutButton`)
       ↓
ImageKit Media Auth Engine  ✅ DONE (`/api/upload-auth` signed upload params)
       ↓
Posts & Platform Publishing ✅ DONE (`POST /api/posts`, Prisma Post & PostPlatform models)
       ↓
Redux Toolkit State Engine  ✅ DONE (`lib/store.ts`, `postDraftSlice`, `composerUiSlice`)
       ↓
Post Composer UI & Drafts   ✅ DONE (`/create-post`, live preview, ImageKit upload)
       ↓
End-to-End Zod Validation   ✅ DONE (`lib/validations/`, API routes & client forms)
       ↓
Connected Accounts Hub      ✅ DONE (`/connected-accounts` UI & provider connection cards)
       ↓
Social OAuth Integrations   🔄 NEXT STEP (Facebook / Instagram Graph API / LinkedIn OAuth 2.0)
       ↓
Social Media Automation     ⏳ PENDING (Publishing queue / cron worker)
```

---

## 🛠️ Step-by-Step Implementation Log

### STEP 1 — Landing Page & Dashboard UI ✅
- **Landing Page (`/app/page.tsx`):**
  - Smooth scrolling powered by [Lenis](https://lenis.darkroom.engineering/).
  - Dynamic interactive animations using **GSAP** and **Framer Motion**.
  - Custom UI elements: `AccordionGallery`, `revealImage`, interactive canvas effects.
- **Automation / Marketing Dashboard (`/automation`):**
  - Protected dashboard view verifying active sessions via `getCurrentUser()`.
  - Statistics overview metrics:
    - **Total Automations Created**
    - **Published**
    - **Scheduled**
    - **Failed**
  - Recent posts section and feed preview.
  - Interactive `LogoutButton` integration.

---

### STEP 2 — Database & ORM Architecture ✅
- **Database Engine:** PostgreSQL (Neon Serverless).
- **ORM:** Prisma v7 (`@prisma/client`, `prisma`, `@prisma/adapter-pg`, `pg`).
- **Prisma Configuration (`prisma.config.ts` & `lib/prisma.ts`):**
  - Generated output path: `lib/generated/prisma`.
  - Driver adapter instantiation (`PrismaPg`) with global singleton caching for Next.js hot-reloading.
  - Build pipeline automation: Added `postinstall: "prisma generate"` and `build: "prisma generate && next build"` in `package.json` to guarantee generated client presence during builds.
- **Prisma Schema (`prisma/schema.prisma`):**
  - **`User`**: `id` (CUID), `name`, `email` (unique), `passwordHash`, `createdAt`, `updatedAt`.
  - **`Account`**: OAuth accounts (`provider`, `providerAccountId`, `accessToken`, `refreshToken`, `expiresAt`, relational cascade to `User`).
  - **`Session`**: Session management (`sessionToken` (unique), `userId`, `expiresAt`, relational cascade to `User`).
  - **`Post`**: `id`, `userId`, `imageUrl`, `caption`, `status` (`DRAFT`, `SCHEDULED`, `PUBLISHED`, `FAILED`), `scheduledAt`, `createdAt`, `updatedAt`.
  - **`PostPlatform`**: `id`, `postId`, `platform` (`INSTAGRAM`, `FACEBOOK`, `LINKEDIN`), `status` (`PENDING`, `PUBLISHED`, `FAILED`), `publishedAt` (relational cascade to `Post`).
  - **Enums**: `PostStatus`, `Platform`, `PlatformPostStatus`.

---

### STEP 3 — Custom Authentication & Session Management ✅
- **Session Helper (`lib/auth.ts`):**
  - `getCurrentUser()`: Reads `session_token` from Next.js server cookie store (`next/headers`).
  - Validates session existence against database.
  - Automatically purges expired sessions and returns active `User` object.
- **Email & Password Signup (`POST /api/auth/signup`):**
  - Validates email and password length constraints.
  - Normalizes email addresses (lowercased and trimmed).
  - Hashes passwords using `bcryptjs` with salt round `12`.
  - Creates user record and returns sanitized user payload.
- **Email & Password Signin (`POST /api/auth/signin`):**
  - Validates credentials against stored bcrypt hash.
  - Generates secure random 32-byte cryptographic hex token (`crypto.randomBytes(32)`).
  - Stores persistent session in `Session` table (7-day validity).
  - Sets secure, `httpOnly`, `sameSite: "lax"` cookie named `session_token`.
- **User Logout (`POST /api/auth/logout`):**
  - Deletes session record from PostgreSQL database.
  - Clears `session_token` cookie.
- **Auth Frontend Interfaces:**
  - Login Page (`/login`): Clean UI form with email/password authentication + Google OAuth entry point.
  - Signup Page (`/signup`): Registration form.

---

### STEP 4 — Google OAuth 2.0 / OpenID Connect (OIDC) ✅
- **OAuth Initiation (`GET /api/auth/google`):**
  - Redirects user to Google OAuth 2.0 authorization endpoint (`https://accounts.google.com/o/oauth2/v2/auth`).
  - Requests scopes: `openid`, `email`, `profile` with offline access and prompt options.
- **OAuth Callback (`GET /api/auth/google/callback`):**
  - Receives authorization code and exchanges it with `https://oauth2.googleapis.com/token`.
  - Fetches verified user identity from `https://openidconnect.googleapis.com/v1/userinfo`.
  - Auto-provisions new `User` record if email is unregistered.
  - Upserts `Account` record with provider `google`, `providerAccountId`, and `accessToken`.
  - Generates an active application session, issues HTTP-only cookie, and redirects user to `/automation`.
- **OAuth URI Configuration Reference:**
  - `GOOGLE_REDIRECT_URI` in `.env` configured to callback URL (e.g. `http://localhost:3000/api/auth/google/callback` or `https://chartes.tech/api/auth/google/callback`).
  - Matching URI registered under Google Cloud Console's **Authorised redirect URIs**.

---

### STEP 5 — ImageKit Media Storage Integration ✅
- **Media Engine Choice:** [ImageKit](https://imagekit.io) via `@imagekit/next`.
- **Signed Auth Endpoint (`GET /api/upload-auth`):**
  - Protected endpoint requiring active user session (`getCurrentUser()`).
  - Generates signed ImageKit client upload authentication parameters (`token`, `expire`, `signature`, `publicKey`) via `getUploadAuthParams()`.
  - Enables direct client-to-CDN image uploads without exposing private API keys or overloading the Next.js server.

---

### STEP 6 — Post Creation & Multi-Platform Publishing API ✅
- **API Endpoint (`POST /api/posts`):**
  - Requires authenticated session.
  - Accepts `imageUrl`, `caption`, and array of target `platforms` (`INSTAGRAM`, `FACEBOOK`, `LINKEDIN`).
  - Creates atomic `Post` record with nested `PostPlatform` child records inside Prisma transaction/relational create.
  - Returns structured post data with associated target platforms.

---

### STEP 7 — Redux Toolkit State Architecture & Draft Persistence ✅
- **Per-Request Store Factory (`lib/store.ts`):**
  - Implements `makeStore()` factory pattern to prevent state leakage across requests in Next.js SSR/App Router.
  - Configures RootState and AppDispatch types.
- **Domain vs. Transient UI Slices:**
  - **`postDraftSlice` (`lib/features/postDraft/postDraftSlice.ts`):** Manages post domain state (`imageUrl`, `caption`, `platforms`, `hydrateDraft`, `clearDraft`).
  - **`composerUiSlice` (`lib/features/composerUi/composerUiSlice.ts`):** Manages transient presentation state (`previewTab`, `uploadStatus`, `uploadProgress`, `errorMessage`).
- **Typed Hooks (`lib/hooks.ts`):**
  - Custom `useAppDispatch` and `useAppSelector` with full TypeScript inference.
- **Store Provider (`app/StoreProvider.tsx`):**
  - `localStorage` synchronization for `postDraft` state under key `social-manager-post-draft`.
  - Automatic draft restoration on page refresh and state hydration.
  - Wrapped around application in `app/layout.tsx`.

---

### STEP 8 — Social Post Composer & Preview UI (`/create-post`) ✅
- **Page Implementation (`app/create-post/page.tsx`):**
  - **Direct Client Uploads:** Authenticates via `/api/upload-auth` and uploads directly to ImageKit with animated progress bar.
  - **Edit & Preview Tabs:** Toggle between form controls and live card preview matching target social feeds.
  - **Multi-Platform Targeting:** Platform checkboxes (Instagram, Facebook, LinkedIn) synced to Redux draft state.
  - **Publishing Integration:** Submits post data to `POST /api/posts` and clears active draft on success.
- **Supporting UI Components:**
  - `components/ui/card.tsx`
  - `components/ui/button.tsx`
  - `components/ui/textarea.tsx`
  - `components/ui/checkbox.tsx`
  - `components/ui/label.tsx`

---

### STEP 9 — End-to-End Zod Schema Validation ✅
- **Validation Engine:** `zod` for type-safe runtime schemas across both client and server boundaries.
- **Centralized Schema Definitions (`lib/validations/`):**
  - **`lib/validations/auth.ts`**:
    - `signupSchema`: Name sanitization, email format validation, and minimum password length constraint.
    - `signinSchema`: Email and password requirement checks.
  - **`lib/validations/post.ts`**:
    - `createPostSchema`: Validates `imageUrl` format, `caption` maximum characters (2,200 limit), and target `platforms` enum array (`INSTAGRAM`, `FACEBOOK`, `LINKEDIN`).
- **Full API Route Protection:**
  - `POST /api/auth/signup`: Replaced manual checks with `signupSchema.safeParse()`.
  - `POST /api/auth/signin`: Replaced manual checks with `signinSchema.safeParse()`.
  - `POST /api/posts`: Replaced manual checks with `createPostSchema.safeParse()`.
- **Client-Side Form Validation:**
  - `app/login/page.tsx`: Pre-flight validation with `signinSchema` before making network calls.
  - `app/signup/page.tsx`: Pre-flight validation with `signupSchema` before registration.
  - `app/create-post/page.tsx`: Immediate draft validation using `createPostSchema` with user-friendly error banners.

---

### STEP 10 — Connected Accounts Hub & Build Integrity ✅
- **Connected Accounts UI (`/connected-accounts`):**
  - Server-rendered page with session protection via `getCurrentUser()`.
  - Queries active user's connected `Account` records from PostgreSQL.
  - Displays interactive connection status cards for **Google**, **Instagram**, **Facebook**, and **LinkedIn**.
- **Build & CI Pipeline Integrity:**
  - Configured `prisma generate` in `package.json` `postinstall` and `build` scripts.
  - Verified clean Next.js 16 (Turbopack) build and TypeScript type-checking across all 17 routes.

---

## 🎯 Immediate Next Roadmap

1. **[ ] Step 11 — Social OAuth Integrations & Token Storage**
   - Connect Facebook Graph API / Instagram Graph API OAuth flows.
   - Connect LinkedIn OAuth 2.0 flow.
   - Store access tokens in `Account` model for automated publishing.

2. **[ ] Step 12 — Automated Scheduling & Publishing Worker**
   - Background worker / Cron job (e.g. Vercel Cron, QStash, or background polling) to process scheduled posts.
   - Dispatch posts to respective social media platform APIs.
   - Update `PostStatus` and `PlatformPostStatus` (`PUBLISHED` or `FAILED`).

3. **[ ] Step 13 — Dashboard Analytics & Post Feed Integration**
   - Fetch real posts from PostgreSQL in `/automation` dashboard.
   - Update live stat counters (Total, Published, Scheduled, Failed) based on DB aggregations.

# chartes.tech - Project Build Steps & Architecture Roadmap

This document provides a comprehensive log of all implementation steps, architectural decisions, completed API routes, database schemas, and current progress for the chartes.tech marketing & automation platform.

---

## 📊 Current Status Overview

```
Landing Page & Visuals      ✅ DONE (Lenis, GSAP, Framer Motion, AccordionGallery)
       ↓
Mobile UX & Lenis Tuning     ✅ DONE (Mobile scroll rate, full-bleed gallery, real navbar anchors)
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
Privacy Policy & Legal Hub  ✅ DONE (`/privacy`, `/privacy-policy`, GDPR/CCPA compliance)
       ↓
LinkedIn OAuth 2.0 Engine   ✅ DONE (`/api/social/linkedin`, `/api/social/linkedin/callback`, OpenID Connect)
       ↓
Favicon & High-DPI Icons    ✅ DONE (`app/layout.tsx`, `app/favicon.ico`, `icon.png`, `apple-icon.png`)
       ↓
LinkedIn Publishing Engine  ✅ DONE (`lib/automation/`, REST API `/rest/posts`, live verified)
       ↓
Meta (FB/IG) Graph API      🔄 NEXT STEP (Instagram & Facebook Pages OAuth & Tokens)
       ↓
Social Media Automation     ⏳ PENDING (Publishing queue / cron worker triggers)
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
  - Verified clean Next.js 16 (Turbopack) build and TypeScript type-checking across all routes.

---

### STEP 11 — Privacy Policy & Legal Governance Hub ✅
- **Privacy Policy (`/privacy` & `/privacy-policy`):**
  - Implemented 16-section interactive privacy document covering GDPR, CCPA/CPRA, and global data privacy standards.
  - Integrated full-text section search, interactive sticky table of contents, PDF print engine, and smooth scroll anchors.
  - Configured automated redirect route at `/privacy-policy` pointing to `/privacy`.
- **Branding & Compliance Alignment:**
  - Complete rebranding to `chartes.tech` across metadata, legal disclosures, policy copy, and footer links.
  - Dedicated DPO and legal contact mailto points (`privacy@chartes.tech`, `legal@chartes.tech`, `dpo@chartes.tech`).

---

### STEP 12 — LinkedIn OAuth 2.0 Integration & Token Vault ✅
- **OAuth Initiation (`GET /api/social/linkedin`):**
  - Protected endpoint requiring an active session (`getCurrentUser()`).
  - Generates secure random 16-byte state parameter (`crypto.randomBytes(16)`).
  - Sets HTTP-only, `sameSite: "lax"`, secure cookie `linkedin_oauth_state` (10-minute expiry).
  - Redirects to `https://www.linkedin.com/oauth/v2/authorization` with `openid`, `profile`, `email`, and `w_member_social` scopes.
- **OAuth Callback (`GET /api/social/linkedin/callback`):**
  - Validates callback `state` parameter against stored `linkedin_oauth_state` cookie (CSRF protection).
  - Verifies active user session via `session_token`.
  - Exchanges authorization code for access token at `https://www.linkedin.com/oauth/v2/accessToken`.
  - Queries LinkedIn OpenID Connect UserInfo endpoint (`https://api.linkedin.com/v2/userinfo`) to retrieve verified member ID (`sub`).
  - Upserts `Account` record with provider `linkedin`, `providerAccountId`, `accessToken`, and `expiresAt`.
  - Deletes state cookie and redirects back to `/connected-accounts?linkedin=connected`.
- **Client-Side Optimization:**
  - Changed Next.js `<Link>` to standard `<a>` tag in `/connected-accounts` to prevent background RSC prefetching and state cookie invalidation.

---

### STEP 13 — Mobile UX Tuning, Navbar Routing, Gallery Optimization & Favicon System ✅
- **Lenis Smooth Scroll Mobile Calibration (`components/SmoothScroll.tsx`):**
  - Added responsive viewport detection via `window.matchMedia("(max-width: 768px)")`.
  - Tuned mobile `touchMultiplier` down from `1.5` to `0.65` for steady, comfortable touch-swiping.
  - Increased mobile scroll easing duration to `2.0s` and wheel multiplier to `0.7` for fluid deceleration.
- **Navbar Real Routing & Smooth Section Links (`components/(landing-page)/navbar.tsx`):**
  - Updated desktop navigation and mobile drawer links to point to real paths and section anchors:
    - **Home:** `/`
    - **About:** `/#about`
    - **Services:** `/#services`
    - **Solutions:** `/#solutions`
    - **Contact:** `/#contact`
    - **Get Started:** `/login`
    - **Book a Call:** `/booking`
  - Added corresponding `id` attributes across landing page section components (`aboutMe.tsx`, `services.tsx`, `solutions.tsx`, `footer.tsx`).
- **Growth Accordion Gallery Touch Fix & Full-Bleed Sizing (`components/AccordionGallery.tsx` & `growth.tsx`):**
  - Removed dummy `link: '#'` properties to prevent unintended `/` page-top redirects on mobile card taps.
  - Added `hasLink` check and `e.preventDefault()` safeguards to prevent URL hash mutations when expanding cards.
  - Fixed mobile letterboxing: replaced fixed pixel widths with `w-full h-full min-w-full min-h-full` and subtle scaling (`1.05x`) so images cover 100% of each panel without black borders.
- **Favicon & High-DPI App Icon System (`app/layout.tsx`):**
  - Configured comprehensive `icons` metadata in RootLayout supporting standard `.ico`, high-DPI `.png`, shortcut, and Apple Touch Icon.
  - Generated and synchronized `app/favicon.ico`, `app/icon.png`, and `app/apple-icon.png` from brand assets.

---

### STEP 14 — LinkedIn Publishing Engine & Automation Worker ✅
- **LinkedIn Direct REST API Publisher (`lib/automation/publisher/linkedin.ts`):**
  - Targets LinkedIn REST API `POST https://api.linkedin.com/rest/posts` with version `202601` and Restli protocol `2.0.0`.
  - Dynamically constructs author URN payload `urn:li:person:${providerAccountId}` using authenticated tokens.
  - Implements commentary publishing, error parsing, and extracts returned `x-restli-id` external post identifier.
- **Scheduled Automation Worker (`lib/automation/worker.ts`):**
  - Queries scheduled posts from PostgreSQL (`Post` with `SCHEDULED` status and `scheduledAt <= now`).
  - Iterates through connected platforms per post, skipping already published platforms.
  - Automatically fetches linked OAuth tokens from `Account` table.
  - Updates individual `PostPlatform` records to `PUBLISHED` (with `publishedAt` timestamp) or `FAILED`.
  - Cascades overall post status to `PUBLISHED` when all target platforms succeed, or `FAILED` when errors occur.
- **Live Publishing Verification Route (`GET /api/test`):**
  - Validates active session via `getCurrentUser()`.
  - Loads connected LinkedIn account and verifies access token existence.
  - Dispatches test publication to live LinkedIn feed.
### STEP 15 — LinkedIn Media Publishing & Timing Controls Engine ✅
- **LinkedIn 2-Step Image Media Publishing (`lib/automation/publisher/linkedin.ts`):**
  - Implemented automatic image asset fetching from ImageKit CDN (`fetch -> arrayBuffer()`).
  - Added LinkedIn REST Images API upload handshake:
    - Step 1: `POST https://api.linkedin.com/rest/images?action=initializeUpload` to obtain upload URL and `urn:li:image:...` URN.
    - Step 2: Binary `PUT` stream to LinkedIn's media upload URL.
  - Attached `content.media` block (`{ id: imageUrn, title: "Post Image" }`) into `POST /rest/posts` payload.
  - Live tested image publication: verified `urn:li:image:D5610AQH186w4RzCZrA` created and published as post `urn:li:share:7498005318291873792`.
- **Post Scheduling & Timing Controls (`app/create-post/page.tsx` & `app/api/posts/route.ts`):**
  - Added dedicated **[Publish Now]** and **[Schedule Timing]** action buttons with clean toggle controls.
  - Integrated Date Picker and Time Picker with live preview of release timestamps.
  - Added `scheduledAt` field across Redux draft slice, Zod validator, Prisma persistence, and worker immediate/future execution triggers.

---

### STEP 16 — Typography & Subtle Aesthetic Refinement ✅
- **Font System Migration (`Plus_Jakarta_Sans`):**
  - Migrated typography across the application navigation shell, dashboard, and composer to `Plus_Jakarta_Sans` for modern readability and crisp rendering.
- **Calibrated Subtle Parchment Palette:**
  - Ambient Canvas: `#F8F6F2` soft warm tone.
  - Surfaces & Sidebars: `#FAF8F5` off-white parchment.
  - Cards & Modals: `#FFFFFF` with delicate `#EAE3D9` micro-borders and soft micro-shadows.
  - Action Controls: `#18181B` deep charcoal primary buttons with subtle status indicator pills.
- **Responsive Layout & Mobile Drawer (`components/layout/AppSidebar.tsx` & `AppLayout.tsx`):**
  - Unified desktop fixed sidebar with animated Framer Motion mobile hamburger drawer.

---

### STEP 17 — Post Management, Scrollable History & Shadcn Deletion Confirmation ✅
- **Top-3 Visible Viewport with Smooth Scrolling (`components/dashboard/RecentPostsList.tsx`):**
  - Compacted the recent posts dashboard section to display the top 3 items with scrollable overflow (`max-h-[235px] overflow-y-auto`).
- **Official Shadcn Dialog Deletion Modal (`components/ui/dialog.tsx`):**
  - Installed and styled official Radix-powered shadcn `Dialog` component.
  - Integrated per-row trash actions with confirmation popup, item preview thumbnail, and loading indicators.
- **Secure Backend Deletion Route (`DELETE /api/posts/[id]`):**
  - Validates session ownership against `userId` and deletes records with cascade.
- **SSR Hydration Resolution:**
  - Solved locale divergence mismatch using deterministic date formatting (`formatDate`) and `suppressHydrationWarning`.

---

---

### STEP 18 — Monochrome Connected Accounts & Auth Navigation Optimization ✅
- **Monochrome Lucide React Icon System (`app/connected-accounts/page.tsx`):**
  - Replaced colorful brand tiles with clean, minimalist monochrome icon badges (`Briefcase` for LinkedIn, `ShieldCheck` for Google SSO, `Camera` for Instagram, `Users` for Facebook Pages).
  - Standardized micro-borders (`#EAE3D9`) and muted surface tiles (`#FAF8F5`).
- **Session-Aware Landing Page CTAs (`components/(landing-page)/navbar.tsx` & `app/page.tsx`):**
  - Server-rendered session check via `getCurrentUser()` passes `isLoggedIn` flag to navigation components.
  - Dynamically routes logged-in users directly to **Dashboard** (`/automation`) while showing **Get Started** (`/login`) to guest visitors.
  - Applied consistently across desktop navbar and animated mobile drawer.
- **Session Status Endpoint & Auth Guards (`GET /api/auth/me`):**
  - Created session verification endpoint returning `{ authenticated: boolean, user: { id, email, name } }`.
  - Added client-side redirect guards on `/login` and `/signup` to immediately route active sessions to `/automation`.

---

### STEP 19 — Social Account Disconnection Engine & SSO Decoupling ✅
- **Account Disconnection API (`POST /api/social/disconnect`):**
  - Validates active session and user ownership before modifying credentials.
  - Deletes target provider record from Prisma `Account` table (`where: { userId, provider }`).
  - Automatically unlinks OAuth tokens, revoking publishing access while keeping user account intact.
- **Interactive Disconnection UI (`components/accounts/ConnectedAccountsGrid.tsx`):**
  - Added dedicated **Disconnect** action next to active social media accounts (LinkedIn).
  - Integrated themed confirmation modal powered by official shadcn `Dialog`:
    - Displays provider icon, name, and cautionary message regarding paused automations.
    - Prevents accidental disconnections with explicit `Cancel` and `Disconnect` buttons with loading spinners.
  - Optimistically updates UI state upon confirmation without requiring a full browser reload.
- **SSO Account Guarding:**
  - Decoupled Google authentication card from social publishing actions: removed Disconnect/Connect buttons to prevent users from bricking their primary SSO login, displaying an informational **Active Sign-in** / **Email Sign-in** badge instead.

---

### STEP 20 — Global Typography & Portal Typography Standardization ✅
- **Application-Wide Typography (`app/layout.tsx`):**
  - Replaced `Geist` with **Plus Jakarta Sans** (`Plus_Jakarta_Sans` from `next/font/google`) globally on `<html>` and `<body>`.
  - Configured font variables and subsets (`latin`, weights 300-800) for cross-platform rendering.
- **Base-UI & Radix Portal Styling (`components/ui/dialog.tsx`):**
  - Explicitly injected `fontSans.className` into `DialogContent` to prevent portaled DOM elements from falling back to browser serif defaults.
  - Restyled modals with subtle parchment borders (`#EAE3D9`), soft backdrop blur (`bg-black/40 backdrop-blur-xs`), and refined pill buttons.

---

### STEP 21 — Modular Custom Hooks Architecture ✅
- **`useAuthRedirect` (`lib/hooks/useAuthRedirect.ts`):**
  - Encapsulates `/api/auth/me` session validation and automatic route redirection across `/login` and `/signup`.
- **`useDeletePost` (`lib/hooks/useDeletePost.ts`):**
  - Manages modal visibility, confirmation handling, optimistic list mutations, and `DELETE /api/posts/[id]` dispatch for dashboard history.
- **`useSocialAccounts` (`lib/hooks/useSocialAccounts.ts`):**
  - Orchestrates platform connection states, unlinking confirmation modals, and `POST /api/social/disconnect` requests.
- **`useCreatePost` (`lib/hooks/useCreatePost.ts`):**
  - Centralizes composer validation, immediate vs scheduled timing handlers, payload preparation, and `POST /api/posts` submissions.
- **Unified Barrel Export (`lib/hooks.ts`):**
  - Clean centralized export surface for all typed Redux and custom domain hooks.

---

### STEP 22 — Modern Toast Notification System (Sonner & Design System Integration) ✅
- **Installed & Configured Sonner (`components/ui/sonner.tsx`):**
  - Styled toasts with design system tokens: `#FFFFFF` card surface, `#EAE3D9` micro-borders, `#FAFDF9` subtle emerald success tints, `#FFF8F8` rose error tints, rounded pill actions, and `Plus_Jakarta_Sans` typography.
  - Mounted `<Toaster />` globally inside `app/layout.tsx`.
- **Replaced All Native Browser `alert()` Calls:**
  - `useCreatePost`: Rich success toasts for instant LinkedIn publishing and scheduled date/time confirmations.
  - `useDeletePost`: Confirmation feedback toast indicating which post was removed with smooth exit animations.
  - `useSocialAccounts`: Account disconnection success and error feedback toasts with customized platform titles.

---

### STEP 23 — Connected Distribution Channels Validation & UI Gating ✅
- **Connected Accounts Endpoint (`GET /api/social/connected`):**
  - Queries `prisma.account` for the authenticated user and returns an array of currently authorized platforms (`["LINKEDIN"]`).
- **`useConnectedPlatforms` Custom Hook (`lib/hooks/useConnectedPlatforms.ts`):**
  - Fetches and caches the user's active social connections for client-side validation.
- **Post Composer Channel Gating (`app/create-post/page.tsx`):**
  - Disables unlinked platforms (`Instagram`, `Facebook`) with `opacity-50 cursor-not-allowed` styles and a *"Not connected"* status indicator.
  - Keeps only verified, connected accounts selectable (`LinkedIn`).
  - Added a direct *"Manage Accounts"* link to `/connected-accounts` for effortless account linking.

---

### STEP 24 — Automated Cron Publishing Engine & Background Dispatch ✅
- **Secure Cron Endpoint (`app/api/cron/publish/route.ts`):**
  - Protected with `CRON_SECRET` validation (`Authorization: Bearer <CRON_SECRET>`).
  - Calls `processScheduledPosts()` background worker.
- **Worker Execution Pipeline (`lib/automation/worker.ts`):**
  - Queries scheduled posts ready for release (`status: "SCHEDULED"`, `scheduledAt <= now`).
  - Fetches associated OAuth tokens and dispatches to LinkedIn REST API (with 2-step image uploads).
  - Cascades status to `PUBLISHED` or `FAILED`.
- **Vercel Cron Configuration (`vercel.json`):**
  - Added native Vercel Cron configuration (`schedule: "* * * * *"`) to trigger automatic sweeps every minute upon deployment.

---

## 🎯 Immediate Next Roadmap

1. **[ ] Step 25 — Meta Graph API (Facebook Pages & Instagram) OAuth Integration**
   - Connect Facebook Login / Graph API OAuth flow (`/api/social/facebook`, `/api/social/instagram`).
   - Exchange short-lived token for long-lived page access tokens.
   - Upsert `Account` records for Facebook Pages and Instagram Professional accounts.

2. **[ ] Step 26 — X.com (Twitter API v2) & Tech Socials Integration**
   - Implement OAuth 2.0 PKCE for X/Twitter and AT Protocol for Bluesky.









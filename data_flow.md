# Omnicode Architecture & Complete End-to-End Data Flow Specification

> **Document Version:** 1.0.0  
> **Target Framework:** Next.js 16.3.1 (App Router), React 19, TypeScript, Prisma v7 (PostgreSQL Adapter), Redux Toolkit, ImageKit SDK, LinkedIn REST API v202601.

---

## Table of Contents

1. [High-Level Architecture Overview](#1-high-level-architecture-overview)
2. [Technology Stack & Library Matrix](#2-technology-stack--library-matrix)
3. [Database Schema & Entity Relational Model](#3-database-schema--entity-relational-model)
4. [Client-Side State Management (Redux Store & Custom Hooks)](#4-client-side-state-management-redux-store--custom-hooks)
5. [Complete Route-by-Route Directory & Handler Mapping](#5-complete-route-by-route-directory--handler-mapping)
6. [Detailed Function-to-Function Data Flow Diagrams & Step-by-Step Traces](#6-detailed-function-to-function-data-flow-diagrams--step-by-step-traces)
   - 6.1 [User Registration Flow (Sign Up)](#61-user-registration-flow-sign-up)
   - 6.2 [User Authentication Flow (Email/Password Sign In)](#62-user-authentication-flow-emailpassword-sign-in)
   - 6.3 [Google OAuth 2.0 & SSO Flow](#63-google-oauth-20--sso-flow)
   - 6.4 [Session Verification & Route Protection (`getCurrentUser` / `useAuthRedirect`)](#64-session-verification--route-protection-getcurrentuser--useauthredirect)
   - 6.5 [LinkedIn Account Connection (OAuth 2.0 3-Legged Auth)](#65-linkedin-account-connection-oauth-20-3-legged-auth)
   - 6.6 [Connected Accounts Discovery & Disconnection Flow](#66-connected-accounts-discovery--disconnection-flow)
   - 6.7 [Image Upload & Direct-to-CDN Flow (ImageKit SDK + HMAC Server Auth)](#67-image-upload--direct-to-cdn-flow-imagekit-sdk--hmac-server-auth)
   - 6.8 [Post Creation Flow (Instant Live Broadcast vs. Scheduled Queue)](#68-post-creation-flow-instant-live-broadcast-vs-scheduled-queue)
   - 6.9 [Cron Background Worker & Publishing Automation Engine](#69-cron-background-worker--publishing-automation-engine)
   - 6.10 [LinkedIn Publisher: 2-Step Binary Upload & Commentary Publishing](#610-linkedin-publisher-2-step-binary-upload--commentary-publishing)
   - 6.11 [Post Deletion Flow with Optimistic UI Update](#611-post-deletion-flow-with-optimistic-ui-update)
   - 6.12 [User Logout Flow](#612-user-logout-flow)
   - 6.13 [Consultation / Discovery Booking Flow](#613-consultation--discovery-booking-flow)
7. [Security, Session, and Error-Handling Architecture](#7-security-session-and-error-handling-architecture)
8. [Cross-Cutting Concerns & Production Observability](#8-cross-cutting-concerns--production-observability)

---

## 1. High-Level Architecture Overview

Omnicode is an enterprise-grade social media orchestration and automation platform designed to empower creators, brands, and agencies to create, preview, schedule, and syndicate multi-platform content (LinkedIn, with Facebook and Instagram expandability).

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Layer (Next.js 16 App Router / React 19)"]
        UI_Landing["Landing Page (Lenis, GSAP, Framer Motion)"]
        UI_Auth["Auth Pages (/login, /signup)"]
        UI_Dash["Dashboard (/automation)"]
        UI_Composer["Composer & Previews (/create-post)"]
        UI_Accounts["Account Integrations (/connected-accounts)"]
        UI_Booking["Discovery Booking (/booking)"]
        
        ReduxStore["Redux Toolkit Store (postDraft, composerUi)"]
        CustomHooks["Custom React Hooks (useCreatePost, useSocialAccounts, etc.)"]
    end

    subgraph APILayer["Next.js Server API Routes & Server Actions"]
        API_Auth["/api/auth/* (signup, signin, logout, me, google)"]
        API_Social["/api/social/* (linkedin, connected, disconnect)"]
        API_Posts["/api/posts/* (POST, DELETE [id])"]
        API_Upload["/api/upload-auth (ImageKit HMAC)"]
        API_Cron["/api/cron/publish (Cron Worker)"]
    end

    subgraph CoreServices["Server-Side Core Modules (lib/)"]
        AuthLib["lib/auth.ts (getCurrentUser)"]
        WorkerLib["lib/automation/worker.ts (processScheduledPosts)"]
        LinkedInPub["lib/automation/publisher/linkedin.ts (REST v202601)"]
        PrismaClient["lib/prisma.ts (Prisma 7 + PG Driver Adapter)"]
    end

    subgraph ExternalServices["External APIs & Cloud Services"]
        PostgresDB[("PostgreSQL Database (Neon / Supabase / Postgres)")]
        ImageKitCDN["ImageKit.io (Media CDN & Storage)"]
        GoogleOAuth["Google Identity Services (OAuth2 / OIDC)"]
        LinkedInAPI["LinkedIn REST API & Media Upload Server"]
        CronTrigger["Vercel Cron / External Cron Scheduler"]
    end

    ClientLayer <--> APILayer
    APILayer <--> CoreServices
    CoreServices <--> PostgresDB
    CoreServices <--> LinkedInAPI
    CoreServices <--> GoogleOAuth
    UI_Composer <--> ImageKitCDN
    APILayer <--> ImageKitCDN
    CronTrigger --> API_Cron
```

---

## 2. Technology Stack & Library Matrix

| Library / Dependency | Version | Purpose in Architecture | Key Function / Module Calls |
| :--- | :--- | :--- | :--- |
| **`next`** | `16.3.1` | Full-stack framework (App Router, Server Components, API Handlers) | `NextRequest`, `NextResponse`, `cookies()`, `redirect()`, dynamic routing |
| **`react` / `react-dom`** | `19.2.8` | UI rendering, client-side hooks, transition management | `useState`, `useEffect`, `useRef`, `useCallback` |
| **`@reduxjs/toolkit`** | `2.12.0` | Global state management for post draft data & UI composer | `configureStore`, `createSlice`, `PayloadAction` |
| **`react-redux`** | `9.3.0` | React bindings for Redux | `useDispatch.withTypes()`, `useSelector.withTypes()` |
| **`@prisma/client`** | `7.9.1` | Database ORM client (generated to `lib/generated/prisma`) | `prisma.user`, `prisma.session`, `prisma.post`, `prisma.account` |
| **`@prisma/adapter-pg`** | `7.9.1` | High-performance PostgreSQL driver adapter for Prisma 7 | `new PrismaPg({ connectionString })` |
| **`pg`** | `8.23.0` | Low-level Node PostgreSQL driver | Connection pooling and SSL connection string parsing |
| **`@imagekit/next`** | `2.1.5` | Client-side chunked file upload & server-side HMAC token generation | `upload()`, `getUploadAuthParams()`, error classes |
| **`bcryptjs`** | `3.0.3` | One-way salted password hashing | `bcrypt.hash(pwd, 12)`, `bcrypt.compare(pwd, hash)` |
| **`zod`** | `4.4.3` | Schema definition & input validation for runtime security | `safeParse()`, `z.object()`, `z.string()`, `z.enum()` |
| **`framer-motion`** | `13.1.0` | Declarative UI animations, modal transitions, mobile drawers | `motion.div`, `AnimatePresence`, `Variants` |
| **`gsap`** | `3.15.0` | High-performance landing page timeline & scroll-triggered animations | `gsap.timeline()`, `gsap.to()`, `ScrollTrigger` |
| **`lenis`** | `1.3.26` | Smooth inertial page scrolling | `new Lenis()`, RAF render loops |
| **`lucide-react`** | `1.31.0` | Monochrome, scalable vector UI icons | `LayoutDashboard`, `Trash2`, `Clock`, `Zap`, `CheckCircle2` |
| **`sonner`** | `2.0.8` | Interactive toast notifications | `toast.success()`, `toast.error()` |
| **`@radix-ui/react-alert-dialog` / `shadcn`** | `1.1.23` / `4.18.0` | Accessible dialogs and confirmation modals | `<Dialog>`, `<DialogContent>`, `<DialogHeader>` |
| **`tailwind-merge` & `clsx`** | `3.6.0` / `2.1.1` | Dynamic utility class combining & collision avoidance | `cn(...inputs)` in `lib/utils.ts` |

---

## 3. Database Schema & Entity Relational Model

The database is built on PostgreSQL with Prisma ORM 7.

```mermaid
erDiagram
    User ||--o{ Account : "has many"
    User ||--o{ Session : "has many"
    User ||--o{ Post : "creates"
    Post ||--|{ PostPlatform : "dispatches to"

    User {
        String id PK "cuid()"
        String name "nullable"
        String email UK "unique, normalized lowercase"
        String passwordHash "nullable (null for OAuth only)"
        DateTime createdAt "default(now())"
        DateTime updatedAt "updatedAt"
    }

    Account {
        String id PK "cuid()"
        String userId FK "references User.id ON DELETE CASCADE"
        String provider "google | linkedin | instagram | facebook"
        String providerAccountId "external user id (e.g. sub, URN id)"
        String accessToken "nullable (OAuth bearer token)"
        String refreshToken "nullable"
        DateTime expiresAt "nullable"
    }

    Session {
        String id PK "cuid()"
        String sessionToken UK "unique 32-byte hex string"
        String userId FK "references User.id ON DELETE CASCADE"
        DateTime expiresAt "7 days from creation"
    }

    Post {
        String id PK "cuid()"
        String userId FK "references User.id ON DELETE CASCADE"
        String imageUrl "ImageKit CDN URL"
        String caption "nullable text"
        PostStatus status "DRAFT | SCHEDULED | PUBLISHED | FAILED"
        DateTime scheduledAt "nullable timestamp"
        DateTime createdAt "default(now())"
        DateTime updatedAt "updatedAt"
    }

    PostPlatform {
        String id PK "cuid()"
        String postId FK "references Post.id ON DELETE CASCADE"
        Platform platform "INSTAGRAM | FACEBOOK | LINKEDIN"
        PlatformPostStatus status "PENDING | PUBLISHED | FAILED"
        DateTime publishedAt "nullable timestamp"
    }
```

---

## 4. Client-Side State Management (Redux Store & Custom Hooks)

### 4.1 Redux Store Architecture (`lib/store.ts`)
The Redux store centralizes draft content and composer UI status:

```mermaid
classDiagram
    class AppStore {
        +postDraft: PostDraftState
        +composerUi: ComposerUiState
    }

    class PostDraftState {
        +String imageUrl
        +String caption
        +Platform[] platforms
        +String? scheduledAt
        +setImageUrl(url)
        +setCaption(text)
        +togglePlatform(platform)
        +setPlatforms(platforms[])
        +hydrateDraft(state)
        +clearDraft()
    }

    class ComposerUiState {
        +PreviewTab previewTab ("EDIT" | "PREVIEW")
        +UploadStatus uploadStatus ("IDLE" | "UPLOADING" | "SUCCESS" | "ERROR")
        +number uploadProgress (0-100)
        +String errorMessage
        +setPreviewTab(tab)
        +setUploadStatus(status)
        +setUploadProgress(progress)
        +setErrorMessage(msg)
        +resetUploadState()
        +resetComposerUi()
    }

    AppStore *-- PostDraftState
    AppStore *-- ComposerUiState
```

### 4.2 Custom React Hooks (`lib/hooks/`)

| Hook Name | File Location | Responsibilities | Key Functions & Returned Values |
| :--- | :--- | :--- | :--- |
| `useAuthRedirect` | [`lib/hooks/useAuthRedirect.ts`](file:///c:/Users/sibas/OneDrive/Desktop/Freelance%20Works/omnicode-beta/lib/hooks/useAuthRedirect.ts) | Queries `/api/auth/me` on mount to enforce route guarding or auto-redirection. | `{ user, loading, authenticated }` |
| `useCreatePost` | [`lib/hooks/useCreatePost.ts`](file:///c:/Users/sibas/OneDrive/Desktop/Freelance%20Works/omnicode-beta/lib/hooks/useCreatePost.ts) | Bridges Redux state to `/api/posts`, validates with Zod, handles instant vs scheduled release. | `{ creating, isScheduled, scheduleDate, scheduleTime, handlePublishNow, handleSchedulePost }` |
| `useDeletePost` | [`lib/hooks/useDeletePost.ts`](file:///c:/Users/sibas/OneDrive/Desktop/Freelance%20Works/omnicode-beta/lib/hooks/useDeletePost.ts) | Manages post deletion modal, calls `DELETE /api/posts/[id]`, performs optimistic state removal. | `{ postToDelete, deleting, openDeleteDialog, closeDeleteDialog, handleDeleteConfirm }` |
| `useSocialAccounts` | [`lib/hooks/useSocialAccounts.ts`](file:///c:/Users/sibas/OneDrive/Desktop/Freelance%20Works/omnicode-beta/lib/hooks/useSocialAccounts.ts) | Handles social network disconnects via `/api/social/disconnect` with optimistic UI update. | `{ platforms, targetDisconnect, disconnecting, promptDisconnect, cancelDisconnect, handleConfirmDisconnect }` |
| `useConnectedPlatforms` | [`lib/hooks/useConnectedPlatforms.ts`](file:///c:/Users/sibas/OneDrive/Desktop/Freelance%20Works/omnicode-beta/lib/hooks/useConnectedPlatforms.ts) | Fetches authorized platforms from `/api/social/connected` to enable/disable toggles in composer. | `{ connectedPlatforms: string[], loading: boolean }` |

---

## 5. Complete Route-by-Route Directory & Handler Mapping

```
app/
├── (landing-page)
│   ├── page.tsx                           # Landing Page with SSR auth check
│   ├── booking/page.tsx                   # Consultation Booking with Interactive Scheduler
│   ├── privacy/page.tsx                   # Privacy Policy Page
│   ├── terms/page.tsx                     # Terms of Service Page
├── login/page.tsx                         # User Login Page
├── signup/page.tsx                        # User Registration Page
├── automation/page.tsx                    # Protected Dashboard (Stats, Post History)
├── create-post/page.tsx                   # Protected Post Composer & Live Preview
├── connected-accounts/page.tsx            # Protected Social Media Connection Hub
└── api/
    ├── auth/
    │   ├── signup/route.ts                # POST: User registration with bcrypt hashing
    │   ├── signin/route.ts                # POST: Email/password auth & session cookie creation
    │   ├── logout/route.ts                # POST: Session revocation & cookie clearing
    │   ├── me/route.ts                    # GET: Session verification endpoint
    │   └── google/
    │       ├── route.ts                   # GET: Google OAuth 2.0 redirect
    │       └── callback/route.ts          # GET: Google OAuth code exchange & user provisioning
    ├── social/
    │   ├── linkedin/
    │   │   ├── route.ts                   # GET: LinkedIn 3-legged OAuth initiator
    │   │   └── callback/route.ts          # GET: LinkedIn access token exchange & account store
    │   ├── connected/route.ts             # GET: Returns user's active connected providers
    │   └── disconnect/route.ts            # POST: Unlinks and deletes social account credentials
    ├── posts/
    │   ├── route.ts                       # POST: Post creation (instant or scheduled)
    │   └── [id]/route.ts                  # DELETE: Cascading deletion of post and platforms
    ├── cron/
    │   └── publish/route.ts               # GET: Automated cron worker triggering scheduled posts
    ├── upload-auth/route.ts               # GET: ImageKit HMAC upload signature generator
    └── test/route.ts                      # GET: Test sandbox endpoint for direct LinkedIn posting
```

---

## 6. Detailed Function-to-Function Data Flow Diagrams & Step-by-Step Traces

---

### 6.1 User Registration Flow (Sign Up)

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Page as app/signup/page.tsx
    participant Schema as lib/validations/auth.ts (signupSchema)
    participant API as app/api/auth/signup/route.ts
    participant Bcrypt as bcryptjs
    participant DB as PostgreSQL (prisma.user)

    User->>Page: Fills { name, email, password } & Clicks "Create Account"
    Page->>Schema: signupSchema.safeParse({ name, email, password })
    alt Client Validation Fails
        Schema-->>Page: Return Zod issues
        Page->>User: Render error alert
    else Client Validation Passes
        Page->>API: POST /api/auth/signup (JSON body)
        API->>Schema: signupSchema.safeParse(body)
        API->>DB: prisma.user.findUnique({ where: { email: normalizedEmail } })
        alt Email Already Registered
            DB-->>API: Returns existing user record
            API-->>Page: 400 Bad Request ("User already exists with this email")
            Page->>User: Display error message
        else Email is Unique
            API->>Bcrypt: bcrypt.hash(password, 12)
            Bcrypt-->>API: Returns passwordHash string
            API->>DB: prisma.user.create({ data: { name, email, passwordHash } })
            DB-->>API: Returns created User { id, email, name }
            API-->>Page: 201 Created { message: "Account created successfully", user }
            Page->>User: Redirects to /login
        end
    end
```

---

### 6.2 User Authentication Flow (Email/Password Sign In)

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Page as app/login/page.tsx
    participant Schema as lib/validations/auth.ts (signinSchema)
    participant API as app/api/auth/signin/route.ts
    participant DB as PostgreSQL (prisma.user & prisma.session)
    participant Crypto as Node crypto
    participant Bcrypt as bcryptjs

    User->>Page: Enters { email, password } & Clicks "Sign In"
    Page->>Schema: signinSchema.safeParse({ email, password })
    Page->>API: POST /api/auth/signin (JSON body)
    API->>Schema: signinSchema.safeParse(body)
    API->>DB: prisma.user.findUnique({ where: { email: normalizedEmail } })
    
    alt User Not Found or No PasswordHash (e.g., OAuth-only account)
        DB-->>API: null or empty passwordHash
        API-->>Page: 401 Unauthorized ("Invalid email or password")
    else User Exists
        API->>Bcrypt: bcrypt.compare(password, user.passwordHash)
        alt Password Mismatch
            Bcrypt-->>API: false
            API-->>Page: 401 Unauthorized ("Invalid email or password")
        else Password Matches
            Bcrypt-->>API: true
            API->>Crypto: crypto.randomBytes(32).toString('hex')
            Crypto-->>API: sessionToken (64 hex chars)
            API->>DB: prisma.session.create({ data: { sessionToken, userId, expiresAt: now + 7 days } })
            DB-->>API: Session created
            API-->>Page: 200 OK + Set-Cookie: session_token=<token>; HttpOnly; SameSite=Lax; Path=/
            Page->>User: Redirects to /automation
        end
    end
```

---

### 6.3 Google OAuth 2.0 & SSO Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant GoogleRoute as app/api/auth/google/route.ts
    participant GoogleAuth as Google Identity Server
    participant CallbackRoute as app/api/auth/google/callback/route.ts
    participant DB as PostgreSQL (User, Account, Session)

    User->>GoogleRoute: GET /api/auth/google
    GoogleRoute->>GoogleRoute: Build OAuth URL (client_id, scope='openid email profile', prompt='select_account')
    GoogleRoute-->>User: 302 Redirect to https://accounts.google.com/o/oauth2/v2/auth?...
    User->>GoogleAuth: Authenticates & Approves Scopes
    GoogleAuth-->>User: 302 Redirect to /api/auth/google/callback?code=AUTH_CODE
    User->>CallbackRoute: GET /api/auth/google/callback?code=AUTH_CODE
    CallbackRoute->>GoogleAuth: POST https://oauth2.googleapis.com/token (code, client_id, client_secret)
    GoogleAuth-->>CallbackRoute: { access_token, id_token, ... }
    CallbackRoute->>GoogleAuth: GET https://openidconnect.googleapis.com/v1/userinfo (Bearer access_token)
    GoogleAuth-->>CallbackRoute: { sub: googleId, email, name }
    
    CallbackRoute->>DB: prisma.user.findUnique({ where: { email } })
    alt User Does Not Exist
        CallbackRoute->>DB: prisma.user.create({ data: { email, name, passwordHash: null } })
    end
    CallbackRoute->>DB: prisma.account.upsert({ where: { provider_providerAccountId: { provider: 'google', providerAccountId: googleId } }, update: { accessToken }, create: { userId, provider: 'google', providerAccountId: googleId, accessToken } })
    CallbackRoute->>DB: prisma.session.create({ data: { sessionToken, userId, expiresAt } })
    CallbackRoute-->>User: 302 Redirect to /automation + Set-Cookie: session_token=<token>
```

---

### 6.4 Session Verification & Route Protection (`getCurrentUser` / `useAuthRedirect`)

```mermaid
sequenceDiagram
    autonumber
    participant ClientHook as lib/hooks/useAuthRedirect.ts
    participant API as app/api/auth/me/route.ts
    participant AuthLib as lib/auth.ts (getCurrentUser)
    participant NextCookie as Next.js cookies()
    participant DB as PostgreSQL (prisma.session)

    ClientHook->>API: GET /api/auth/me
    API->>AuthLib: getCurrentUser()
    AuthLib->>NextCookie: cookieStore.get("session_token")
    alt No Cookie Present
        AuthLib-->>API: null
        API-->>ClientHook: 401 Unauthorized { authenticated: false, user: null }
        ClientHook->>ClientHook: Redirect to redirectToIfUnauthenticated (if configured)
    else Cookie Present
        AuthLib->>DB: prisma.session.findUnique({ where: { sessionToken }, include: { user: true } })
        alt Session Not In DB
            DB-->>AuthLib: null
            AuthLib-->>API: null
            API-->>ClientHook: 401 Unauthorized { authenticated: false, user: null }
        else Session Expired (expiresAt < now)
            AuthLib->>DB: prisma.session.delete({ where: { id: session.id } })
            AuthLib-->>API: null
            API-->>ClientHook: 401 Unauthorized { authenticated: false, user: null }
        else Session Active
            AuthLib-->>API: session.user
            API-->>ClientHook: 200 OK { authenticated: true, user: { id, email, name } }
        end
    end
```

---

### 6.5 LinkedIn Account Connection (OAuth 2.0 3-Legged Auth)

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant LinkedInInit as app/api/social/linkedin/route.ts
    participant LinkedInOAuth as LinkedIn Identity Platform
    participant LinkedInCallback as app/api/social/linkedin/callback/route.ts
    participant AuthLib as lib/auth.ts (getCurrentUser)
    participant DB as PostgreSQL (prisma.account)

    User->>LinkedInInit: GET /api/social/linkedin
    LinkedInInit->>AuthLib: getCurrentUser() (verifies user session)
    LinkedInInit->>LinkedInInit: Generate crypto state token (16 bytes hex)
    LinkedInInit-->>User: 302 Redirect to https://www.linkedin.com/oauth/v2/authorization?... + Set-Cookie: linkedin_oauth_state=<state>; maxAge=600s
    User->>LinkedInOAuth: Approves LinkedIn Social Permissions (`w_member_social`, `openid`, `profile`, `email`)
    LinkedInOAuth-->>User: 302 Redirect to /api/social/linkedin/callback?code=CODE&state=STATE
    User->>LinkedInCallback: GET /api/social/linkedin/callback?code=CODE&state=STATE
    LinkedInCallback->>LinkedInCallback: Verify query state matches cookie `linkedin_oauth_state`
    LinkedInCallback->>AuthLib: Verify active `session_token` cookie
    LinkedInCallback->>LinkedInOAuth: POST https://www.linkedin.com/oauth/v2/accessToken (code, client_id, client_secret, redirect_uri)
    LinkedInOAuth-->>LinkedInCallback: { access_token, expires_in }
    LinkedInCallback->>LinkedInOAuth: GET https://api.linkedin.com/v2/userinfo (Bearer access_token)
    LinkedInOAuth-->>LinkedInCallback: { sub: linkedinMemberId, name, email }
    LinkedInCallback->>DB: prisma.account.upsert({ where: { provider_providerAccountId: { provider: 'linkedin', providerAccountId: linkedinMemberId } }, update: { userId, accessToken, expiresAt }, create: { userId, provider: 'linkedin', providerAccountId: linkedinMemberId, accessToken, expiresAt } })
    LinkedInCallback-->>User: 302 Redirect to /connected-accounts?linkedin=connected + Clear Cookie: linkedin_oauth_state
```

---

### 6.6 Connected Accounts Discovery & Disconnection Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Grid as components/accounts/ConnectedAccountsGrid.tsx
    participant Hook as lib/hooks/useSocialAccounts.ts
    participant DiscAPI as app/api/social/disconnect/route.ts
    participant AuthLib as lib/auth.ts (getCurrentUser)
    participant DB as PostgreSQL (prisma.account)
    participant Toast as sonner (toast)

    User->>Grid: Clicks "Disconnect" on LinkedIn card
    Grid->>Hook: promptDisconnect(platform)
    Hook->>Grid: Opens Shadcn Confirmation Dialog
    User->>Grid: Clicks "Confirm Disconnect"
    Grid->>Hook: handleConfirmDisconnect()
    Hook->>DiscAPI: POST /api/social/disconnect { provider: "linkedin" }
    DiscAPI->>AuthLib: getCurrentUser()
    DiscAPI->>DB: prisma.account.deleteMany({ where: { userId: user.id, provider: "linkedin" } })
    DB-->>DiscAPI: { count: 1 }
    DiscAPI-->>Hook: 200 OK { success: true, count: 1, message: "linkedin account disconnected successfully" }
    Hook->>Hook: Optimistically update state: platform.connected = false
    Hook->>Toast: toast.success("LinkedIn Disconnected")
    Hook->>Grid: Closes Dialog & refreshes UI
```

---

### 6.7 Image Upload & Direct-to-CDN Flow (ImageKit SDK + HMAC Server Auth)

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Composer as app/create-post/page.tsx
    participant Redux as Redux Store (composerUi & postDraft)
    participant UploadAuthAPI as app/api/upload-auth/route.ts
    participant ImageKitServer as @imagekit/next/server (getUploadAuthParams)
    participant ImageKitClient as @imagekit/next (upload)
    participant ImageKitCDN as ImageKit.io Cloud Storage

    User->>Composer: Selects image file in `<input type="file" />`
    Composer->>Redux: dispatch(setUploadStatus("UPLOADING")), dispatch(setUploadProgress(0))
    Composer->>UploadAuthAPI: GET /api/upload-auth
    UploadAuthAPI->>UploadAuthAPI: getCurrentUser()
    UploadAuthAPI->>ImageKitServer: getUploadAuthParams({ privateKey, publicKey })
    ImageKitServer-->>UploadAuthAPI: { token, expire, signature, publicKey }
    UploadAuthAPI-->>Composer: 200 OK { token, expire, signature, publicKey }
    
    Composer->>ImageKitClient: upload({ file, fileName, token, signature, expire, publicKey, folder: "/social-manager", onProgress })
    loop Upload Chunks
        ImageKitClient->>ImageKitCDN: Stream binary chunks
        ImageKitClient->>Composer: onProgress(event: { loaded, total })
        Composer->>Redux: dispatch(setUploadProgress(percent))
    end
    ImageKitCDN-->>ImageKitClient: { url: "https://ik.imagekit.io/...", fileId: "..." }
    ImageKitClient-->>Composer: result { url }
    Composer->>Redux: dispatch(setImageUrl(result.url)), dispatch(setUploadStatus("SUCCESS"))
    Composer->>User: Displays image in composer & device live preview
```

---

### 6.8 Post Creation Flow (Instant Live Broadcast vs. Scheduled Queue)

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Composer as app/create-post/page.tsx
    participant Hook as lib/hooks/useCreatePost.ts
    participant Validation as lib/validations/post.ts (createPostSchema)
    participant PostAPI as app/api/posts/route.ts
    participant AuthLib as lib/auth.ts (getCurrentUser)
    participant DB as PostgreSQL (prisma.post & prisma.postPlatform)
    participant Worker as lib/automation/worker.ts (processScheduledPosts)
    participant Toast as sonner (toast)
    participant Redux as Redux Store (postDraft & composerUi)

    User->>Composer: Enters Caption, Selects Platforms (e.g. LINKEDIN), Sets Schedule (Optional)
    alt User clicks "Publish Now"
        Composer->>Hook: handlePublishNow() -> submitPost(scheduledAtISO = null)
    else User clicks "Confirm Schedule"
        Composer->>Hook: handleSchedulePost() -> submitPost(scheduledAtISO = "2026-08-30T10:00:00Z")
    end
    Hook->>Validation: createPostSchema.safeParse({ imageUrl, caption, platforms, scheduledAt })
    Hook->>PostAPI: POST /api/posts (JSON body)
    PostAPI->>AuthLib: getCurrentUser()
    PostAPI->>PostAPI: scheduledDate = scheduledAt ? new Date(scheduledAt) : new Date()
    PostAPI->>PostAPI: isDueImmediately = scheduledDate <= new Date()
    
    PostAPI->>DB: prisma.post.create({ data: { userId, imageUrl, caption, status: "SCHEDULED", scheduledAt: scheduledDate, platform: { create: platforms.map(p => ({ platform: p })) } }, include: { platform: true } })
    DB-->>PostAPI: Returns created Post entity

    opt isDueImmediately is True (Publish Now)
        PostAPI->>Worker: processScheduledPosts() [Asynchronously triggered in background]
    end

    PostAPI-->>Hook: 201 Created { message: "Post created successfully", post }
    Hook->>Redux: dispatch(clearDraft()), dispatch(resetComposerUi())
    Hook->>Toast: toast.success(isScheduled ? "Post Scheduled Successfully" : "Post Published Live")
    Hook->>Composer: Reset form state
```

---

### 6.9 Cron Background Worker & Publishing Automation Engine

```mermaid
sequenceDiagram
    autonumber
    participant CronService as Vercel Cron / Scheduler
    participant CronRoute as app/api/cron/publish/route.ts
    participant Worker as lib/automation/worker.ts (processScheduledPosts)
    participant DB as PostgreSQL (Post, PostPlatform, Account)
    participant Publisher as lib/automation/publisher/linkedin.ts

    CronService->>CronRoute: GET /api/cron/publish (Header: Authorization: Bearer <CRON_SECRET>)
    CronRoute->>CronRoute: Validate CRON_SECRET against process.env.CRON_SECRET
    CronRoute->>Worker: processScheduledPosts()
    
    Worker->>DB: prisma.post.findMany({ where: { status: "SCHEDULED", scheduledAt: { lte: now } }, include: { platform: true }, orderBy: { scheduledAt: "asc" }, take: 10 })
    DB-->>Worker: List of due posts
    
    loop For each Post
        loop For each PostPlatform
            opt platform.status === "PUBLISHED"
                Note over Worker: Skip platform (idempotency guard)
            end
            
            alt platform.platform === "LINKEDIN"
                Worker->>DB: prisma.account.findFirst({ where: { userId: post.userId, provider: "linkedin" } })
                DB-->>Worker: account { accessToken, providerAccountId }
                
                alt Missing LinkedIn Account or Access Token
                    Worker->>DB: prisma.postPlatform.update({ where: { id: platform.id }, data: { status: "FAILED" } })
                else Credentials Valid
                    Worker->>Publisher: publishToLinkedIn({ accessToken, authorUrn: "urn:li:person:" + account.providerAccountId, caption: post.caption, imageUrl: post.imageUrl })
                    Publisher-->>Worker: { success: boolean, externalPostId, error }
                    
                    alt Success
                        Worker->>DB: prisma.postPlatform.update({ where: { id: platform.id }, data: { status: "PUBLISHED", publishedAt: now } })
                    else Failure
                        Worker->>DB: prisma.postPlatform.update({ where: { id: platform.id }, data: { status: "FAILED" } })
                    end
                end
            else Unsupported Platform (Instagram/Facebook)
                Worker->>DB: prisma.postPlatform.update({ where: { id: platform.id }, data: { status: "FAILED" } })
            end
        end

        Worker->>DB: prisma.postPlatform.findMany({ where: { postId: post.id } })
        DB-->>Worker: updatedPlatforms
        
        alt All platforms PUBLISHED
            Worker->>DB: prisma.post.update({ where: { id: post.id }, data: { status: "PUBLISHED" } })
        else Any platform FAILED & none PENDING
            Worker->>DB: prisma.post.update({ where: { id: post.id }, data: { status: "FAILED" } })
        end
    end

    Worker-->>CronRoute: { processed, published, failed }
    CronRoute-->>CronService: 200 OK { success: true, processed, published, failed }
```

---

### 6.10 LinkedIn Publisher: 2-Step Binary Upload & Commentary Publishing

```mermaid
sequenceDiagram
    autonumber
    participant Worker as lib/automation/worker.ts
    participant Publisher as lib/automation/publisher/linkedin.ts (publishToLinkedIn)
    participant Uploader as lib/automation/publisher/linkedin.ts (uploadImageToLinkedIn)
    participant ImageKitCDN as ImageKit CDN
    participant LinkedInImagesAPI as LinkedIn REST Images API
    participant LinkedInPostsAPI as LinkedIn REST Posts API

    Worker->>Publisher: publishToLinkedIn({ accessToken, authorUrn, caption, imageUrl })
    
    opt imageUrl is provided
        Publisher->>Uploader: uploadImageToLinkedIn(accessToken, authorUrn, imageUrl)
        Uploader->>ImageKitCDN: fetch(imageUrl)
        ImageKitCDN-->>Uploader: imageBuffer (binary) + contentType (image/jpeg)
        
        Uploader->>LinkedInImagesAPI: POST /rest/images?action=initializeUpload (Headers: LinkedIn-Version: 202601, X-Restli-Protocol-Version: 2.0.0, Body: { initializeUploadRequest: { owner: authorUrn } })
        LinkedInImagesAPI-->>Uploader: { value: { uploadUrl: "https://media.licdn.com/...", image: "urn:li:image:12345" } }
        
        Uploader->>LinkedInImagesAPI: PUT uploadUrl (Body: imageBuffer, Content-Type: contentType)
        LinkedInImagesAPI-->>Uploader: 201 Created / 200 OK
        Uploader-->>Publisher: imageUrn = "urn:li:image:12345"
    end

    Publisher->>Publisher: Construct payload { author: authorUrn, commentary: caption, visibility: "PUBLIC", distribution: { feedDistribution: "MAIN_FEED" }, lifecycleState: "PUBLISHED", content: { media: { id: imageUrn } } }
    Publisher->>LinkedInPostsAPI: POST https://api.linkedin.com/rest/posts (Headers: Bearer accessToken, LinkedIn-Version: 202601, X-Restli-Protocol-Version: 2.0.0)
    
    alt Post Published Successfully
        LinkedInPostsAPI-->>Publisher: 201 Created (Header x-restli-id: "urn:li:share:98765")
        Publisher-->>Worker: { success: true, externalPostId: "urn:li:share:98765" }
    else LinkedIn API Error
        LinkedInPostsAPI-->>Publisher: 4xx/5xx Error Response
        Publisher-->>Worker: { success: false, error: errorText }
    end
```

---

### 6.11 Post Deletion Flow with Optimistic UI Update

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant List as components/dashboard/RecentPostsList.tsx
    participant Hook as lib/hooks/useDeletePost.ts
    participant DeleteAPI as app/api/posts/[id]/route.ts
    participant AuthLib as lib/auth.ts (getCurrentUser)
    participant DB as PostgreSQL (prisma.post)
    participant Toast as sonner (toast)

    User->>List: Clicks Trash icon on Post item
    List->>Hook: openDeleteDialog(post)
    Hook->>List: Opens Shadcn Confirmation Dialog
    User->>List: Clicks "Delete Post" button
    List->>Hook: handleDeleteConfirm()
    Hook->>DeleteAPI: DELETE /api/posts/{postId}
    DeleteAPI->>AuthLib: getCurrentUser()
    DeleteAPI->>DB: prisma.post.findUnique({ where: { id: postId } })
    
    alt Post Not Found or post.userId !== user.id
        DB-->>DeleteAPI: null or unauthorized user id
        DeleteAPI-->>Hook: 404 Not Found / 401 Unauthorized
        Hook->>Toast: toast.error("Failed to delete post")
    else Post Ownership Verified
        DeleteAPI->>DB: prisma.post.delete({ where: { id: postId } })
        Note over DB: Cascades & deletes associated PostPlatform rows
        DB-->>DeleteAPI: Deleted Post record
        DeleteAPI-->>Hook: 200 OK { success: true, message: "Post deleted successfully" }
        Hook->>Hook: Optimistically filters post out of local React state
        Hook->>Toast: toast.success("Post Deleted")
        Hook->>List: Closes Dialog & updates recent list
    end
```

---

### 6.12 User Logout Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Sidebar as components/layout/AppSidebar.tsx
    participant LogoutAPI as app/api/auth/logout/route.ts
    participant NextCookie as Next.js cookies()
    participant DB as PostgreSQL (prisma.session)

    User->>Sidebar: Clicks "Sign Out" button
    Sidebar->>LogoutAPI: POST /api/auth/logout
    LogoutAPI->>NextCookie: cookieStore.get("session_token")
    opt Session Token Exists
        LogoutAPI->>DB: prisma.session.deleteMany({ where: { sessionToken } })
    end
    LogoutAPI->>NextCookie: cookieStore.delete("session_token")
    LogoutAPI-->>Sidebar: 200 OK { message: "User logout Successful" }
    Sidebar->>User: window.location.href = "/login"
```

---

### 6.13 Consultation / Discovery Booking Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor / Client
    participant BookingPage as app/booking/page.tsx
    participant Layout as components/layout/AppLayout.tsx

    User->>BookingPage: Navigates to /booking
    BookingPage->>Layout: Renders sidebar and responsive discovery interface
    User->>BookingPage: Selects Consultation Type (e.g. 30-Min Growth Strategy)
    User->>BookingPage: Selects Preferred Date & Time Slot (e.g. 02:00 PM)
    User->>BookingPage: Enters Contact details (Full Name, Work Email, Company URL, Notes)
    User->>BookingPage: Clicks "Confirm 30 mins Strategy Call"
    BookingPage->>BookingPage: Validates required fields, triggers submitting animation
    BookingPage->>User: Displays confirmation screen with scheduled details & invitation notice
```

---

## 7. Security, Session, and Error-Handling Architecture

```mermaid
flowchart TD
    subgraph SecurityMechanisms["Security & Guardrails"]
        CSRF["OAuth State Validation (HMAC 16-byte random token with 10-min TTL)"]
        Cookies["HTTP-Only, SameSite=Lax, Secure Cookies for Session Isolation"]
        BcryptSec["Bcrypt 12 Salt Rounds for User Password Storage"]
        ZodVal["Zod Schema Runtime Validation across all inbound HTTP payloads"]
        Cascade["Database Cascades for GDPR/Privacy Compliant Account & Post Deletions"]
        CronSec["Bearer Token CRON_SECRET Verification on Scheduled Endpoints"]
    end

    subgraph ErrorHandling["Resilience & Fault Recovery"]
        Idempotency["Worker Platform-level Status Checking (Skips already PUBLISHED platforms)"]
        GracefulFail["Non-blocking Worker Errors (Marks individual platform/post as FAILED)"]
        SafeTokenExpiry["Auto-cleanup of Expired Sessions during getCurrentUser() checks"]
    end
```

1. **Authentication Token Lifecycle:**
   - Generated via Node.js native `crypto.randomBytes(32).toString("hex")`.
   - Stored in the PostgreSQL `Session` table with an explicit 7-day expiration timestamp (`expiresAt`).
   - Transported via HTTP-Only, Lax-same-site cookie (`session_token`).
   - Auto-purged from the database upon expiration during `getCurrentUser()` validation checks.

2. **OAuth 2.0 Security:**
   - **LinkedIn & Google:** Employs cryptographically secure `state` parameters stored in temporary cookies (`linkedin_oauth_state`) with 10-minute maximum age to block Cross-Site Request Forgery (CSRF).
   - **Secret Isolation:** Environment variables (`GOOGLE_CLIENT_SECRET`, `LINKEDIN_CLIENT_SECRET`, `IMAGEKIT_PRIVATE_KEY`, `CRON_SECRET`) are strictly read in server-side handlers and never exposed to the client bundle.

3. **Input Validation:**
   - All mutations pass through strict Zod schemas (`signupSchema`, `signinSchema`, `createPostSchema`).
   - Invalid payloads receive structured 400 responses containing mapped error messages.

---

## 8. Cross-Cutting Concerns & Production Observability

```mermaid
graph LR
    subgraph ClientMonitoring["Client Side"]
        Toasts["Sonner Interactive Feedback"]
        ReduxDevTools["Redux State Action Tracking"]
    end

    subgraph ServerLogging["Server Logging & Observability"]
        AuthLogs["[Auth] Sign-in, OAuth & Session Creation logs"]
        UploadLogs["[ImageKit] HMAC Signature Generation logs"]
        WorkerLogs["[Automation] Batch query, post status updates & errors"]
        LinkedInLogs["[LinkedIn Publisher] Image URN initialization & post ids"]
        CronLogs["[Cron] Periodic job lifecycle metrics"]
    end

    ClientMonitoring --> ServerLogging
```

- **Structured Console Logging:** Every automated worker run outputs detailed progress:
  - `[Automation] Looking for scheduled posts at <ISO timestamp>`
  - `[Automation] Processing post <id>`
  - `[LinkedIn Image] Image uploaded successfully. URN: <urn>`
  - `[Automation] Finished. Processed: X, Published: Y, Failed: Z`
- **Database Indexing:** Unique compound indexes on `[provider, providerAccountId]`, `[postId, platform]`, and single-key indexes on `sessionToken` and `email` ensure high query throughput.
- **Client Cache Synchronization:** Custom hooks execute `router.refresh()` in conjunction with optimistic UI state mutations to ensure the Next.js server component cache stays in lockstep with the database.

---
*End of Data Flow Specification.*

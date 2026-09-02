# 🚀 chartes.tech (`omnicode-beta`)

> **Next-Generation AI Marketing & Multi-Platform Social Media Automation Engine**

---

## 🌟 Executive Overview (Non-Technical)

**chartes.tech** is an intelligent social media automation and marketing platform engineered for modern brands, creators, agencies, and businesses. It eliminates the repetitive friction of managing and distributing content across fragmented social networks by offering a unified workspace to draft, preview, schedule, and automatically publish multimedia content.

### 💡 Core Value Proposition
- **Create Once, Publish Everywhere:** Draft rich content once and distribute it across supported platforms (LinkedIn, Facebook Pages, and Instagram Professional accounts).
- **Pixel-Perfect Live Previews:** Real-time mobile and desktop previews show exactly how your post will render before it goes live.
- **Intelligent Scheduled Automation:** Set future publishing dates and let the background automation worker execute time-accurate releases (triggered by zero-hosting external schedulers like `cron-job.org`).
- **Single-Click Social Authorization:** Connect verified social profiles safely via OAuth 2.0 with zero password sharing.
- **Enterprise-Grade Trust & Compliance:** Built-in session security, GDPR & CCPA privacy governance, and strict data protection standards.
- **Immersive Visual Aesthetics:** A modern, high-performance web experience with fluid smooth-scrolling, GSAP micro-animations, and interactive WebGL canvas visuals.

---

## ✨ Key Features

### 1. 🎨 Visual Post Composer & Live Preview
- Rich caption drafting with character counters and live validation.
- Direct-to-cloud media uploads powered by **ImageKit** with client-side image compression and preview cards.
- Multi-platform target selectors to easily choose destination platforms for each post (LinkedIn, Facebook Pages, Instagram).
- Draft state persistence powered by **Redux Toolkit**.

### 2. 🤖 Social Media Publishing & Automation Worker
- **LinkedIn Publishing Engine:** Direct integration with the LinkedIn REST API (`/rest/posts`) using secure OpenID Connect member URNs and 2-step binary image uploading.
- **Facebook Pages Publishing Engine:** Direct integration with Meta Graph API v21.0 (`/{page-id}/photos` and `/{page-id}/feed`) with permanent Page Access Tokens.
- **Instagram Professional Publishing Engine:** 2-step asynchronous media container creation (`/{ig-user-id}/media`) and publishing (`/{ig-user-id}/media_publish`).
- **Zero-Hosting Scheduled Worker:** Cron-driven HTTP trigger (`/api/cron/publish`) secured with Bearer token authentication compatible with free cron services like `cron-job.org`.
- **Idempotent Execution:** Prevents duplicate posts by tracking per-platform statuses (`PENDING`, `PUBLISHED`, `FAILED`) and updating parent post states.

### 3. 🔐 Authentication & Social Connections Hub
- **Custom Session Auth:** Secure cryptographic session tokens stored in `HTTP-Only`, `SameSite: Lax` cookies with automatic expiration purging.
- **Google Sign-In / OAuth 2.0:** One-click authentication with Google OpenID Connect.
- **LinkedIn OAuth 2.0 Connection:** State-verified OAuth flow to link LinkedIn accounts for automated publishing.
- **Meta OAuth 2.0 (Facebook & Instagram):** Unified 3-legged authorization to grant Facebook Page and Instagram Professional publishing permissions.
- **Connected Accounts Management (`/connected-accounts`):** View connection health, member account IDs, and disconnect/reconnect social profiles on demand.

### 4. 📊 Marketing Dashboard (`/automation`)
- Real-time KPI statistics: **Total Automations**, **Published**, **Scheduled**, and **Failed**.
- Recent posts feed with status chips, scheduled timestamps, and detailed publication states.
- Protected session routing ensuring tenant data isolation.

### 5. 📜 Privacy & Legal Governance Hub (`/privacy` & `/terms`)
- Clean, minimalist, and responsive legal documentation for Privacy Policy and Terms of Service.
- Early-stage SaaS legal protections: clear data disclosures, user content ownership, third-party platform & AI disclaimers, no-guarantee-of-results clauses, and synchronized PDF print engine.

---

## 🛠️ Technical Architecture & Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 (App Router)                  │
│   React 19  •  TypeScript 5  •  Tailwind CSS v4  •  Redux   │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Auth Engine    │ │   Media Engine   │ │  Social Worker   │
│ Session Cookies  │ │ ImageKit Uploads │ │ LinkedIn, Meta   │
│  OAuth 2.0 / OIDC│ │ Auth Tokens & CDN│ │ (FB & IG API)    │
└───────────┬──────┘ └──────────────────┘ └───────────┬──────┘
            │                                         │
            └──────────────────┬──────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Prisma 7 ORM  •  PostgreSQL (Neon DB)            │
│         @prisma/adapter-pg Driver Adapter Singleton         │
└─────────────────────────────────────────────────────────────┘
```

### 💻 Technologies & Libraries

| Domain | Technology / Library | Description |
|---|---|---|
| **Framework** | [Next.js 16.3.1](https://nextjs.org/) (App Router, Turbopack) | Server Components, Server Actions, API routes |
| **Frontend Runtime** | [React 19.2.8](https://react.dev/) & [TypeScript 5](https://www.typescriptlang.org/) | Type-safe reactive UI development |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit`, `react-redux`) | Global post composer & UI state |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) | Utility-first responsive design & icons |
| **Motion & UX** | [Lenis](https://lenis.darkroom.engineering/), [GSAP](https://greensock.com/gsap/), [Framer Motion](https://www.framer.com/motion/) | Smooth inertial scroll, card animations |
| **Graphics** | [OGL](https://github.com/oframe/ogl) | WebGL interactive background canvas effects |
| **Database & ORM** | [Prisma v7](https://www.prisma.io/) + [Neon Serverless PostgreSQL](https://neon.tech/) | Relational database modeling with pg adapter |
| **Data Validation** | [Zod v4](https://zod.dev/) | End-to-end schema validation (client & API) |
| **Media Hosting** | [ImageKit](https://imagekit.io/) (`@imagekit/next`) | Cloud asset optimization & client upload auth |
| **Security & Auth** | `bcryptjs`, `crypto`, `next/headers` cookies | Password hashing & cryptographic session tokens |
| **External Scheduler** | [cron-job.org](https://cron-job.org) | Zero-hosting scheduled HTTP ping trigger (`/api/cron/publish`) |

---

## 🗄️ Database Schema Overview (Prisma)

- **`User`**: Core user entity (`id`, `name`, `email`, `passwordHash`, `createdAt`, `updatedAt`).
- **`Account`**: OAuth accounts (`userId`, `provider`, `providerAccountId`, `accessToken`, `refreshToken`, `expiresAt`).
- **`Session`**: Active user sessions (`id`, `sessionToken`, `userId`, `expiresAt`).
- **`Post`**: Social posts (`id`, `userId`, `imageUrl`, `caption`, `status`, `scheduledAt`, `createdAt`, `updatedAt`).
- **`PostPlatform`**: Platform targets per post (`id`, `postId`, `platform`, `status`, `publishedAt`).

---

## 📂 Project Structure

```
├── app/
│   ├── (auth)/             # Login & Signup authentication views
│   ├── (dashboard)/        # Automation dashboard & connected accounts
│   ├── api/
│   │   ├── auth/           # Signup, Signin, Logout, Google OAuth
│   │   ├── cron/           # Scheduled publishing worker trigger (/api/cron/publish)
│   │   ├── posts/          # Post creation & draft management
│   │   ├── social/         # Social platform OAuth callbacks (LinkedIn, Facebook/Meta)
│   │   ├── upload-auth/    # ImageKit secure client-upload token generator
│   │   └── test/           # End-to-end publisher test verification route
│   ├── layout.tsx          # Root layout with High-DPI icons & fonts
│   └── page.tsx            # High-performance landing page
├── components/
│   ├── (landing-page)/     # Hero, Navbar, Services, AccordionGallery, Footer
│   ├── composer/           # Post Composer, Media Uploader, Platform Previews
│   └── ui/                 # Reusable Base UI and Shadcn components
├── lib/
│   ├── automation/         # Social publisher engines & scheduling worker
│   │   ├── publisher/      # Direct REST API drivers (LinkedIn, Facebook, Instagram)
│   │   └── worker.ts       # Scheduled automation processing engine
│   ├── validations/        # Zod validation schemas for forms and API routes
│   ├── auth.ts             # Session token extraction & user verification
│   ├── prisma.ts           # PrismaClient pg driver adapter singleton
│   └── store.ts            # Redux store & state slices
├── prisma/
│   └── schema.prisma       # Database schema & relations
└── public/                 # Static assets, branding icons, and favicons
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the project root with the following configuration:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=verify-full"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth 2.0
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# LinkedIn OAuth 2.0 & Publishing
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
LINKEDIN_REDIRECT_URI="http://localhost:3000/api/social/linkedin/callback"

# Meta (Facebook & Instagram) OAuth 2.0 & Publishing
META_APP_ID="your-meta-app-id"
META_APP_SECRET="your-meta-app-secret"
META_REDIRECT_URI="http://localhost:3000/api/social/facebook/callback"

# Cron Secret for /api/cron/publish
CRON_SECRET="your-secure-random-cron-secret"

# ImageKit Media Engine
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_account"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/Sibasish2005/omninode-beta.git
cd omnicode-beta
npm install
```

### 2. Generate Prisma ORM Client & Apply Schema
```bash
npm run build # or npx prisma generate
```

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 🧪 Testing the Publishing Engine

To verify your LinkedIn integration with an active session:
```bash
# 1. Run the development server
npm run dev

# 2. Make an authenticated request to the test route
curl.exe -i -b "session_token=<YOUR_ACTIVE_SESSION_TOKEN>" http://localhost:3000/api/test
```
A successful response confirms OAuth token validation and live post creation on LinkedIn:
```json
{
  "success": true,
  "message": "LinkedIn post published successfully",
  "externalPostId": "urn:li:share:7497977128286605312"
}
```

---

## 🗺️ Roadmap & Upcoming Milestones

- [x] **Step 1 — Landing Page & Visual Architecture** (Lenis, GSAP, Framer Motion)
- [x] **Step 2 — Database & ORM Setup** (PostgreSQL + Prisma 7)
- [x] **Step 3 — Custom Session Authentication** (Bcrypt + Crypto Session Tokens)
- [x] **Step 4 — Social Auth & Media Engine** (Google OAuth + ImageKit)
- [x] **Step 5 — Post Composer & Redux State** (Live preview + multi-platform targeting)
- [x] **Step 6 — Connected Accounts Hub** (Social connection dashboard)
- [x] **Step 7 — Privacy & Legal Hub** (Responsive `/privacy` & `/terms`)
- [x] **Step 8 — LinkedIn OAuth & REST Publishing Engine** (Live verified)
- [x] **Step 9 — Meta Graph API (Facebook Pages & Instagram)** (Photo posts & 2-step media containers)
- [x] **Step 10 — Automated Background Cron Triggers & Queue Worker** (cron-job.org zero-hosting integration)
- [ ] **Step 11 — Live Analytics & Dashboard Feed Sync**
- [ ] **Step 12 — X.com (Twitter v2) & Bluesky AT Protocol**
- [ ] **Step 13 — GitHub → AI Social Posting Engine (NEW — BUILD NEXT)**
  - Webhook ingestion with HMAC-SHA256 signature verification
  - Deterministic relevance & security filter (branch eligibility, magnitude, sensitive path exclusions, cooldown)
  - Semantic AI change analysis with structured Zod output validation
  - Human approval inbox (`WAITING_FOR_APPROVAL` state machine)
  - Seamless handoff to active LinkedIn / Facebook / Instagram multi-platform publishers
- [ ] **Step 14 — Event-Driven AI Job Search & Recruiter Outreach Agent (NEXT MAJOR FEATURE)**
  - Resume extraction into typed `CandidateProfile`
  - Hybrid job matching engine (rules + `pgvector` semantic search + LLM evaluation)
  - Verified public recruiter contact discovery
  - Human-in-the-loop personalized email outreach drafts
  - Gmail API & Google Workspace OAuth integration
  - Inbound email intelligence & interview/rejection event classification
  - Event-driven orchestration with **BullMQ / Redis** and **LangGraph / LangChain**
  - Spreadsheet-like application tracking CRM dashboard

---

## 📄 License & Attribution

Distributed under the MIT License. Developed for **chartes.tech**.

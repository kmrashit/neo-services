# Architecture Audit & UI Revamp Specification

## 1. Executive Summary
This document provides:
1. **Backend Architecture Audit**: Detailed inventory and isolation plan for non-core modules (`leetcode` and legacy IoT fall-detection remnants).
2. **Re-Architected Core Modules**:
   - `link-shortener`: Repurposed into **Feature F08** for resume sharing, blog previews, view counters, and visitor dwell-time tracking.
   - `forti`: Repurposed into **Feature F09 (Forti AI Engine)** for automatic candidate profile insight synthesis, learning velocity calculation, leadership trait detection, and HR interactive profile chatbot.
3. **Frontend Revamp & Shadcn UI Standard**: Architectural specification to migrate `fortlio-ui` from flat, unstructured pages into a clean feature-based modular system using **Shadcn UI exclusively** (https://ui.shadcn.com/) for all UI primitives.
4. **Master Feature Priority Roadmap**: The token-optimal execution order (P1 through P9) across all platform layers.

---

## 2. Backend Architecture Audit

The core domain of Fortlio is:
> *An all-inclusive, universal professional portfolio and talent discovery platform for **anyone and everyone** across all professions, backgrounds, specialties, and education paths (engineering, design, medicine, law, finance, science, research, marketing, education, operations, and more) where candidates create showcase profiles, verify domain skills, write specialty learning blogs, generate pixel-perfect PDF resumes, and share tracked resume/blog links; an integrated AI engine (Forti) evaluates learning velocity, domain depth, topic diversity, and leadership qualities from candidate writings; HRs search candidates across all professions using keyword filters backed by Typesense, chat interactively with candidate profiles via Forti AI, with video-ad monetization after every 2 searches; and candidates and HRs network via connections and real-time chat.*

### 2.1. Non-Core Modules & Retention Policy

#### A. The `leetcode` Module (`fortlio-be/src/modules/leetcode/`)
- **What it contains**:
  - `leetcode.service.ts`: Scrapes `https://leetcode.com/graphql` for question descriptions and solution code, and generates AI explanations.
  - `models/dsa-quests.model.ts` & `models/dsa-answers.model.ts`: MongoDB models storing LeetCode questions and DSA solutions.
  - `models/questions.collections.ts`: Typesense schema for DSA questions.
  - `core/core-workers/bullmq.workers.ts`: Background job `typesense-leetcode-questions-sync-job`.
- **Policy & Action**:
  - **DO NOT DELETE**: The files in `fortlio-be/src/modules/leetcode/` are kept on disk as requested. The user will relocate/move them.
  - **Isolation Rule**: Core candidate portfolio modules (F01–F09) must NOT import from `leetcode` or introduce new dependencies on it.

#### B. Legacy Fall Detection in `bullmq.workers.ts`
- **What it contains**:
  - `initializeBullMQSendNotification`: Worker referencing `IMEI` and fall detection emergency SMS queues.
- **Action**:
  - Replaced by Fortlio-relevant workers: `initializeBullMQFortiInsightsWorker` (for candidate insight synthesis) and `initializeBullMQSendCandidateNotification`. The original worker function signature is preserved for reference.

---

### 2.2. Re-Architected Core Module: `link-shortener` (Feature F08)
- **Status**: **RETAINED & REPURPOSED AS CORE FEATURE**
- **Domain Role**: Rather than a generic URL shortener, `link-shortener` is elevated into Fortlio's **Share & Engagement Analytics Engine**:
  1. **Resume Sharing**: Candidates create personalized short links (e.g. `fortlio.me/s/alex-cv`) to share on LinkedIn, GitHub, or direct job applications.
  2. **Blog Previews**: Candidates share drafts or published blogs with recruiters and peers.
  3. **Visitor & Dwell Time Analytics**: The service tracks total link clicks (`viewsCount`) and cumulative active time spent on the destination page (`totalTimeSpentSeconds`), giving candidates actionable recruiter interest metrics.
- Detailed in [docs/F08.md](file:///home/ashit/neo-services/docs/F08.md).

---

### 2.3. Re-Architected Core Module: `forti` (Feature F09 - Forti AI Engine)
- **Status**: **RETAINED & ELEVATED INTO CROSS-CUTTING AI ENGINE**
- **Domain Role**: Forti is the cross-cutting intelligence backbone:
  1. **Automated Candidate Insight Synthesis**: Triggered whenever a blog is published or edited (F04). Analyzes learning velocity, topic diversity, technical volume, and leadership/mindset traits.
  2. **Typesense Keyword Discovery**: Extracted AI traits are indexed to allow recruiters to search candidates by leadership potential, learning speed, or specific architectural expertise.
  3. **HR Profile AI Chatbot**: Recruiter-facing RAG chatbot allowing HRs to chat directly with an AI assistant grounded in the candidate's complete portfolio.
- Detailed in [docs/F09.md](file:///home/ashit/neo-services/docs/F09.md).

---

## 3. Frontend Architecture Revamp: Feature Modularity & Shadcn UI Standard

### 3.1. Current UI Shortcomings
1. **No Feature Folders**: `src/features/` is empty. Pages are dumped flat into `src/pages/`.
2. **No Shadcn UI Integration**: Forms and controls use ad-hoc Tailwind classes, raw `<input>` and `<button>` tags, and manual DOM/state management instead of accessible Radix primitives.
3. **Mock Data in Components**: `CandidateProfile.tsx` and `CandidateBlogs.tsx` use hardcoded arrays instead of connecting to backend APIs.
4. **Scattered Business Logic**: `Login.tsx` directly manipulates `localStorage` inside component handlers.
5. **Leftover Test Files**: `RoughTesting.jsx` (23 KB) is committed in `src/components/`.

---

### 3.2. Target Revamped Folder Structure

```
fortlio-ui/
├── src/
│   ├── api/
│   │   ├── client.ts             # Central Axios instance with JWT interceptors
│   │   └── endpoints.ts          # Centralized API endpoint routes
│   │
│   ├── components/
│   │   ├── ui/                   # STRICT SHADCN UI COMPONENT PRIMITIVES
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── table.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── toast.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/               # Application Shell
│   │   │   ├── AppLayout.tsx     # Authenticated shell layout (Header + Sidebar)
│   │   │   ├── Header.tsx        # Global header with Search, Notifications, User Menu
│   │   │   ├── Sidebar.tsx       # Navigation links
│   │   │   └── Footer.tsx
│   │   │
│   │   └── shared/               # Reusable Compound Components
│   │       ├── ProtectedRoute.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx       # Central user state, token refresh, login, logout
│   │   └── ThemeContext.tsx      # Dark / Light theme provider
│   │
│   ├── features/                 # DOMAIN FEATURE MODULES (No cross-imports)
│   │   ├── auth/                 # Feature F01
│   │   │   ├── components/       # LoginForm, RegisterForm, VerifyEmailCard
│   │   │   ├── hooks/            # useAuth, useLogin, useRegister
│   │   │   ├── api.ts            # /auth/* requests
│   │   │   └── types.ts          # Auth DTOs
│   │   │
│   │   ├── user/                 # Feature F02
│   │   │   ├── components/       # UserProfileSettings, AdRewardModal, RoleBadge
│   │   │   ├── hooks/            # useUserProfile, useAdReward
│   │   │   ├── api.ts            # /user/* and /role/*
│   │   │   └── types.ts
│   │   │
│   │   ├── candidate/            # Feature F03
│   │   │   ├── components/       # ProfileCard, EditProfileForm, ResumeEditor, PdfModal
│   │   │   ├── hooks/            # useCandidateProfile, useResumeExport
│   │   │   ├── api.ts            # /candidate/*
│   │   │   └── types.ts
│   │   │
│   │   ├── blogs/                # Feature F04
│   │   │   ├── components/       # BlogCard, BlogFeedList, BlogDetail, BlogEditor
│   │   │   ├── hooks/            # useBlogFeed, useCreateBlog
│   │   │   ├── api.ts            # /candidate/blog*
│   │   │   └── types.ts
│   │   │
│   │   ├── hr/                   # Feature F05
│   │   │   ├── components/       # CandidateSearchBar, FilterPanel, CandidateCard, VideoAdModal
│   │   │   ├── hooks/            # useCandidateSearch, useVideoAdGate
│   │   │   ├── api.ts            # /hr/*
│   │   │   └── types.ts
│   │   │
│   │   ├── connections/          # Feature F06
│   │   │   ├── components/       # ConnectionCard, ConnectionTabsList, NotificationBell
│   │   │   ├── hooks/            # useConnections, useNotifications
│   │   │   ├── api.ts            # /connections/*
│   │   │   └── types.ts
│   │   │
│   │   ├── chat/                 # Feature F07
│   │   │   ├── components/       # ChatContainer, MessageList, ChatInputBar
│   │   │   ├── hooks/            # useChatMessages, useChatSocket
│   │   │   ├── api.ts            # /connections/chat/*
│   │   │   └── types.ts
│   │   │
│   │   ├── shortener/            # Feature F08
│   │   │   ├── components/       # ShareLinkModal, ShareAnalyticsCard, MySharedLinksTable
│   │   │   ├── hooks/            # useCreateShareLink, useTrackLinkDwellTime, useLinkAnalytics
│   │   │   ├── api.ts            # /services/shorten/*
│   │   │   └── types.ts
│   │   │
│   │   ├── forti/                # Feature F09 (AI Engine & Profile Chat)
│   │   │   ├── components/       # CandidateAiInsightsCard, HrCandidateChatDrawer, LearningVelocityBadge
│   │   │   ├── hooks/            # useCandidateInsights, useCandidateAiChat
│   │   │   ├── api.ts            # /forti/*
│   │   │   └── types.ts
│   │   │
│   │   └── landing/              # Marketing & Public Home
│   │       ├── components/       # Hero, Features, HowItWorks, Testimonials, CTA
│   │       └── types.ts
│   │
│   ├── lib/
│   │   └── utils.ts              # cn() utility: clsx + tailwind-merge
│   ├── App.tsx                   # Route definitions
│   ├── main.tsx
│   └── index.css                 # Tailwind + Shadcn CSS theme variables
```

---

## 4. Master Feature Priority Roadmap (Token-Optimal Order)

| Priority | Feature ID | Feature Name | Core Rationale & Dependencies |
|:---:|:---|:---|:---|
| **P1** | **F01** | **Auth & Session Management** | Required first: Provides JWT credentials, user roles, and Redis sessions needed by all other modules. |
| **P2** | **F02** | **User Account & RBAC** | Identity: Handles user profiles, role enforcement (`candidate` vs `hr`), and search quota coin counters. |
| **P3** | **F03** | **Candidate Profile & Resume Builder** | Core Showcase: Builds candidate profile, skills matrix, and PDF resume generator. |
| **P4** | **F04** | **Candidate Blogs & Knowledge** | Content Engine: Enables markdown blogs; serves as raw input feeding Forti AI insights. |
| **P5** | **F08** | **Link Shortener & Share Analytics** | Viral Distribution: Generates trackable short links for resumes & blogs with active dwell-time beacon tracking. |
| **P6** | **F09** | **Forti AI Engine & HR Chatbot** | Intelligence: Asynchronously evaluates learning velocity, topic diversity, and leadership qualities from F04 blogs; powers HR profile chatbot. |
| **P7** | **F05** | **HR Search & Monetization** | Discovery & Revenue: Typesense candidate search querying candidate profiles & F09 AI insights, gated by the 2-query video ad rule. |
| **P8** | **F06** | **Connections & Notifications** | Networking: Bi-directional connection requests and notification popovers between candidates and HRs. |
| **P9** | **F07** | **Real-Time Chat & WebSocket** | Communication: Direct 1-on-1 messaging between connected candidates and recruiters over WebSockets. |

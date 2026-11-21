# GEMINI.md - Fortlio Project Master Context

## 1. Project Overview & Mission
**Fortlio** is an all-inclusive, universal professional portfolio and recruitment discovery platform for **anyone and everyone** across all professions, backgrounds, specialties, and education paths (engineering, design, medicine, law, finance, science, research, marketing, education, operations, and beyond) where:
- **Candidates & Professionals** create rich showcase profiles across their respective professions and education backgrounds, showcase verified domain skills, publish markdown specialty blogs sharing their knowledge and deep domain expertise, export pixel-perfect PDF resumes generated from Markdown, and share trackable short links to their portfolios and articles with real-time visitor count and dwell-time analytics.
- **AI-Powered Candidate Insights & Leadership Detection (Forti Engine)**: Automatically synthesizes candidate progression, learning velocity, knowledge breadth/depth, and leadership qualities whenever a specialty blog is published, enabling HRs and recruiters to discover talent based on mindset, domain mastery, and intellectual trajectory.
- **HRs & Recruiters** discover talent across diverse backgrounds, professions, and education credentials using keyword and skill-based search powered by Typesense, chat interactively with candidate profiles via the Forti AI chatbot, and evaluate candidates with full privacy controls.
- **Monetization** is enforced via video ads: recruiters receive 2 searches before being required to watch a video ad (`/user/watch-ad`) to replenish search quota.
- **Networking** is facilitated through bi-directional connection requests, real-time 1-on-1 chat (WebSocket), and in-app notifications.

---

## 2. Tech Stack
- **Runtime**: Bun (`>=1.0.0`)
- **Backend**: TypeScript, Express, MongoDB (Aggregations first), Typesense (Candidate search & AI insights search), Redis (Sessions & Caching), BullMQ (Async tasks & Forti AI event queues), AWS SES (Email), Puppeteer (Markdown-to-PDF), OpenRouter/Ollama (Forti LLM)
- **Frontend**: Vite, React 19, TypeScript, Tailwind CSS, **Shadcn UI exclusively** (https://ui.shadcn.com/)
- **Testing**: Bun Test (`fortlio-be/__tests__/`), Playwright (`e2e/tests/`)
- **CI/CD**: Jenkins (`Jenkinsfile-dev.cicd`, `Jenkinsfile-prod.cicd`)

---

## 3. Strict Architecture & Coding Rules

### A. Backend Architecture & Modularity
1. **Module Isolation**: Every core feature MUST live in `fortlio-be/src/modules/<feature-name>/`.
   - Each module contains: `controller.ts`, `service.ts`, `route.ts`, `validation.ts`, `types.ts` (or `interface.ts`), `queries.ts`, `constants.ts`, `registry.ts`.
   - **NO cross-module imports**: Modules MUST NOT import from each other. Shared logic goes in `fortlio-be/src/core/` or `fortlio-be/src/interface/`. Cross-module triggers use BullMQ queues (e.g. `BULLMQQUEUES.FORTI_INSIGHTS_QUEUE`).
2. **MongoDB Coding Rules & Helper Priority**:
   - **Aggregations First**: All data fetching, joins, sorting, pagination, and projections MUST use MongoDB Aggregation Pipelines in `*.queries.ts`.
   - **Prioritize `mongo.helper.ts`**: For all record retrieval, **PRIORITIZE** using shared aggregation helper functions in `fortlio-be/src/core/core-helper/mongo.helper.ts`:
     - `getDataWithLookupsAfterFilter`: **The primary standard for paginated list queries.** It executes `$lookup` stages **after** `$match`, `$sort`, `$skip`, and `$limit` inside a `$facet`, ensuring lookups run only on the sliced page documents rather than the full collection.
     - `getDataByFilter`: For paginated filtering without relational `$lookup` stages.
     - `getDataByFilterSecondary`: For read-heavy operations routed to secondary replicas.
     - `runQueryMongoDriverSecondary`: For running raw driver aggregations on secondary nodes.
   - **Helper Extension Standard**: If an operation requires a specialized or more optimized aggregation pattern, **never write ad-hoc in-memory JavaScript loops or unoptimized pipelines**. Create/extend a reusable, typed helper function in `fortlio-be/src/core/core-helper/mongo.helper.ts` first, and then consume it in `*.queries.ts`.
   - **Mongoose Scope**: Use Mongoose models solely for basic write operations (`create`, `updateOne`, `deleteOne`).
   - **Bun Optimization**: Offload all computations and shape transformations to MongoDB. Minimize in-memory JavaScript loops and modifications in Bun.
3. **Core Modules vs Deprecation Policy**:
   - **Core Modules (F01–F09)**: `auth`, `user`, `role`, `candidate`, `hr`, `connection`, `link-shortener`, `forti`.
   - **Deprecation Policy**:
     - `fortlio-be/src/modules/leetcode/`: **DO NOT DELETE** for now (the user will relocate/move it). Do NOT extend it, import from it, or introduce dependencies on it.
     - Fall detection IoT code in `core/core-workers/bullmq.workers.ts` is replaced by `initializeBullMQFortiInsightsWorker` and `initializeBullMQSendCandidateNotification`.

### B. Frontend Architecture & Shadcn UI Revamp
1. **Feature-Based Folder Structure**: Every feature MUST live in `fortlio-ui/src/features/<feature-name>/`:
   ```
   fortlio-ui/src/features/<feature-name>/
   ├── components/      # Feature-specific UI components
   ├── hooks/           # Feature-specific business logic & query/mutation hooks
   ├── api.ts           # Feature-specific API endpoints using axios client
   └── types.ts         # Feature-specific TypeScript DTOs and interfaces
   ```
2. **STRICT SHADCN UI STANDARD**:
   - The UI MUST ONLY use **Shadcn UI** (https://ui.shadcn.com/) for all interactive primitives (Buttons, Inputs, Dialogs, Cards, Badges, Tabs, Dropdowns, Sheets, Tables, Sliders, Avatars, Toast).
   - All primitives reside in `fortlio-ui/src/components/ui/`.
   - No raw HTML unstyled buttons (`<button>`) or custom ad-hoc dropdown/modal state machines.
   - Use `cn()` helper (`clsx` + `tailwind-merge`) in `fortlio-ui/src/lib/utils.ts`.

---

## 4. Master Feature Map & Documentation Index

| ID | Feature Name | Backend Module | Frontend Feature | Spec Document |
|:---:|:---|:---|:---|:---|
| **F01** | Authentication & Session Management | `fortlio-be/src/modules/auth/` | `fortlio-ui/src/features/auth/` | [`docs/F01.md`](file:///home/ashit/neo-services/docs/F01.md) |
| **F02** | User Account & RBAC (Roles & Privileges) | `fortlio-be/src/modules/user/`, `role/` | `fortlio-ui/src/features/user/` | [`docs/F02.md`](file:///home/ashit/neo-services/docs/F02.md) |
| **F03** | Candidate Profile & Resume Generator (MD-to-PDF) | `fortlio-be/src/modules/candidate/` | `fortlio-ui/src/features/candidate/` | [`docs/F03.md`](file:///home/ashit/neo-services/docs/F03.md) |
| **F04** | Candidate Blogs & Knowledge Showcase | `fortlio-be/src/modules/candidate/` | `fortlio-ui/src/features/blogs/` | [`docs/F04.md`](file:///home/ashit/neo-services/docs/F04.md) |
| **F05** | HR Search Engine & Video Ad Monetization | `fortlio-be/src/modules/hr/` | `fortlio-ui/src/features/hr/` | [`docs/F05.md`](file:///home/ashit/neo-services/docs/F05.md) |
| **F06** | Connections & Notification System | `fortlio-be/src/modules/connection/` | `fortlio-ui/src/features/connections/`| [`docs/F06.md`](file:///home/ashit/neo-services/docs/F06.md) |
| **F07** | Real-Time & Stored Chat Messaging | `fortlio-be/src/modules/connection/` | `fortlio-ui/src/features/chat/` | [`docs/F07.md`](file:///home/ashit/neo-services/docs/F07.md) |
| **F08** | Link Shortener & Share Analytics (Resume & Blog Previews) | `fortlio-be/src/modules/link-shortener/` | `fortlio-ui/src/features/shortener/` | [`docs/F08.md`](file:///home/ashit/neo-services/docs/F08.md) |
| **F09** | Forti AI Engine (Insights, Leadership & HR Chatbot) | `fortlio-be/src/modules/forti/` | `fortlio-ui/src/features/forti/` | [`docs/F09.md`](file:///home/ashit/neo-services/docs/F09.md) |
| **AUDIT** | Backend Audit & Frontend Revamp Guide | Architecture & Deprecations | UI Revamp & Shadcn Setup | [`docs/AUDIT_AND_REVAMP.md`](file:///home/ashit/neo-services/docs/AUDIT_AND_REVAMP.md) |

---

## 5. Main Master Progress Tracker

> Track completion progress across all architectural layers. Keep updated after each feature milestone.

| Feature ID | Feature Description | Backend API | Mongo Aggregations | Typesense | Shadcn UI | Bun Tests | Playwright E2E | Overall Progress |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **F01** | Auth & Session Management | 🟢 100% | 🟢 100% | N/A | 🟢 85% | 🟢 100% | 🟢 100% | **97%** |
| **F02** | User & RBAC Management | 🟢 100% | 🟢 100% | N/A | 🟢 100% | 🟢 100% | 🟢 100% | **100%** |
| **F03** | Candidate Profile & MD-to-PDF | 🟢 100% | 🟢 100% | 🟢 100% | 🟢 100% | 🟢 100% | 🟢 100% | **100%** |
| **F04** | Candidate Blogs & Knowledge | 🟢 100% | 🟢 90% | N/A | 🟡 60% | 🟢 80% | 🔴 0% | **66%** |
| **F05** | HR Search & Video Ad Monetization | 🟢 100% | 🟢 90% | 🟢 100% | 🔴 15% | 🟢 100% | 🔴 0% | **67%** |
| **F06** | Connections & Notifications | 🟢 100% | 🟢 90% | N/A | 🟡 40% | 🟢 100% | 🔴 0% | **66%** |
| **F07** | Real-Time Chat & WebSocket | 🟢 90% | 🟢 85% | N/A | 🟡 35% | 🟢 80% | 🔴 0% | **58%** |
| **F08** | Link Shortener & Share Analytics | 🟢 85% | 🟡 60% | N/A | 🔴 20% | 🟢 100% | 🔴 0% | **52%** |
| **F09** | Forti AI Engine & Profile Chatbot | 🟡 35% | 🔴 20% | 🔴 20% | 🔴 0% | 🔴 0% | 🔴 0% | **22%** |
| **Total** | **Fortlio Platform Master** | **90%** | **82%** | **70%** | **51%** | **84%** | **33%** | **70%** |

*Legend: 🟢 Completed (>=80%) | 🟡 In Progress (30-79%) | 🔴 Pending (<30%) | N/A Not Applicable*

---

## 6. Master Feature Implementation Priority Order & Roadmap

To maximize token efficiency, eliminate rework, and respect cross-module dependency chains, features MUST be implemented in this exact sequence:

| Priority | Feature ID | Feature Name | Dependency & Architectural Rationale |
|:---:|:---|:---|:---|
| **P1** | **F01** | **Auth & Session Management** | Foundation: Establishes JWT tokens, Redis sessions, and candidate/HR identity required by all other endpoints. |
| **P2** | **F02** | **User Account & RBAC** | Identity: Manages user roles (`candidate` vs `hr`), privileges, and the video ad-watch coin counter. |
| **P3** | **F03** | **Candidate Profile & Resume (MD-to-PDF)** | Core Showcase: Builds the candidate portfolio, skills matrix, and PDF resume generator. |
| **P4** | **F04** | **Candidate Blogs & Knowledge** | Content Engine: Enables markdown publishing; acts as the primary data source feeding AI insight synthesis. |
| **P5** | **F08** | **Link Shortener & Share Analytics** | Viral Distribution: Generates trackable links for resumes & blog previews with active dwell-time beacon tracking. |
| **P6** | **F09** | **Forti AI Engine & HR Chatbot** | Intelligence: Consumes F04 blogs to synthesize learning velocity, topic diversity, and leadership qualities; powers the HR profile Q&A chatbot. |
| **P7** | **F05** | **HR Search & Monetization** | Discovery & Revenue: Recruiter candidate search querying Typesense candidate records & F09 AI insights, gated by the 2-query video ad rule. |
| **P8** | **F06** | **Connections & Notifications** | Networking: Bi-directional connection requests and notification popovers between candidates and HRs. |
| **P9** | **F07** | **Real-Time Chat & WebSocket** | Communication: Direct 1-on-1 messaging between connected candidates and recruiters over WebSockets. |

---

## 7. Testing & Quality Rules
1. **Unit & Integration Tests**:
   - Write Bun tests in `fortlio-be/__tests__/<feature>.controller.test.ts`.
   - Run via: `cd fortlio-be && bun test`.
   - Ensure all controller and service edge cases (happy path, validation errors, unauthorized access) are covered.
2. **E2E Playwright Tests**:
   - Write tests in `e2e/tests/<feature>.spec.ts`.
   - Run via: `bunx playwright test`.
3. **History Rotation**:
   - E2E test history is limited to 50 slots. Run `scripts/rotate-playwright-history.sh` after every E2E run to enforce FIFO rotation in `e2e/history/`.

---

## 8. Developer Feature Workflow & Progress Hook Guidelines
When implementing or modifying any feature:
1. **Follow Priority Sequence**: Implement features in the order defined in Section 6.
2. **Consult Feature Spec**: Read `docs/F0<X>.md` for exact endpoints, aggregation pipelines, and Shadcn UI components.
3. **Backend Implementation**:
   - Edit only `fortlio-be/src/modules/<feature>/`.
   - Prioritize `mongo.helper.ts` functions (especially `getDataWithLookupsAfterFilter`) for data fetching.
   - Run `bun test` to verify zero regressions.
4. **Frontend Revamp**:
   - Build in `fortlio-ui/src/features/<feature>/` (`components/`, `hooks/`, `api.ts`, `types.ts`).
   - Use exclusively Shadcn UI components from `@/components/ui/*`.
5. **Synchronize Progress Hooks**:
   - Update checklist items in Section 2 of `docs/F0<X>.md`.
   - Append an entry in Section 6 (`Changelog & Progress Log`) of `docs/F0<X>.md`.
   - Recalculate and update the feature's status percentage in the Main Master Progress Tracker in `GEMINI.md`.

<!-- For testing purpose
 candidate@test.com
Password: Password123!
Email: hr@test.com
Password: Password123! -->
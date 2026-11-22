# GEMINI.md - Fortlio Project Master Context

## 1. Project Overview & Mission
**Fortlio** is an all-inclusive, universal professional portfolio, recruitment discovery, and job matching platform for **anyone and everyone** across all professions, backgrounds, specialties, and education paths (engineering, design, medicine, law, finance, science, research, marketing, education, operations, and beyond) designed around two dedicated, role-specific workflows:

### A. Candidate & Professional Workflow
- **Verified Portfolio & Knowledge Showcase**: Candidates create comprehensive multi-disciplinary profiles, showcase verified domain skills, and publish markdown specialty blogs sharing deep expertise.
- **Unified Universal Editor Studio**: Single powerful Markdown editor engine operating in two modes:
  - **Resume Builder Mode**: Paginated A4 layout with print-ready page boundaries, page breaks, margins, and **mandatory backend-rendered watermark in the bottom-right corner: `By : [logo] Fortlio`**. Includes **"Help Me Write Resume"** AI copilot (STAR method, quantifiable impact, action verbs).
  - **Blog Creation Mode**: Medium-like fluid reading/writing layout with editorial typography, reading time estimation, author cards, and tags. Includes **"Help Me Write Blog"** AI writing assistant with authentic input evaluation.
  - **"Draw Your Imagination" (Canvas/Whiteboard)**: Integrated directly inside the editor across both modes to sketch system architectures, clinical pathways, legal schematics, or process flows and embed them directly into markdown.
- **AI Job Suggestions & Smart Job Search**: Candidates discover personalized job recommendations dynamically matched and ranked against their verified skills, experience, and Forti learning velocity score, with one-click applications.
- **AI Interactive Interviews**: Adaptive simulated domain interviews providing instant readiness reports.
- **Viral Distribution**: Shareable trackable short links to resumes and articles with real-time visitor count and dwell-time analytics.

### B. HR & Recruiter Workflow
- **Job Postings & Recruitment Management**: HRs create, publish, edit, and track job openings across all disciplines with requirements, salary ranges, and applicant management.
- **Candidate Discovery & Talent Engine (F05)**: Search candidate profiles across all domains using Typesense, filter by skills, experience, verified learning velocity, and leadership traits.
- **Video Ad Monetization**: Enforced 2-search quota replenished by watching a sponsored video ad (`/user/watch-ad`).
- **Interactive Profile Evaluation**: Conversational profile exploration via Forti AI Chatbot ("Chat with Candidate Profile") grounded in candidate portfolios.
- **Networking & Direct Messaging**: Bi-directional connection requests and real-time 1-on-1 chat over WebSockets.

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

### C. Unified Universal Editor, Role Views & Watermark Standards
1. **Divergent Role-Based UI Architecture**:
   - The user interface strictly bifurcates based on authenticated role (`candidate` vs `hr`):
     - **Candidate View**: Focuses on **Job Suggestions & Smart Search (`/jobs`)**, Showcase Profile, Markdown Blogs, Unified Resume Studio, and AI Interviews.
     - **HR / Recruiter View**: Focuses on **Job Postings Management (`/hr/jobs`)**, **Candidate Search & Talent Discovery (`/candidates`)**, Video Ad Monetization Quota, and Applicant Pipelines.
2. **Unified Universal Editor Engine**:
   - Both resume building and blog creation use the same core Markdown editor engine, tailored by mode:
     - **Mode `'resume'`**: Paginated A4 preview (realistic page boundaries, page margins, print pagination indicator) + **"Help Me Write Resume"** AI copilot (STAR method, action verbs, bullet metrics) + **"Draw Your Imagination"** (whiteboard architecture diagrams).
     - **Mode `'blog'`**: Medium-like fluid reading/writing preview (editorial typography, reading time, author banner) + **"Help Me Write Blog"** AI writing assistant + **"Draw Your Imagination"** (visual concept canvas).
3. **Resume PDF Export Watermark**:
   - All resumes compiled and exported via the backend Puppeteer engine (`/candidate/md-to-pdf`) MUST contain a permanent watermark in the bottom-right corner:
     `By : [logo] Fortlio` (rendered via Puppeteer footerTemplate and `@media print` CSS).

---

## 4. Master Feature Map & Documentation Index

| ID | Feature Name | Backend Module | Frontend Feature | Spec Document |
|:---:|:---|:---|:---|:---|
| **F01** | Authentication & Session Management | `fortlio-be/src/modules/auth/` | `fortlio-ui/src/features/auth/` | [`docs/F01.md`](file:///home/ashit/neo-services/docs/F01.md) |
| **F02** | User Account & RBAC (Roles & Privileges) | `fortlio-be/src/modules/user/`, `role/` | `fortlio-ui/src/features/user/` | [`docs/F02.md`](file:///home/ashit/neo-services/docs/F02.md) |
| **F03** | Candidate Profile, Resume Generator (MD-to-PDF with Watermark) & AI Resume OCR | `fortlio-be/src/modules/candidate/` | `fortlio-ui/src/features/candidate/` | [`docs/F03.md`](file:///home/ashit/neo-services/docs/F03.md) |
| **F04** | Candidate Blogs, Knowledge Showcase, Draw Your Imagination & AI Blog Improver | `fortlio-be/src/modules/candidate/` | `fortlio-ui/src/features/blogs/` | [`docs/F04.md`](file:///home/ashit/neo-services/docs/F04.md) |
| **F05** | HR Search Engine & Video Ad Monetization | `fortlio-be/src/modules/hr/` | `fortlio-ui/src/features/hr/` | [`docs/F05.md`](file:///home/ashit/neo-services/docs/F05.md) |
| **F06** | Connections & Notification System | `fortlio-be/src/modules/connection/` | `fortlio-ui/src/features/connections/`| [`docs/F06.md`](file:///home/ashit/neo-services/docs/F06.md) |
| **F07** | Real-Time & Stored Chat Messaging | `fortlio-be/src/modules/connection/` | `fortlio-ui/src/features/chat/` | [`docs/F07.md`](file:///home/ashit/neo-services/docs/F07.md) |
| **F08** | Link Shortener & Share Analytics (Resume & Blog Previews) | `fortlio-be/src/modules/link-shortener/` | `fortlio-ui/src/features/shortener/` | [`docs/F08.md`](file:///home/ashit/neo-services/docs/F08.md) |
| **F09** | Forti AI Engine (Authentic Input Evaluation, Insights, Leadership & HR Chatbot) | `fortlio-be/src/modules/forti/` | `fortlio-ui/src/features/forti/` | [`docs/F09.md`](file:///home/ashit/neo-services/docs/F09.md) |
| **F10** | AI Interactive Interviews & Domain Readiness Evaluation | `fortlio-be/src/modules/interview/` | `fortlio-ui/src/features/interview/` | [`docs/F10.md`](file:///home/ashit/neo-services/docs/F10.md) |
| **F11** | Job Board & Recruitment Engine (HR Job Postings ↔ Candidate AI Job Suggestions) | `fortlio-be/src/modules/job/` | `fortlio-ui/src/features/jobs/` | [`docs/F11.md`](file:///home/ashit/neo-services/docs/F11.md) |
| **AUDIT** | Backend Audit & Frontend Revamp Guide | Architecture & Deprecations | UI Revamp & Shadcn Setup | [`docs/AUDIT_AND_REVAMP.md`](file:///home/ashit/neo-services/docs/AUDIT_AND_REVAMP.md) |

---

## 5. Main Master Progress Tracker

> Track completion progress across all architectural layers. Keep updated after each feature milestone.

| Feature ID | Feature Description | Backend API | Mongo Aggregations | Typesense | Shadcn UI | Bun Tests | Playwright E2E | Overall Progress |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **F01** | Auth & Session Management | 🟢 100% | 🔴 20% | N/A | 🟢 90% | 🟢 100% | 🟢 100% | **82%** | ⚠️ Needs Aggregation Refactor |
| **F02** | User & RBAC Management | 🟢 100% | 🟢 95% | N/A | 🟢 95% | 🟢 100% | 🟢 100% | **98%** | 🟢 Completed |
| **F03** | Candidate Profile, MD-to-PDF & AI Resume OCR | 🟡 75% | 🔴 30% | 🟢 90% | 🟢 85% | 🟢 100% | 🟢 100% | **78%** | 🟡 Partially Complete (OCR Pending) |
| **F04** | Candidate Blogs, Draw Imagination & AI Blog Improver | 🟡 70% | 🟢 90% | N/A | 🟢 90% | 🟢 100% | 🟢 100% | **88%** | 🟡 Partially Complete (AI Improver Pending) |
| **F05** | HR Search & Video Ad Monetization | 🟢 100% | 🟢 95% | 🟢 90% | 🟢 95% | 🟢 100% | 🟢 100% | **96%** | 🟢 Completed |
| **F06** | Connections & Notifications | 🟢 100% | 🟢 95% | N/A | 🟢 100% | 🟢 100% | 🟢 100% | **99%** | 🟢 Completed |
| **F07** | Real-Time Chat & WebSocket | 🟢 100% | 🟢 95% | N/A | 🟢 95% | 🟢 100% | 🟢 100% | **98%** | 🟢 Completed |
| **F08** | Link Shortener & Share Analytics | 🟢 100% | 🟢 100% | N/A | 🟢 95% | 🟢 100% | 🟢 100% | **99%** | 🟢 Completed |
| **F09** | Forti AI Engine (Authentic Input Evaluation) | 🟢 90% | 🟢 80% | 🟢 85% | 🟢 95% | 🟢 100% | 🟢 100% | **92%** | 🟢 Completed |
| **F10** | AI Interactive Interviews & Domain Readiness | 🔴 0% | 🔴 0% | 🔴 0% | 🔴 5% | 🔴 0% | 🔴 0% | **1%** | ❌ Not Started |
| **F11** | Job Board & Recruitment Engine | 🟢 95% | 🟢 95% | N/A | 🟡 30% | 🟢 100% | 🔴 0% | **64%** | 🔧 In Progress (FE Wiring & E2E) |
| **Total** | **Fortlio Platform Master** | **87%** | **73%** | **66%** | **80%** | **91%** | **82%** | **82%** | **Platform Wide** |

*Legend: 🟢 Completed (>=80%) | 🟡 In Progress / Partially Complete (30-79%) | 🔴 Pending / Needs Action (<30%) | N/A Not Applicable*

---

## 6. Master Feature Implementation Priority Order & Roadmap

To maximize token efficiency, eliminate rework, and respect cross-module dependency chains, features MUST be implemented in this exact sequence:

| Priority | Feature ID | Feature Name | Dependency & Architectural Rationale |
|:---:|:---|:---|:---|
| **P1** | **F01** | **Auth & Session Management** | Foundation: Establishes JWT tokens, Redis sessions, and candidate/HR identity required by all other endpoints. |
| **P2** | **F02** | **User Account & RBAC** | Identity: Manages user roles (`candidate` vs `hr`), privileges, and the video ad-watch coin counter. |
| **P3** | **F03** | **Candidate Profile, Resume (MD-to-PDF with Watermark) & AI Resume OCR** | Core Showcase: Builds candidate portfolio, skills matrix, PDF resume generator with `By : logo Fortlio` watermark, and AI Resume OCR ingestion. |
| **P4** | **F04** | **Candidate Blogs, Draw Imagination & AI Blog Improver** | Content Engine: Enables markdown publishing, visual architecture drawing with interactive canvas, and AI writing refinement while tracking authentic inputs. |
| **P5** | **F08** | **Link Shortener & Share Analytics** | Viral Distribution: Generates trackable links for resumes & blog previews with active dwell-time beacon tracking. |
| **P6** | **F09** | **Forti AI Engine & HR Chatbot** | Intelligence: Consumes F04 blogs to synthesize learning velocity, topic diversity, and leadership qualities **judging candidates strictly on authentic inputs**; powers HR profile Q&A chatbot. |
| **P7** | **F05** | **HR Search & Monetization** | Discovery & Revenue: Recruiter candidate search querying Typesense candidate records & F09 AI insights, gated by the 2-query video ad rule. |
| **P8** | **F06** | **Connections & Notifications** | Networking: Bi-directional connection requests and notification popovers between candidates and HRs. |
| **P9** | **F07** | **Real-Time Chat & WebSocket** | Communication: Direct 1-on-1 messaging between connected candidates and recruiters over WebSockets. |
| **P10** | **F11** | **Job Board & Recruitment Engine** | Discovery & Career Match: Dual-sided job marketplace featuring HR Job Postings Management (`/hr/jobs`) and Candidate AI Job Suggestions (`/jobs`) dynamically matched by verified skills and Forti learning velocity. |
| **P11** | **F10** | **AI Interactive Interviews & Domain Readiness** | Career & Readiness: Adaptive simulated AI interviews across all disciplines providing candidates and HRs with detailed domain mastery and leadership scorecards. |

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
6. **Mandatory Linting Verification (Run Every Time)**:
   - At the conclusion of every feature implementation, modification, or bug fix, ALWAYS run lint on both backend and frontend:
     - Backend: `cd fortlio-be && bun run lint` (or `bun run lint:fix` to auto-fix)
     - Frontend: `cd fortlio-ui && bun run lint`
   - All lint errors and warnings must be resolved before marking the feature complete or presenting changes for review.

---

## 9. Git Commit & Version Control Rules
1. **ALWAYS ASK BEFORE COMMITTING**:
   - The agent MUST NEVER run `git commit` or create git commits autonomously or automatically without explicit prior user approval and confirmation.
   - When code is ready to commit:
     1. Stage files or inspect `git status` / `git diff`.
     2. Ensure relevant tests pass.
     3. Present the proposed commit message, summary of changes, and list of modified/added files to the USER.
     4. Explicitly ask for user confirmation before running `git commit`.
2. **Never Push Without Instruction**:
   - The agent MUST NEVER execute `git push` unless specifically and explicitly requested by the user.

<!-- For testing purpose
 candidate@test.com
Password: Password123!
Email: hr@test.com
Password: Password123! -->
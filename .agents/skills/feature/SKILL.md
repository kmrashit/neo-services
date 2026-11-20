---
name: feature
description: Guided workflow to plan, implement, test, and document a new Fortlio feature end-to-end.
---

# Feature Implementation Lifecycle (Token-Optimal Sequence)

Follow this 7-phase sequence to maximize token efficiency, prevent regressions, and eliminate rework.

## Phase 1: Specifications & Schemas / DB Models
1. Read the corresponding feature spec in `docs/F0<X>.md` and check [GEMINI.md](file:///home/ashit/neo-services/GEMINI.md).
2. Author or update Mongoose models (`models/<feature>.model.ts`) and Zod validation schemas (`<feature>.validation.ts`).
3. Author MongoDB aggregation pipelines in `<feature>.queries.ts`. (Follow the MongoDB Aggregations First rule).

## Phase 2: Core Backend Services & APIs
1. Implement business logic in `src/modules/<feature>/<feature>.service.ts`.
2. Implement request handler in `src/modules/<feature>/<feature>.controller.ts`.
3. Register routes in `<feature>.route.ts` with `AuthGuard` and validation middlewares.
4. Verify zero cross-module imports (use `core/` or `interface/` for shared contracts).

## Phase 3: Fast Unit & Integration Testing (`bun test`)
1. Author controller tests in `fortlio-be/__tests__/<feature>.controller.test.ts`.
2. Run `cd fortlio-be && bun test` to verify 100% test pass rate with zero regressions before writing frontend code.

## Phase 4: Frontend Feature Implementation with Shadcn UI
1. Create directory `fortlio-ui/src/features/<feature>/`:
   - `types.ts`: TypeScript DTOs.
   - `api.ts`: API endpoints via Axios client.
   - `hooks/`: Custom query/mutation hooks.
   - `components/`: Feature components using exclusively Shadcn UI (`@/components/ui/*`).
2. Wire routes into `fortlio-ui/src/App.tsx`.

## Phase 5: Automated Pre-Flight Code Review & Audit
1. Verify no raw unstyled `<button>` or ad-hoc custom modals exist in the UI.
2. Verify no cross-module imports in backend.
3. Verify no leaked secrets or injection vulnerabilities.

## Phase 6: E2E Playwright Verification
1. Author user journey tests in `e2e/tests/<feature>.spec.ts`.
2. Run `bunx playwright test`.
3. Rotate history via `scripts/rotate-playwright-history.sh`.

## Phase 7: Synchronize Progress Hooks
1. Check off completed deliverables in Section 2 of `docs/F0<X>.md`.
2. Append a changelog entry in Section 6 of `docs/F0<X>.md`.
3. Update the overall progress percentage for this feature in [GEMINI.md](file:///home/ashit/neo-services/GEMINI.md).

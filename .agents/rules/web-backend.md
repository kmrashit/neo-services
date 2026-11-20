---
trigger: glob
globs: "**/fortlio-be/**, **/backend/**, **/src/**/*.ts"
---

# Web Backend Architecture & Coding Rules

- **Module Isolation**: Every core feature MUST live in its own directory `fortlio-be/src/modules/<feature-name>/`.
  - Standard files per module: `controller.ts`, `service.ts`, `route.ts`, `validation.ts`, `types.ts`, `queries.ts`, `constants.ts`, `registry.ts`.
  - **NO cross-module imports**: Feature modules MUST NOT import from each other. Shared logic goes in `fortlio-be/src/core/` or `fortlio-be/src/interface/`. Cross-module communication uses BullMQ queues (e.g. `BULLMQQUEUES.FORTI_INSIGHTS_QUEUE`).
- **MongoDB Aggregations First & `mongo.helper.ts` Priority**:
  - All data fetching, joins, sorting, pagination, and projections MUST use MongoDB Aggregation Pipelines in `*.queries.ts`.
  - **Prioritize shared helpers in `fortlio-be/src/core/core-helper/mongo.helper.ts`**, specifically `getDataWithLookupsAfterFilter` for paginated queries (executes lookups after slicing to maximize performance).
  - If a more optimized or specialized aggregation pattern is needed, **create a reusable function in `mongo.helper.ts` first**, then consume it.
  - Use Mongoose models solely for basic write operations (`create`, `updateOne`, `deleteOne`).
  - Offload all transformations and computations to MongoDB. Minimize in-memory JavaScript array manipulation in Bun.
- **Deprecation Policy**:
  - **`leetcode` module**: Do NOT delete `leetcode` module files for now (the user will move them). Do NOT import from it, extend it, or add new dependencies on it.
  - Do NOT extend the legacy fall detection worker; use `initializeBullMQFortiInsightsWorker` or `initializeBullMQSendCandidateNotification` instead.
- **Error Handling**: Use `AppError` and `fmtRes` / `fmtPrntErr` consistently. Call `fmtPrntErr` only once at the controller level.
- **Testing**: Author unit and integration tests using Bun test in `fortlio-be/__tests__/<feature>.controller.test.ts`. Run with `bun test`.

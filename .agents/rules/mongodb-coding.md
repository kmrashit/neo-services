---
trigger: always_on
---

# MongoDB & Bun Coding Rules

## 1. MongoDB Query & Aggregation Standards
1. **Aggregations First**: All data retrieval, sorting, joining, filtering, pagination, and projection MUST use MongoDB Aggregation Pipelines in `*.queries.ts`.
2. **Prioritize `mongo.helper.ts` Aggregation Helpers**:
   - For all record retrieval, **PRIORITIZE** using shared aggregation helper functions in `fortlio-be/src/core/core-helper/mongo.helper.ts`:
     - `getDataWithLookupsAfterFilter`: **The primary standard for paginated list queries.** It optimizes aggregation performance by executing `$lookup` stages **after** `$match`, `$sort`, `$skip`, and `$limit` inside a `$facet`, ensuring lookups run only on the sliced page documents rather than the full collection.
     - `getDataByFilter`: For paginated filtering without relational `$lookup` stages.
     - `getDataByFilterSecondary`: For read-heavy operations routed to secondary replicas.
     - `runQueryMongoDriverSecondary`: For running raw driver aggregations on secondary nodes.
3. **Helper Extension Rule**:
   - If an operation requires a specialized or more optimized aggregation pattern, **never write ad-hoc in-memory JavaScript loops or unoptimized pipelines in controllers/services**.
   - Instead, create or extend a reusable, typed helper function in `fortlio-be/src/core/core-helper/mongo.helper.ts` first, and then consume it in `*.queries.ts`.
4. **Mongoose Scope**:
   - Use Mongoose models solely for basic write operations (`create`, `updateOne`, `deleteOne`).
5. **Offload to DB**:
   - Perform all computations, field projections, faceting, date filtering, and aggregations inside MongoDB pipelines instead of in-memory JavaScript loops in Bun.

## 2. Bun.js Optimization
1. Minimize JavaScript-level array manipulations (`.map`, `.filter`, `.reduce`) over large datasets—let MongoDB handle indexing, sorting, and transformations.
2. Use Bun's native test runner (`bun test`) for fast unit/integration testing in `fortlio-be/__tests__/`.

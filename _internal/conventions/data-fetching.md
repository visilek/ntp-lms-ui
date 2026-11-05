# Data Fetching Responsibilities

## Display components never fetch data

Display components receive data via props and emit events. Pure presentational. No knowledge of APIs or endpoints.

Note: `NtpTable` is an **exception** — it is a display component by role, but it accepts an optional loader (`loadRows`) and owns the fetch lifecycle when one is provided. See "Interactive components with internal data needs" below.

## Interactive components with internal data needs may load data via injected loader

Components receive a loader function via prop. The component defines the contract (TypeScript type). The consumer provides the implementation (factory-bound to an endpoint). Component owns *when* to call. Consumer owns *how* it's fetched.

`NtpSelect`, `NtpMultiSelect`, and `NtpTable` fall into this category.

## No component knows about API endpoints, HTTP clients, or auth

Dependency injection is the only mechanism for data access.

## Loader contract

```ts
interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}
```

The response's `page` and `pageSize` are **authoritative**. If the server clamps an out-of-range page (e.g., page 99 of a 5-page dataset returns page 1), the component syncs its internal state to the response. This may trigger a re-fetch with the corrected parameters — one extra round-trip in the clamping case. Accepted.

## Concurrency

Fetches triggered by rapid state changes (e.g., paging quickly, changing filters rapidly) can race. The pattern:

- Each fetch is assigned a `requestId` (incrementing counter).
- On response, the component checks `if (id === requestId)`. Stale responses (from superseded fetches) are discarded.
- Same for error handlers: stale errors are discarded.

Last-write-wins: the newest fetch's outcome takes precedence.

## Column callbacks

When a component supports per-column customization of sorting/filtering, the callbacks follow these principles.

### Callbacks are complete overrides

When a callback is provided, the framework invokes it and uses its result as-is. The framework does not augment, transform, or validate. **Type-default fallbacks apply only when no callback is present.**

This lets a column opt into custom behavior at any time without affecting other columns.

### The local ≡ server invariant

**Local filtering/sorting must produce the same result set as server-side filtering/sorting for the same criterion.**

Why: a component may operate in local mode (all data in memory) or server mode (one page at a time). The same user-visible filter/sort should produce the same result regardless of mode. Divergence is a bug that's invisible until the dataset crosses the page-size boundary.

### The three-party framing

The invariant has three parties. The **backend is the source of truth**; the others adopt it.

| Party | Role | Obligation |
|---|---|---|
| **Backend** | Source of truth | Define the semantics (Django lookups, collation, edge cases). Publish them. Consult when new frontend capabilities need backend support. |
| **Kit** | Adopter | Ensure local fallbacks match the backend's standard semantics. |
| **Consumer** | Adopter + customizer | Ensure custom callbacks (local + request) match the backend's semantics for their columns. |

Divergence is a frontend-side bug (or a misunderstanding of the backend's behavior). The backend is right by definition.

### One-sided callbacks

A column can provide the local callback (`sortLocally` / `filterLocally`) without the request callback (`sortRequest` / `filterRequest`), or vice versa. This causes complete/partial mode divergence. The consumer is responsible for providing both when the invariant matters.

A future dev-warn will catch this case (see `_internal/todo/table-one-sided-callbacks-warning.md`).

### The frontend never guesses backend lookup names

The frontend does not invent lookup suffixes (`__label`, `__value`) by column type. If a complex column needs a non-standard lookup, the consumer writes the request callback (`sortRequest` / `filterRequest`) to produce it explicitly. This keeps the frontend free of backend-specific knowledge.
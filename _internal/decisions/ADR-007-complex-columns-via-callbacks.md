# ADR-007: Complex columns via callbacks

**Date:** 2026-10-30
**Status:** Accepted

## Context

The LMS's API returns some table cells as JSON objects rather than scalars:

- **Enums:** `{ value: 'ACTIVE', label: 'Active' }` — the value is what the backend accepts for filtering/sorting; the label is what the user sees.
- **Relations:** `{ id: 'uuid-...', title: 'Physics 101', ... }` — the id is the backend's identifier; the title is what the user sees.

The kit's `NtpTable` was designed against scalar cells. Rendering, sorting, and filtering all assumed a `string | number` per cell. Complex cells would render as `[object Object]` and sort/filter incorrectly.

The retrofit needed a design that:
- Handles complex cells end-to-end (rendering, local filtering, local sorting, server-side filtering, server-side sorting).
- Doesn't force consumers into scoped slots for every complex column (which would defeat the point of a reusable kit).
- Doesn't invent new abstractions for hypothetical data shapes.
- Fits the project-specific nature of the kit (pre-consideration in the broader design work: the kit is a tool for this project, not a general UI framework).

## Decision

**Complex columns are handled via per-column callbacks, not types, shorthands, or framework-level abstractions.**

`TableColumn` gains five optional callbacks:

```ts
interface TableColumn {
  // ... existing props

  /** Renders the cell. Fallback: raw cell value. */
  displayMapper?: (cell: any, row: TableRow) => string | number | null | undefined

  /** Local filtering for this column (complete/fixed mode). */
  filterLocally?: (cell: any, filter: ColumnFilter, row: TableRow) => boolean

  /** Local sorting for this column (complete/fixed mode). */
  sortLocally?: (a: any, b: any, rowA: TableRow, rowB: TableRow) => number

  /** Modifies LoadRowsParams before the fetch (partial mode filtering). */
  filterRequest?: (column: TableColumn, filter: ColumnFilter, params: LoadRowsParams) => LoadRowsParams

  /** Modifies LoadRowsParams before the fetch (partial mode sorting). */
  sortRequest?: (column: TableColumn, order: SortOrder, params: LoadRowsParams) => LoadRowsParams
}
```

The callbacks are **partial contributors** to the framework's algorithms, not complete overrides:

- **`filterLocally`** is a predicate. The framework iterates rows and filters. The consumer decides per (row, filter).
- **`sortLocally`** is a comparator. The framework runs `.sort()`, applies direction (via negation on desc), guarantees stability. The consumer decides pairwise order.
- **`filterRequest` / `sortRequest`** are parameter modifiers. The framework owns the base `LoadRowsParams` construction and loader invocation. The consumer adjusts what goes into the request.

## Rationale

### Why callbacks, not a new column type

We considered introducing `type: 'complex'` or a `ComplexTableField` named type. Rejected:

- **The framework's signatures would still use `any`.** The same `displayMapper` applies to scalar columns (formatting dates, prefixing currency symbols) and complex columns. Making it `ComplexTableField` would break scalar-column usage.
- **"Complex" is not a meaningful type category.** It's a runtime shape (`typeof cell === 'object'`). Naming it would imply category-level structure that doesn't exist.
- **The retrofit doesn't need it.** Nothing in the implementation requires a shared "this is a complex cell" type. Consumers who need it can define it locally.
- **Naming types without a functional purpose is framework-thinking.** Pre-consideration 1 warns against this.

### Why no shorthands (e.g., `displayField: 'label'`)

We considered shorthand props (`displayField`, `valueField`) as syntactic sugar for simple mappers. Rejected for v1:

- **Callbacks subsume shorthands entirely.** `displayField: 'label'` is exactly `displayMapper: cell => cell.label`. Having both means two code paths, two behaviors when both provided, two dev-warnings for ambiguity — for zero expressive gain.
- **The interface is already large.** Adding two more props for convenience increases the mental model without justification.
- **If a pattern proves recurring, we add it later without breaking anyone.** No forward-commitment to speculation.

### Why `valueMapper` was dropped

We considered a `valueMapper` that extracts a scalar from a complex cell for both sorting and filtering. Rejected because:

- **The extraction is purpose-dependent.** Sorting for a relation typically sorts by `title` (what users see); filtering by `id` (what the backend accepts). Filtering an enum typically matches `label` (what users type) against `label`; the backend filter by `value`. A single extracted value can't serve both.
- **For the project's actual data shapes, the extracted value diverges.** `valueMapper` only helps for hypothetical "flattened display string" cases that aren't present.
- **`sortLocally` / `filterLocally` cover the same ground cleanly.** Consumers write two small callbacks instead of one misnomered mapper.

### Why the "user filters by what they see" principle holds

For complex cells, users have no mental access to the data shape. They see what `displayMapper` renders (`"Active"`). When they type into a filter, they expect matches against what's displayed.

`filterLocally` and `filterRequest` should therefore typically center on the field that `displayMapper` uses (usually `label` or `title`), with flexibility to also consider the underlying value (e.g., a power user typing `"ACTIVE"`).

The connection between display and filtering is not direct — `filterLocally` can be smarter than `displayMapper` — which is why they remain separate callbacks. But the *intent* is that filtering matches what the user sees.

### Why framework algorithms are preserved

The framework owns:
- The sort algorithm (`.sort()`), direction (negation), stability (`.sort()` guarantee).
- The filter iteration (looping rows and filters, AND-composing).
- The base `LoadRowsParams` construction.

The consumer's callbacks are invoked by the framework within its own algorithms. This:
- Keeps the kit small (no algorithm reimplementation per column).
- Composes naturally for v2 multi-column sorting/filtering (framework iterates multiple callbacks).
- Matches every major table library (Quasar, Vuetify, PrimeVue, TanStack) — a familiar contract for consumers.

## Backend collaboration

The `filterRequest` / `sortRequest` callbacks translate frontend filter/sort intent to backend-specific query parameters. The kit doesn't know what backend lookups exist.

**The backend will be extended with optional lookup properties** as Phase 1 of the core project is implemented. Examples:

- `status__label` — filter/sort statuses by display label.
- `status__value` — filter/sort by enum value.
- `course__title` — filter/sort course relations by title.
- `course__id` — filter/sort by relation id.

These are standard Django lookup paths (`<field>__<subfield>__<lookup>`), so adding them is a small backend change (custom filter class or view logic).

**The frontend callbacks write directly to these lookups:**

```ts
filterRequest: (col, filter, params) => ({
  ...params,
  filters: [{ field: 'status__label', mode: 'icontains', value: filter.value }],
})
```

No framework-level abstraction for lookup translation. The consumer, who knows the backend, writes the callback.

## Consequences

### Positive

- **Complex columns render, filter, and sort end-to-end.**
- **Consumers customize per column, not per table.**
- **The kit stays thin.** No `ComplexTableField`, no shorthand props, no guessing.
- **Extends naturally to v2** (multi-column sorting, interval filters) without changing the callback contracts.
- **Kit and backend co-evolve.** Adding a backend lookup is a backend change plus one frontend callback; no kit code changes.
- **Familiar contract.** Matches standard table-library comparator/predicate patterns.

### Negative

- **Consumers write callbacks per complex column.** For a table with several complex columns, that's several small callbacks. Acceptable — the boilerplate is proportional to the columns that actually need it.
- **Local and server behavior must be kept consistent by the consumer.** `filterLocally` and `filterRequest` must produce equivalent semantics. Backend `icontains` behavior is the source of truth.
- **Complex filterable/sortable columns need both local and server callbacks** for full mode coverage. Providing only one leaves the other mode unhandled.

### Dev-warn policy

When a complex cell (object or array) is encountered on a `sortable` or `filterable` column without the corresponding callback:

- **Behavior (dev and prod):** the criterion is ignored (fail-open for filtering, treated-as-equal for sorting).
- **Dev only:** a warning fires once per `apply` operation, aggregated across columns.
- **Prod:** silent — no console noise, no user-facing disruption. The criterion is honestly not applied.

Dev and prod behave identically in terms of results. Only the notification differs.

## Not included

Deferred to future versions:

- **Multi-column sorting.** The framework's `apply` will compose multiple `sortLocally` callbacks in v2. The callback signature is unchanged.
- **Interval filters (`gte`/`lte` pairs).** Will need either two `ColumnFilter` entries or an extended `ColumnFilter.value` shape. Deferred until real needs appear.
- **Boolean column type.** `ColumnFilter.value` currently excludes booleans. If boolean filters become relevant, extend the union.
- **Shorthand props (`displayField`, `valueField`).** Add only if a recurring pattern proves the ergonomic gain is real.
- **`ComplexTableField` named type.** Add only if the kit needs a shared type (e.g., for type guards).

## References

- Stage 1–6 retrofit plan (internal).
- `_internal/conventions/table.md` (documentation of callback patterns).
- Pre-consideration 1: "The kit is a tool for this project, not a general UI framework."
- `ADR-006`: Drag-and-drop reorder strategy (establishes the pattern of extracting per-concern callbacks).

## Where to place it

**`_internal/adr/ADR-007-complex-columns-via-callbacks.md`**

If the ADR folder doesn't exist yet or uses a different convention (e.g., `docs/adr/`, or a single `ADRs.md` file), adjust accordingly.

## Notes on the draft

1. **Date:** fill in with the actual decision date (today's date).

2. **Status:** "Accepted" if this is the final decision. If you want to formally accept it in a separate review, use "Proposed" and change to "Accepted" later.

3. **References section:** points to Stage plan and conventions doc. Those will exist by the end of Concern 6.5. If not yet written, note them as "to be written" or remove.

4. **The "Backend collaboration" section** is unusually specific for an ADR (mentioning Phase 1, Django lookups). That's intentional — this ADR captures the project-specific decision, which is the whole point of pre-consideration 1. If you'd prefer a more generic ADR, we can strip that section, but I think keeping it makes the ADR useful for future reference.

5. **Length:** this is a long ADR. That's fine for a decision with this much context. If you'd prefer a shorter version, the "Rationale" section could be trimmed to just the top-level claims without the sub-justifications. But the sub-justifications are the institutional memory that makes the ADR valuable when someone (including future-you) asks "why did we do it this way?"
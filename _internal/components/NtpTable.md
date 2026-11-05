# NtpTable — Conventions and Implementation Notes

Component-specific conventions for `NtpTable`, followed by implementation notes describing how the component is built. Generic conventions referenced here live in `_internal/conventions/`.

---

## Conventions

Rules specific to `NtpTable`. These refine the generic conventions as applied to this component. They should survive implementation rewrites — if the implementation changes but the behavior stays the same, these conventions still hold.

### `useTable` is the single state owner

All table state lives in `useTable`: `page`, `pageSize`, `sort`, `filters`, `selectedKeys`, `totalCount`, `isLoading`, `lastError`, plus derived `mode` and `displayedRows`.

Secondary composables (`useTableSort`, `useTableSelection`) are **pure operation helpers** — they receive state as arguments and return new values. They don't own state, don't close over external refs, and don't have lifecycle hooks.

This applies the generic "extract from the start" principle (`conventions/composables.md`) with a specific refinement: **state and operations are separated.** Operations are reusable primitives; state lives in one place.

### The component is orchestration, not a courier

`NtpTable.vue` calls `useTable` once at setup and binds its returned state/operations to the template. It does not pass state between composables or make decisions about state transitions.

**The test:** if a new concern is added, it goes inside `useTable` (as state or derived) and/or `useTableX` (as pure operations) — not as another setup-time injection into the component. The component's setup should remain a single `useTable` call plus template-binding helpers.

### Mode is derived, never declared

The table operates in fixed, complete, or partial mode. The mode is computed from `loadRows` presence and `totalCount <= pageSize`. No prop, event, or method lets the consumer declare the mode directly.

**Consequences:**
- Mode transitions happen automatically when the dataset size crosses the page-size boundary.
- A mode transition triggers a refetch (the previous response was based on the old mode's assumptions).
- The consumer cannot force a mode — they shape it indirectly via `loadRows` presence and the data they return.

### Callbacks are complete overrides

When a column provides a callback (`displayMapper`, `sortLocally`, `filterLocally`, `sortRequest`, `filterRequest`), the framework invokes it and uses its result as-is. The framework does not augment, transform, or validate the callback's output.

**Type-default fallbacks apply only when no callback is present.** This means a column can always opt into custom behavior by providing the relevant callback.

### One-sided callbacks are the consumer's responsibility

A `sortable` or `filterable` column can provide `sortLocally` without `sortRequest` (or vice versa). This causes divergence between complete and partial modes.

**The consumer is responsible for providing both when the invariant ("local ≡ server", see `conventions/data-fetching.md`) matters.** A future dev-warn will catch this case (`_internal/todo/table-one-sided-callbacks-warning.md`).

### `composables/index.ts` exports only `useTable`

The composables barrel exports the surface the component consumes — `useTable` only. `useTableSort` and `useTableSelection` are internal helpers of `useTable` and are not exported from the barrel.

Tests import them directly via relative paths, per the generic barrel convention (`conventions/imports.md`).

### `selectAllVisible` / `deselectAllVisible` compute visible keys internally

The high-level operations exposed by `useTable` for selection compute the visible keys from `displayedRows`. The template doesn't have to know about `displayedRows` and `rowKey` to trigger selection-all behavior.

`handleHeaderCheckbox(checked)` is a further wrapper: it branches to `selectAllVisible` / `deselectAllVisible` based on the checkbox state.

---

## Implementation

### Structure

```
NtpTable/
├── NtpTable.vue
├── NtpTable.css
├── NtpSortSwitcher.vue
├── NtpSortSwitcher.css
├── constants.ts
└── composables/
    ├── index.ts         (exports useTable only)
    ├── useTable.ts
    ├── useTableSort.ts
    └── useTableSelection.ts
```

### State

All state lives in `useTable`. Sections of its return:
**State refs:** `page`, `pageSize`, `sort`, `filters`, `selectedKeys`, `totalCount`, `isLoading`, `lastError`.
**Derived:** `mode` (computed), `displayedRows` (computed).
**Setters:** `setPage`, `setPageSize`, `setSort`, `setFilters`, `setSelectedKeys`.
**Operations:** `switchSort`, `toggleRow`, `selectAllVisible`, `deselectAllVisible`, `handleHeaderCheckbox`, `clearFilter`.
**State-bound template helpers:** `stateForColumn`, `ariaSortForColumn`, `isRowSelected`, `headerState`, `showSelectionWarning`.
**Imperative:** `refetch`.
**Internal to `useTable`:** `requestId` (concurrency counter), `sortEqual` / `filtersEqual` (semantic-equality helpers for prop sync).

### Mode derivation

```ts
const mode = computed<TableMode>(() => {
  if (!options.loadRows) return 'fixed'
  return totalCount.value <= pageSize.value ? 'complete' : 'partial'
})
```

Initial `totalCount` is `initialRows.length`. After the first fetch, it's the response's `totalCount`.

### Fetch lifecycle

**The fetchKey.** A computed that consolidates the fetch-triggering state:

```ts
const fetchKey = computed(() => {
  if (mode.value === 'partial') {
    return { page: page.value, pageSize: pageSize.value, sort: sort.value, filters: filters.value }
  }
  return { page: page.value, pageSize: pageSize.value }
})
```

In complete/fixed mode, sort and filters do not contribute (local pipeline handles them). In partial mode, they do. The shape difference between modes means the `watch(fetchKey)` fires on mode transitions too.

**The fetch.** `performFetch` runs on `onMounted` (if a loader is provided) and when `fetchKey` changes. It:

1. Increments `requestId` (for stale-response detection).
2. Builds `baseParams` (mode-aware: sort/filters only in partial mode).
3. Applies `applyFilterRequest` then `applySortRequest` (Concern 6.5 Stage 4).
4. Calls `loadRows(finalParams)`.
5. On success: updates `totalCount` from the response; syncs `page`/`pageSize` to the response (server-authoritative); emits `update:rows`.
6. On error: sets `lastError`, emits `load-error`.
7. Guards all response handling with `id === requestId` to discard stale responses.

**Concurrency.** Last-write-wins via `requestId`. A newer fetch's `id` supersedes the older fetch's; the older one's success and error handlers are no-ops.

### Display pipeline

`displayedRows` composes:

```ts
let result = rowsProp.value ?? initialRows
if (mode.value !== 'partial') {
  result = columnFilter.apply(result, filters.value, options.columns)
  if (sort.value) {
    result = columnSort.apply(result, sort.value, options.columns)
  }
}
// Concern 9: reorder stage will insert here.
return result
```

- **Complete/fixed:** local filter then local sort.
- **Partial:** raw rows from the response (server already filtered/sorted).

The composition uses the pure lib helpers (`useColumnFilter`, `useColumnSort`).

### Selection

- **Header checkbox state** (`headerState` computed): derived from visible keys and `selectedKeys`. Tri-state: `'unchecked'` | `'indeterminate'` | `'checked'`.
- **`isRowSelected(key)`:** `selectedKeys.value.includes(key)`.
- **`toggleRow(key)`:** add or remove `key` from `selectedKeys`.
- **`selectAllVisible()` / `deselectAllVisible()`:** compute visible keys from `displayedRows` and apply the pure helper.
- **`handleHeaderCheckbox(checked)`:** branch on `checked` to `selectAllVisible` / `deselectAllVisible`.
- **`showSelectionWarning` computed:** `mode.value === 'partial'`.

The header checkbox is `disabled` when `displayedRows.length === 0`.

### Pagination

- Rendered when `showPagination` (component-local: `loadRows !== undefined`).
- `page`, `pageSize`, `totalCount` from `useTable`.
- `@update:page` → `setPage`.
- `@update:page-size` → `setPageSize` (which resets page to 1).

The `selectionColumnWidth` component-local computed chooses between `SELECTION_COLUMN_WIDTH` and `SELECTION_COLUMN_WIDTH_WITH_WARNING` based on `showSelectionWarning`.

### Dev-warnings

**Complex cells without callbacks.** When `useColumnFilter.applyFilter` or `useColumnSort.apply` encounters an object or array cell without the corresponding callback:

- Treat as **fail-open** (filter: match everything; sort: treat as equal).
- Emit a dev-warn once per `apply` operation, naming the affected column(s).

Detection runs in both dev and prod (behavior is consistent); the warning is dev-only (via `createDevWarn`).

### Future considerations

Items to be addressed in future work. Detailed context and acceptance criteria live in `_internal/todo/` when they need their own document.

- **Multi-column sorting** (v2). The framework's `apply` will compose multiple `sortLocally` callbacks.
- **Interval filters (`gte`/`lte` pairs)** (v2). Will require either two `ColumnFilter` entries or an extended `ColumnFilter.value` shape.
- **Row virtualization** for large datasets. Would require revisiting the page-scroll model (nested scroll is currently avoided).
- **Column resizing.** Not in scope for v1.
- **Row expansion (detail rows).** Not in scope for v1.
- **One-sided callbacks warning** — noted in `_internal/todo/table-one-sided-callbacks-warning.md`.
- **`ariaSortFor` Record mapping** — noted in `_internal/todo/table-aria-sort-record-mapping.md`.
- **Additional table stories** (relation column, local filtering) — noted in `_internal/todo/table-additional-stories.md`.
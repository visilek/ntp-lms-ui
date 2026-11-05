# NtpTable

A data table component that handles rendering, sorting, filtering, pagination, and selection. The table owns its internal state (page, sort, filters, selection, mode) and, given a loader, its fetch lifecycle. Complex cells (objects like `{ value, label }` or `{ id, title }`) are supported via per-column callbacks.

## Import

```ts
import { NtpTable } from '@ntp-lms-ui/components'
import type { TableColumn, TableRow } from '@ntp-lms-ui/lib/types'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `TableColumn[]` | **required** | Column definitions |
| `rowKey` | `string` | **required** | Row identifier field |
| `rows` | `TableRow[]` | `[]` | Rows to display (v-model:rows). Seed in loader mode. |
| `loadRows` | `(params: LoadRowsParams) => Promise<PaginatedResult<TableRow>>` | — | Loader callback. Presence switches the table to loader mode. |
| `selectable` | `boolean` | `false` | Enable the checkbox column |
| `selectedKeys` | `TableRowKey[]` | `[]` | Selected row keys (v-model:selected-keys) |
| `sort` | `SortState \| null` | `null` | Current sort (v-model:sort) |
| `filters` | `ColumnFilter[]` | `[]` | Active filters (v-model:filters) |
| `page` | `number` | `1` | Current page (v-model:page). Loader mode only. |
| `pageSize` | `number` | `20` | Items per page (v-model:page-size). Loader mode only. |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Page size options passed to `NtpPagination` |
| `emptyText` | `string` | `'No data'` | Empty state text |
| `stickyHeader` | `boolean` | `true` | Sticky header row |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:rows` | `TableRow[]` | Rows changed (loader mode: emitted after each fetch) |
| `update:selectedKeys` | `TableRowKey[]` | Selection changed |
| `update:sort` | `SortState \| null` | Sort changed |
| `update:filters` | `ColumnFilter[]` | Filters changed |
| `update:page` | `number` | Page changed |
| `update:pageSize` | `number` | Page size changed |
| `load-error` | `Error` | Loader rejected |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `cell` | `{ column, row, value }` | Custom cell content. `value` is the raw cell (may be an object for complex columns). |
| `header` | `{ column }` | Custom header content. Falls back to `column.label`. |
| `empty` | — | Custom empty state. Overrides `emptyText`. |

### Exposed methods

| Method | Signature | Description |
|---|---|---|
| `refetch` | `() => Promise<void>` | Re-run the loader with the current parameters. Loader mode only. |

## Modes

The table operates in one of three modes, derived from the props it receives. The mode is never declared — it's computed from `loadRows` presence and the current response:

| Condition | Mode |
|---|---|
| No `loadRows` | **Fixed** |
| `loadRows` + `totalCount <= pageSize` | **Complete** |
| `loadRows` + `totalCount > pageSize` | **Partial** |

Mode determines where sorting and filtering happen, and what UI is shown:

| Behavior | Fixed | Complete | Partial |
|---|---|---|---|
| Sorting | Local | Local | Server (refetch) |
| Filtering | Local | Local | Server (refetch) |
| Pagination | Hidden | Shown | Shown |
| Selection warning | None | None | "'Select all' affects visible rows only" |

**Local sorting/filtering** applies on the client (fast, no network). **Server sorting/filtering** refetches via `loadRows` with the updated parameters.

Mode is re-evaluated after every fetch. If the response's `totalCount` crosses the page-size boundary (e.g., a filter reduces the result set below one page), the mode transitions automatically — and a refetch follows, because the previous response was based on the old mode's assumptions.

## Column definition

```ts
interface TableColumn {
  key: string
  label: string
  type?: 'text' | 'enum' | 'date' | 'number'
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'start' | 'center' | 'end'

  // Optional callbacks
  displayMapper?: (cell: any, row: TableRow) => string | number | null | undefined
  sortLocally?: (a: any, b: any, rowA: TableRow, rowB: TableRow) => number
  filterLocally?: (cell: any, filter: ColumnFilter, row: TableRow) => boolean
  sortRequest?: (column: TableColumn, order: SortOrder, params: LoadRowsParams) => LoadRowsParams
  filterRequest?: (column: TableColumn, filter: ColumnFilter, params: LoadRowsParams) => LoadRowsParams
}
```

### Scalar columns

For columns whose cells are scalars (`string`, `number`, `date` string), no callbacks are needed. The table's type-based defaults apply:

| `type` | Local sort | Local filter (by mode) |
|---|---|---|
| `text` (or undefined) | `localeCompare` | `icontains` → case-insensitive substring |
| `number` | numeric comparison | `exact` → strict equality |
| `date` | `Date.parse` comparison | `exact` → same day |
| `enum` | `localeCompare` (string) | `exact` → equality |

Server-side sorting and filtering pass `column.key` and `filter.value` to the backend as-is. The backend's standard lookups (`?sort=title&order=asc`, `?title__icontains=x`) handle the request.

### Complex columns

For columns whose cells are objects — enums (`{ value, label }`), relations (`{ id, title }`), or any JSON object — the defaults don't work. You must provide:

- **`displayMapper`** to render the cell (otherwise Vue renders `[object Object]`).
- **`sortLocally`** and **`filterLocally`** for local sorting/filtering (optional if the table is always in partial mode, but required for complete/fixed mode).
- **`sortRequest`** and **`filterRequest`** for server-side sorting/filtering (optional if the table is always in complete/fixed mode, but required for partial mode).

A dev-warn fires once per `apply` operation when a complex cell hits the default path without a callback.

### Callbacks are complete overrides

When a callback is provided, the framework invokes it and uses its result as-is. It doesn't augment, transform, or validate. This means:

- A `sortLocally` that returns values inconsistent with the backend's ordering will cause complete/partial mode divergence.
- A `filterLocally` that matches different rows than the server-side `filterRequest` will cause the same.

**The invariant:** local filtering/sorting must produce the same result set as server-side filtering/sorting for the same criterion. The backend is the source of truth.

### The two-sided pattern

For a complex column to work correctly in both modes, provide both the local and the request callback:

```ts
{
  key: 'status',
  label: 'Status',
  type: 'enum',
  sortable: true,
  filterable: true,

  // Render: show the label
  displayMapper: (cell) => cell.label,

  // Local: sort/filter by label
  sortLocally: (a, b) => a.label.localeCompare(b.label),
  filterLocally: (cell, filter) => {
    if (filter.mode === 'icontains') {
      return String(cell.label).toLowerCase().includes(String(filter.value).toLowerCase())
    }
    if (filter.mode === 'exact') return cell.label === filter.value
    return false
  },

  // Server: translate to `status__label` lookup
  sortRequest: (col, order, params) => ({
    ...params,
    sort: { key: 'status__label', order },
  }),
  filterRequest: (col, filter, params) => ({
    ...params,
    filters: params.filters.map((f) =>
      f.field === 'status' ? { ...f, field: 'status__label' } : f,
    ),
  }),
}
```

## Loader contract

```ts
interface LoadRowsParams {
  page: number
  pageSize: number
  sort: SortState | null
  filters: ColumnFilter[]
}

interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}
```

The loader receives the current request parameters and returns a page of items plus the total count. The response's `page` and `pageSize` are authoritative — the table syncs its internal state to them, which handles server-side clamping of out-of-range pages.

In complete/fixed mode, sort and filters are **not** sent to the loader (local pipeline handles them). In partial mode, they are.

## Usage examples

### Fixed dataset

```html
<NtpTable
  :columns="columns"
  :rows="rows"
  row-key="id"
/>
```

`rows` is the complete dataset. No pagination. Sorting and filtering (if any columns are `sortable`/`filterable`) happen locally.

### Loader mode

```html
<NtpTable
  :columns="columns"
  v-model:rows="rows"
  :load-rows="loadRows"
  row-key="id"
/>
```

```ts
async function loadRows(params: LoadRowsParams): Promise<PaginatedResult<TableRow>> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    ...(params.sort && { sort: params.sort.key, order: params.sort.order }),
    ...flattenFilters(params.filters),
  })
  const res = await fetch(`/api/sections/?${query}`)
  return res.json()
}
```

`loadRows` is called on mount and whenever `page`, `pageSize`, sort, or filters change. The response replaces `rows`.

### With selection

```html
<NtpTable
  :columns="columns"
  v-model:rows="rows"
  v-model:selected-keys="selectedIds"
  :load-rows="loadRows"
  row-key="id"
  selectable
/>
```

Selection persists across page changes. In partial mode, a warning tooltip appears next to the header checkbox: *"'Select all' affects visible rows only."*

### With sortable columns

```html
<NtpTable
  :columns="sortableColumns"
  v-model:rows="rows"
  :load-rows="loadRows"
  v-model:sort="sort"
  row-key="id"
/>
```

```ts
const sortableColumns: TableColumn[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'createdAt', label: 'Created', type: 'date', sortable: true },
]
```

Clicking a sortable header cycles `null → asc → desc → null`. In complete/fixed mode, the sort happens locally. In partial mode, a fetch fires.

### With complex columns

See [Column definition → The two-sided pattern](#the-two-sided-pattern) for the full example.

Minimal fixed-mode example:

```html
<NtpTable
  :columns="complexColumns"
  :rows="rows"
  row-key="id"
/>
```

```ts
const complexColumns: TableColumn[] = [
  { key: 'title', label: 'Title' },
  {
    key: 'status',
    label: 'Status',
    displayMapper: (cell) => cell.label,
  },
]
```

```ts
const rows = [
  { id: 1, title: 'Mechanics', status: { value: 'ACTIVE', label: 'Active' } },
  // ...
]
```

### Deep-linking page and sort

```html
<NtpTable
  :columns="columns"
  v-model:rows="rows"
  v-model:page="page"
  v-model:sort="sort"
  :load-rows="loadRows"
  row-key="id"
/>
```

```ts
// From URL query, e.g. in a router hook:
const page = ref(Number(route.query.page) || 1)
const sort = ref<SortState | null>(
  route.query.sort
    ? { key: String(route.query.sort), order: (route.query.order as 'asc' | 'desc') || 'asc' }
    : null,
)
```

The `v-model:page` and `v-model:sort` bindings are optional escape hatches. Consumers who don't need deep-linking don't bind them — the table manages them internally.

### Error handling

```html
<NtpTable
  :columns="columns"
  v-model:rows="rows"
  :load-rows="loadRows"
  row-key="id"
  @load-error="onLoadError"
/>
```

```ts
function onLoadError(error: Error) {
  // Surface via toast, redirect on 401, etc.
  showToast(error.message)
}
```

`load-error` fires when the loader rejects. The table also sets an internal error state (used by the future error banner in Concern 8). For now, the banner isn't rendered — the notification event is the only surface.

## Accessibility

- Table uses `role="table"` with proper `rowgroup`, `row`, `columnheader`, `cell` roles.
- Sortable headers are `<button>` elements inside `<th>`, supporting keyboard activation.
- `aria-sort` is set on sortable `<th>` elements (`'none'` when inactive, `'ascending'`/`'descending'` when active).
- Header checkbox has `aria-label="Select all rows on this page"`; row checkboxes have `aria-label="Select row ${key}"`.
- Sort indicator arrows are `aria-hidden` (the `aria-sort` on the header conveys the state).
# NtpTable

A data table component for structured data presentation. Dumb component — receives data via props, emits user intent. Consumer owns data fetching, sorting, filtering, and persistence.

## Import

```ts
import { NtpTable } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `TableColumn[]` | **required** | Column definitions |
| `rows` | `Record<string, any>[]` | **required** | Row data |
| `rowKey` | `string` | **required** | Unique row identifier field |
| `sort` | `{ key: string, order: 'asc' \| 'desc' } \| null` | `null` | Current sort state (controlled) |
| `selectedKeys` | `Array<string \| number>` | `[]` | Selected row keys (v-model:selected-keys) |
| `selectable` | `boolean` | `false` | Show checkbox column |
| `reorderMode` | `boolean` | `false` | Enable drag-and-drop sorting |
| `highlightedKeys` | `Array<string \| number>` | `[]` | Rows to briefly highlight (1.5s animation) |
| `loading` | `boolean` | `false` | Show loading overlay with spinner |
| `emptyText` | `string` | `'No data'` | Empty state text |
| `stickyHeader` | `boolean` | `true` | Sticky header row |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `cell` | `{ column, row, value }` | Custom cell content. Falls back to plain text. |
| `header` | `{ column }` | Custom column label content. Falls back to `column.label`. |
| `filter` | `{ column, close }` | Filter input content. Rendered for `filterable` columns. `close()` removes the filter from active set. |
| `actions` | `{ row }` | Row action buttons. Consumer renders conditionally. |
| `empty` | — | Custom empty state. Overrides `emptyText`. |
| `loading` | — | Custom loading indicator. Overrides default spinner. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:selectedKeys` | `Array<string \| number>` | Selection changed |
| `sort` | `{ key, order } \| null` | Sort requested. Cycle: `asc` → `desc` → `null`. |
| `rowClick` | `{ row, key }` | Row clicked |
| `lockOrder` | `Array<string \| number>` | User requested order persistence |
| `resetOrder` | — | User cancelled reordering |

## Column Definition

```ts
interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'start' | 'center' | 'end'
}
```

## Sort Behavior

- Click sortable column header to cycle: `asc` → `desc` → `null`.
- Arrow indicator shows current direction.
- Sort state is controlled — table emits `sort`, parent fetches sorted data.

## Filtering

- `filterable: true` on a column shows a filter toggle button in the header.
- Toggling a filter reveals the filter row below the header.
- Filter row collapses when all filters are inactive.
- The `filter` slot provides the input. Consumer owns filtering logic.
- Developer must keep `filterable` prop and `filter` slot content in sync.

## Selection

- `selectable: true` shows a checkbox column as the first column.
- Header checkbox is tri-state: all / some / none.
- Row checkboxes bound to `selectedKeys`.

## Row Actions

The `actions` slot renders per row. Consumer decides what to show based on row data.

```html
<NtpTable :columns="columns" :rows="rows" row-key="id">
  <template #actions="{ row }">
    <NtpActionMenu
      v-if="row.status === 'DRAFT'"
      :items="draftActions"
      @select="(e) => handleAction(e, row)"
    />
  </template>
</NtpTable>
```

## Reorder (Drag-and-Drop)

### Activation

Consumer sets `reorderMode = true`. Drag handles appear.

### During Drag

- Table maintains an internal `keyOrder` map.
- Rows display in `keyOrder` sequence.
- Visual reordering is immediate.
- No events emitted during drag.

### Lock

Consumer renders "Save order" button. On click, consumer calls API. Table emits `lockOrder` with current `keyOrder`.

| Outcome | Table | Consumer |
|---|---|---|
| Success | Keeps `keyOrder` until `reorderMode` turns `false` | Updates `rows`, sets `reorderMode = false` |
| Failure | Keeps `keyOrder` | Shows error. User retries or resets. |

### Reset

Consumer renders "Cancel" button. On click, consumer sets `reorderMode = false`. Table clears `keyOrder`, reverts to `rows` prop order.

### One Rule

**`reorderMode` turning `false` always clears `keyOrder`.**

## Row Highlight

- `highlightedKeys` prop accepts row keys.
- Matching rows briefly animate (1.5s color transition).
- Parent clears keys after animation.

## Usage Examples

### Basic

```html
<NtpTable
  :columns="columns"
  :rows="rows"
  row-key="id"
/>
```

### With Selection

```html
<NtpTable
  :columns="columns"
  :rows="rows"
  row-key="id"
  selectable
  v-model:selected-keys="selectedIds"
/>
```

### With Sorting

```html
<NtpTable
  :columns="columns"
  :rows="rows"
  row-key="id"
  :sort="sortState"
  @sort="onSort"
/>
```

### With Custom Cell Rendering

```html
<NtpTable :columns="columns" :rows="rows" row-key="id">
  <template #cell="{ column, row, value }">
    <NtpChip
      v-if="column.key === 'status'"
      :label="value"
      :color="statusColor(value)"
    />
    <span v-else>{{ value }}</span>
  </template>
</NtpTable>
```

### With Column Filters

```html
<NtpTable :columns="columns" :rows="rows" row-key="id">
  <template #filter="{ column, close }">
    <NtpTextInput
      v-if="column.key === 'title'"
      v-model="filters.title"
      label="Filter title"
      @update:model-value="onFilterChange"
    />
    <NtpSelect
      v-else-if="column.key === 'status'"
      v-model="filters.status"
      :load-options="loadStatuses"
      label="Filter status"
    />
  </template>
</NtpTable>
```

### With Reorder

```html
<NtpTable
  :columns="columns"
  :rows="rows"
  row-key="id"
  :reorder-mode="reorderMode"
  @lock-order="onLockOrder"
/>

<NtpButton v-if="reorderMode" @click="reorderMode = false">
  Cancel
</NtpButton>
<NtpButton v-if="reorderMode" @click="onLockOrder">
  Save order
</NtpButton>
```

## Accessibility

- Table has `role="table"` with proper `rowgroup`, `row`, `columnheader`, `cell` roles.
- Sortable headers are buttons with `aria-sort`.
- Checkbox column has `aria-label` for header ("Select all") and rows.
- Drag handles have `aria-label="Reorder"`.
- Row highlight is visual only — no semantic impact.
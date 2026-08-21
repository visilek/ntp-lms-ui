# NtpPagination

A pagination control for server-paginated views. Displays total count, page size selector, and page number navigation.

## Import

```ts
import { NtpPagination } from 'ntp-lms-ui'
```

## Data Fetching Pattern

This component is **dumb** — it receives state via props and emits change events. The parent page/widget owns server state and fetching logic. See [Data Fetching Pattern](data-fetching.md).

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | `1` | Current page (1-based) |
| `pageSize` | `number` | `20` | Items per page |
| `totalCount` | `number` | **required** | Total items |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Selectable page sizes |
| `disabled` | `boolean` | `false` | Disables all controls |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:page` | `number` | Page changed |
| `update:pageSize` | `number` | Page size changed. Parent should reset page to 1. |

## Page Number Scheme

- Previous and Next buttons.
- Numbered buttons:
  - First 2 pages: `1, 2`
  - Current page ± 1 neighbor
  - Last 2 pages
  - Gaps between disjoint ranges shown as ellipsis (`…`).

## Display

- Total count text.
- Page size selector (uses `NtpSelect` internally).
- Page number buttons.

## Edge Cases

| Case | Behavior |
|---|---|
| `totalCount === 0` | Component hidden or shows "No items" |
| `totalPages === 1` | Page number buttons hidden. Count + page size selector remain. |
| Page size change | Emits `update:pageSize`. Parent resets page to 1. |

## Usage Example

```html
<NtpPagination
  :page="page"
  :page-size="pageSize"
  :total-count="totalCount"
  @update:page="onPageChanged"
  @update:page-size="onPageSizeChanged"
/>
```

```ts
const page = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)

function onPageChanged(newPage: number) {
  page.value = newPage
  fetchData()
}

function onPageSizeChanged(newSize: number) {
  pageSize.value = newSize
  page.value = 1
  fetchData()
}
```

## Accessibility

- Page buttons have `aria-label` ("Page 3", "Previous page", "Next page").
- Current page has `aria-current="page"`.
- Page size selector has an accessible label.
# Data Fetching Pattern

## Core Principle

No component in the UI kit knows about API endpoints, HTTP clients, or auth. Data access happens through two distinct patterns:

## Category 1: Display Components — Never Fetch

Components whose sole purpose is to present data:

- `NtpTable`
- `NtpPagination`
- `NtpCard` family
- `NtpBreadcrumb`

**Rule:** Receive data via props. Emit change events. Pure presentational.

## Category 2: Interactive Components — Load via Injected Loader

Components that load their own data as part of their interaction:

- `NtpSelect` / `NtpMultiSelect` — dropdown options

**Rule:** May trigger data loading internally, but:

1. They do not know the API. No endpoints, no HTTP client, no auth.
2. They receive a loader function via prop.
3. The loader implements a contract defined by the component:

```ts
type DropdownLoader = (
  query: string,
  page: number,
  pageSize: number
) => Promise<{ items: DropdownOption[], totalCount: number }>
```

4. The component owns **when** to call (on open, on typing, debounce).
5. The consumer owns **how** it's fetched (HTTP, GraphQL, mock, localStorage).

## Dependency Injection

The component defines the interface. The consumer provides the implementation.

```ts
// Consumer: factory binds loader to real endpoint
const loadCourses = createDropdownLoader('/api/v1/curriculum-management/curriculums/')

// Usage
<NtpSelect v-model="courseId" :load-options="loadCourses" />
```

## Paginated Views

### State Owner

The page or widget is the single owner of server state for paginated views.

| State | Owner | Default |
|---|---|---|
| `filters` | Page/widget | `{}` |
| `page` | Page/widget | `1` |
| `pageSize` | Page/widget | `20` |
| `items` | Page/widget | `[]` |
| `totalCount` | Page/widget | `0` |

### Event Handling

```ts
function onFiltersChanged() {
  page.value = 1
  fetchData()
}

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

### Clamping

If `page` exceeds `totalPages` after a refetch, the page/widget clamps:

```ts
const totalPages = Math.ceil(totalCount.value / pageSize.value)
if (page.value > totalPages) {
  page.value = Math.max(totalPages, 1)
  fetchData()
}
```

## Backend Contract

All list endpoints return:

```json
{
  "items": [...],
  "totalCount": 123,
  "page": 1,
  "pageSize": 20
}
```

**Query params:** `?page=1&pageSize=20`.
Default page size: 20. Maximum: 100.
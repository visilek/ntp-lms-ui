# NtpPagination — Implementation Notes

## Page Number Window Algorithm

Given `totalPages`, `currentPage`:

1. Always include: `1`, `2`, `totalPages-1`, `totalPages`.
2. Include: `currentPage-1`, `currentPage`, `currentPage+1` (clamped to valid range).
3. Deduplicate and sort.
4. Where gaps between consecutive numbers > 1, insert ellipsis marker.

Example: `totalPages=20, currentPage=10`
→ `[1, 2, '…', 9, 10, 11, '…', 19, 20]`

## Internal NtpSelect for Page Size

- Uses `NtpSelect` with a static loader:
  ```ts
  const loadPageSizes = async () => ({
    items: pageSizeOptions.map(size => ({ value: size, label: String(size) })),
    totalCount: pageSizeOptions.length
  })
  ```
- Preload mode (totalCount ≤ limit). No search.

## Page Size Change

- Emit `update:pageSize`.
- Do **not** auto-emit `update:page`. Parent handles reset (see data-fetching pattern).
- This keeps the component dumb and predictable.

## Disabled State

- All controls disabled: page buttons, next/prev, page size selector.
- Visual: reduced opacity, not-allowed cursor.

## Edge Cases

- `totalCount === 0`: render nothing. Return `null` or `v-if` in parent.
- `totalPages === 1`: hide page number buttons. Keep count + page size selector.
- `page > totalPages`: parent responsibility to clamp. Component renders as given.
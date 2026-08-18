# NtpTable — Implementation Notes

## Structure

```
NtpTable
├── Header (sticky, optional)
│   ├── Checkbox column (if selectable)
│   ├── Column labels + sort buttons + filter toggle buttons
│   └── Filter row (if any filters active)
├── Body
│   ├── Rows (per `rows` prop or `keyOrder` override)
│   │   ├── Checkbox (if selectable)
│   │   ├── Cells (per columns)
│   │   └── Actions slot
│   └── Empty state / loading overlay
└── (no pagination — separate component)
```

## Sort State

- Sort is controlled via `sort` prop.
- Click on sortable header: compute next state (`null` → `asc` → `desc` → `null`).
- Emit `sort` with new state.
- Arrow indicator based on current state.

## Filter State

- Internal `activeFilterKeys: Set<string>`.
- Filter toggle button on filterable columns toggles membership.
- Filter row rendered when set is non-empty.
- `close()` in filter slot scope removes the key from the set.
- Filter inputs are consumer-owned — table only manages visibility.

## Selection

- `selectedKeys` prop + `update:selectedKeys` event.
- Header checkbox: checked if all selected, indeterminate if some, unchecked if none.
- Row checkbox: checked if row key in `selectedKeys`.

## Reorder

### keyOrder Map

```ts
const keyOrder = ref<Array<string | number>>([])
```

- Snapshot from `rows` when `reorderMode` turns `true`.
- Non-empty `keyOrder` overrides display order.
- Cleared when `reorderMode` turns `false`.

### Drag Mechanics

- Uses `useDragReorder` composable (or internal implementation).
- DOM manipulation during drag — no re-renders.
- Drop indicators between rows.
- On drop: update `keyOrder`.
- Display order: `keyOrder` if non-empty, else `rows` prop.

### Events

- `lockOrder`: emit current `keyOrder`.
- `resetOrder`: consumer handles by setting `reorderMode = false`.

## Row Highlight

- `use-row-highlight` composable.
- `highlightedKeys` prop watched.
- Matching rows get CSS animation class for 1.5s.
- Parent clears keys after animation.

## Loading

- `loading: true` → semi-transparent backdrop + `NtpSpinner` centered.
- Rows remain visible under backdrop.
- `loading` slot overrides default spinner.

## Sticky Header

- CSS `position: sticky; top: 0` on header row.
- Works within scrollable container.
- Disabled when `stickyHeader` is `false`.

## Future Considerations

- Row virtualization for large datasets.
- Column resizing.
- Multi-column sort.
- Async filter dropdowns.
- Row expansion (detail rows).
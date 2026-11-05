# NtpTable ariaSortFor: switch to Record mapping

**Date:** 2026-11-05
**Status:** Open
**Related:** NtpTable, useTableSort, lib/types/table
**Trigger:** Concern 6.5 audit
**Blocked by:** —
**Blocks:** —
**Effort:** small

## Context

`useTableSort.ariaSortFor` maps `SortIndicatorState` to `SortAriaValue` via a ternary:

```ts
if (order === null) return 'none'
return order === 'asc' ? 'ascending' : 'descending'
```

A `Record<SortIndicatorState, SortAriaValue>` mapping would provide compile-time exhaustiveness: if `SortIndicatorState` gains a new value, the map must be updated, and the compiler catches omission.

## Proposed Direction

```ts
const SORT_ARIA_MAP: Record<SortIndicatorState, SortAriaValue> = {
  'none': 'none',
  'asc': 'ascending',
  'desc': 'descending',
}
```

Replace the ternary with `SORT_ARIA_MAP[order ?? 'none']`.

## Acceptance Criteria

- `ariaSortFor` uses the Record mapping.
- Existing tests still pass.
- Adding a new `SortIndicatorState` value causes a compile error on the map (verified by temporarily adding a value in dev).

## Deferral Rationale

Not urgent — the current ternary works correctly. The Record mapping is a defensive improvement that pays off only if `SortIndicatorState` grows. Deferred to batch with other polish items.
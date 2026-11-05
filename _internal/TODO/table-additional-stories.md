# Additional NtpTable stories (relation column, local filtering)

**Date:** 2026-11-05
**Status:** Open
**Related:** NtpTable, NtpTable.stories.ts
**Trigger:** Concern 6.5 Stage 5 audit
**Blocked by:** Concern 7 (filter row UI)
**Blocks:** —
**Effort:** small

## Context

Two story categories are deferred:

1. **Relation column story.** `ComplexColumns` and `ComplexColumnsPartial` demonstrate an enum column (`{ value, label }`). A relation column (`{ id, title }`) behaves similarly but is a distinct complex-cell shape. A story with a relation column would demonstrate the pattern for consumers.

2. **Local filtering stories.** No UI exists yet to trigger local filtering — the filter row is Concern 7. Once the filter row exists, stories for local filtering across column types (text, enum, relation) become possible.

## Proposed Direction

After Concern 7:

- Add a relation column to `ComplexColumns` / `ComplexColumnsPartial` (or a new dedicated story).
- Add `Filterable` / `FilterablePartial` stories demonstrating local and server filtering.
- Add a `ComplexColumnsFilterable` story combining complex cells with the filter row.

## Acceptance Criteria

- Relation column renders via `displayMapper`.
- Filter row UI appears for `filterable` columns.
- Filtering works locally in fixed/complete mode; server-side in partial mode.

## Deferral Rationale

Blocked by Concern 7 (filter row UI). The relation column itself isn't blocked, but adding it alongside the filter stories keeps the "complex column demonstration" coherent.
# ADR-006: Drag-and-drop reorder strategy

**Date:** 2026-08-17
**Status:** Accepted

## Context

Drag-and-drop reordering is needed for tables (v1), and likely for lists and card grids (future). The backend has explicit `/reorder/` endpoints for multiple entities.

We evaluated three options:
- Generic `NtpReorderable` wrapper component
- Shared `useDragReorder` composable with per-component integration
- Deferring DnD entirely

## Decision

Design and implement a `useDragReorder` composable as part of the table work. Abstract the interface with future reuse in mind. After testing in the table, refactor for use in lists and cards.

No generic wrapper component at this stage.

## Rationale

- Reorder is a core domain requirement (backend `/reorder/` endpoints).
- A composable captures shared mechanics without premature abstraction.
- The table is the first concrete integration. Lists and cards will follow.
- A wrapper component is premature — we don't yet know the common patterns across all three use cases.

## Consequences

- `useDragReorder` lives in `lib/`.
- Table integrates it internally.
- Lists and cards integrate the same composable later.
- The composable must support: drag handles, pointer/touch events, keyboard accessibility, reorder events.
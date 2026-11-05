# Table one-sided callbacks warning

**Date:** 2026-11-05
**Status:** Open
**Related:** NtpTable, TableColumn, ADR-007
**Trigger:** Concern 6.5 discussion on local/server consistency
**Blocked by:** —
**Blocks:** —
**Effort:** small

## Context

A `sortable` or `filterable` column can provide `sortLocally` without `sortRequest` (or vice versa). When this happens, the two modes diverge:

- Complete mode uses the local callback; partial mode sends raw params to the backend (or vice versa).
- There is no signal to the developer that the divergence exists.

This is a real class of bug against the local ≡ server invariant (`_internal/conventions/data-fetching.md`). The consumer can silently ship a table where filtering works in complete mode but not partial mode (or vice versa), and only discovers it when the dataset crosses the page-size boundary.

## Proposed Direction

Emit a dev-warn when a `sortable` / `filterable` column has exactly one of the local/request callback pair.

Message shape:

```
[NtpTable] Column "status" has sortLocally but no sortRequest; sorting will diverge between complete and partial mode. Provide both for consistency.
```

Fire once per column, in dev mode only (via `createDevWarn`).

Where to place the check: at mount or at the first render of the header (any point where `column.sortable` / `column.filterable` and the callback pair can be inspected).

## Acceptance Criteria

- A `sortable` column with `sortLocally` only → dev-warn.
- A `sortable` column with `sortRequest` only → dev-warn.
- A `filterable` column with `filterLocally` only → dev-warn.
- A `filterable` column with `filterRequest` only → dev-warn.
- Both provided, or neither → no warning.
- Warning fires once per column, not per render.

## Deferral Rationale

Not required for v1 — the pattern is documented and the first few consumers will get it right by following the docs. The warning is a safety net for eventual inconsistency. Cheap to add later.
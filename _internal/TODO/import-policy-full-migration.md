# Full import policy migration

**Date:** 2026-11-05
**Status:** Open
**Related:** All code, package.json, `_internal/conventions/file-structure.md`
**Trigger:** Concern 6.5 discussion on sub-barrel imports
**Blocked by:** — (independent refactor)
**Blocks:** —
**Effort:** medium (mechanical migration, but touches every file)

## Context

During Concern 6.5, we adopted the sub-barrel-first import policy:

- Values → `@ntp-lms-ui/lib/utils`, `/constants`, `/composables`, `/domain-specific/*`.
- Types → `@ntp-lms-ui/lib/types`.
- Remove the root `@ntp-lms-ui/lib` barrel entirely.

New code (Concern 6.5 Stage 4 and beyond) follows this policy. Existing code (pre-6.5) still uses the root barrel. Component-internal subfolder barrels follow the "exports what the parent component consumes" rule — currently applied to `NtpTable/composables/`.

## Proposed Direction

Single migration commit:

1. Update all existing imports to sub-barrel paths.
2. Remove `lib/index.ts`.
3. Update `package.json` exports:
   - Remove `"."` from `./lib`.
   - List each sub-barrel explicitly: `./lib/types`, `./lib/utils`, `./lib/constants`, `./lib/composables`, `./lib/domain-specific/*`.
4. Introduce `index.ts` in component subfolders that need one (following the "exports what the component uses" rule).
5. Update `_internal/conventions/file-structure.md` to remove any reference to the root barrel.

## Acceptance Criteria

- No `from '@ntp-lms-ui/lib'` anywhere in `src/`, `tests/`, or `stories/`.
- `package.json` exports list all sub-barrels, no `"."`.
- All tests pass.
- Conventions doc updated.

## Deferral Rationale

Post-6.5 — this is a whole-codebase refactor, best done in a focused commit after the current concern is complete, not mixed with feature work.
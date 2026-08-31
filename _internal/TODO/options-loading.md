# Extract Shared Dropdown Options Loading

**Date:** 2026-08-30
**Status:** Open
**Related:** NtpSelect, NtpMultiSelect

## Context

Both components duplicate: open, search, load more, label resolution, debounce.

## Proposed Direction

`useDropdownOptions` composable — manages loaded/filtered options, pagination, modes.

## Deferral Rationale

Both components still stabilizing. Real usage patterns not yet known.
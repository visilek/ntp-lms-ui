# NtpMultiSelect — Implementation Notes

## Structure
Same combobox foundation as `NtpSelect`. Difference: selection model is `T[]`, options render with checkbox indicators.

## "All" Option
- Rendered only in preload mode.
- Computed state:
  - `selected.length === 0` → unchecked
  - `selected.length === options.length` → checked
  - otherwise → indeterminate
- On click:
  - unchecked/indeterminate → select all currently loaded option values
  - checked → deselect all

## Count Chip
- Closed state: renders `[N]` where N = `modelValue.length`.
- No dismiss interaction. Not customizable.
- Chip inherits input styling (surface, border radius).

## Search + Selection Interaction
- Dropdown stays open after selecting an option (unlike `NtpSelect`).
- User can continue searching and selecting multiple options.
- Search query persists while selecting — does not reset after each selection.

## Clearing
- No clear button. Clearing happens inside dropdown:
  - Deselect individual options.
  - Use "All" toggle (preload mode only).
- In async mode without "All": user must deselect each selected option manually. Is this acceptable? Potential UX concern for large selections.

## Selected Values Not in Loaded Options
- If `modelValue` contains values not present in loaded items (async mode): display count correctly, but those values may not appear checked in the list. Acceptable for v1.

## Keyboard Navigation
- Same as `NtpSelect`, but Enter toggles selection and keeps dropdown open.
- Space also toggles selection.

## Edge Cases
- Async mode, user selects 10 items from different search queries → count chip shows "10". Items from different pages both in `modelValue`.
- "All" clicked in preload mode, then data refreshes → selection persists, but "All" state re-evaluates on next open.
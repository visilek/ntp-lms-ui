# NtpMultiSelect — Implementation Notes

## State

| State | Purpose |
|---|---|
| `loadedOptions` | Accumulated available options |
| `filteredOptions` | Currently displayed in available view |
| `selectedOptions` | Cached selected options with labels |
| `lastSelectedOption` | Most recent user selection |

## Label Resolution

Reverse-search modelValue in selectedOptions → loadedOptions → `#value`.

## ensureOptionsLoaded

Batch resolution: missing values → preloaded merge → API load.

## Master Checkbox

- Visible: available mode + totalCount > 5.
- Tri-state based on visible options.
- Uses `NtpCheckbox`.

## Mode Toggle

`viewMode: 'available' | 'selected'`.

## TODO

- Label twitch on selection — see `_internal/TODO/label-transition.md`.
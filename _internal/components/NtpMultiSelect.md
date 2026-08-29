# NtpMultiSelect — Implementation Notes

## State

| State | Purpose |
|---|---|
| `allOptions` | Loaded options |
| `filteredOptions` | Currently displayed in available view |
| `selectedOptions` | Cached selected options with labels |
| `lastSelectedOption` | Most recent user selection |

## Display Label

Resolution: lastSelectedOption → reverse-search modelValue in selectedOptions → allOptions → `#value`.

## Master Checkbox

- Visible: available mode + totalCount > 5.
- Tri-state based on visible options.
- Uses `NtpCheckbox` component.

## Mode Toggle

`viewMode: 'available' | 'selected'`. Button label switches.

## Load More

Footer, available mode only. Spinner while loading.

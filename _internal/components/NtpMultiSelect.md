# NtpMultiSelect — Implementation Notes

## Structure

Same as `NtpSelect` + multi-selection logic.

## Composition

Same as `NtpSelect`.

## Data Loading

Same as `NtpSelect` (ADR-0005).

## Selection Model

- `modelValue: T[]` — array of selected values.
- Toggle: click option adds/removes from array.
- Menu stays open after selection (multi-select).

## Count Chip

- Closed state: `[N]` — number only.
- Not dismissible.
- Shown when `modelValue.length > 0`.

## "All" Option

- Shown only in preload mode AND `totalCount > 5`.
- Top of list, visually separated.
- Tri-state: none/some/all.
- Click: selects all or deselects all.

## Search

Same as `NtpSelect`. Query persists while selecting.

## Clear

- No clear button.
- Deselect via "All" or individual options.

## Events

- `update:modelValue` — new array.

## Accessibility

- `role="combobox"` + `aria-multiselectable="true"` on menu.
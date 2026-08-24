# NtpCheckboxGroup — Implementation Notes

## Structure

```
NtpInputs/
├── NtpCheckboxGroup.vue
└── NtpCheckboxGroup.css
```

## Composition

- Renders `NtpCheckbox` per option.
- Group owns selection state via `modelValue` array.
- Toggle: add/remove value from array.

## Slot

- `option` slot customizes label content only.
- Checkbox input always rendered by group.

## Direction

- `vertical`: flex column.
- `horizontal`: flex row with wrap.

## Types

Uses shared `SelectionLabelPosition` and `SelectionGroupDirection` from `lib/types/input.ts`.

## Disabled / Readonly

- Group-level props propagate to all child checkboxes.
- Individual options can be disabled via `option.disabled`.
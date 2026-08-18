# NtpCheckbox — Implementation Notes

## Native Element
Uses `<input type="checkbox">`. Indeterminate state is set via the native `indeterminate` DOM property after mount and on prop change (it cannot be set via HTML attribute).

## Edge Cases

### Indeterminate + modelValue
`indeterminate` is purely visual. It does not affect `modelValue`. The parent controls both independently:
- `allSelected = true` → checked
- `someSelected = true` → indeterminate
- `noneSelected = true` → unchecked

### readonly vs disabled
`readonly` keeps the checkbox focusable but prevents toggle. Implementation: intercept `@click.prevent` when readonly. Native `readonly` attribute does not exist on checkboxes — must be handled manually.

## Styling
- Custom checkbox appearance: hides native input visually, renders a styled box with checkmark icon.
- Focus ring uses `:focus-visible` on the hidden input, applied to the custom box via `:focus-visible + .ntp-checkbox-box`.
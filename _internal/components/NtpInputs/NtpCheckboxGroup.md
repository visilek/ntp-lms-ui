# NtpCheckboxGroup — Implementation Notes

## Structure
Renders `<fieldset>` + `<legend>` for group label. Each option renders an internal `NtpCheckbox` with `value` prop.

## v-model Logic
- Group maintains `T[]` of checked values.
- Each child checkbox's `modelValue` is computed as `modelValue.includes(option.value)`.
- On child toggle: add or remove from the array, emit new array.

## Scoped Slot
The `option` slot only customizes label content. The checkbox input is always rendered by the group. This ensures accessibility and consistent behavior.

## Direction
- `'vertical'`: `display: flex; flex-direction: column; gap: $spacing-sm`
- `'horizontal'`: `display: flex; flex-wrap: wrap; gap: $spacing-md`
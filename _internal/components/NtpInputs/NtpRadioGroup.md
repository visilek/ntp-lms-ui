# NtpRadioGroup — Implementation Notes

## Structure
Renders `<fieldset>` + `<legend>`. Each option renders an internal `NtpRadio` component. `NtpRadio` is not exported from the kit.

## v-model Logic
- Group holds `T | null`.
- Each radio's checked state is `modelValue === option.value`.
- On radio select: emit the selected value.

## Name Generation
If `name` prop is not provided, generate one using `useId()` or a module-level counter. Must be stable across re-renders.

## readonly
Radios don't support native `readonly`. Intercept click/change when readonly is true.

## Scoped Slot
Same pattern as `NtpCheckboxGroup` — slot customizes label content only.

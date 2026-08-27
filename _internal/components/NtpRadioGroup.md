# NtpRadioGroup — Implementation Notes

## Structure

```
NtpInputs/
├── NtpRadio.vue
├── NtpRadio.css
├── NtpRadioGroup.vue
└── NtpRadioGroup.css
```

## Composition

- Renders internal `NtpRadio` per option.
- `NtpRadio` is not exported — internal only.
- Group owns selection via `modelValue`.

## Name Generation

- Uses `useId()` for the radio group `name`.
- Ensures radio exclusivity.

## Slot

- `option` slot customizes label content only.
- Radio input always rendered.

## Required

- Adds `ntp-radio-group--required` class.
- CSS asterisk on legend.
- `aria-required="true"` on fieldset.
- `role="radiogroup"`.

## Dot Animation

- Unchecked → checked: dot grows via `scale(0)` → `scale(1)` with decelerated easing.
- Checked → unchecked: dot shrinks with accelerated easing.
- Border color transitions alongside.
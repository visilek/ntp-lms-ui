# NtpDateInput — Implementation Notes

## Structure

```
NtpInputs/
├── NtpDateInput.vue
└── NtpDateInput.css
```

## Rendering

- Native `<input type="date">`.
- Shares input shell via `useInputBase`.

## Native Format Hiding

- Input `opacity: 0` when empty and unfocused.
- Visible on focus or when `--has-value` class present.
- Show transition delayed — input appears after label floats.
- Hide transition immediate.

## Firefox Notes

- `::-webkit-datetime-edit` pseudo doesn't work.
- `opacity` on the whole input is the cross-browser solution.

## Required

- `ntp-input--required` class + asterisk on label + `aria-required`.

## Context Colors

Same as `NtpTextInput`.
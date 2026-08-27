# NtpDateTimeInput — Implementation Notes

## Structure

```
NtpInputs/
├── NtpDateTimeInput.vue
└── NtpDateTimeInput.css
```

## Rendering

- Native `<input type="datetime-local">`.
- Shares input shell via `useInputBase`.

## Native Format Hiding

Same pattern as `NtpDateInput`:
- Input `opacity: 0` when empty and unfocused.
- Visible on focus or `--has-value`.
- Show delayed, hide immediate.

## Step

- Default 60 seconds (1 minute).
- Passed to native `step` attribute.

## Context Colors

Same as `NtpTextInput`.

## Required

Same pattern — class + asterisk + `aria-required`.
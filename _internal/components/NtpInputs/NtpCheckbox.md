# NtpCheckbox — Implementation Notes

## Structure

```
NtpInputs/
├── NtpCheckbox.vue
└── NtpCheckbox.css
```

## Native Input

- Uses native `<input type="checkbox">`.
- Custom appearance via CSS `appearance: none`.
- Checkmark via `::after` pseudo-element.

## Indeterminate

- Cannot be set via HTML attribute.
- Set via DOM property in `watch` with `immediate: true`.

## Readonly

- No native readonly on checkboxes.
- Intercept click with `preventDefault` when readonly.

## Label Position

| Position | Layout |
|---|---|
| right | `[checkbox] Label` — compact |
| left | `Label [checkbox]` — full-width, label flex-grows |

## Edge Cases

- `indeterminate` + `modelValue` are independent.
- Disabled prevents all interaction.
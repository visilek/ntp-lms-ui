# NtpChip — Implementation Notes

## Structure

```
NtpChip/
├── NtpChip.vue
└── NtpChip.css
```

## Render Element

- `clickable: true` → `<button type="button">`.
- `clickable: false` → `<span>`.

## Local Variables Pattern

CSS uses local variables for background/border/color.

## Color Palette

| Color | Filled Background | Filled Text |
|---|---|---|
| `neutral` (default) | `color-mix(secondary 12%, white)` | `color-mix(secondary 70%, black)` |
| `primary` | `--ntp-color-primary-container` | `--ntp-color-on-primary-container` |
| `secondary` | `--ntp-color-secondary-container` | `--ntp-color-on-secondary-container` |
| `tertiary` | `--ntp-color-tertiary-container` | `--ntp-color-on-tertiary-container` |
| `error` | `--ntp-color-error-container` | `--ntp-color-on-error-container` |

## Dismiss Button

- Rendered when `dismissible: true`.
- `aria-label`: `Remove {label}` or `Remove` when label empty.
- Click emits `dismiss` — does not emit `click`.
- `@click.stop` prevents parent chip click.

## Slots

- `default`: chip content. Overrides `label` prop.
- `leading`: content before label.
- `trailing`: content after label. Hidden when `dismissible` also present? No — trailing renders, dismiss button after.

## Edge Cases

- `label` empty and no slot → empty chip. Consumer error, no crash.
- `dismissible` + `clickable` → dismiss click stops propagation.
- `disabled` → all interactions blocked.
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

CSS uses local variables:

| Variable | Purpose |
|---|---|
| `--_chip-bg` | Background (tonal surface for filled, transparent for outlined) |
| `--_chip-border` | Border color (outlined only) |
| `--_chip-color` | Text color |
| `--_chip-base` | Solid base color — used by dismiss button hover |
| `--_chip-on` | On-color — text on solid base |

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

### Dismiss Button Hover

- Transparent at rest — merges with chip background.
- On hover: solid circle in `--_chip-base` color, `--_chip-on` text, `brightness(1.16)`.
- Matches the regular filled button hover appearance.

## Clickable Hover

| Variant | Hover Effect |
|---|---|
| `filled` | `background-color: color-mix(in srgb, var(--_chip-base) 25%, white)` — more pronounced than resting |
| `outlined` | `background-color: color-mix(in srgb, var(--_chip-base) 15%, transparent)` — semi-transparent tint |

## Slots

- `default`: chip content. Overrides `label` prop.
- `leading`: content before label.
- `trailing`: content after label. Dismiss button renders after.

## Edge Cases

- `label` empty and no slot → empty chip. Consumer error, no crash.
- `dismissible` + `clickable` → dismiss click stops propagation.
- `disabled` → all interactions blocked.
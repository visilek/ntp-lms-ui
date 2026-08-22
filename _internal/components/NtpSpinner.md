# NtpSpinner — Implementation Notes

## Structure

```
NtpSpinner/
├── NtpSpinner.vue
└── NtpSpinner.css
```

## Rendering

- SVG-based circular indicator.
- Two circles: track (background) + head (animated arc).
- Animations: rotation + stroke-dasharray.

## Sizes

| Size | Dimensions |
|---|---|
| `small` | 24px |
| `medium` | 40px |
| `large` | 56px |

## Colors

| Color | Head Stroke |
|---|---|
| `primary` | `--ntp-color-primary` |
| `on-surface-variant` | `--ntp-color-on-surface-variant` |
| `surface` | white |

Track stroke: `--ntp-color-surface-container-high`.

## Accessibility

- `role="progressbar"`.
- `aria-busy="true"`.
- SVG is `aria-hidden="true"` — the role communicates state.

## Future

- `prefers-reduced-motion` handling.
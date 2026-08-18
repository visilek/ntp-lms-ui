# NtpSpinner — Implementation Notes

## Rendering

- MD3 circular progress indicator (indeterminate).
- SVG or CSS-based. MD3 uses SVG with animated stroke-dasharray.

## Sizes

| Size | Diameter |
|---|---|
| `small` | 24dp |
| `medium` | 40dp |
| `large` | 56dp |

Exact values resolved in `tokens/`.

## Colors

| Color | Stroke |
|---|---|
| `primary` | `$color-primary` |
| `on-surface-variant` | `$color-on-surface-variant` |
| `surface` | white |

## Animation

- Continuous rotation + stroke-dasharray expansion/contraction.
- Duration: ~1.5s per full cycle.
- `prefers-reduced-motion` media query should pause or slow animation.

## Usage in Loading States

- `NtpTable` loading overlay.
- `NtpButton` loading (replaces content).
- `NtpSelect` / `NtpMultiSelect` loading overlay.
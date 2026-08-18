# NtpButton — Implementation Notes

## Color Palette

| Color | Background (filled) | Text (filled) | Border (outlined) | Text (outlined/text) |
|---|---|---|---|---|
| `primary` | `$color-primary` | `$color-on-primary` | `$color-primary` | `$color-primary` |
| `secondary` | `$color-secondary` | `$color-on-secondary` | `$color-secondary` | `$color-secondary` |
| `error` | `$color-error` | `$color-on-error` | `$color-error` | `$color-error` |
| `on-surface-variant` | `$color-on-surface-variant` | `$color-surface` | `$color-on-surface-variant` | `$color-on-surface-variant` |
| `surface` | `rgba(255,255,255,0.9)` | `$color-on-surface` | `rgba(255,255,255,0.7)` | `white` |

Exact token values resolved in `tokens/`.

## Edge Cases

### Loading state preserves width
On `loading` transition to `true`, measure button width before swapping content to spinner. Apply `min-width` and `min-height` inline.

### iconOnly without ariaLabel
Dev-mode `console.warn` if `iconOnly` is `true` and both `ariaLabel` and `ariaLabelledby` are empty.

### `surface` color
- Designed for use over images or color fills.
- White icon/text with subtle dark scrim background (semi-transparent) for contrast.
- Not intended for use on plain light surfaces — contrast is insufficient.

## Variant Implementation

All variants share padding, font, border-radius. Differ in:
- `background-color`
- `border-color`
- `color`

Hover/focus: semi-transparent overlay via `::after` with current color at 8-12% opacity.

## Future Considerations

- `href` prop: render `<a>` for link buttons.
- Button group component: horizontal grouping with connected borders.
# NtpCard — Implementation Notes

## Render Element

- `clickable: true` → `<button type="button">`
- `clickable: false` → `<div>`

## Variants

| Variant | CSS |
|---|---|
| `elevated` | `box-shadow: $elevation-1` |
| `elevated` + `clickable` hover | `box-shadow: $elevation-2` |
| `filled` | `background: $color-surface-container-highest` |
| `outlined` | `border: 1px solid $color-outline` |

## Border Radius

- MD3 card shape: 12dp radius (token `$shape-medium`).

## No Internal Padding

Card applies **no padding**. Consumers use spacing utilities. This is intentional — edge-to-edge media is the default case, not an exception.

## Future Considerations

- Draggable cards.
- Card with `href` for navigation.
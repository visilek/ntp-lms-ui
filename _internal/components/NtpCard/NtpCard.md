# NtpCard — Implementation Notes

## Structure

```
NtpCard/
├── NtpCard.vue
├── NtpCard.css
├── NtpCardHeader.vue
├── NtpCardHeader.css
└── index.ts
```

## Variants

| Variant | CSS |
|---|---|
| `elevated` | `box-shadow: var(--ntp-elevation-1)` |
| `filled` | `background: var(--ntp-color-surface-container-highest)` |
| `outlined` | `border: 1px solid var(--ntp-color-outline)` |

## Color Override

Color classes set `background-color` + `color` (the `on-*` token). Variant effects remain.

## Overflow

`overflow: hidden` — clips media to rounded corners.

## No Internal Padding

Consumers apply spacing utilities. Cards are bare containers.

## clickable

- Renders `role="button"` + `tabindex="0"`.
- Elevated: hover raises elevation.
- Filled/Outlined: hover darkens background.

## Future

- Tonal elevation — see `_internal/TODO/card-tonal-elevation.md`.
- Layout system — see `_internal/TODO/layout-system.md`.

# NtpCardHeader — Implementation Notes

## Structure

Flex row: avatar (fixed 40px) + text block (flex-grow) + action slot (fixed).

## Color Inheritance

- Title: `color: inherit`.
- Subtitle: `color: inherit; opacity: 0.75`.
- Overlay modes override with white.

## Overlay Modes

| Mode | Background |
|---|---|
| `scrim` | `linear-gradient(to top, rgba(0,0,0,0.6), transparent)` |
| `solid` | `rgba(0,0,0,0.5)` |

Overlay adds `padding: var(--ntp-spacing-4)`.

## Slot Overrides

`title`, `subtitle`, `avatar` slots override props.
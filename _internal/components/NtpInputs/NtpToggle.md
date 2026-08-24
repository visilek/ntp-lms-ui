# NtpToggle — Implementation Notes

## Structure

```
NtpInputs/
├── NtpToggle.vue
└── NtpToggle.css
```

## Rendering

- Hidden native input (`position: absolute; opacity: 0`).
- Visual track + thumb as separate spans.
- Transitions on track and thumb.

## MD3 Dimensions

| Element | Value |
|---|---|
| Track | 52×32px |
| Thumb (unselected) | 16×16px, left 6px |
| Thumb (selected) | 24×24px, left 20px |

## Label Position

| Position | Layout |
|---|---|
| left (default) | `Label [switch]` |
| right | `[switch] Label` — full-width |

## Readonly

No native readonly on checkboxes. Intercept click with `preventDefault`.

## Transitions

- Track: background-color, border-color.
- Thumb: left, width, height, background-color.
- Uses decelerated easing for thumb movement.
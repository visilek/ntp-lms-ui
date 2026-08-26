# NtpAppBar — Implementation Notes

## Structure

```
NtpAppBar/
├── NtpAppBar.vue
└── NtpAppBar.css
```

## Heights

| Height | Layout |
|---|---|
| `small` | Single row — all regions vertically centered |
| `medium` / `large` | Two zones — leading/actions top, title bottom |

## Slots

- `leading`: content-sized.
- `default`: title area, flex-grow. Overrides title/subtitle props.
- `actions`: content-sized, right-aligned.

## Typography

| Height | Title |
|---|---|
| small | title-large |
| medium | headline-small |
| large | headline-medium |
# NtpAppBar — Implementation Notes

## Structure

```
<header class="ntp-app-bar">
  [leading slot — optional]
  [default slot OR title + subtitle]
  [actions slot — optional]
</header>
```

Flex row. Leading and actions content-sized. Title area flex-grow.

## Height Presets

| Height | Min Height | Typography | Layout |
|---|---|---|---|
| `small` | 64dp | Title large | Single row. Grows with content. |
| `medium` | 112dp | Headline small | Two zones. Title bottom-anchored. |
| `large` | 152dp | Headline medium | Two zones. |

Two-zone layout: leading/actions aligned top, title block aligned bottom via `align-self: flex-end`.

## Title Area

- Default: `title` prop + `subtitle` prop.
- Default slot overrides both.
- Subtitle rendered below title when provided.

## Future

- `scrollable` prop: scroll listener toggles transparent background. Deferred.

## Accessibility

- Renders `<header>` element.
- Leading/actions content must provide accessible labels.
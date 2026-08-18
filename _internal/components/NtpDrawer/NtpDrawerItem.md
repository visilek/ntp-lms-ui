# NtpDrawerItem — Implementation Notes

## Internal Component

Not exported from the kit. Used only by `NtpDrawer`.

## Rendering

- Renders `RouterLink` when `to` provided.
- Disabled → not clickable. Still rendered.

## Structure (Expanded Mode)

```
[icon] [label]                    [badge] [trailing slot]
```

## Structure (Rail Mode)

```
        [badge overlay on icon]
        [icon]
        [railLabel or label]
```

## Badge

- Expanded: in flow, trailing position.
- Rail: absolutely positioned on icon's top-right.

## Nested Items

- Recursive? No — single level only.
- Nested items render as their own `NtpDrawerItem` instances with indentation.
- Nested items don't use `railLabel`.

## Active State

- RouterLink active class applied to parent item.
- Active parent shows nested items (CSS-driven).

## Edge Cases

- `railLabel` empty → falls back to `label`.
- `badge` empty → no badge.
- `to` missing → dev warning.
- `disabled` → no navigation, no active state.
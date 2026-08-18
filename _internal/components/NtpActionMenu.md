# NtpActionMenu — Implementation Notes

## Composition

```
NtpActionMenu
├── NtpButton (trigger)
│   ├── iconOnly by default, ellipsis icon
│   └── Custom trigger via `trigger` slot
└── NtpMenu (popup)
    ├── Data-driven: `items` prop
    └── Custom: `default` slot or `item` scoped slot
```

## Internal State

- `isOpen: boolean` — managed internally.
- On trigger click: toggle `isOpen`.
- On `select` from menu: emit `select`, set `isOpen = false`.
- On `close` from menu (outside click, Escape): set `isOpen = false`, emit `close`.

## Trigger Button

- Default: `NtpButton` with `iconOnly`, `variant="text"`, `color="on-surface-variant"`, ellipsis icon (`more_vert`).
- `aria-label`: `label` prop if non-empty, else `'More actions'`.
- `aria-haspopup="menu"`, `aria-expanded` bound to `isOpen`.

## Menu

- Anchor: trigger button element (via `ref`).
- `placement` passed through to `NtpMenu`.
- `items` passed through.
- `open` bound to `isOpen`.

## Edge Cases

- `disabled` on trigger → menu cannot open. If open and `disabled` becomes `true`, close menu.
- `items` empty and no `default` slot → render trigger with empty menu? For v1: trigger still renders, menu opens empty. Parent should not do this.
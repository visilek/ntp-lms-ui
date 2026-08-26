# NtpActionMenu — Implementation Notes

## Structure

```
NtpActionMenu/
├── NtpActionMenu.vue
└── NtpActionMenu.css
```

## Composition

- `NtpButton` (trigger, icon-only).
- `NtpMenu` (popup).
- Anchor: button component instance — menu resolves `$el`.

## Behavior

- Toggle open/close on trigger click.
- Auto-close on select.
- Disabled: trigger disabled, menu never opens.

## Trigger

- Hardcoded icon-only.
- `ariaLabel` prop or default "More actions".
- `trigger` slot overrides content.
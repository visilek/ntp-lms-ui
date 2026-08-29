# NtpActionMenu — Implementation Notes

## Composition

- `NtpButton` (trigger, icon-only).
- `NtpMenu` (popup).
- Anchor: button component instance → menu resolves `$el`.

## Behavior

- Toggle open/close on trigger click.
- Auto-close on select.
- `select` emits `MenuItem` directly.

## Trigger

- Hardcoded icon-only.
- `ariaLabel` or default "More actions".
- `trigger` slot overrides.
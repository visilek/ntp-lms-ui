# NtpMenu — Implementation Notes

## Teleport

Renders in `<Teleport to="body">`. Prevents clipping by `overflow: hidden` containers.

## Positioning

- Compute position based on `anchor` bounding rect and `placement`.
- Use `position: fixed` with calculated top/left.
- Recompute on window resize / scroll while open.
- For v1: no auto-flipping. Consumer chooses `placement`.

## Focus Management

- On open: store `document.activeElement` (the anchor). Focus first non-disabled item or header slot content.
- On close: restore focus to stored anchor.
- Tab: close menu, let browser handle focus naturally.

## Outside Click

- Listen for `mousedown` on document while open.
- If click target is outside the menu and outside the anchor → emit `close`.
- Anchor clicks are handled by the parent (e.g., NtpActionMenu toggles).

## Item Rendering

Default item structure:

```html
<button class="ntp-menu-item" role="menuitem">
  [leading icon]
  [label]
</button>
```

- `danger`: adds error color class.
- `disabled`: `disabled` attribute + `aria-disabled`.

## Header Slot

- Rendered above items, below the menu's top border-radius.
- No divider by default. Consumer can add one.

## Future Considerations

- Auto-flipping when near viewport edges.
- Submenus (nested menus).
- Width constraints (`minWidth`, `maxWidth` props).
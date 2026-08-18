# NtpDialog — Implementation Notes

## Teleport

Renders in `<Teleport to="body">`.

## Focus Management

- On open: store `document.activeElement`. Focus first focusable element in dialog.
- Focus trap: on Tab, cycle within dialog.
- On close: restore focus to stored element.

## Scroll Lock

- On open: `overflow: hidden` on `document.body`.
- On close: remove.

## Responsive Fullscreen

- Track `isFullscreen` ref.
- Compute: `fullscreenProp || viewportWidth < width + 32`.
- Listen to `window.resize` while open.
- Provide `isFullscreen` via injection key (`Symbol`).

## Close Button

### Standard Mode
- Rendered by dialog when `showClose` is `true` and `!isFullscreen`.
- Positioned top-right.
- `close` slot overrides default × button.
- Click → emit `update:open` with `false`.

### Fullscreen Mode
- Not rendered by dialog.
- `NtpDialogHeader` renders its own close button.

## Backdrop

- Semi-transparent scrim.
- Click: if not `persistent`, emit `update:open` with `false`.

## Escape

- Keydown listener while open.
- Escape: if not `persistent`, emit `update:open` with `false`.

## Transition

- Fade + slight scale.
- `opened` / `closed` events after transition.

## Edge Cases

- Multiple dialogs: hierarchical injection ensures correct fullscreen state.
- `persistent` + `fullscreen`: close button in header still works if consumer wires it.
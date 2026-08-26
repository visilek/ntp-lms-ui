# NtpDialog — Implementation Notes

## Structure

```
NtpDialog/
├── NtpDialog.vue
├── NtpDialog.css
├── NtpDialogHeader.vue
├── NtpDialogHeader.css
└── index.ts
```

## Rendering

- Teleports to body.
- Backdrop = the dialog root element (full-screen div with rgba background).
- Surface inside, centered.

## Fullscreen

- Prop `fullscreen` OR viewport < `width + 32px`.
- Tracked via `isFullscreen` ref.
- Provided to children via `inject` key (`Symbol`).
- Re-evaluated on window resize.

## Focus Management

- Stores `document.activeElement` on open.
- Focuses dialog root on open.
- Tab cycles within focusable elements.
- Restores focus on close.

## Scroll Lock

- `document.body.style.overflow = 'hidden'` on open.
- Removed on close.

## Close Button

- Standard mode only — hidden in fullscreen.
- `showClose` prop controls visibility.
- `close` slot overrides default × button.

## Persistent

- Disables Escape + backdrop close.
- Close button still functional (consumer controls).

## Edge Cases

- Multiple dialogs: injection key is per-dialog — no collision.
# NtpDialogHeader — Implementation Notes

## Modes

### Standard
- Centered column: icon (optional), title, subtitle.
- No close button — dialog owns it.

### Fullscreen
- Renders `NtpAppBar` internally.
- `leading`: close button (default × or `close` slot).
- `default`: title area (slot or `fullscreenTitle`/`title`).
- `actions`: `fullscreenActions` slot.

## Fullscreen State Resolution

```ts
const injectedFullscreen = inject<Ref<boolean> | null>(fullscreenKey, null)

const isFullscreen = computed(() => {
  if (fullscreen !== null) return fullscreen
  return injectedFullscreen?.value ?? false
})
```

Priority: prop > injected > false.

## Icon

- Standard mode only.
- Decorative — `aria-hidden`.
- Dropped in fullscreen.

## Main Content Override

- `default` slot overrides the entire title area.
- Standard: replaces icon + title + subtitle.
- Fullscreen: passed to `NtpAppBar` default slot.

## Close Button

- Fullscreen mode only (standard mode handled by dialog).
- `showClose` prop.
- `close` slot.
- Emits `close` — consumer closes dialog.
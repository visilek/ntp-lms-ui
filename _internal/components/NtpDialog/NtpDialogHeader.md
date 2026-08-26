# NtpDialogHeader — Implementation Notes

## Modes

### Standard
- Centered or left-aligned depending on icon.
- No close button — dialog owns it.

### Fullscreen
- Renders `NtpAppBar` internally.
- `leading`: close button (default × or `close` slot).
- `default`: title area (slot or `fullscreenTitle`/`title`).
- `actions`: `fullscreenActions` slot.

## Standard Alignment

| Icon | Classes |
|---|---|
| No icon | `.ntp-dialog-header` — left-aligned |
| With icon | `.ntp-dialog-header--with-icon` — centered |

Computed in script:

```ts
const headerClasses = computed(() => [
  'ntp-dialog-header',
  {
    'ntp-dialog-header--with-icon': !!icon,
  },
])
```

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
- Default `''` — no icon.

## Main Content Override

- `default` slot overrides the entire title area.
- Standard: replaces icon + title + subtitle.
- Fullscreen: passed to `NtpAppBar` default slot.

## Close Button

- Fullscreen mode only.
- `showClose` prop.
- `close` slot.
- Emits `close` — consumer closes dialog.

## Padding

Standard header: `spacing-4` horizontal — aligns with body content.
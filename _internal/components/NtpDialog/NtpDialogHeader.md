# NtpDialogHeader — Implementation Notes

## Layout Modes

### Standard Mode
- Centered column: icon (if provided), title, subtitle — OR default slot content.
- No close button rendered.
- Icon decorative (`aria-hidden="true"`).

### Fullscreen Mode
- Renders `NtpAppBar` internally.
- Mapping:
  - `leading` → close button (from `close` slot or default ×)
  - `default` → consumer's default slot content, OR `fullscreenTitle`/`title` + `subtitle`
  - `actions` → `actions` slot
- Icon not rendered.

## Main Content Override

- Default slot overrides icon + title + subtitle.
- Standard mode: slot content replaces main block.
- Fullscreen mode: slot content passed to `NtpAppBar`'s default slot.

## Fullscreen State Resolution

```ts
const injected = inject<Ref<boolean>>(fullscreenKey, null)
const isFullscreen = computed(() =>
  props.fullscreen !== null ? props.fullscreen : injected?.value ?? false
)
```

## Close Button (Fullscreen Mode Only)

- Default: `NtpButton` icon-only with × icon, `aria-label="Close"`.
- `close` slot overrides.
- Always rendered in fullscreen mode.
- Emits `close` event. Parent dialog or consumer handles.

## Edge Cases

- No props, no default slot → renders only close button (fullscreen mode).
- Standalone use (outside `NtpDialog`) → `fullscreen` prop controls layout.
- Icon + fullscreen → icon ignored.
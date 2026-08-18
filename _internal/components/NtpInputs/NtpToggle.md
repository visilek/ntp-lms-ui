# NtpToggle — Implementation Notes

## Native Element
Uses `<input type="checkbox" role="switch">`. The `role="switch"` is critical for screen reader semantics — it communicates on/off state rather than checked/unchecked.

## readonly
Same as checkbox: no native readonly. Intercept interaction when readonly is true.

## Styling
- Visually hides the native checkbox.
- Renders a track (rounded rectangle) and a thumb (circle).
- Track color changes based on checked state.
- Thumb translates horizontally on state change.
- Transition: `transform $duration-short $easing-standard` on thumb, `background-color` on track.

## Accessibility
- `aria-checked` is handled natively by the checkbox.
- Ensure the thumb has sufficient contrast against the track in both states.
- Focus ring visible via `:focus-visible`.
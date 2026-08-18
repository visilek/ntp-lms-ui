# NtpChip — Implementation Notes

## Render Element

- `clickable: true` → `<button type="button">`
- `clickable: false` → `<span>`

## Visual Approach (MD3 Tonal Surface)

### Filled Variant

```scss
background: color-mix(in srgb, var(--ntp-color-{color}) 10%, transparent);
color: color-mix(in srgb, var(--ntp-color-{color}) 70%, black);
```

### Outlined Variant

```scss
background: transparent;
border: 1px solid color-mix(in srgb, var(--ntp-color-{color}) 50%, transparent);
color: color-mix(in srgb, var(--ntp-color-{color}) 70%, black);
```

Exact token values resolved in `tokens/`. The `color-mix()` approach avoids pre-computing tinted tokens for every color variant.

## Dismissible Button

- × button rendered as `<button type="button" class="ntp-chip-dismiss">`.
- `aria-label`: `Remove {label}` or `Remove` when label is empty.
- Clicking × emits `dismiss`. Does not emit `click`.
- × button has `disabled` state when chip is `disabled`.

## Slots Composition

```
[leading] [default content | label] [trailing] [× if dismissible]
```

## Edge Cases

- `label` empty and no default slot → render nothing? Or empty chip? For v1: render empty chip (consumers shouldn't do this, but don't crash).
- `dismissible` + `clickable` both true → × click must not trigger `click`. Stop propagation.
- `disabled` + `clickable` → no hover/focus, no `click`.
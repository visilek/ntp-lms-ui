# NtpButton — Implementation Notes

## Structure

```
NtpButton/
├── NtpButton.vue
└── NtpButton.css
```

## Local Variables Pattern

CSS uses local variables per the styling convention:

```css
.ntp-button {
  --_btn-bg: transparent;
  --_btn-border: transparent;
  --_btn-color: var(--ntp-color-on-surface);
  --_btn-hover-bg: transparent;
  /* ... */
}
```

Color classes set the variables. Variant classes define how they're used.

## Color Palette

| Color | Background (filled) | Text (filled) | Text (outlined/text) |
|---|---|---|---|
| `primary` | `--ntp-color-primary` | `--ntp-color-on-primary` | `--ntp-color-primary` |
| `secondary` | `--ntp-color-secondary` | `--ntp-color-on-secondary` | `--ntp-color-secondary` |
| `tertiary` | `--ntp-color-tertiary` | `--ntp-color-on-tertiary` | `--ntp-color-tertiary` |
| `error` | `--ntp-color-error` | `--ntp-color-on-error` | `--ntp-color-error` |
| `on-surface-variant` | `--ntp-color-on-surface-variant` | `--ntp-color-surface` | `--ntp-color-on-surface-variant` |
| `surface` | `rgba(255,255,255,0.9)` | `--ntp-color-on-surface` | white |

## Variant Behavior

| Variant | Background | Border | Text |
|---|---|---|---|
| `filled` | `--_btn-bg` | transparent | `--_btn-color` |
| `outlined` | transparent | `--_btn-color` | `--_btn-color` |
| `text` | transparent | transparent | `--_btn-color` |

## Hover

| Variant | Styling |
| --- | --- |
|`filled` | `filter: brightness(1.16)` |
| `outlined` / `text`| `background-color: var(--_btn-hover-bg)` |

### Surface Hover

| Variant | Styling |
| --- | --- |
| `filled` | background becomes more transparent (reveals underlying content) |
| `outlined`/`text` | dark text & outline + translucent fill |

## Focus

`outline: 2px solid var(--_btn-color)` — adapts to the button's color.

## Loading State

- Replaces content with spinner.
- `aria-busy="true"`.
- `pointer-events: none`.
- Width preserved — spinner is centered in the same button box.

## Pressed State

```css
.ntp-button:active:not(.ntp-button--disabled):not(.ntp-button--loading):not(.ntp-button--icon-only) {
  border-radius: var(--ntp-shape-medium);
}

.ntp-button--icon-only:active:not(.ntp-button--disabled):not(.ntp-button--loading) {
  transform: scale(0.92);
}
```

## Edge Cases

- `iconOnly` + no `ariaLabel`/`ariaLabelledby` → accessibility gap. Consumer responsibility. Dev warning if needed later.
- `disabled` + `loading` both true → loading visual wins (spinner shown, muted).
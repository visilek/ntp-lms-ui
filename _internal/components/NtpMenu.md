# NtpMenu — Implementation Notes

## Structure

```
NtpMenu/
├── NtpMenu.vue
└── NtpMenu.css
```

## Positioning

- Pure utility: `lib/positioning.ts` — `computePosition()`.
- Component internal: `computeMenuPosition()` — measures DOM + calls utility.
- CSS: `position: fixed; top: 0; left: 0; visibility: hidden` initially.
- `--positioned` class reveals after measurement.
- Clamps to viewport (8px margin).

## Anchor Resolution

Accepts `HTMLElement` or component instance (`$el`).

## Visibility Pattern

Hidden render → measure → position → reveal. Avoids first-open timing race.

## Scroll

`window.addEventListener('scroll', handler, true)` — capture catches nested scrolls.

## Selected State

- `MenuItem.selected` → `ntp-menu__item--selected`.
- Background: `var(--ntp-color-selected-container)`.
- Hover: `var(--ntp-color-selected-container-hover)`.

## Shape

- Container: 16px radius (`--ntp-shape-large`).
- `overflow: hidden` clips item backgrounds.

## Min Width

- Prop `minWidth`, default `'112px'`.
- Consumer passes input width for dropdowns.


# NtpMenu — Implementation Notes

## Structure

```
NtpMenu/
├── NtpMenu.vue
└── NtpMenu.css
```

## Positioning

- CSS base: `position: fixed; top: 0; left: 0; visibility: hidden`.
- JS sets `top`/`left` after measurement.
- `--positioned` class reveals.
- Clamps to viewport with 8px margin.

## Anchor Resolution

Accepts `HTMLElement` or component instance (`$el`).

## Visibility Pattern

Hidden render → measure → position → reveal. Avoids first-open timing race.

## Scroll Handling

`window.addEventListener('scroll', handler, true)` — capture catches nested scrolls.

## Focus

First item focused on open. Arrow keys navigate.
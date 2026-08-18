# NtpDrawer — Implementation Notes

## Structure

```
NtpDrawer
├── (modal mode) Scrim
└── <aside class="ntp-drawer">
    ├── items (data-driven) OR default slot
    │   └── NtpDrawerItem (internal)
    └── (rail hover expansion via CSS :hover)
```

## Breakpoint Detection

- `matchMedia` with MD3 breakpoints.
- Library-level configurable (future).
- Internal ref: `isModalMode`.

## State

- `isOpen` prop from `useDrawer` composable.
- Modal mode: `isOpen` → overlay shown/hidden.
- Standard mode: `isOpen` → `--expanded` class toggled.

## CSS-Driven Expand/Collapse

```scss
.ntp-drawer {
  width: 80dp;
  transition: width 200ms;
}

.ntp-drawer--expanded,
.ntp-drawer:hover {
  width: 360dp;
}
```

## Nested Items

- Parent item has `nested` array.
- Nested items rendered only when:
  - Parent is active (RouterLink active class), AND
  - Drawer is expanded (class or hover).
- CSS:

```scss
.nested-items { display: none; }

.ntp-drawer--expanded .drawer-item--active .nested-items,
.ntp-drawer:hover .drawer-item--active .nested-items {
  display: block;
}
```

## Badge

- `badge` prop on item data.
- Expanded: rendered as trailing element.
- Rail: absolutely positioned overlay on icon.
- Empty badge → no badge rendered.

## navigate Event

- `NtpDrawerItem` emits `navigate`.
- `NtpDrawer` re-emits it.

## Edge Cases

- `items` empty and no default slot → empty drawer.
- Item with `nested` but no `to` → parent not clickable? For v1: `to` is required on all items. Dev warning if missing.
- Modal mode open → body scroll locked.
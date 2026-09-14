# NtpBreadcrumbs — Implementation Notes

## Structure

```
NtpBreadcrumbs/
├── NtpBreadcrumbs.vue
└── NtpBreadcrumbs.css
```

## Rendering

- Each item: `RouterLink` when `to` present, else `<span>`.
- Separators between items, not after the last.
- Icon-only items handled via `ariaLabel`.

## Type

`BreadcrumbItem` in `lib/types/breadcrumbs.ts`. Uses `RouteLocationRaw` from vue-router.

## Dependencies

- Requires vue-router (peer dependency).
- Storybook preview registers a mock router for stories.

## Dev Warning

Icon-only items without `ariaLabel` → `console.warn`.

## Slots

- `item` — full override for custom segment rendering.
- `separator` — custom separator.
# NtpBreadcrumb — Implementation Notes

## Structure

```
<nav class="ntp-breadcrumb" aria-label="Breadcrumb">
  <span class="ntp-breadcrumb__item">...</span>
  <span class="ntp-breadcrumb__separator">›</span>
  <span class="ntp-breadcrumb__item">...</span>
  ...
</nav>
```

## Rendering Logic

For each item:

```ts
const isClickable = computed(() => !!item.href)
const isIconOnly = computed(() => !!item.icon && !item.label)
```

- Clickable: `<a :href="item.href" @click="emitNavigate(item)">`
- Non-clickable: `<span>`

## Icon Rendering

- `icon` + `label`: icon `<span class="material-symbols">` before text.
- `icon` only: icon with `aria-label` from `ariaLabel` prop.
- No icon: text only.

## Separator

- Default: `›` character or chevron icon.
- Rendered between items, not after the last.
- `separator` slot overrides.

## Click Handling

- Emit `navigate` with `{ item, index }`.
- Native `<a>` behavior remains (browser navigation). Consumer can `.prevent` in the handler if using vue-router.

## Styling

- Clickable: `color: $color-primary`.
- Non-clickable: `color: $color-on-surface`.
- Icon sizing matches text size.

## No Internal State

The component is stateless. Parent owns the path state. No localStorage, no sessionStorage, no cross-tab communication.

## Edge Cases

- `items` empty → render nothing.
- Icon-only item without `ariaLabel` → dev warning.
- Item with neither `label` nor `icon` → render empty. Dev warning.
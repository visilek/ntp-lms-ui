# NtpBreadcrumbs

A breadcrumb navigation trail. Renders a list of segments as `RouterLink`s (when `to` is provided) or plain text.

## Import

```ts
import { NtpBreadcrumbs } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `BreadcrumbItem[]` | required | Breadcrumb segments |

### BreadcrumbItem

```ts
interface BreadcrumbItem {
  label?: string
  ariaLabel?: string
  to?: RouteLocationRaw
  icon?: string
}
```

| Field | Type | Description |
|---|---|---|
| `label` | `string` | Text label. Optional if `icon` provided. |
| `ariaLabel` | `string` | Accessible label. **Required** for icon-only items. |
| `to` | `RouteLocationRaw` | Vue Router target. Presence makes the item clickable. |
| `icon` | `string` | Icon name. Renders before label, or alone. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `item` | `{ item, isLast }` | Custom item rendering |
| `separator` | — | Custom separator. Default: `›` chevron. |

### Events

None. Navigation handled by `RouterLink`.

## Behavior

- Clickable items render as `RouterLink` (primary color).
- Non-clickable items render as plain text (`on-surface` color).
- Icon-only items require `ariaLabel`.

## Usage

### Basic

```html
<NtpBreadcrumbs
  :items="[
    { label: 'Home', to: '/' },
    { label: 'Courses', to: '/courses' },
    { label: 'Physics 101' },
  ]"
/>
```

### With Home Icon

```html
<NtpBreadcrumbs
  :items="[
    { icon: '🏠', ariaLabel: 'Home', to: '/' },
    { label: 'Courses', to: '/courses' },
    { label: 'Physics 101' },
  ]"
/>
```

### Custom Separator

```html
<NtpBreadcrumbs :items="items">
  <template #separator>
    <span>/</span>
  </template>
</NtpBreadcrumbs>
```

## Accessibility

- `nav` has `aria-label="Breadcrumb"`.
- Clickable items are native router links.
- Icon-only items must provide `ariaLabel` (dev warning if missing).
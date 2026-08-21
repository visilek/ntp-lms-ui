# NtpBreadcrumb

Displays a navigation path as a sequence of segments. Each segment with an `href` is a hyperlink. State is managed by the parent — the component is stateless.

## Import

```ts
import { NtpBreadcrumb } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `BreadcrumbItem[]` | **required** | Path segments |

### BreadcrumbItem

```ts
interface BreadcrumbItem {
  label?: string
  ariaLabel?: string
  href?: string
  icon?: string
}
```

| Field | Type | Description |
|---|---|---|
| `label` | `string` | Text label. Optional if `icon` is provided. |
| `ariaLabel` | `string` | Accessible label. **Required** when `label` is omitted (icon-only). |
| `href` | `string` | Link target. Presence determines clickability. |
| `icon` | `string` | Icon name. Renders before label, or alone if no label. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `item` | `{ item, isLast }` | Custom segment rendering. Overrides default rendering. |
| `separator` | — | Custom separator. Default: `›` chevron. |

### Events

| Event | Payload | Description |
|---|---|---|
| `navigate` | `{ item, index }` | Emitted when a clickable segment is clicked. |

## Behavior

### Clickability

- Item with `href` → clickable link. Rendered as `<a>`. Primary color.
- Item without `href` → plain text. Not clickable. `on-surface` color.

The criterion is **presence of `href`**, not position. Any segment can be clickable or non-clickable.

### Icon Rendering

| Case | Rendering |
|---|---|
| `label` + `icon` | Icon before text |
| `icon` only | Icon-only segment. `ariaLabel` required. |
| `label` only | Text segment |

### Separator

Default separator: `›` chevron. Customizable via `separator` slot.

## Usage Examples

### Basic

```html
<NtpBreadcrumb
  :items="[
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Physics 101' },
  ]"
/>
```

### With Home Icon

```html
<NtpBreadcrumb
  :items="[
    { icon: 'home', ariaLabel: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'Physics 101' },
  ]"
/>
```

### With Navigate Handler

```html
<NtpBreadcrumb
  :items="breadcrumbItems"
  @navigate="({ item }) => router.push(item.href)"
/>
```

### Custom Separator

```html
<NtpBreadcrumb :items="items">
  <template #separator>
    <span class="material-symbols">chevron_right</span>
  </template>
</NtpBreadcrumb>
```

### Custom Item Rendering

```html
<NtpBreadcrumb :items="items">
  <template #item="{ item, isLast }">
    <RouterLink
      v-if="item.href"
      :to="item.href"
      class="breadcrumb-link"
    >
      {{ item.label }}
    </RouterLink>
    <span v-else>{{ item.label }}</span>
  </template>
</NtpBreadcrumb>
```

## Accessibility

- Breadcrumb container has `aria-label="Breadcrumb"`.
- Links are native `<a>` elements.
- Icon-only items require `ariaLabel`.
- Last segment (non-clickable) is plain text — not focusable.
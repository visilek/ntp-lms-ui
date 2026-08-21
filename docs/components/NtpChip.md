# NtpChip

A compact element for tags, filters, selected items, and status indicators. Follows Material Design 3 chip styling with tonal surfaces.

## Import

```ts
import { NtpChip } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `''` | Text content |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual style |
| `color` | `'primary' \| 'secondary' \| 'error' \| 'success' \| 'warning' \| 'neutral'` | `'neutral'` | Color scheme |
| `size` | `'small' \| 'medium'` | `'medium'` | Size preset |
| `dismissible` | `boolean` | `false` | Shows remove (×) button |
| `disabled` | `boolean` | `false` | Disabled state |
| `clickable` | `boolean` | `false` | Interactive. Adds hover/focus states. Emits `click`. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Custom content. Overrides `label`. |
| `leading` | — | Content before label (icon, avatar) |
| `trailing` | — | Content after label. When `dismissible`, × button is appended after this slot. |

### Events

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Emitted only when `clickable` is `true`. |
| `dismiss` | — | Emitted when × button is clicked. Parent removes chip. |

## Variants

### Filled (Default)

Tonal surface background. Soft tinted look.

```html
<NtpChip label="Physics" color="primary" />
```

### Outlined

Transparent background with colored border.

```html
<NtpChip label="Draft" variant="outlined" color="warning" />
```

## Colors

| Color | Typical Use |
|---|---|
| `primary` | Selected filter, active tag |
| `secondary` | Secondary categorization |
| `error` | Overdue, rejected, error state |
| `success` | Published, completed, approved |
| `warning` | Draft, pending, needs attention |
| `neutral` | Generic tag, no specific meaning |

## Usage Examples

### Basic Tag

```html
<NtpChip label="Mechanics" />
```

### Status Indicator

```html
<NtpChip label="Published" color="success" />
<NtpChip label="Draft" color="warning" />
<NtpChip label="Overdue" color="error" />
```

### Dismissible Filter

```html
<NtpChip
  v-for="filter in activeFilters"
  :key="filter.id"
  :label="filter.label"
  dismissible
  @dismiss="removeFilter(filter.id)"
/>
```

### Clickable

```html
<NtpChip
  label="Newton's Laws"
  clickable
  @click="openTopic('newtons-laws')"
/>
```

### With Leading Icon

```html
<NtpChip label="Physics" color="primary">
  <template #leading>
    <span class="material-symbols">science</span>
  </template>
</NtpChip>
```

### Small Size

```html
<NtpChip label="Tag" size="small" />
```

## Accessibility

- Dismissible × button has `aria-label="Remove {label}"`.
- `clickable` chips render as `<button type="button">`.
- Non-clickable chips render as `<span>`.
- Disabled dismissible chips have the × button disabled.

`_internal/components/NtpChip.md`


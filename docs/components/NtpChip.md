# NtpChip

A compact element for tags, filters, selected items, and status indicators. Follows Material Design 3 tonal surface styling.

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
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'error' \| 'neutral'` | `'neutral'` | Color scheme |
| `size` | `'small' \| 'medium'` | `'medium'` | Size preset |
| `dismissible` | `boolean` | `false` | Shows remove (×) button |
| `disabled` | `boolean` | `false` | Disabled state |
| `clickable` | `boolean` | `false` | Interactive. Adds hover/focus states. Emits `click`. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Custom content. Overrides `label`. |
| `leading` | — | Content before label (icon, avatar) |
| `trailing` | — | Content after label |

### Events

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Emitted only when `clickable` is `true`. |
| `dismiss` | — | Emitted when × button clicked. Parent removes chip. |

## Variants

| Variant | Description |
|---|---|
| `filled` | Tonal surface background. Soft tinted look. |
| `outlined` | Transparent background with colored border. |

## Colors

| Color | Typical Use |
|---|---|
| `primary` | Published, approved, selected |
| `secondary` | Secondary categorization |
| `tertiary` | Draft, pending, needs attention |
| `error` | Overdue, rejected |
| `neutral` | Generic tag |

## Usage Examples

### Basic Tag

```html
<NtpChip label="Mechanics" />
```

### Status

```html
<NtpChip label="Published" color="primary" />
<NtpChip label="Draft" color="tertiary" />
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

## Accessibility

- Dismissible × button has `aria-label="Remove {label}"`.
- `clickable` chips render as `<button type="button">`.
- Non-clickable chips render as `<span>`.
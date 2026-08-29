# NtpActionMenu

A trigger button with an attached menu. Composition of `NtpButton` and `NtpMenu`.

## Import

```ts
import { NtpActionMenu } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MenuItem[]` | `[]` | Menu items |
| `ariaLabel` | `string` | `'More actions'` | Accessible label for trigger |
| `variant` | `ButtonVariant` | `'text'` | Trigger variant |
| `color` | `ButtonColor` | `'on-surface-variant'` | Trigger color |
| `size` | `ButtonSize` | `'medium'` | Trigger size |
| `disabled` | `boolean` | `false` | Disabled |
| `placement` | `MenuPlacement` | `'bottom-end'` | Menu position |

### Slots

| Slot | Description |
|---|---|
| `trigger` | Custom trigger content |
| `default` | Custom menu content. Overrides `items`. |

### Events

| Event | Payload | Description |
|---|---|---|
| `select` | `MenuItem` | Item clicked. Menu closes. |
| `open` | — | Menu opened |
| `close` | — | Menu closed |

## Usage

```html
<NtpActionMenu
  :items="[
    { value: 'edit', label: 'Edit' },
    { value: 'delete', label: 'Delete', danger: true },
  ]"
  @select="handleAction"
/>
```
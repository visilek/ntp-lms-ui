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
| `ariaLabel` | `string` | `'More actions'` | Accessible label for the trigger button |
| `variant` | `ButtonVariant` | `'text'` | Trigger button variant |
| `color` | `ButtonColor` | `'on-surface-variant'` | Trigger button color |
| `size` | `ButtonSize` | `'medium'` | Trigger button size |
| `disabled` | `boolean` | `false` | Disables trigger |
| `placement` | `MenuPlacement` | `'bottom-end'` | Menu position |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `trigger` | — | Custom trigger content. Default is `⋮` icon. |
| `item` | `{ item }` | Custom menu item content |
| `default` | — | Custom menu content. Overrides `items`. |

### Events

| Event | Payload | Description |
|---|---|---|
| `select` | `{ value, item }` | Item clicked. Menu closes after. |
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

## Accessibility

- Trigger is icon-only button with `aria-label`.
- Default label: "More actions".
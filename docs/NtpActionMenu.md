# NtpActionMenu

A trigger button (ellipsis icon by default) that opens a menu of actions. Composition of `NtpButton` and `NtpMenu`.

## Import

```ts
import { NtpActionMenu } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Array<{ value: string \| number, label: string, disabled?: boolean, danger?: boolean, leading?: string }>` | `[]` | Menu items |
| `label` | `string` | `''` | Accessible label for trigger. Falls back to `'More actions'`. |
| `variant` | `'filled' \| 'outlined' \| 'text'` | `'text'` | Trigger button variant |
| `color` | `'on-surface-variant' \| 'primary' \| 'secondary' \| 'surface'` | `'on-surface-variant'` | Trigger button color |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Trigger button size |
| `disabled` | `boolean` | `false` | Disables trigger |
| `placement` | `'bottom-end' \| 'bottom-start' \| 'top-end' \| 'top-start'` | `'bottom-end'` | Menu position relative to trigger |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `trigger` | — | Custom trigger content. Overrides default ellipsis icon button. |
| `item` | `{ item, active }` | Custom menu item content. |
| `default` | — | Custom menu content. Overrides data-driven `items`. |

### Events

| Event | Payload | Description |
|---|---|---|
| `select` | `{ value, item }` | Menu item clicked |
| `open` | — | Menu opened |
| `close` | — | Menu closed |

## Usage Examples

### Basic

```html
<NtpActionMenu
  :items="[
    { value: 'edit', label: 'Edit', leading: 'edit' },
    { value: 'duplicate', label: 'Duplicate', leading: 'content_copy' },
    { value: 'delete', label: 'Delete', leading: 'delete', danger: true },
  ]"
  @select="handleAction"
/>
```

### Custom Trigger

```html
<NtpActionMenu :items="items" @select="handleAction">
  <template #trigger>
    <NtpButton variant="outlined" size="small">
      Actions
      <span class="material-symbols">expand_more</span>
    </NtpButton>
  </template>
</NtpActionMenu>
```

### Custom Menu Content

```html
<NtpActionMenu label="More actions">
  <template #default>
    <div class="custom-menu">
      <a href="/profile">View profile</a>
      <button @click="report">Report</button>
    </div>
  </template>
</NtpActionMenu>
```

### Custom Item Rendering

```html
<NtpActionMenu :items="items" @select="handleAction">
  <template #item="{ item }">
    <div class="custom-item">
      <img :src="item.iconUrl" />
      <span>{{ item.label }}</span>
    </div>
  </template>
</NtpActionMenu>
```

## Accessibility

- Trigger button has `aria-label` from `label` prop or `'More actions'`.
- Trigger has `aria-haspopup="menu"` and `aria-expanded`.
- Menu items have `role="menuitem"`.
- Keyboard: Arrow Up/Down to navigate, Enter to select, Escape to close.
- Focus returns to trigger on close.
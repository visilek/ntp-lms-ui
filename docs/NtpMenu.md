# NtpMenu

A generic popup surface with a list of selectable items. The foundation for dropdowns, action menus, and context menus. Follows MD3 menu specifications.

## Import

```ts
import { NtpMenu } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `Array<{ value: string \| number, label: string, disabled?: boolean, danger?: boolean, leading?: string }>` | `[]` | Menu items |
| `anchor` | `HTMLElement \| null` | `null` | Element to position relative to |
| `placement` | `'bottom-end' \| 'bottom-start' \| 'top-end' \| 'top-start'` | `'bottom-end'` | Position relative to anchor |
| `open` | `boolean` | `false` | Controlled open state |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `header` | — | Content at top of popup (e.g., search field) |
| `item` | `{ item, active }` | Custom item rendering |
| `default` | — | Fully custom menu content. Overrides `items`. |

### Events

| Event | Payload | Description |
|---|---|---|
| `select` | `{ value, item }` | Item clicked |
| `close` | — | Request to close (outside click, Escape) |

## Item Type

```ts
interface MenuItem {
  value: string | number
  label: string
  disabled?: boolean
  danger?: boolean
  leading?: string
}
```

## Behavior

- Renders in `<Teleport to="body">`.
- Elevation level 2.
- Min width 112px.
- `danger` items render with error color.
- `leading` icon renders at left of label.
- Clicking disabled item: no event.
- Outside click or Escape: emits `close`.

## Usage Examples

### Basic (Controlled)

```html
<NtpMenu
  :items="items"
  :anchor="buttonRef"
  :open="isOpen"
  @select="handleSelect"
  @close="isOpen = false"
/>
```

### With Header Slot

```html
<NtpMenu :items="items" :anchor="inputRef" :open="isOpen">
  <template #header>
    <input type="text" placeholder="Search..." />
  </template>
</NtpMenu>
```

### Custom Item Rendering

```html
<NtpMenu :items="items" :anchor="ref" :open="isOpen">
  <template #item="{ item }">
    <div class="custom-item">
      <Avatar :src="item.avatarUrl" />
      <span>{{ item.label }}</span>
    </div>
  </template>
</NtpMenu>
```

### Fully Custom Content

```html
<NtpMenu :anchor="ref" :open="isOpen" @close="isOpen = false">
  <template #default>
    <div class="custom-popup">
      <h3>Custom content</h3>
      <p>Anything goes here</p>
    </div>
  </template>
</NtpMenu>
```

## Accessibility

- Renders `role="menu"` for the popup.
- Items have `role="menuitem"`.
- Disabled items have `aria-disabled="true"`.
- Focus management: first non-disabled item on open, anchor on close.
- Keyboard: Arrow Up/Down, Enter/Space to select, Escape to close, Tab to close.
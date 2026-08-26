# NtpMenu

A popup menu surface. Positions relative to an anchor element.

## Import

```ts
import { NtpMenu } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MenuItem[]` | `[]` | Menu items |
| `anchor` | `HTMLElement \| { $el: HTMLElement } \| null` | `null` | Element or component instance to position against |
| `placement` | `'bottom-end' \| 'bottom-start' \| 'top-end' \| 'top-start'` | `'bottom-end'` | Position relative to anchor |
| `open` | `boolean` | `false` | Controlled visibility |

### MenuItem

```ts
interface MenuItem {
  value: string | number
  label: string
  disabled?: boolean
  danger?: boolean
  leading?: string
}
```

### Slots

| Slot | Scope | Description |
|---|---|---|
| `header` | — | Content above items (search field) |
| `item` | `{ item }` | Custom item rendering |
| `default` | — | Fully custom menu content. Overrides `items`. |

### Events

| Event | Payload | Description |
|---|---|---|
| `select` | `{ value, item }` | Item clicked |
| `close` | — | Outside click, Escape, or scroll outside |

## Behavior

- Teleports to body.
- Clamps to viewport with 8px margin.
- Closes on outside click, Escape, or scroll outside.
- Keyboard: ArrowUp/ArrowDown navigate, Enter selects.

## Usage

```html
<NtpButton ref="anchorRef" @click="isOpen = !isOpen">Open</NtpButton>

<NtpMenu
  :items="items"
  :anchor="anchorRef"
  :open="isOpen"
  @select="handleSelect"
  @close="isOpen = false"
/>
```

## Accessibility

- `role="menu"` with `role="menuitem"` children.
- Focus moves to first item on open.
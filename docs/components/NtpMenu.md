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
| `anchor` | `HTMLElement \| { $el: HTMLElement } \| null` | `null` | Element or component instance |
| `placement` | `MenuPlacement` | `'bottom-end'` | Position |
| `open` | `boolean` | `false` | Controlled visibility |
| `minWidth` | `string` | `'112px'` | Minimum menu width |

### MenuItem

```ts
interface MenuItem {
  value: string | number
  label: string
  disabled?: boolean
  danger?: boolean
  leading?: string
  selected?: boolean
}
```

### Slots

| Slot | Description |
|---|---|
| `header` | Content above items |
| `default` | Custom menu content. Overrides `items`. |
| `footer` | Content below items |

### Events

| Event | Payload | Description |
|---|---|---|
| `select` | `MenuItem` | Item clicked |
| `close` | — | Outside click, Escape, scroll |

## Behavior

- Teleports to body.
- Clamps to viewport with 8px margin.
- Max-height: 60vh with internal scroll.
- Header and footer are pinned — items scroll internally when the menu exceeds 60vh.
- Selected items have primary-tinted background.
- Closes on outside click, Escape, or scroll outside.

## Usage

```html
<NtpMenu
  :items="items"
  :anchor="anchorRef"
  :open="isOpen"
  @select="handleSelect"
  @close="isOpen = false"
/>
```

## Accessibility

- `role="menu"` + `role="menuitem"` children.
- Keyboard: ArrowUp/ArrowDown navigate, Escape closes.
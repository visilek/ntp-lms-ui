# NtpMenu

A popup menu surface. Positions relative to an anchor element.

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MenuItem[]` | `[]` | Menu items |
| `anchor` | `HTMLElement \| { $el: HTMLElement } \| null` | `null` | Element or component instance |
| `placement` | `MenuPlacement` | `'bottom-end'` | Position |
| `open` | `boolean` | `false` | Controlled visibility |
| `minWidth` | `string` | `'112px'` | Minimum menu width |

### Slots

| Slot | Description |
|---|---|
| `header` | Content above items |
| `default` | Custom menu content |
| `footer` | Content below items |

### Events

| Event | Payload | Description |
|---|---|---|
| `select` | `MenuSelection` | Item clicked |
| `close` | — | Outside click, Escape, scroll |

## Behavior

- Teleports to body.
- Clamps to viewport with 8px margin.
- Max-height: 60vh with internal scroll.
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
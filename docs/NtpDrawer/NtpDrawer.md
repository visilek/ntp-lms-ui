# NtpDrawer

An adaptive navigation drawer following MD3. Standard (docked) mode on large and extra-large breakpoints, modal (overlay) mode on smaller breakpoints. State managed via `useDrawer` composable.

## Import

```ts
import { NtpDrawer, useDrawer } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `DrawerItem[]` | `[]` | Navigation items. Data-driven. |
| `isOpen` | `boolean` | `false` | Controlled state from `useDrawer`. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Custom drawer content. Overrides `items`. |

### Events

| Event | Payload | Description |
|---|---|---|
| `navigate` | `{ item }` | Re-emitted from internal items. |

## DrawerItem

```ts
interface DrawerItem {
  key: string | number
  icon: string
  label: string
  railLabel?: string
  badge?: string | number
  to: RouteLocationRaw
  disabled?: boolean
  nested?: DrawerItem[]
}
```

| Field | Type | Description |
|---|---|---|
| `key` | `string \| number` | Unique identifier |
| `icon` | `string` | Icon name |
| `label` | `string` | Expanded mode label |
| `railLabel` | `string` | Rail mode label. Falls back to `label`. Nested items don't use this. |
| `badge` | `string \| number` | Badge content. Trailing in expanded, overlaid on icon in rail. |
| `to` | `RouteLocationRaw` | VueRouter route target. |
| `disabled` | `boolean` | Disabled state |
| `nested` | `DrawerItem[]` | Nested items. Single-level expansion. |

## Modes

| Breakpoint | Mode | Behavior |
|---|---|---|
| Large / XL | Standard | Docked. Expands/collapses to rail. |
| Small / Medium | Modal | Overlay with scrim. |

Breakpoints follow MD3. Library-level configurable.

## State

`useDrawer` composable provides unified state:

```ts
const drawer = useDrawer({ defaultOpen: true })

drawer.isOpen    // boolean
drawer.toggle()
drawer.open()
drawer.close()
```

| Mode | `isOpen = true` | `isOpen = false` |
|---|---|---|
| Standard | Expanded (full width) | Collapsed (rail, 80dp) |
| Modal | Overlay shown | Hidden |

## Expand / Collapse (Standard Mode)

CSS-driven. The `--expanded` class toggles width. Hover also expands.

```
Rail (80dp)          Hover / Expanded (360dp)
┌──────────┐         ┌─────────────────────────┐
│   🏠     │         │ [🏠]  Home              │
│  Home    │   →     │ [📚]  Courses        ▾  │
│   📚     │         │      ├ [📖] All        │
│ Courses  │         │      └ [📁] Archived   │
└──────────┘         └─────────────────────────┘
```

## Nested Items

Visibility is CSS-driven. Nested items appear when **both**:

1. Parent item is active (RouterLink active state).
2. Drawer is visually expanded (persistent class **or** hover).

| Mode / State | Nested Items |
|---|---|
| Modal, parent active | ✅ Visible |
| Drawer expanded, parent active | ✅ Visible |
| Rail collapsed, parent active | ❌ Hidden |
| Rail hover-expanded, parent active | ✅ Temporarily visible |

## Badge Rendering

| Mode | Badge Position |
|---|---|
| Expanded | Trailing position (right side) |
| Rail | Overlaid on icon (top-right corner) |

## Usage Example

```html
<script setup>
const drawer = useDrawer({ defaultOpen: true })

const items = [
  { key: 'home', icon: 'home', label: 'Home', to: '/' },
  {
    key: 'courses',
    icon: 'book',
    label: 'Courses',
    railLabel: 'Courses',
    to: '/courses',
    nested: [
      { key: 'all', icon: 'list', label: 'All Courses', to: '/courses' },
      { key: 'drafts', icon: 'edit', label: 'Drafts', to: '/courses?status=draft' },
    ],
  },
  { key: 'inbox', icon: 'inbox', label: 'Inbox', railLabel: 'Inbox', badge: 5, to: '/inbox' },
]

function onNavigate({ item }) {
  // Close modal drawer after navigation on mobile
  if (drawer.isModal) drawer.close()
}
</script>

<template>
  <NtpDrawer
    :items="items"
    :is-open="drawer.isOpen"
    @navigate="onNavigate"
  />
</template>
```

## Accessibility

- Drawer has `role="navigation"` and `aria-label="Main navigation"`.
- Modal mode: focus trap + scrim. Same as `NtpDialog`.
- Active item has `aria-current="page"`.
- Badge is announced via `aria-label` on the item.
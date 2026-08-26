# NtpDialog

A dialog container. Overlay with backdrop, focus management, responsive fullscreen.

## Import

```ts
import { NtpDialog } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Controlled visibility |
| `persistent` | `boolean` | `false` | Disables backdrop + Escape close |
| `width` | `string \| number` | `'560px'` | Dialog width |
| `fullscreen` | `boolean` | `false` | Force fullscreen |
| `showClose` | `boolean` | `true` | Show close button in standard mode |

### Slots

| Slot | Description |
|---|---|
| `default` | Dialog content |
| `close` | Custom close button |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | v-model |
| `opened` | — | After open |
| `closed` | — | After close |

## Behavior

- Responsive fullscreen when viewport < width + 32px.
- Scroll lock while open.
- Focus trap.
- Escape + backdrop close (unless persistent).

## Usage

```html
<NtpDialog v-model:open="isOpen">
  <NtpDialogHeader title="Edit" @close="isOpen = false" />
  <div class="ntp-pa-4">Content</div>
</NtpDialog>
```

## Accessibility

- `role="dialog"` + `aria-modal="true"`.
- Focus moves to dialog on open, restored on close.
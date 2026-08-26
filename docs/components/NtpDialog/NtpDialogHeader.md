# NtpDialogHeader

Header for dialogs. Centered in standard mode, app-bar in fullscreen.

## Import

```ts
import { NtpDialogHeader } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Title |
| `fullscreenTitle` | `string` | `''` | Brief title for fullscreen. Falls back to `title`. |
| `subtitle` | `string` | `''` | Subtitle |
| `icon` | `string` | `''` | Decorative icon. Standard mode only. |
| `fullscreen` | `boolean \| null` | `null` | Force mode. `null` = auto-inject from dialog. |
| `showClose` | `boolean` | `true` | Show close button (fullscreen mode) |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Overrides entire title area |
| `fullscreenActions` | — | Header actions (fullscreen) |
| `close` | — | Custom close button |

### Events

| Event | Payload | Description |
|---|---|---|
| `close` | — | Close clicked |

## Usage

```html
<NtpDialog v-model:open="isOpen" fullscreen>
  <NtpDialogHeader title="Edit Course" fullscreen-title="Edit" @close="isOpen = false" />
</NtpDialog>
```
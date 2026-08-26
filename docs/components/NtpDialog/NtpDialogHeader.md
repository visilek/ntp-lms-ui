# NtpDialogHeader

Header for dialogs. Two modes: standard and fullscreen.

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

## Standard Mode Alignment

| Icon | Alignment |
|---|---|
| No icon | Left-aligned — like a message |
| With icon | Centered — branded header |

## Usage

```html
<!-- Standard, no icon — left-aligned -->
<NtpDialog v-model:open="isOpen">
  <NtpDialogHeader title="Edit Course" @close="isOpen = false" />
</NtpDialog>

<!-- Standard, with icon — centered -->
<NtpDialog v-model:open="isOpen">
  <NtpDialogHeader title="Delete Course?" subtitle="Irreversible" icon="⚠️" @close="isOpen = false" />
</NtpDialog>

<!-- Fullscreen -->
<NtpDialog v-model:open="isOpen" fullscreen>
  <NtpDialogHeader title="Edit Course Details" fullscreen-title="Edit" @close="isOpen = false">
    <template #fullscreenActions>
      <NtpButton variant="text" @click="isOpen = false">Save</NtpButton>
    </template>
  </NtpDialogHeader>
</NtpDialog>
```
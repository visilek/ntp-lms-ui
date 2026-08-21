# NtpDialog

A dialog container following MD3. Overlay with backdrop, focus trapping, and responsive fullscreen behavior.

## Import

```ts
import { NtpDialog } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Controlled visibility |
| `persistent` | `boolean` | `false` | Disables backdrop click and Escape dismissal |
| `width` | `string \| number` | `'560px'` | Dialog width |
| `fullscreen` | `boolean` | `false` | Force fullscreen mode |
| `showClose` | `boolean` | `true` | Show close button in standard mode. Ignored in fullscreen mode. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Dialog content. Compose `NtpDialogHeader`, body, actions. |
| `close` | — | Custom close button for standard mode. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | v-model:open contract |
| `opened` | — | After open transition |
| `closed` | — | After close transition |

## Behavior

### Dismissal

| Mode | Backdrop Click | Escape | Close Button |
|---|---|---|---|
| Default (`persistent: false`) | Closes | Closes | Closes (if `showClose`) |
| Persistent (`persistent: true`) | Ignored | Ignored | Consumer handles |

### Close Button

- **Standard mode:** rendered by `NtpDialog`. Visible when `showClose` is `true`. Positioned top-right.
- **Fullscreen mode:** not rendered by `NtpDialog`. `NtpDialogHeader` renders the close button in the app bar leading position.
- Customizable via `close` slot (standard mode only).

### Responsive Fullscreen

Dialog renders fullscreen when:

- `fullscreen` prop is `true`, **or**
- Viewport width < `width + 32px`

Re-evaluated on window resize.

### Fullscreen State Sharing

`NtpDialog` provides its effective fullscreen state to child components via injection. `NtpDialogHeader` automatically switches to app-bar layout when fullscreen.

## Usage Examples

### Basic

```html
<NtpDialog v-model:open="isOpen">
  <NtpDialogHeader
    title="Edit Course"
    @close="isOpen = false"
  />

  <div class="ntp-pa-4">
    <NtpTextInput v-model="title" label="Title" />
  </div>
</NtpDialog>
```

### Without Close Button (Standard Mode)

```html
<NtpDialog v-model:open="isOpen" :show-close="false">
  <NtpDialogHeader title="Quick Info" />
  <!-- User dismisses via backdrop click or Escape -->
</NtpDialog>
```

### Custom Close Button (Standard Mode)

```html
<NtpDialog v-model:open="isOpen">
  <template #close>
    <NtpButton icon-only aria-label="Close dialog" @click="isOpen = false">
      <span class="material-symbols">close</span>
    </NtpButton>
  </template>

  <NtpDialogHeader title="Details" />
</NtpDialog>
```

### Persistent

```html
<NtpDialog v-model:open="isOpen" persistent>
  <NtpDialogHeader title="Processing..." :show-close="false" />
  <div class="ntp-pa-4">
    <p>Please wait while the operation completes.</p>
  </div>
</NtpDialog>
```

### Forced Fullscreen

```html
<NtpDialog v-model:open="isOpen" fullscreen>
  <NtpDialogHeader
    title="Edit Course"
    fullscreen-title="Edit"
    @close="isOpen = false"
  />
  <!-- content -->
</NtpDialog>
```

## Accessibility

- Focus trap: Tab cycles within dialog.
- Focus moves to dialog on open. Restored to trigger on close.
- Body scroll locked while open.
- `role="dialog"` and `aria-modal="true"`.
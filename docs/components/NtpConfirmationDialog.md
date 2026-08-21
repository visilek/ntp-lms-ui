# NtpConfirmationDialog

A standard confirmation dialog. Composition of `NtpDialog`, `NtpDialogHeader`, `NtpTextInput`, and `NtpButton`. Supports optional type-to-confirm.

## Import

```ts
import { NtpConfirmationDialog } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Controlled visibility |
| `title` | `string` | `''` | Dialog title |
| `message` | `string` | `''` | Confirmation message |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button text |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button text |
| `icon` | `string` | `'warning'` | Decorative icon |
| `confirmColor` | `'primary' \| 'error'` | `'primary'` | Confirm button color |
| `buttons` | `'text' \| 'filled'` | `'text'` | Button style mode |
| `loading` | `boolean` | `false` | Loading state on confirm button |
| `persistent` | `boolean` | `false` | Disables backdrop/Escape dismissal |
| `confirmationPhrase` | `string` | `''` | Phrase to type to enable confirm. Empty = no typing required. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Custom message content. Overrides `message` prop. |
| `footer` | — | Custom footer. Overrides default Cancel/Confirm buttons. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | v-model:open contract |
| `confirm` | — | Confirm clicked. Parent performs action, then closes. |
| `cancel` | — | Cancel clicked or dialog dismissed |

## Button Modes

| Mode | Confirm Button | Cancel Button |
|---|---|---|
| `text` (default) | `variant="text"` | `variant="text"` |
| `filled` | `variant="filled"` | `variant="outlined"` |

Cancel button color: `on-surface-variant` in both modes.

## Type-to-Confirm

When `confirmationPhrase` is non-empty:

- A text input appears below the message.
- The confirm button is disabled until the typed text matches the phrase exactly.
- Matching is live on every keystroke.

## Behavior

- **Confirm:** emits `confirm`. Does not auto-close. Parent closes after the action completes.
- **Cancel:** emits `cancel`, sets `open` to `false`.
- **Backdrop click / Escape:** emits `cancel`, sets `open` to `false`. Ignored if `persistent` is `true`.

## Usage Examples

### Basic (Text Mode)

```html
<NtpConfirmationDialog
  v-model:open="isConfirmOpen"
  title="Confirm Attendance?"
  message="Mark this student as present for today's session."
  confirm-label="Confirm"
  @confirm="confirmAttendance"
/>
```

### Destructive with Type-to-Confirm

```html
<NtpConfirmationDialog
  v-model:open="isDeleteOpen"
  title="Delete Course?"
  message="This action is irreversible. The course and all associated content will be permanently removed."
  confirm-label="Delete"
  confirm-color="error"
  buttons="filled"
  confirmation-phrase="delete"
  :loading="isDeleting"
  @confirm="deleteCourse"
/>
```

### Custom Message

```html
<NtpConfirmationDialog
  v-model:open="isOpen"
  title="Archive Items?"
  confirm-label="Archive"
  buttons="filled"
  @confirm="archive"
>
  <template #default>
    <p>You are about to archive <strong>3 courses</strong>.</p>
    <p>Archived courses are hidden from students but can be restored later.</p>
  </template>
</NtpConfirmationDialog>
```

### Custom Footer

```html
<NtpConfirmationDialog
  v-model:open="isOpen"
  title="Custom Action?"
  @confirm="handleConfirm"
>
  <template #footer>
    <div class="ntp-d-flex ntp-justify-between">
      <NtpButton variant="text" @click="isOpen = false">Back</NtpButton>
      <div class="ntp-d-flex ntp-gap-2">
        <NtpButton variant="text" @click="isOpen = false">Cancel</NtpButton>
        <NtpButton @click="handleConfirm">Proceed</NtpButton>
      </div>
    </div>
  </template>
</NtpConfirmationDialog>
```

## Accessibility

- Renders `NtpDialog` with `role="dialog"` and `aria-modal="true"`.
- Icon is decorative (`aria-hidden="true"`).
- Type-to-confirm input has accessible label ("Type {phrase} to confirm").
- Escape closes unless `persistent`.
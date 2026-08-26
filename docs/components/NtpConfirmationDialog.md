# NtpConfirmationDialog

A standard confirmation dialog. Composition of `NtpDialog`, `NtpDialogHeader`, `NtpButton`, and optional `NtpTextInput`.

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
| `icon` | `string` | `''` | Decorative icon. Centered header when present. |
| `confirmColor` | `'primary' \| 'error'` | `'primary'` | Confirm button color |
| `buttons` | `'text' \| 'filled'` | `'text'` | Button style mode |
| `loading` | `boolean` | `false` | Loading state on confirm |
| `persistent` | `boolean` | `false` | Disables backdrop/Escape close |
| `confirmationPhrase` | `string` | `''` | Type-to-confirm phrase |

### Slots

| Slot | Description |
|---|---|
| `default` | Custom message. Overrides `message` prop. |
| `footer` | Custom footer. Overrides buttons. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | v-model |
| `confirm` | — | Confirm clicked. Consumer closes. |
| `cancel` | — | Cancel or dismissed |

## Button Modes

| Mode | Confirm | Cancel |
|---|---|---|
| `text` | text | text |
| `filled` | filled | outlined |

## Type-to-Confirm

When `confirmationPhrase` set, a text input appears. Confirm disabled until exact match.

## Usage

```html
<NtpConfirmationDialog
  v-model:open="isOpen"
  title="Delete Course?"
  message="This action is irreversible."
  confirm-label="Delete"
  confirm-color="error"
  buttons="filled"
  confirmation-phrase="delete"
  @confirm="handleDelete"
/>
```
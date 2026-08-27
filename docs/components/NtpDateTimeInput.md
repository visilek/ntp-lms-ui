# NtpDateTimeInput

A date and time input using native `<input type="datetime-local">`. Emits ISO datetime string or `null`.

## Import

```ts
import { NtpDateTimeInput } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| null` | `null` | ISO datetime (`YYYY-MM-DDTHH:mm`) |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual style |
| `contextColor` | `'primary' \| 'secondary' \| 'surface'` | `'surface'` | Background context |
| `min` | `string` | — | Minimum datetime |
| `max` | `string` | — | Maximum datetime |
| `step` | `number` | `60` | Time increment in seconds |
| `disabled` | `boolean` | `false` | Native disabled |
| `readonly` | `boolean` | `false` | Native readonly |
| `errors` | `string[]` | `[]` | Error messages |
| `hint` | `string` | `''` | Supporting text |
| `required` | `boolean` | `false` | Visual asterisk + `aria-required` |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string \| null` | Datetime string or null |
| `blur` | `FocusEvent` | Native blur |
| `focus` | `FocusEvent` | Native focus |

## Usage

```html
<NtpDateTimeInput v-model="deadline" label="Deadline" />
<NtpDateTimeInput v-model="meeting" label="Meeting" :step="900" />
```

## Accessibility

- Native `<input type="datetime-local">`.
- Label associated via `for`/`id`.
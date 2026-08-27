# NtpDateInput

A date input field using native `<input type="date">`. Emits ISO date string or `null`.

## Import

```ts
import { NtpDateInput } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| null` | `null` | ISO date (`YYYY-MM-DD`) |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual style |
| `contextColor` | `'primary' \| 'secondary' \| 'surface'` | `'surface'` | Background context |
| `min` | `string` | — | Minimum date |
| `max` | `string` | — | Maximum date |
| `disabled` | `boolean` | `false` | Native disabled |
| `readonly` | `boolean` | `false` | Native readonly |
| `errors` | `string[]` | `[]` | Error messages |
| `hint` | `string` | `''` | Supporting text |
| `required` | `boolean` | `false` | Visual asterisk + `aria-required` |

### Slots

| Slot | Description |
|---|---|
| `leading` | Content before input. Fixed 24px. |
| `trailing` | Content after input |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string \| null` | Date string or null |
| `blur` | `FocusEvent` | Native blur |
| `focus` | `FocusEvent` | Native focus |

## Behavior

- Empty input hides native date format — label acts as placeholder.
- On focus or value: label floats, input appears with delay.

## Usage

```html
<NtpDateInput v-model="dueDate" label="Due date" />
<NtpDateInput v-model="startDate" label="Start" :min="today" :max="endOfYear" />
```

## Accessibility

- Native `<input type="date">`.
- Label associated via `for`/`id`.
# NtpTextInput

A text input field with Material Design floating label. Supports text, password, and email types. Available in filled and outlined variants with context color support.

## Import

```ts
import { NtpTextInput } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` | `''` | v-model binding |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual container style |
| `contextColor` | `'primary' \| 'secondary' \| 'surface'` | `'surface'` | Background context behind the input |
| `type` | `'text' \| 'password' \| 'email'` | `'text'` | Native input type |
| `disabled` | `boolean` | `false` | Native disabled |
| `readonly` | `boolean` | `false` | Native readonly |
| `error` | `string` | `''` | Error message. Replaces hint. |
| `hint` | `string` | `''` | Supporting text |
| `required` | `boolean` | `false` | Asterisk on label |
| `autocomplete` | `string` | `'off'` | Native autocomplete attribute |

### Slots

| Slot | Description |
|---|---|
| `leading` | Content before input text. Fixed 24px width. |
| `trailing` | Content after input text |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` | v-model update |
| `blur` | `FocusEvent` | Native blur |
| `focus` | `FocusEvent` | Native focus |

## Usage

```html
<NtpTextInput v-model="title" label="Assignment title" />
<NtpTextInput v-model="email" label="Email" type="email" />
<NtpTextInput v-model="password" label="Password" type="password" />
```

## Context Colors

| Context | Use Case |
|---|---|
| `surface` | Default — inputs on cards, forms |
| `primary` | Inputs on primary-colored backgrounds |
| `secondary` | Inputs on secondary-colored backgrounds |

```html
<NtpTextInput label="Search" context-color="primary" />
```

## Accessibility

- Renders a native `<input>`.
- Label associated via `for`/`id`.
- Error message linked via `aria-describedby`.
- `required` adds `aria-required`.
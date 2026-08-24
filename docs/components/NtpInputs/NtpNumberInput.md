# NtpNumberInput

A numeric input field with stepper buttons. Emits `number | null`. Native validation via `min`, `max`, `step`.

## Import

```ts
import { NtpNumberInput } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number \| null` | `null` | v-model binding |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual container style |
| `contextColor` | `'primary' \| 'secondary' \| 'surface'` | `'surface'` | Background context |
| `min` | `number` | `undefined` | Minimum value |
| `max` | `number` | `undefined` | Maximum value |
| `step` | `number` | `1` | Increment/decrement step. Decimal places define precision. |
| `disabled` | `boolean` | `false` | Native disabled |
| `readonly` | `boolean` | `false` | Native readonly |
| `errors` | `string[]` | `[]` | Consumer-provided validation errors |
| `hint` | `string` | `''` | Supporting text |
| `required` | `boolean` | `false` | Marks as required |

### Slots

| Slot | Description |
|---|---|
| `leading` | Content before input. Fixed 24px width. |
| `trailing` | Content after input. Rendered before stepper buttons. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `number \| null` | Parsed numeric value |
| `blur` | `FocusEvent` | Native blur |
| `focus` | `FocusEvent` | Native focus |

## Stepper Buttons

- Visible when not disabled/readonly.
- Increment: clamps to `max`.
- Decrement: clamps to `min`.
- Disabled at boundaries.
- Rounds to step's decimal precision.

## Validation

- Context-agnostic validation handled natively via `min`, `max`, `step`.
- Internal errors shown automatically.
- Consumer errors passed via `errors` prop — merged with internal.

## Usage

```html
<NtpNumberInput v-model="count" label="Count" :min="0" :max="100" />
<NtpNumberInput v-model="price" label="Price" :step="0.01" :min="0" />
```

## Accessibility

- Stepper buttons have `aria-label`.
- Native `<input type="number">`.
- Label associated via `for`/`id`.
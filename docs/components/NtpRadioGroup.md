# NtpRadioGroup

A group of radio buttons for mutually exclusive selection. Data-driven via `options` prop.

## Import

```ts
import { NtpRadioGroup } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| number \| null` | `null` | Selected value |
| `options` | `Array<{ value, label, disabled? }>` | required | Options |
| `label` | `string` | `''` | Group label |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position for radios |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout. Horizontal wraps. |
| `disabled` | `boolean` | `false` | Disables all options |
| `readonly` | `boolean` | `false` | Readonly all options |
| `errors` | `string[]` | `[]` | Error messages |
| `hint` | `string` | `''` | Supporting text |
| `required` | `boolean` | `false` | Visual asterisk + `aria-required`. No validation. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `option` | `{ option, checked }` | Custom option content. Radio input rendered by group. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string \| number` | New selected value |

## Usage

```html
<NtpRadioGroup
  v-model="difficulty"
  label="Difficulty"
  :options="[
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ]"
/>
```

## Accessibility

- Renders `<fieldset role="radiogroup">` + `<legend>`.
- Each option is a native radio with shared `name`.
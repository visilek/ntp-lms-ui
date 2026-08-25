# NtpCheckboxGroup

A group of checkboxes for multi-select. Data-driven via `options` prop.

## Import

```ts
import { NtpCheckboxGroup } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `Array<string \| number>` | `[]` | Selected values |
| `options` | `Array<{ value, label, disabled? }>` | required | Options |
| `label` | `string` | `''` | Group label |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position for checkboxes |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout. Horizontal wraps. |
|`required`|`boolean`| visual asterisk + `role="group` + `aria-required`. No validation — consumer handles via `errors`. |
| `disabled` | `boolean` | `false` | Disables all options |
| `readonly` | `boolean` | `false` | Readonly all options |
| `errors` | `string[]` | `[]` | Error messages |
| `hint` | `string` | `''` | Supporting text |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `option` | `{ option, checked }` | Custom option content. Checkbox input rendered by group. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `Array<string \| number>` | New selected values |

## Usage

```html
<NtpCheckboxGroup
  v-model="selected"
  label="Permissions"
  :options="[
    { value: 'create', label: 'Create' },
    { value: 'edit', label: 'Edit' },
  ]"
/>
```

## Accessibility

- Renders `<fieldset>` + `<legend>`.
- Each option is a native checkbox with label.
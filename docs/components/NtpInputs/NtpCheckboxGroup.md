# NtpCheckboxGroup

A group of checkboxes sharing layout, state, and v-model. Renders options from a data array.

## Import

```ts
import { NtpCheckboxGroup } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `T[]` | `[]` | Array of checked values (generic `T extends string \| number`) |
| `options` | `Array<{ value: T, label: string, disabled?: boolean }>` | **required** | Options to render |
| `label` | `string` | `''` | Group label above the options |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position for all checkboxes |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout. Horizontal wraps if needed. |
| `disabled` | `boolean` | `false` | Disables all checkboxes |
| `readonly` | `boolean` | `false` | Makes all checkboxes readonly |
| `error` | `string` | `''` | Error message below the group |
| `hint` | `string` | `''` | Supporting text below the group. Hidden when `error` is set. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `option` | `{ option, checked }` | Custom label content. Checkbox input is rendered by the group. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `T[]` | Emitted with the new array of checked values |

## Usage Examples

### Basic

```html
<NtpCheckboxGroup
  v-model="selectedPermissions"
  :options="[
    { value: 'create', label: 'Create' },
    { value: 'edit', label: 'Edit' },
    { value: 'delete', label: 'Delete' },
  ]"
/>
```

### Horizontal Layout

```html
<NtpCheckboxGroup
  v-model="selectedDays"
  :options="[
    { value: 'mon', label: 'Mon' },
    { value: 'tue', label: 'Tue' },
    { value: 'wed', label: 'Wed' },
  ]"
  direction="horizontal"
/>
```

### Custom Option Rendering

```html
<NtpCheckboxGroup v-model="selected" :options="options">
  <template #option="{ option, checked }">
    <span class="custom-label">
      <Icon :name="option.icon" />
      {{ option.label }}
    </span>
  </template>
</NtpCheckboxGroup>
```

### Error State

```html
<NtpCheckboxGroup
  v-model="selected"
  :options="options"
  error="Select at least one option"
/>
```

## Accessibility

- Renders a `<fieldset>` with a `<legend>` for the group label.
- Each option renders a native `<input type="checkbox">` associated with its label.
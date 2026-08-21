# NtpRadioGroup

A group of radio buttons for mutually exclusive selection. Renders options from a data array.

## Import

```ts
import { NtpRadioGroup } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `T \| null` | `null` | Selected value (generic `T extends string \| number`) |
| `options` | `Array<{ value: T, label: string, disabled?: boolean }>` | **required** | Options to render |
| `label` | `string` | `''` | Group label above the options |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position for all radios |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout. Horizontal wraps if needed. |
| `disabled` | `boolean` | `false` | Disables all radios |
| `readonly` | `boolean` | `false` | Makes all radios readonly |
| `error` | `string` | `''` | Error message below the group |
| `hint` | `string` | `''` | Supporting text below the group. Hidden when `error` is set. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `option` | `{ option, checked }` | Custom label content. Radio input is rendered by the group. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `T \| null` | Emitted with the newly selected value |

## Usage Examples

### Basic

```html
<NtpRadioGroup
  v-model="difficulty"
  :options="[
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ]"
/>
```

### Horizontal Layout

```html
<NtpRadioGroup
  v-model="mode"
  :options="[
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ]"
  direction="horizontal"
/>
```

### Custom Option Rendering

```html
<NtpRadioGroup v-model="selected" :options="options">
  <template #option="{ option, checked }">
    <span class="custom-label">
      <Icon :name="option.icon" />
      {{ option.label }}
    </span>
  </template>
</NtpRadioGroup>
```

### Disabled Option

```html
<NtpRadioGroup
  v-model="selected"
  :options="[
    { value: 'a', label: 'Available' },
    { value: 'b', label: 'Coming soon', disabled: true },
  ]"
/>
```

## Accessibility

- Renders a `<fieldset>` with a `<legend>` for the group label.
- Each option renders a native `<input type="radio">` with a shared `name` attribute.
- Arrow keys navigate between options. Standard radio behavior.
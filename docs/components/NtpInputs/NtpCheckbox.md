# NtpCheckbox

A standalone checkbox for boolean selection. Use inside forms for toggling a single value on/off.

## Import

```ts
import { NtpCheckbox } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | v-model binding |
| `label` | `string` | `''` | Text label next to the control |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Position of label relative to the checkbox |
| `indeterminate` | `boolean` | `false` | Shows a dash instead of a check. Use for "partially selected" states (e.g., parent checkbox with some children checked). Does not affect `modelValue`. |
| `disabled` | `boolean` | `false` | Prevents interaction. Muted styling. |
| `readonly` | `boolean` | `false` | Visible and focusable, but not toggleable. Use for immutable fields per ADR-0004. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Custom label content. Overrides `label` prop. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | v-model binding contract |
| `change` | `boolean` | Fires on user interaction only. Not emitted on programmatic changes. |

## Usage Examples

### Basic

```html
<NtpCheckbox v-model="agreed" label="I agree to the terms" />
```

### Custom Label via Slot

```html
<NtpCheckbox v-model="accepted">
  I have read the <a href="/policy">privacy policy</a>
</NtpCheckbox>
```

### Indeterminate

```html
<NtpCheckbox
  :model-value="allSelected"
  :indeterminate="someSelected"
  label="Select all"
  @update:model-value="toggleAll"
/>
```

### Disabled

```html
<NtpCheckbox v-model="checked" label="Unavailable" disabled />
```

### Readonly

```html
<NtpCheckbox :model-value="true" label="Permanent setting" readonly />
```

## Accessibility

- Renders a native `<input type="checkbox">`.
- Label is associated via `for`/`id` or wrapping `<label>`.
- `indeterminate` sets the native `indeterminate` DOM property for screen readers.
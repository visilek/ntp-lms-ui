# NtpCheckbox

A standalone checkbox for boolean selection. Supports indeterminate state and label positioning.

## Import

```ts
import { NtpCheckbox } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | v-model binding |
| `label` | `string` | `''` | Text label |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position. `left` creates full-width two-column layout. |
| `indeterminate` | `boolean` | `false` | Visual dash state. Does not affect `modelValue`. |
|`required`|`boolean`|`false`| visual asterisk + `aria-required`. No validation — consumer handles via `errors`. |
| `disabled` | `boolean` | `false` | Native disabled |
| `readonly` | `boolean` | `false` | Not toggleable. Still focusable. |

### Slots

| Slot | Description |
|---|---|
| `default` | Custom label content. Overrides `label` prop. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | v-model update |
| `change` | `boolean` | User interaction only |

## Usage

```html
<NtpCheckbox v-model="agreed" label="I agree" />
<NtpCheckbox v-model="accepted" label="Accept" label-position="left" />
<NtpCheckbox :model-value="true" indeterminate label="Some selected" />
```

## Accessibility

- Renders native `<input type="checkbox">`.
- `indeterminate` set via DOM property.
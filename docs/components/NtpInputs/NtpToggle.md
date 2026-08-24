# NtpToggle

A Material Design switch for boolean on/off states.

## Import

```ts
import { NtpToggle } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | v-model binding |
| `label` | `string` | `''` | Text label |
| `labelPosition` | `'left' \| 'right'` | `'left'` | Label position. MD3 default left. |
| `disabled` | `boolean` | `false` | Native disabled |
| `readonly` | `boolean` | `false` | Not toggleable |

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
<NtpToggle v-model="enabled" label="Notifications" />
<NtpToggle v-model="darkMode" label="Dark mode" label-position="right" />
```

## Accessibility

- Native `<input type="checkbox">` with `role="switch"`.
- Label associated via wrapping `<label>`.
# NtpToggle

A Material Design switch for boolean on/off states. Use for settings, feature flags, and enable/disable states.

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
| `labelPosition` | `'left' \| 'right'` | `'left'` | Position of label. Default left per Material Design 3. |
| `disabled` | `boolean` | `false` | Prevents interaction |
| `readonly` | `boolean` | `false` | Visible, not toggleable. Use for immutable fields per ADR-0004. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Custom label content. Overrides `label` prop. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | v-model binding contract |
| `change` | `boolean` | Fires on user interaction only |

## Usage Examples

### Basic

```html
<NtpToggle v-model="notificationsEnabled" label="Email notifications" />
```

### Label on Right

```html
<NtpToggle
  v-model="darkMode"
  label="Dark mode"
  label-position="right"
/>
```

### Disabled

```html
<NtpToggle v-model="feature" label="Beta feature" disabled />
```

### Readonly

```html
<NtpToggle :model-value="true" label="Locked setting" readonly />
```

## Accessibility

- Renders a native `<input type="checkbox" role="switch">`.
- The `role="switch"` communicates the on/off semantics to screen readers.
- Label is associated via wrapping `<label>` or `aria-labelledby`.
# NtpNumberInput

A numeric input field for integer and decimal values. Emits `number | null` — no string parsing required. Available in filled and outlined variants.

## Import

```ts
import { NtpNumberInput } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number \| null` | `null` | v-model binding. `null` when empty. |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual container style |
| `placeholder` | `string` | `''` | Visible when empty and unfocused |
| `precision` | `number` | `0` | Decimal places. `0` = integer only. |
| `min` | `number` | `undefined` | Minimum value (inclusive) |
| `max` | `number` | `undefined` | Maximum value (inclusive) |
| `step` | `number` | `1` | Increment/decrement step |
| `disabled` | `boolean` | `false` | Native disabled |
| `readonly` | `boolean` | `false` | Native readonly. Prefilled, visible, not editable. |
| `error` | `string` | `''` | Error message. Replaces hint. |
| `hint` | `string` | `''` | Supporting text below input. Hidden when `error` is set. |
| `required` | `boolean` | `false` | Appends asterisk to label |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `leading` | — | Content before input text |
| `trailing` | — | Content after input text (clear button, unit suffix) |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `number \| null` | Parsed number, or `null` if empty/invalid |
| `blur` | `FocusEvent` | Native blur |
| `focus` | `FocusEvent` | Native focus |

## Variants

### Filled (Default)

```html
<NtpNumberInput v-model="order" label="Order" />
```

### Outlined

```html
<NtpNumberInput v-model="order" label="Order" variant="outlined" />
```

## Behavior

- Input filtered: digits, minus sign, one decimal separator (if `precision > 0`).
- Empty field → emits `null`.
- On blur: clamps to `min`/`max`. Invalid input → `null`.
- `precision: 0` rejects decimal separators entirely.

## Usage Examples

### Integer (Default)

```html
<NtpNumberInput v-model="orderNumber" label="Order" :min="1" :max="20" />
```

### Decimal

```html
<NtpNumberInput
  v-model="score"
  label="Score"
  :precision="2"
  :min="0"
  :max="100"
/>
```

### With Unit Suffix

```html
<NtpNumberInput v-model="duration" label="Duration" :min="1">
  <template #trailing>
    <span class="unit">min</span>
  </template>
</NtpNumberInput>
```

### Readonly (Immutable Field)

```html
<NtpNumberInput
  :model-value="item.position"
  label="Position"
  readonly
/>
```

### With Error

```html
<NtpNumberInput
  v-model="attempts"
  label="Attempts"
  :min="1"
  :max="10"
  error="Must be between 1 and 10"
/>
```

## Accessibility

- Renders a native `<input type="number">` with appropriate `min`, `max`, `step` attributes.
- Floating label associated via `for`/`id`.
- Error message linked via `aria-describedby`.
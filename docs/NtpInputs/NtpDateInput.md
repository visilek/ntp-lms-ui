# NtpDateInput

A date input field using the native `<input type="date">`. Available in filled and outlined variants.

## Import

```ts
import { NtpDateInput } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| null` | `null` | v-model binding. ISO date string (`YYYY-MM-DD`), or `null` when empty. |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual container style |
| `min` | `string` | `undefined` | Minimum selectable date. ISO format (`YYYY-MM-DD`). |
| `max` | `string` | `undefined` | Maximum selectable date. ISO format. |
| `disabled` | `boolean` | `false` | Native disabled |
| `readonly` | `boolean` | `false` | Native readonly. Prefilled, visible, not editable. |
| `error` | `string` | `''` | Error message. Replaces hint. |
| `hint` | `string` | `''` | Supporting text below input. Hidden when `error` is set. |
| `required` | `boolean` | `false` | Appends asterisk to label |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `leading` | — | Content before input (e.g., calendar icon) |
| `trailing` | — | Content after input (e.g., clear button) |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string \| null` | Emits ISO date string, or `null` when cleared |
| `blur` | `FocusEvent` | Native blur |
| `focus` | `FocusEvent` | Native focus |

## Variants

### Filled (Default)

```html
<NtpDateInput v-model="dueDate" label="Due date" />
```

### Outlined

```html
<NtpDateInput v-model="dueDate" label="Due date" variant="outlined" />
```

## Usage Examples

### With Min/Max

```html
<NtpDateInput
  v-model="startDate"
  label="Start date"
  :min="today"
  :max="semesterEnd"
/>
```

### With Error

```html
<NtpDateInput
  v-model="dueDate"
  label="Due date"
  error="Due date cannot be in the past"
/>
```

### Readonly (Immutable Field)

```html
<NtpDateInput
  :model-value="assignment.publishedAt"
  label="Published"
  readonly
/>
```

### With Calendar Icon

```html
<NtpDateInput v-model="dueDate" label="Due date">
  <template #leading>
    <span class="material-symbols">calendar_today</span>
  </template>
</NtpDateInput>
```

### Clearable

```html
<NtpDateInput v-model="dueDate" label="Due date">
  <template #trailing>
    <NtpButton
      v-if="dueDate"
      icon-only
      aria-label="Clear date"
      @click="dueDate = null"
    >
      <span class="material-symbols">close</span>
    </NtpButton>
  </template>
</NtpDateInput>
```

## Behavior Notes

- v-model is a **string** in ISO format (`YYYY-MM-DD`), not a JavaScript `Date` object.
- Display format follows the user's browser locale. Not customizable.
- The native date picker UI is browser-specific. Styling applies to the container, not the picker popup.

## Accessibility

- Renders a native `<input type="date">`.
- Floating label associated via `for`/`id`.
- Error message linked via `aria-describedby`.
- `min`/`max` are enforced by the browser's native picker.
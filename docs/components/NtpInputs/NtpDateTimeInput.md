# NtpDateTimeInput

A date and time input field using the native `<input type="datetime-local">`. Available in filled and outlined variants.

## Import

```ts
import { NtpDateTimeInput } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| null` | `null` | v-model binding. ISO datetime string (`YYYY-MM-DDTHH:mm`), or `null` when empty. |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual container style |
| `min` | `string` | `undefined` | Minimum selectable datetime. ISO format. |
| `max` | `string` | `undefined` | Maximum selectable datetime. ISO format. |
| `step` | `number` | `60` | Time increment in seconds. Default 60 = 1 minute. |
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
| `update:modelValue` | `string \| null` | Emits ISO datetime string, or `null` when cleared |
| `blur` | `FocusEvent` | Native blur |
| `focus` | `FocusEvent` | Native focus |

## Variants

### Filled (Default)

```html
<NtpDateTimeInput v-model="deadline" label="Deadline" />
```

### Outlined

```html
<NtpDateTimeInput v-model="deadline" label="Deadline" variant="outlined" />
```

## Usage Examples

### With Min/Max

```html
<NtpDateTimeInput
  v-model="examTime"
  label="Exam time"
  :min="semesterStart"
  :max="semesterEnd"
/>
```

### With Custom Step (15 minutes)

```html
<NtpDateTimeInput
  v-model="meetingTime"
  label="Meeting time"
  :step="900"
/>
```

### With Error

```html
<NtpDateTimeInput
  v-model="deadline"
  label="Deadline"
  error="Deadline must be after the publication date"
/>
```

### Readonly

```html
<NtpDateTimeInput
  :model-value="submission.submittedAt"
  label="Submitted at"
  readonly
/>
```

## Behavior Notes

- v-model is a **string** in ISO format (`YYYY-MM-DDTHH:mm`), not a JavaScript `Date` object.
- No time zone information. Values are local to the user's browser.
- Display format follows the user's browser locale.
- The native picker UI is browser-specific.

## Accessibility

- Renders a native `<input type="datetime-local">`.
- Floating label associated via `for`/`id`.
- Error message linked via `aria-describedby`.
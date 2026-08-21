# NtpTextInput

A text input field with Material Design floating label. Supports text, password, and email types. Available in filled and outlined variants.

## Import

```ts
import { NtpTextInput } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` | `''` | v-model binding |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual container style |
| `placeholder` | `string` | `''` | Visible when empty and unfocused |
| `type` | `'text' \| 'password' \| 'email'` | `'text'` | Native input type |
| `disabled` | `boolean` | `false` | Native disabled. Not focusable, not submitted. |
| `readonly` | `boolean` | `false` | Native readonly. Prefilled, visible, not editable. Use for immutable fields per ADR-0004. |
| `error` | `string` | `''` | Error message. Replaces hint. Label turns error color. |
| `hint` | `string` | `''` | Supporting text below input. Hidden when `error` is set. |
| `required` | `boolean` | `false` | Appends asterisk to label |
| `autocomplete` | `'off' \| 'email' \| 'username' \| 'current-password' \| 'new-password' \| 'name' \| 'tel' \| 'organization' \| 'url'` | `'off'` | Browser autofill hint. Forced to `'off'` when `readonly` is `true`. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `leading` | — | Content before input text (icon, prefix) |
| `trailing` | — | Content after input text (clear button, visibility toggle, suffix) |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` | v-model update |
| `blur` | `FocusEvent` | Native blur |
| `focus` | `FocusEvent` | Native focus |

## Variants

### Filled (Default)

Grey background fill. Bottom border. Label floats above the field when focused or filled.

```html
<NtpTextInput v-model="title" label="Assignment title" />
```

### Outlined

Transparent background. Full border outline. Label floats onto the border with a notch.

```html
<NtpTextInput v-model="title" label="Assignment title" variant="outlined" />
```

## Usage Examples

### With Hint

```html
<NtpTextInput
  v-model="email"
  label="Email"
  type="email"
  hint="We'll send a confirmation to this address"
/>
```

### With Error

```html
<NtpTextInput
  v-model="username"
  label="Username"
  error="Username is already taken"
/>
```

### Password with Visibility Toggle

```html
<NtpTextInput
  v-model="password"
  label="Password"
  :type="showPassword ? 'text' : 'password'"
>
  <template #trailing>
    <NtpButton
      icon-only
      :aria-label="showPassword ? 'Hide password' : 'Show password'"
      @click="showPassword = !showPassword"
    >
      <span class="material-symbols">
        {{ showPassword ? 'visibility_off' : 'visibility' }}
      </span>
    </NtpButton>
  </template>
</NtpTextInput>
```

### Clearable

```html
<NtpTextInput v-model="search" label="Search">
  <template #trailing>
    <NtpButton
      v-if="search"
      icon-only
      aria-label="Clear search"
      @click="search = ''"
    >
      <span class="material-symbols">close</span>
    </NtpButton>
  </template>
</NtpTextInput>
```

### Readonly (Immutable Field)

```html
<NtpTextInput
  :model-value="course.code"
  label="Course code"
  readonly
/>
```

### Disabled

```html
<NtpTextInput v-model="value" label="Unavailable" disabled />
```

### Leading Icon

```html
<NtpTextInput v-model="search" label="Search">
  <template #leading>
    <span class="material-symbols">search</span>
  </template>
</NtpTextInput>
```

## Accessibility

- Renders a native `<input>`.
- Floating label is associated via `for`/`id`.
- Error message is linked via `aria-describedby`.
- `required` adds `aria-required="true"`.

## Autocomplete Notes

- Default is `'off'` — most LMS fields are domain-specific.
- Use `'email'`, `'current-password'`, `'new-password'` for login/registration forms.
- Forced to `'off'` when `readonly` is `true` — readonly fields should never trigger browser autofill.


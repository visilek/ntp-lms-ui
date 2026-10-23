# NtpSelect

A single-select dropdown with autosuggest. Options loaded via injected loader.

## Import

```ts
import { NtpSelect } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `DropdownValue \| null` | `null` | Selected value |
| `label` | `string` | `''` | Floating label |
| `variant` | `InputVariant` | `'filled'` | Visual style |
| `contextColor` | `InputContextColor` | `'surface'` | Background context |
| `loadOptions` | `DropdownOptionLoader` | — | Optional. Async loader for dynamic options. When omitted, `preloadedOptions` serves as the full option set. |
| `preloadedOptions` | `DropdownOption[]` | `[]` | Options available at mount — labels resolve without API call |
| `mapToOptions` | `DropdownOptionMapper` | default | Maps raw entities to options |
| `clearable` | `boolean` | `true` | Show clear button |
| `disabled` | `boolean` | `false` | Disabled |
| `readonly` | `boolean` | `false` | Readonly |
| `errors` | `string[]` | `[]` | Error messages |
| `hint` | `string` | `''` | Supporting text |
| `required` | `boolean` | `false` | Visual asterisk |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `DropdownValue \| null` | Selection changed |
| `blur` | — | Menu closed |
| `focus` | — | Menu opened |
| `load-error` | `Error` | Loader failed |

## Behavior

- Open: input becomes search field.
- Preload (≤15): local filtering.
- Async (>15): debounced API search.
- "Load more" footer with spinner.
- Label resolution: loaded options → preloaded options → API → `#value`.

### Static Mode

When `loadOptions` is omitted, the component operates in static mode:

- `preloadedOptions` is the full option set.
- No API calls.
- Filtering is synchronous (no debounce).
- No pagination, no "Load more".

```html
<NtpSelect v-model="status" label="Status" :preloaded-options="statusOptions" />
```

## Usage

### Basic

```html
<NtpSelect v-model="sectionId" label="Section" :load-options="loadSections" />
```

### With Preloaded Options

```html
<NtpSelect
  v-model="sectionId"
  label="Section"
  :load-options="loadSections"
  :preloaded-options="[
    { value: 'physics', label: 'Physics' },
  ]"
/>
```

### Programmatic Reset

Changing `v-model` externally updates the selection. If the new value isn't in loaded options, the component loads options to resolve the label.
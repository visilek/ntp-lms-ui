# NtpMultiSelect

A multi-select dropdown with autosuggest, master checkbox, and selected/available views.

## Import

```ts
import { NtpMultiSelect } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `DropdownValue[]` | `[]` | Selected values |
| `label` | `string` | `''` | Floating label |
| `variant` | `InputVariant` | `'filled'` | Visual style |
| `contextColor` | `InputContextColor` | `'surface'` | Background context |
| `loadOptions` | `DropdownOptionLoader` | required | Async loader |
| `preloadedOptions` | `DropdownOption[]` | `[]` | Options available at mount |
| `mapToOptions` | `DropdownOptionMapper` | default | Maps entities |
| `disabled` | `boolean` | `false` | Disabled |
| `readonly` | `boolean` | `false` | Readonly |
| `errors` | `string[]` | `[]` | Error messages |
| `hint` | `string` | `''` | Supporting text |
| `required` | `boolean` | `false` | Visual asterisk |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `DropdownValue[]` | Selection changed |
| `blur` | — | Menu closed |
| `focus` | — | Menu opened |
| `load-error` | `Error` | Loader failed |

## Behavior

- Closed label: last selected label, e.g., `Physics (+2)`.
- Header: master checkbox (when >5 options), warning icon (async), mode toggle.
- "Selected" view: only selected items.
- "Available" view: loaded options with selected highlight.
- "Load more" only in available view.
- Label resolution: loaded → preloaded → API → `#value`.

## Usage

### Basic

```html
<NtpMultiSelect v-model="selectedIds" label="Sections" :load-options="loadSections" />
```

### With Preloaded Options

```html
<NtpMultiSelect
  v-model="selectedIds"
  label="Sections"
  :load-options="loadSections"
  :preloaded-options="[
    { value: 'physics', label: 'Physics' },
    { value: 'math', label: 'Mathematics' },
  ]"
/>
```

### Programmatic Reset

Changing `v-model` externally updates the selection. Missing labels resolve via preloaded or API.
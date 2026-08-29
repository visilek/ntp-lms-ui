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
| `modelValue` | `Array<string \| number>` | `[]` | Selected values |
| `initialOptions` | `DropdownOption[]` | `[]` | Initial selected options |
| `label` | `string` | `''` | Floating label |
| `variant` | `InputVariant` | `'filled'` | Visual style |
| `contextColor` | `InputContextColor` | `'surface'` | Background context |
| `loadOptions` | `DropdownOptionLoader` | required | Async loader |
| `mapToOptions` | `DropdownOptionMapper` | default | Maps entities |
| `disabled` | `boolean` | `false` | Disabled |
| `readonly` | `boolean` | `false` | Readonly |
| `errors` | `string[]` | `[]` | Error messages |
| `hint` | `string` | `''` | Supporting text |
| `required` | `boolean` | `false` | Visual asterisk |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `Array<string \| number>` | Selection changed |
| `blur` | — | Menu closed |
| `focus` | — | Menu opened |
| `load-error` | `Error` | Loader failed |

## Behavior

- Closed label: last selected label, e.g., `Physics (+2)`.
- Header: master checkbox (when >5 options), warning icon (async), mode toggle.
- "Selected" view: only selected items.
- "Available" view: loaded options with selected highlight.
- "Load more" only in available view.

## Usage

```html
<NtpMultiSelect v-model="selectedIds" label="Sections" :load-options="loadSections" />
```

### Programmatic Values / Reset

`initialOptions` serves two purposes:

1. **Initial labels** — provides labels for values set before mount.
2. **Programmatic reset** — changing `initialOptions` updates the selection.

```html
<NtpMultiSelect
  v-model="selectedIds"
  :initial-options="selectedSections"
  :load-options="loadSections"
/>
```

When `selectedSections` changes in the consumer, the multiselect updates `modelValue` accordingly.

Without `initialOptions`, programmatic values show as `#value` until the menu loads matching options.
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
| `modelValue` | `string \| number \| null` | `null` | Selected value |
| `initialOption` | `DropdownOption \| null` | `null` | Initial selected option |
| `label` | `string` | `''` | Floating label |
| `variant` | `InputVariant` | `'filled'` | Visual style |
| `contextColor` | `InputContextColor` | `'surface'` | Background context |
| `loadOptions` | `DropdownOptionLoader` | required | Async loader |
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
| `update:modelValue` | `string \| number \| null` | Selection changed |
| `blur` | — | Menu closed |
| `focus` | — | Menu opened |
| `load-error` | `Error` | Loader failed |

## Behavior

- Open: input becomes search field.
- Preload (≤15): local filtering.
- Async (>15): debounced (300ms) API search.
- "Load more" footer with spinner.
- Search cleared on close.

## Usage

```html
<NtpSelect v-model="sectionId" label="Section" :load-options="loadSections" />
```

### Programmatic Value / Reset

`initialOption` serves two purposes:

1. **Initial label** — provides the label for a value set before mount.
2. **Programmatic reset** — changing `initialOption` updates the selection.

```html
<NtpSelect
  v-model="sectionId"
  :initial-option="selectedSection"
  :load-options="loadSections"
/>
```

When `selectedSection` changes in the consumer, the select updates `modelValue` accordingly.

Without `initialOption`, programmatic values show as `#value` until the menu loads the matching option.
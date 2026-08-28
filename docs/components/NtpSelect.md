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
| `initialOption` | `DropdownOption \| null` | `null` | Initial selected option — provides label for programmatic values |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual style |
| `contextColor` | `'primary' \| 'secondary' \| 'surface'` | `'surface'` | Background context |
| `loadOptions` | `DropdownOptionLoader` | required | Async loader |
| `mapToOptions` | `DropdownOptionMapper` | default mapper | Maps raw entities to options |
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

- **Open:** loads first page (15 items). Input becomes search field.
- **Preload mode (≤15):** filters locally as the user types.
- **Async mode (>15):** debounced (300ms) API search.
- **"Load more"** in footer when more results exist. Spinner while loading.
- **Search cleared on close.**
- **Selected label resolution:** cached option → loaded options → `#value` fallback.

## Usage

```html
<NtpSelect
  v-model="sectionId"
  label="Section"
  :load-options="loadSections"
/>
```

### With Initial Option

```html
<NtpSelect
  v-model="sectionId"
  label="Section"
  :initial-option="{ value: 'mechanics', label: 'Mechanics' }"
  :load-options="loadSections"
/>
```

### Custom Mapper

```html
<NtpSelect
  v-model="contentElementId"
  label="Content Element"
  :load-options="loadContentElements"
  :map-to-options="(item) => ({
    value: item.id,
    label: `${item.title} (${item.kind})`,
  })"
/>
```

## Accessibility

- Combobox pattern: input is the search field.
- Menu has `role="menu"` with `role="menuitem"` items.
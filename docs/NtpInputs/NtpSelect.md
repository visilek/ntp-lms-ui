# NtpSelect

A single-select dropdown with search. Options are loaded via a factory-created async loader. Follows the unified dropdown data strategy (ADR-0005).

## Import

```ts
import { NtpSelect } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `T \| null` | `null` | Selected value (generic `T extends string \| number`) |
| `loadOptions` | `(query: string, page: number, pageSize: number) => Promise<{ items: Option[], totalCount: number }>` | **required** | Factory-created loader bound to a specific endpoint |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual container style |
| `placeholder` | `string` | `''` | Shown when no selection |
| `clearable` | `boolean` | `true` | Shows a clear button (×) when a value is selected |
| `emptyText` | `string` | `'No results'` | Shown when no options match the search query |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Readonly state |
| `error` | `string` | `''` | Error message. Replaces hint. |
| `hint` | `string` | `''` | Supporting text. Hidden when error is set. |
| `required` | `boolean` | `false` | Asterisk on label |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `option` | `{ option, selected }` | Custom option content. Radio indicator rendered by component. |
| `loading` | — | Content shown while fetching. Defaults to spinner. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `T \| null` | Selected value, or `null` when cleared |
| `blur` | — | Dropdown closed |
| `focus` | — | Dropdown opened |

## Option Type

```ts
interface DropdownOption<T extends string | number> {
  value: T
  label: string
  disabled?: boolean
}
```

## Data Loading

| Mode | Condition | Behavior |
|---|---|---|
| Preload | `totalCount ≤ DROPDOWN_PRELOAD_LIMIT` | All items loaded on open. Client-side filtering. |
| Async | `totalCount > DROPDOWN_PRELOAD_LIMIT` | Debounced server search on typing. |

Mode re-evaluated on every open.

## Label Behavior

| State | Filled | Outlined |
|---|---|---|
| Closed, empty | Label inside | Label inside |
| Closed, has selection | Label floated above field | Label floated in notch |
| Open (search mode) | Label stays floated | Label stays floated in notch |

## Input Area Behavior

| State | Display |
|---|---|
| Closed, empty | Placeholder |
| Closed, has selection | Selected option label + clear button |
| Open | Search input |

## Usage Examples

### Basic

```html
<NtpSelect
  v-model="courseId"
  :load-options="loadCourses"
  label="Course"
/>
```

### With Placeholder

```html
<NtpSelect
  v-model="sectionId"
  :load-options="loadSections"
  label="Section"
  placeholder="Select a section"
/>
```

### Outlined Variant

```html
<NtpSelect
  v-model="difficulty"
  :load-options="loadDifficulties"
  label="Difficulty"
  variant="outlined"
/>
```

### Not Clearable

```html
<NtpSelect
  v-model="courseId"
  :load-options="loadCourses"
  label="Course"
  :clearable="false"
/>
```

### Custom Option Rendering

```html
<NtpSelect v-model="userId" :load-options="loadUsers" label="Student">
  <template #option="{ option, selected }">
    <div class="user-option">
      <Avatar :src="option.avatarUrl" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</NtpSelect>
```

### With Error

```html
<NtpSelect
  v-model="courseId"
  :load-options="loadCourses"
  label="Course"
  error="Course is required"
/>
```

## Loader Factory Example

```ts
// In the consuming app
function createDropdownLoader(endpoint: string) {
  return async (query: string, page: number, pageSize: number) => {
    const params = new URLSearchParams({
      search: query,
      page: String(page),
      pageSize: String(pageSize),
    })
    const response = await fetch(`${endpoint}?${params}`)
    return response.json() // { items, totalCount }
  }
}

const loadCourses = createDropdownLoader('/api/courses')
```

## Accessibility

- Renders a combobox pattern (`role="combobox"` with `aria-expanded`, `aria-controls`).
- Options list has `role="listbox"`. Options have `role="option"` and `aria-selected`.
- Keyboard navigation: Arrow Up/Down to navigate options, Enter to select, Escape to close.
- Clear button has `aria-label="Clear selection"`.
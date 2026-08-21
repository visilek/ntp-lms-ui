# NtpMultiSelect

A multi-select dropdown with search and checkbox options. Options are loaded via a factory-created async loader. Follows the unified dropdown data strategy (ADR-0005).

## Import

```ts
import { NtpMultiSelect } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `T[]` | `[]` | Selected values (generic `T extends string \| number`) |
| `loadOptions` | `(query: string, page: number, pageSize: number) => Promise<{ items: Option[], totalCount: number }>` | **required** | Factory-created loader |
| `label` | `string` | `''` | Floating label |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | Visual container style |
| `placeholder` | `string` | `''` | Shown when no selections |
| `emptyText` | `string` | `'No results'` | Shown when no options match the search query |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Readonly state |
| `error` | `string` | `''` | Error message. Replaces hint. |
| `hint` | `string` | `''` | Supporting text. Hidden when error is set. |
| `required` | `boolean` | `false` | Asterisk on label |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `option` | `{ option, selected }` | Custom option content. Checkbox indicator rendered by component. |
| `loading` | — | Content shown while fetching. Defaults to spinner. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `T[]` | Array of selected values |
| `blur` | — | Dropdown closed |
| `focus` | — | Dropdown opened |

## Data Loading

Same as `NtpSelect`. See ADR-0005.

## Label Behavior

Same as `NtpSelect`.

## Input Area Behavior

| State | Display |
|---|---|
| Closed, empty | Placeholder |
| Closed, has selections | Count chip `[N]` — number only, not dismissible |
| Open | Search input |

## "All" Option

- Available when both options are met:
	- **preload mode** (`totalCount ≤ DROPDOWN_PRELOAD_LIMIT`);
	- `totalCount > 5`
- Rendered at top of options list, visually separated by a divider.
- Tri-state group checkbox semantics:
  - None selected → unchecked
  - All selected → checked
  - Some selected → indeterminate
- Click behavior:
  - Unchecked/indeterminate → select all options
  - Checked → deselect all options

## Count Chip

- Displayed when at least one item is selected.
- Contains **only the number** — no text, no labels.
- Not dismissible. Not customizable.
- To change selection, open the dropdown.

## Usage Examples

### Basic

```html
<NtpMultiSelect
  v-model="selectedStudentIds"
  :load-options="loadStudents"
  label="Students"
/>
```

### Outlined Variant

```html
<NtpMultiSelect
  v-model="selectedPermissions"
  :load-options="loadPermissions"
  label="Permissions"
  variant="outlined"
/>
```

### Custom Option Rendering

```html
<NtpMultiSelect v-model="selectedIds" :load-options="loadUsers" label="Participants">
  <template #option="{ option, selected }">
    <div class="user-option">
      <Avatar :src="option.avatarUrl" />
      <span>{{ option.label }}</span>
    </div>
  </template>
</NtpMultiSelect>
```

### With Error

```html
<NtpMultiSelect
  v-model="selectedIds"
  :load-options="loadStudents"
  label="Students"
  error="Select at least one student"
/>
```

## Accessibility

- Combobox pattern with `role="combobox"`.
- Options list has `role="listbox"` with multi-selectable options (`aria-multiselectable="true"`).
- Each option has `role="option"` and `aria-selected`.
- "All" option behaves as a group checkbox with indeterminate state.
- Keyboard navigation same as `NtpSelect`.
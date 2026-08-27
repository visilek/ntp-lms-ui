# NtpSelect — Implementation Notes

## Structure

```
NtpInputs/
├── NtpSelect.vue
└── NtpSelect.css
```

## Composition

- `useInputBase` — shared input shell (label, hint/errors, context colors).
- `NtpMenu` — dropdown panel with header slot for search.
- `NtpTextInput` — search input inside menu header.
- `DropdownLoader` — consumer-provided data access.

## Data Loading

| Mode | Condition | Behavior |
|---|---|---|
| Preload | `totalCount ≤ 15` | All items loaded. No search. |
| Async | `totalCount > 15` | Search via debounced API. |

Mode re-evaluated on every open.

## Input Area

- Visually identical to regular input shell.
- Read-only — not editable.
- Click opens menu.
- Closed, empty: label resting, ▾.
- Closed, has value: floating label + selected value + [×] + ▾.
- Open: floating label, selected value visible, ▾.

## Search

- In menu header, only async mode.
- NtpTextInput.
- Debounced loader call.

## Options Rendering

- `NtpMenu` data-driven `items`.
- Option: `{ value, label }` from loader.
- Radio-style selection indicator? Or plain menu items with selected state? For v1: plain menu items — selected item visually highlighted.

## Selected Value Display

- If selected option in loaded list → show its label.
- If selected value not in current loaded items (async, programmatic set) → attempt to resolve label from cache; fallback to raw value.

## Clear Button

- [×] when value selected + clearable.
- Coexists with ▾.
- Emits null.

## Dropdown Arrow

- ▾ icon in trailing slot.
- Always visible? Or replaced by × when clearable + value selected?

## Menu Anchor

- Input's root element (component instance → `$el`).

## Events

- `update:modelValue` — selected value or `null`.
- `blur` — menu closed.
- `focus` — menu opened.

## Accessibility

- Combobox pattern: `role="combobox"`, `aria-expanded`, `aria-controls`.
- Menu items have `role="menuitem"` (from `NtpMenu`).
- Keyboard: menu handles arrows + Escape.
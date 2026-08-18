# NtpSelect — Implementation Notes

## Structure
- Custom combobox. Not a native `<select>`.
- Input area: button-like element with `role="combobox"`, `aria-expanded`, `aria-controls`.
- Dropdown panel: teleported to body (avoid overflow clipping). Positioned via JS (Popper-like logic or manual calculation).

## Data Loading
- On open: call `loadOptions('', 1, DROPDOWN_PRELOAD_LIMIT)`.
- If `totalCount ≤ LIMIT` → preload mode. Store items locally. Client-side filter on typing.
- If `totalCount > LIMIT` → async mode. Debounced (300ms) `loadOptions(query, 1, LIMIT)` on typing.
- Re-evaluate on every open.

## Search Mode
- On open: input area switches from selected value display to search input.
- Search query is local state, not part of v-model.
- On close: query discarded. Input area returns to selected value display.

## Clearable
- Clear button (×) appears when `clearable` is `true` and value is not `null`.
- On click: emit `update:modelValue` with `null`. Close dropdown if open.
- Clear button does not open/close the dropdown.

## Keyboard Navigation
- Arrow Down/Up: navigate options.
- Enter: select highlighted option, close dropdown.
- Escape: close dropdown, restore selection display.
- Tab: close dropdown, move focus.

## Selected Option Display
- Closed state: shows the label of the selected option.
- If selected option not in currently loaded items (e.g., async mode, value set programmatically): attempt to resolve label from a cached "selected option" map, or show raw value as fallback.

## Edge Cases
- Programmatic `modelValue` change to `null` — clear selection.
- Programmatic `modelValue` set to a value not in loaded options — still display something meaningful.
- Loader throws error — show error state inside dropdown? Or emit error event? For v1: show `emptyText` with error styling. Log to console.
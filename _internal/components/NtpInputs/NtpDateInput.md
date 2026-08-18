# NtpDateInput — Implementation Notes

## Native Element
Uses native `<input type="date">`. No custom picker.

## Shared Shell
Uses `useInputBase` composable. See `NtpTextInput` internal notes for variant, label, and error details.

## v-model Type
Emits `string | null`. ISO format (`YYYY-MM-DD`). No `Date` object conversion.

## Clearing
Native date input has no built-in clear. Consumer provides clear button via `trailing` slot. On clear, parent sets `modelValue` to `null`.

## Browser Quirks
- Chrome: empty input shows `dd.mm.yyyy` format placeholder. Not controllable.
- Safari: date input may render as text with no picker on older versions.
- Firefox: full native picker support.

## Styling
- Container styled to match kit. Internal date segments remain native.
- Calendar icon is browser-specific and not controllable via CSS in Chrome.
- Consider hiding the native icon via `::-webkit-calendar-picker-indicator` and providing a custom `leading` icon if design requires consistency.

## Future Considerations
- If locale-specific formatting becomes necessary, add a formatting layer that displays a custom format while storing ISO.
- If browser inconsistency becomes a problem, evaluate a custom calendar picker (out of scope for v1).
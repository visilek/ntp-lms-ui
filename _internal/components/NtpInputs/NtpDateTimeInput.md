# NtpDateTimeInput — Implementation Notes

## Native Element
Uses native `<input type="datetime-local">`. No custom picker.

## Shared Shell
Uses `useInputBase` composable.

## v-model Type
Emits `string | null`. ISO format (`YYYY-MM-DDTHH:mm`). No time zone — local browser time.

## Step
- `step` prop controls time increment in seconds.
- Default `60` (1 minute).
- Passed to native `step` attribute. Browser picker respects it for time selection.

## Browser Quirks
- Chrome: full datetime-local picker.
- Safari: partial support, may fall back to text input.
- Firefox: full support.

## Styling
Same as `NtpDateInput`. Native segments not stylable.

## Future Considerations
- Time zone support if cross-timezone use cases emerge.
- Custom datetime picker if native becomes insufficient.
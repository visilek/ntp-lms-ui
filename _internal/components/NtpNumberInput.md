# NtpNumberInput — Implementation Notes

## Native Element
Uses native `<input type="number">`. Browser provides increment/decrement arrows.

## Input Filtering
Listens to `beforeinput` or `input` events to reject invalid characters:
- `precision: 0`: digits and minus sign only. Decimal separator rejected.
- `precision > 0`: digits, minus sign, one decimal separator allowed.
- Reject second decimal separator.
- Reject invalid minus placement (not at start).

## v-model Type
Emits `number | null`, never a string. Parsing happens on input.
- Empty string after parsing → `null`.
- Invalid intermediate states (e.g., user typed `-` or `1.`) → hold local string, don't emit until valid or blur.

## Clamping on Blur
- On blur: if value is valid number and `min`/`max` defined → clamp.
- If value is invalid (e.g., just `-`) → emit `null`.

## Precision and step
- `precision` controls decimal places. Used for `step` calculation if `step` prop is not explicitly provided. Default `step: 1` matches `precision: 0`.
- If `precision: 2` and no `step` provided, step should be `0.01`.

## Variants
Same filled/outlined implementation as `NtpTextInput`. See `NtpTextInput` internal notes for variant details.

## Shared Shell
Uses `useInputBase` composable. See `NtpTextInput` internal notes for details.

## Required

- Prop adds `ntp-input--required` class (via `useInputBase`).
- CSS appends red asterisk to floating label.
- Sets `aria-required="true"` on the native input.
- Visual + semantic. No validation — consumer handles via `errors`.
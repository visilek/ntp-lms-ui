# NtpTextInput — Implementation Notes

## Native Element
Uses native `<input>`. No custom element. `type` limited to `'text' | 'password' | 'email'`.

## Input Base Composable
Shares visual shell with `NtpNumberInput` (and future select/autosuggest/date inputs) via a `useInputBase` composable:
- Wrapper structure: leading slot + input + trailing slot
- Floating label logic (focused / has-value / placeholder)
- Hint/error display
- State class computation (disabled, readonly, error)

## Variants

### Filled
- Background: `$color-surface-container-highest` or similar token
- Border: bottom only, 1px. 2px on focus.
- Label floated: above input, within field padding.
- Padding: larger top padding to accommodate floated label.

### Outlined
- Background: transparent
- Border: full outline, 1px. 2px on focus.
- Label floated: on the top border with a notch.
- Implementation: `<fieldset>` + `<legend>`. The floating label is the `<legend>`. Browser cuts the border around the legend automatically.
- Notch background: the `<legend>` has a background color matching the container surface. Exposed via CSS variable `--ntp-input-notch-bg`. Consumer can override if the input sits on a non-default surface.
- Limitation: notch is not truly transparent. Acceptable for v1 — LMS inputs sit on solid surfaces (cards, paper). If true transparency becomes necessary, migrate to split-border approach with measured label width.

## Autocomplete
- When `readonly` is `true`, force `autocomplete="off"` regardless of prop.
- Autofill styling must be neutralized (Chrome yellow/blue background) via CSS:
  ```scss
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px transparent inset;
    transition: background-color 9999s ease-out;
  }
  ```

## Floating Label
- Label sits inside field when empty and unfocused.
- Shrinks and moves to top border on focus or when value is non-empty.
- Error state: label changes to error color.
- Empty `label` prop → no label rendered. Placeholder only.

## Error vs Hint
- `error` non-empty → show error message, hide hint.
- Error message and label use error color.
- Input border changes to error color.

## State Precedence
- `disabled` > `readonly` > default.
- Error styling applies on top of any state.
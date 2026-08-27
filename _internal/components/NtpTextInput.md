# NtpTextInput — Implementation Notes

## Structure

```
NtpInputs/
├── NtpTextInput.vue
└── NtpTextInput.css
```

## Shared Composable

Uses `useInputBase` for:
- ID generation
- Floating label state
- Wrapper classes
- Error/hint support text

## Floating Label

- CSS-only transitions.
- `--label-floating` class from composable drives the state.
- Filled: label floats to top inside field.
- Outlined: label floats onto the border with notch background.

## Leading Slot

- Fixed 24px width.
- `:has()` selector adjusts label offset when leading present.
- Prevents label misalignment with arbitrary icon sizes.

## Context Colors

Three contexts: surface, primary, secondary.

| Context | Filled Label | Outlined Label | Border |
|---|---|---|---|
| surface | primary when floating | primary when floating | outline → primary focused |
| primary | primary when floating | on-primary | on-primary |
| secondary | secondary when floating | on-secondary | on-secondary |

## Required

- Prop adds `ntp-input--required` class (via `useInputBase`).
- CSS appends red asterisk to floating label.
- Sets `aria-required="true"` on the native input.
- Visual + semantic. No validation — consumer handles via `errors`.

## Error State

Error always overrides context colors — uses `!important` for label and border.

## Readonly

- No border.
- `cursor: default`.
- Still focusable for selection.
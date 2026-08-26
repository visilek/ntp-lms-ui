# NtpConfirmationDialog — Implementation Notes

## Structure

```
NtpConfirmationDialog/
└── NtpConfirmationDialog.vue
```

No CSS file — utilities handle layout.

## Composition

- `NtpDialog` — container.
- `NtpDialogHeader` — title + icon.
- `NtpButton` — confirm/cancel.
- `NtpTextInput` — type-to-confirm (optional).

## Behavior

- Confirm: emits `confirm`. Does NOT auto-close.
- Cancel: emits `cancel` + `update:open false`.
- Type-to-confirm: confirm disabled until phrase matched.

## Icon

- Default `''` — no icon.
- When set → centered header per MD3.
# NtpConfirmationDialog — Implementation Notes

## Composition

```
NtpConfirmationDialog
└── NtpDialog
    ├── NtpDialogHeader (title, icon)
    ├── Body:
    │   ├── message prop OR default slot
    │   └── NtpTextInput (if confirmationPhrase is non-empty)
    └── Footer: default buttons OR footer slot
```

## Button Modes

| Mode | Confirm | Cancel |
|---|---|---|
| `text` | `NtpButton variant="text" color={confirmColor}` | `NtpButton variant="text" color="on-surface-variant"` |
| `filled` | `NtpButton variant="filled" color={confirmColor}` | `NtpButton variant="outlined" color="on-surface-variant"` |

## Type-to-Confirm

- Local `typedPhrase` ref.
- `isMatch = computed(() => typedPhrase.value === props.confirmationPhrase)`
- Confirm button `disabled` bound to `!isMatch`.
- Live match — no blur handling.
- `NtpTextInput` bound to `typedPhrase`.
- Input label: `Type {confirmationPhrase} to confirm`.

## Event Handling

- `confirm` emitted. Does not set `open` to `false`.
- `cancel` emitted. Sets `open` to `false`.
- Dialog backdrop/Escape: emits `cancel`, sets `open` to `false`.

## Loading

- `loading` bound to confirm button's `loading` prop.
- While loading, confirm button not clickable.

## Edge Cases

- `message` empty and no default slot → empty body.
- `confirmationPhrase` empty → no input rendered.
- `persistent` → backdrop/Escape ignored.
- Custom `footer` slot → default buttons not rendered. Consumer handles all events.
# NtpTooltip — Implementation Notes

## Structure

```
NtpTooltip/
├── NtpTooltip.vue
└── NtpTooltip.css
```

## Visibility

- `isVisible` ref toggled on mouseenter/mouseleave + focusin/focusout.
- CSS absolute positioning — no Teleport.

## Future

- Viewport edge detection / flipping.
- `aria-describedby` wiring.
```

---

Create both docs. Update `components/index.ts`:

```ts
export { default as NtpTooltip } from './NtpTooltip/NtpTooltip.vue'
```

Then commit:

```bash
git add .
git commit -m "feat(NtpTooltip): hover tooltip component"
```
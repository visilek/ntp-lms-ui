# NtpCard

A bare card container following MD3. No internal padding — consumers apply spacing utilities.

## Import

```ts
import { NtpCard } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'elevated' \| 'filled' \| 'outlined'` | `'elevated'` | Card style |
| `clickable` | `boolean` | `false` | Interactive card. Hover state. Emits `click`. |

### Slots

| Slot | Description |
|---|---|
| `default` | Card content |

### Events

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Emitted only when `clickable` is `true`. |

## Variants

| Variant | Background | Border | Shadow |
|---|---|---|---|
| `elevated` | Surface | None | Level 1 (level 2 on hover if clickable) |
| `filled` | Surface container highest | None | None |
| `outlined` | Surface | 1px outline | None |

## Usage

See [NtpCard Family](./index.md) for composition patterns.

## Accessibility

- `clickable` cards render as `<button type="button">` for keyboard accessibility.
- Non-clickable cards render as `<div>`.
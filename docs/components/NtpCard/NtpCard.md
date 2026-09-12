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
| `color` | `'surface' \| 'primary' \| 'secondary' \| 'tertiary'` | `'surface'` | Background tint |
| `clickable` | `boolean` | `false` | Interactive card |

### Slots

| Slot | Description |
|---|---|
| `default` | Card content |

### Events

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Emitted only when `clickable` is `true` |

## Variants

| Variant | Background | Border | Shadow |
|---|---|---|---|
| `elevated` | Surface | None | Level 1 (level 2 on hover if clickable) |
| `filled` | Surface container highest | None | None |
| `outlined` | Surface | 1px outline | None |

## Colors

`color` overrides the background with a container tint. Variant effects (shadow, border) remain.

| Color | Background |
|---|---|
| `surface` | Default per variant |
| `primary` | Primary container tint |
| `secondary` | Secondary container tint |
| `tertiary` | Tertiary container tint |

## Usage

```html
<NtpCard>
  <div class="ntp-pa-4">
    <NtpCardHeader title="Physics 101" subtitle="Mechanics" />
    <p>Card content</p>
  </div>
</NtpCard>

<NtpCard color="primary" clickable @click="openCourse">
  <div class="ntp-pa-4">...</div>
</NtpCard>
```

## Accessibility

- `clickable` cards render with `role="button"` and `tabindex="0"`.
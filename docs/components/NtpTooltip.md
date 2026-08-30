# NtpTooltip

A simple tooltip that appears on hover or focus of its trigger content.

## Import

```ts
import { NtpTooltip } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | required | Tooltip content |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position relative to trigger |

### Slots

| Slot | Description |
|---|---|
| `default` | Trigger content |

## Usage

```html
<NtpTooltip text="Selects only what's currently loaded.">
  <NtpButton icon-only aria-label="Warning">⚠</NtpButton>
</NtpTooltip>
```

## Accessibility

- Shows on hover and keyboard focus.
- `role="tooltip"` on the content.
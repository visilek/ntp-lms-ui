# NtpCardHeader

Avatar + title + subtitle block for card headers. Supports overlay treatment for use over media or color fills.

## Import

```ts
import { NtpCardHeader } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Primary title text |
| `subtitle` | `string` | `''` | Secondary text below title |
| `avatar` | `string` | `''` | Avatar image URL |
| `overlay` | `'none' \| 'scrim' \| 'solid'` | `'none'` | Visual treatment over media/color |

### Slots

| Slot | Description |
|---|---|
| `avatar` | Custom avatar content. Overrides `avatar` prop. |
| `title` | Custom title content. Overrides `title` prop. |
| `subtitle` | Custom subtitle content. Overrides `subtitle` prop. |

## Overlay Modes

| Mode | Description |
|---|---|
| `none` | Default. Text uses standard tokens. |
| `scrim` | Dark gradient behind header. White text. |
| `solid` | Semi-transparent dark background. White text. |

## Usage

See [NtpCard Family](components/NtpCard/index.md) for composition patterns.

## Accessibility

- Renders semantic heading elements? Or plain divs? For v1: plain divs with appropriate text styling. Consumers wrap with heading tags if needed.
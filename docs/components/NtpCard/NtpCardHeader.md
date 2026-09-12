# NtpCardHeader

Avatar + title + subtitle block for card headers. Supports overlay modes for use over media.

## Import

```ts
import { NtpCardHeader } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Primary title |
| `subtitle` | `string` | `''` | Secondary text |
| `avatar` | `string` | `''` | Avatar image URL (40dp) |
| `overlay` | `'none' \| 'scrim' \| 'solid'` | `'none'` | Visual treatment over media/color |

### Slots

| Slot | Description |
|---|---|
| `default` | Action content (right-aligned) |
| `avatar` | Custom avatar. Overrides `avatar` prop. |
| `title` | Custom title. Overrides `title` prop. |
| `subtitle` | Custom subtitle. Overrides `subtitle` prop. |

## Color Inheritance

- Title inherits the card's `color`.
- Subtitle inherits with 75% opacity (muted).
- Overlay modes force white text.

## Overlay Modes

| Mode | Use |
|---|---|
| `none` | Header over normal card surface |
| `scrim` | Dark gradient — header over image |
| `solid` | Semi-transparent dark background |

## Usage

```html
<!-- Normal -->
<NtpCardHeader title="John Doe" subtitle="2 hours ago" avatar="..." />

<!-- Over media -->
<NtpCard>
  <div style="position: relative;">
    <NtpMedia :media="{ src: 'cover.jpg' }" />
    <div style="position: absolute; bottom: 0; left: 0; right: 0;">
      <NtpCardHeader title="Title" subtitle="Subtitle" overlay="scrim" />
    </div>
  </div>
</NtpCard>
```

## Accessibility

- Avatar has empty `alt` (decorative) or consumer-provided alt via slot.
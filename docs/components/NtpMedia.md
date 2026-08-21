# NtpMedia

A generic media container for images. Applies aspect ratio and object-fit. Works in cards, detail pages, lists, anywhere.

## Import

```ts
import { NtpMedia } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | `''` | Image URL |
| `alt` | `string` | `''` | Alt text |
| `aspectRatio` | `string` | `'16 / 9'` | CSS aspect-ratio. `'auto'` for natural height. |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none'` | `'cover'` | CSS object-fit |

### Slots

| Slot | Description |
|---|---|
| `default` | Custom media content. Overrides `src`. |

## Usage

```html
<NtpMedia src="cover.jpg" alt="Course cover" aspect-ratio="21 / 9" />
```

```html
<NtpMedia aspect-ratio="1 / 1">
  <MyCustomChart />
</NtpMedia>
```

## Accessibility

- Renders `<img>` with `alt` text.
- Custom slot content: consumer is responsible for accessibility.
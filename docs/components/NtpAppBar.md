# NtpAppBar

A top app bar layout following MD3. Three regions: leading, title, actions.

## Import

```ts
import { NtpAppBar } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Title text |
| `subtitle` | `string` | `''` | Subtitle below title |
| `height` | `'small' \| 'medium' \| 'large'` | `'small'` | Height preset |

### Slots

| Slot | Description |
|---|---|
| `leading` | Left content |
| `default` | Title area. Overrides `title`/`subtitle`. |
| `actions` | Right-aligned actions |

## Usage

```html
<NtpAppBar title="Settings" />
<NtpAppBar title="Edit" subtitle="Course details" height="medium" />
```

## Accessibility

- Renders `<header>` element.
- Leading/actions content must provide accessible labels.
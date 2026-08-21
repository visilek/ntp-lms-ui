# NtpSpinner

An indeterminate circular progress indicator following MD3.

## Import

```ts
import { NtpSpinner } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size preset |
| `color` | `'primary' \| 'on-surface-variant' \| 'surface'` | `'primary'` | Spinner color |

## Usage Examples

### Basic

```html
<NtpSpinner />
```

### Small

```html
<NtpSpinner size="small" />
```

### Custom Color

```html
<NtpSpinner color="on-surface-variant" />
```

## Accessibility

- Renders with `role="progressbar"` and `aria-busy="true"`.
- Indeterminate — no `aria-valuenow`.
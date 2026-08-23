# NtpButton

A button component following Material Design principles. Supports filled, outlined, and text variants across three sizes and six color schemes.

## Import

```ts
import { NtpButton } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'filled' \| 'outlined' \| 'text'` | `'filled'` | Visual style |
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'error' \| 'on-surface-variant' \| 'surface'` | `'primary'` | Color scheme |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size preset |
| `disabled` | `boolean` | `false` | Prevents interaction. Muted styling. |
| `loading` | `boolean` | `false` | Shows spinner. Not clickable. Width preserved. |
| `block` | `boolean` | `false` | Stretches to full width of container. |
| `iconOnly` | `boolean` | `false` | Circular shape. Use when content is a single icon. |
| `ariaLabel` | `string` | `''` | Accessible label. **Required** when `iconOnly` is `true`. |
| `ariaLabelledby` | `string` | `''` | ID of an element that labels this button. Alternative to `ariaLabel`. |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Button content: text, icons, or both. |
| `loading` | — | Custom loading indicator. Falls back to default spinner. |

### Events

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Emitted on click. Not emitted when `disabled` or `loading`. |

## Variants

| Variant | Description |
|---|---|
| `filled` | Solid background filled with the color. |
| `outlined` | Transparent background. Colored border and text. |
| `text` | No background, no border. Colored text only. |

## Colors

| Color | Typical Use |
|---|---|
| `primary` | Main CTA. Default for most buttons. |
| `secondary` | Secondary actions. |
| `tertiary` | Accent actions. |
| `error` | Destructive actions. |
| `on-surface-variant` | Neutral icon buttons. Muted gray. |
| `surface` | White icon over media or color fill. |

## States

### Pressed

- Regular buttons: border radius flattens from full to medium on press.
- Icon-only buttons: scale down slightly (0.92) on press.
- Quick transition (150ms, decelerated easing).

### Loading

- Content stays in DOM, hidden with `visibility: hidden`.
- Spinner overlays centered.
- Button width preserved — no layout shift.

## Usage Examples

### Basic

```html
<NtpButton>Save</NtpButton>
<NtpButton variant="outlined" color="secondary">Cancel</NtpButton>
<NtpButton variant="text" color="error">Delete</NtpButton>
```

### Neutral Icon Button

```html
<NtpButton icon-only color="on-surface-variant" aria-label="More actions">
  <span class="material-symbols">more_vert</span>
</NtpButton>
```

### Loading

```html
<NtpButton :loading="isSaving">Save</NtpButton>
```

### Block

```html
<NtpButton block>Submit</NtpButton>
```

### Disabled

```html
<NtpButton disabled>Can't click</NtpButton>
```

## Accessibility

- Icon-only buttons **must** provide `ariaLabel` or `ariaLabelledby`.
- Disabled and loading buttons are removed from tab order.
- Button always renders `<button type="button">`.
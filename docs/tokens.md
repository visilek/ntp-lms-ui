# Design Tokens

CSS custom properties available to consumers. All tokens are namespaced with `ntp-`.

## Categories

| File | Purpose |
|---|---|
| `colors.css` | Color palette — primary, secondary, tertiary, error, surface |
| `typography.css` | Type scale — display, headline, title, body, label |
| `spacing.css` | Spacing scale — 4dp base |
| `elevation.css` | Shadow levels 0-5 |
| `shape.css` | Border radius scale |
| `motion.css` | Durations and easing curves |

## Usage

Tokens are available as CSS custom properties. Import once:

```ts
import 'ntp-lms-ui/styles'
```

Then use anywhere:

```css
.my-element {
  color: var(--ntp-color-primary);
  padding: var(--ntp-spacing-4);
  border-radius: var(--ntp-shape-medium);
  transition: all var(--ntp-duration-short) var(--ntp-easing-standard);
}
```

## Token Naming

Pattern: `--ntp-{category}-{role}`

| Category | Example |
|---|---|
| Colors | `--ntp-color-primary`, `--ntp-color-on-primary` |
| Typography | `--ntp-type-title-medium` |
| Spacing | `--ntp-spacing-4` |
| Elevation | `--ntp-elevation-2` |
| Shape | `--ntp-shape-medium` |
| Motion | `--ntp-duration-short`, `--ntp-easing-standard` |

## Source

Token definitions live in `src/tokens/`. The CSS files are the source of truth.
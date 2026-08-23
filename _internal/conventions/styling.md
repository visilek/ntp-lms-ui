# Styling

## Tokens

- All spacing/sizing/typography values reference tokens from `_tokens/`.
- No magic numbers for spacing (`padding: 12px` → `padding: var(--ntp-spacing-4)`).
- Percentages in `color-mix()` are acceptable as color state definitions.
- Elevation, spacing, typography follow MD3 scale.

## Component CSS Files

Separate CSS files in the component folder, imported scoped via `src`.

```vue
<style scoped src="./NtpButton.css"></style>
```

## Global Styles

No global styles except in `_base/`.

## CSS Local Variables

When drafting component CSS, evaluate the use of local variables (`--_component-*`) against two criteria:

1. **Structuring** — does the code become more organized and maintainable?
2. **Shortening** — does the amount of code reduce noticeably?

**Use local variables if either:**

- The code gets more structured AND the amount of code doesn't increase.
- The amount of code reduces noticeably.

**Do not use local variables if:**

- The code gets more complex/obscure without shortening.
- The component is simple enough that plain rules are clearer.

### Pattern

Base class defines **how** styles are applied (reads variables). Modifier classes define **what** values to use (sets variables).

```css
.component {
  /* Local state variables */
  --_comp-base: var(--ntp-color-on-surface);
  --_comp-on: var(--ntp-color-surface);
  --_comp-hover-bg: transparent;
  --_comp-hover-stroke: transparent;

  background-color: transparent;
  border: 1px solid var(--_comp-hover-stroke);
  color: var(--_comp-base);
}

.component--primary {
  --_comp-base: var(--ntp-color-primary);
  --_comp-on: var(--ntp-color-on-primary);
  --_comp-hover-bg: var(--ntp-color-primary-container);
}
```

### Color Pattern

For color variants, two core variables:

- `--_comp-base` — the color itself.
- `--_comp-on` — text on that color.

Filled uses `base` for background, `on` for text.
Outlined/text use `base` for text and border.

## color-mix() Derivation

Derive tints and transparent variants from base colors:

```css
/* Container tint — color + white */
background-color: color-mix(in srgb, var(--ntp-color-primary) 12%, white);

/* Translucent hover — color + transparent */
background-color: color-mix(in srgb, var(--_comp-base) 75%, transparent);

/* Dynamic tint — follows current text color */
background-color: color-mix(in srgb, currentColor 12%, transparent);
```

Always derive from a variable or `currentColor` — never hardcode derived colors.

## Specificity and Overrides

When a variant needs different hover/pressed behavior:

- Use higher specificity (two classes) for the override.
- Exclude the special variant from the generic rule with `:not()`.
- Use `var(--fallback)` for optional variables.

## Motion

Use motion tokens from `_tokens/motion.css`:

- `--ntp-duration-short` (150ms), `--ntp-duration-medium` (250ms), `--ntp-duration-long` (400ms)
- `--ntp-easing-standard`, `--ntp-easing-decelerated`, `--ntp-easing-accelerated`

### Pressed State

- Regular buttons: border-radius full → medium.
- Icon-only buttons: `transform: scale(0.92)`.
- Surface buttons: transparency increase.
- Uses `decelerated` easing.
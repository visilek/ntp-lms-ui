# Styling

## Tokens

- All values reference tokens from `tokens/` via CSS custom properties.
- No magic numbers (`padding: 12px` → `padding: var(--ntp-spacing-4)`).
- Elevation, spacing, typography follow Material Design 3 scale.

## Component CSS Files

Separate CSS files in the component folder, imported scoped via `src`.

```vue
<style scoped src="./NtpButton.css"></style>
```

## Global Styles

No global styles except in `base/`.

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

```css
.component {
  /* Local state variables */
  --_comp-bg: transparent;
  --_comp-border: transparent;
  --_comp-color: var(--ntp-color-on-surface);

  background-color: var(--_comp-bg);
  border: 1px solid var(--_comp-border);
  color: var(--_comp-color);
}

/* Modifier classes set the variables */
.component--primary {
  --_comp-bg: var(--ntp-color-primary);
  --_comp-color: var(--ntp-color-on-primary);
}
```

Base class defines **how** styles are applied. Modifier classes define **what** values to use.
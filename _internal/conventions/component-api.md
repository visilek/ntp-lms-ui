# Component API Design

## Props for mutually exclusive options → enum strings

```html
<!-- ✅ Correct -->
<NtpButton variant="filled" color="primary" size="medium" />

<!-- ❌ Wrong -->
<NtpButton filled primary size-md />
```

## Props for additive/independent states → booleans

```html
<NtpButton disabled loading block iconOnly />
```

## Never expose native attributes that conflict with SPA patterns

Example: `type` on `<button>` is hardcoded to `"button"`. No prop.

## Scoped slots for logic/presentation separation

Component owns logic (state, accessibility, keyboard). Consumer owns rendering via scoped slots.

## Vue 3.5 Destructured Props with Default Constants

Use destructured props. For enum string props with defaults used more than once, define typed local camelCase constants.

```ts
type ButtonVariant = 'filled' | 'outlined' | 'text'

const defaultVariant: ButtonVariant = 'filled'

const {
  variant = defaultVariant,
} = defineProps<Props>()
```

Rationale:
- Named constants avoid duplicating magic strings.
- Type annotations preserve union type safety.
- Boolean defaults (`false`) don't need constants.

## Empty String Protection for Class-Affecting Enum Props

Every enum prop used in class names must have the `|| default` fallback:

```ts
const classes = computed(() => [
  `component--${variant || defaultVariant}`,
  `component--${color || defaultColor}`,
])
```

**Why:** Destructured defaults (`variant = defaultVariant`) handle `undefined` but not `''`. Consumers (Storybook controls, JS callers) may pass empty strings. Without the fallback, the class becomes `component--` — broken styling.

**Rule:** Always apply `|| defaultConstant` for enum props in class computations.

## Prop Declaration Order

In `<script setup>`, declare props in this order:

1. Type aliases
2. Default constants
3. Props interface
4. Destructured props

```ts
// 1. Type aliases
type ButtonVariant = 'filled' | 'outlined' | 'text'

// 2. Default constants
const defaultVariant: ButtonVariant = 'filled'

// 3. Props interface
interface Props {
  variant?: ButtonVariant
}

// 4. Destructured props
const {
  variant = defaultVariant,
} = defineProps<Props>()
```
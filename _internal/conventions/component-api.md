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

## Vue 3.5 Destructured Props

Use destructured props with module-level default constants.

```ts
const {
  variant = defaultVariant,
} = defineProps<Props>()
```

Enum string defaults used more than once → named typed constants. Boolean defaults (`false`) don't need constants.

## Empty String Protection for Class-Affecting Enum Props

Every enum prop used in class names must have the `|| default` fallback:

```ts
const classes = computed(() => [
  `component--${variant || defaultVariant}`,
])
```

**Why:** Destructured defaults (`variant = defaultVariant`) handle `undefined` but not `''`. Consumers (Storybook controls, JS callers) may pass empty strings. Without the fallback, the class becomes `component--` — broken styling.

## Component-Local Constants

Component-private constants live in the component folder as `constants.ts`.

Includes:
- Default prop values (primitives, arrays, functions)
- Internal limits and magic numbers
- Component-specific configuration

Rationale: Vue hoists `defineProps` — local `<script setup>` constants cannot be referenced as defaults. Module-level exports from `constants.ts` solve this and keep the component folder self-contained.

Promote to `lib/constants/` when a constant is used by 2+ components.

## Shared Type Constants

For enum props used by 2+ components or fundamental patterns:

- Runtime array: `UPPER_SNAKE_CASE` — `BUTTON_VARIANTS`
- Type: PascalCase — `ButtonVariant`

```ts
export const BUTTON_VARIANTS = ['filled', 'outlined', 'text'] as const
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number]
```

Location: `src/lib/types/<domain>.ts`

Component-specific types used by one component only → local to `.vue` file.

## Prop Declaration Order

In `<script setup>`, declare props in this order:

1. Imports
2. Local type aliases (component-specific)
3. Default constants (or import from `constants.ts`)
4. Props interface
5. Destructured props

```ts
// 1. Imports
import type { ButtonVariant } from '@ntp-lms-ui/lib/types'

// 2. Local type aliases
type ButtonColor = 'primary' | 'secondary' | 'error'

// 3. Default constants
const defaultVariant: ButtonVariant = 'filled'
const defaultColor: ButtonColor = 'primary'

// 4. Props interface
interface Props {
  variant?: ButtonVariant
  color?: ButtonColor
}

// 5. Destructured props
const {
  variant = defaultVariant,
  color = defaultColor,
} = defineProps<Props>()
```

Note: when defaults live in `constants.ts`, import them instead of declaring locally.

## Event Payloads

Emit domain objects directly — not wrapper payloads.

```ts
// ✅ Correct
emit('select', item)

// ❌ Wrong
emit('select', { value: item.value, item })
```

## Types

Types are always **named** — no anonymous inline type literals.

Location depends on scope:

| Scope | Location |
|---|---|
| One file | Local to that file |
| Across files, one component | Component folder (`types.ts`) |
| Across components | `lib/types/`, organized by domain |
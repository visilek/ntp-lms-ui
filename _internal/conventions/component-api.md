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

## Default Function Props

- Primitive defaults: local constants in `<script setup>`.
- Reusable function defaults: export from `lib/` (e.g., `defaultOptionMapper` in `lib/strategies/`).
- Component-specific function defaults: `functionDefaults.ts` in the component folder.

Function props are always provided via module-level imports — never local `<script setup>` functions — because Vue hoists `defineProps` and cannot reference them.

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

1. Imports (type aliases from `lib/types/`)
2. Local type aliases (component-specific)
3. Default constants
4. Props interface
5. Destructured props

```ts
// 1. Imports
import type { ButtonVariant } from '@ntp-lms-ui/lib/types/button'

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


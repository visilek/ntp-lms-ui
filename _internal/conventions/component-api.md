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

Use destructured props with defaults — not `withDefaults`.

```ts
const {
  variant = 'filled',
  disabled = false,
} = defineProps<Props>()
```
`_internal/conventions/component-api.md` — Update

---

`_internal/conventions/styling.md` — Update

## Local Variable Color Pattern

When a component has color variants, use two variables:

```css
.component {
  --_comp-base: var(--ntp-color-on-surface);  /* the color itself */
  --_comp-on: var(--ntp-color-surface);       /* text on that color */
}

.component--primary {
  --_comp-base: var(--ntp-color-primary);
  --_comp-on: var(--ntp-color-on-primary);
}

/* Filled: bg = base, text = on */
.component--filled {
  background-color: var(--_comp-base);
  color: var(--_comp-on);
}

/* Outlined/text: text = base */
.component--outlined {
  border-color: var(--_comp-base);
  color: var(--_comp-base);
}
```

## Motion

Use motion tokens from `tokens/motion.css`:

- `--ntp-duration-short` (150ms), `--ntp-duration-medium` (250ms), `--ntp-duration-long` (400ms)
- `--ntp-easing-standard`, `--ntp-easing-decelerated` (fast start, slow end), `--ntp-easing-accelerated`

Pressed state uses `decelerated` easing.

---

`_internal/conventions/component-api.md` — Add Loading Pattern

## Loading State Width Preservation

When a component shows a loading state replacing content:

- Keep content in DOM with `visibility: hidden`.
- Overlay spinner absolutely positioned and centered.
- Component width/height remains stable — no layout shift.

---

`_internal/conventions/styling.md` — Add Pressed State

## Pressed State

`:active` changes border-radius from full to medium.

```css
.component:active {
  border-radius: var(--ntp-shape-medium);
}
```

Transition: `--ntp-duration-short` + `--ntp-easing-decelerated`.

---

`docs/tokens.md` — Update

Add motion tokens section.

---

`_internal/conventions/component-api.md`

## Vue 3.5 Destructured Props with Default Constants

Use destructured props. For enum string props with defaults used more than once, define local camelCase constants.

```ts
const defaultVariant = 'filled'
const defaultColor = 'primary'

const {
  variant = defaultVariant,
  color = defaultColor,
} = defineProps<Props>()

const classes = computed(() => [
  `component--${variant || defaultVariant}`,
  `component--${color || defaultColor}`,
])
```

Rationale:
- Destructured defaults handle `undefined` but not `''`.
- The `||` fallback catches empty strings.
- Named constants avoid duplicating magic strings.
- Boolean defaults (`false`) don't need constants.

## Loading State Width Preservation

When a loading state replaces content:

- Keep content in DOM with `visibility: hidden`.
- Overlay spinner absolutely positioned and centered.
- Component width remains stable — no layout shift.

---

`_internal/conventions/styling.md`

## Local Variable Color Pattern

When a component has color variants, use two variables:

```css
.component {
  --_comp-base: var(--ntp-color-on-surface);  /* the color itself */
  --_comp-on: var(--ntp-color-surface);       /* text on that color */
}

.component--primary {
  --_comp-base: var(--ntp-color-primary);
  --_comp-on: var(--ntp-color-on-primary);
}

/* Filled: bg = base, text = on */
.component--filled {
  background-color: var(--_comp-base);
  color: var(--_comp-on);
}

/* Outlined/text: text = base */
.component--outlined {
  border-color: var(--_comp-base);
  color: var(--_comp-base);
}
```

## Motion Tokens

Use tokens from `tokens/motion.css`:

- `--ntp-duration-short` (150ms), `--ntp-duration-medium` (250ms), `--ntp-duration-long` (400ms)
- `--ntp-easing-standard`
- `--ntp-easing-decelerated` (fast start, slow end)
- `--ntp-easing-accelerated`

## Pressed State

`:active` changes border-radius from full to medium.

```css
.component:active {
  border-radius: var(--ntp-shape-medium);
}
```

Transition: `--ntp-duration-short` + `--ntp-easing-decelerated`.
```

---

## 3. Update `docs/tokens.md`

Add motion tokens section:

```md
## Motion

| Token | Value |
|---|---|
| `--ntp-duration-short` | 150ms |
| `--ntp-duration-medium` | 250ms |
| `--ntp-duration-long` | 400ms |
| `--ntp-easing-standard` | cubic-bezier(0.2, 0, 0, 1) |
| `--ntp-easing-decelerated` | cubic-bezier(0, 0, 0.2, 1) |
| `--ntp-easing-accelerated` | cubic-bezier(0.3, 0, 1, 1) |
```

---

## 4. Verify Tests Still Pass

```bash
npm run test:run
```

---

## 5. Commit

```bash
git add .
git commit -m "feat: NtpButton, NtpSpinner, NtpChip + Storybook setup + motion tokens"
```

# NtpCarousel

A generic carousel container. Handles navigation, swipe, keyboard, indicators, and autoplay. Content-agnostic — any top-level slot elements become slides.

## Import

```ts
import { NtpCarousel } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | `0` | Current slide index (v-model). Controlled. |
| `autoplayInterval` | `number` | `0` | Autoplay interval in ms. `0` = autoplay off. |
| `autoplayLoop` | `boolean` | `true` | Loop from last to first during autoplay. |
| `showIndicators` | `boolean` | `true` | Show slide indicators. |
| `swipeable` | `boolean` | `true` | Enable touch/swipe navigation. |

### Slots

| Slot | Description |
|---|---|
| `default` | Slide content. Any top-level elements become slides. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `number` | Slide index changed |


## Multiple Instances

Each `NtpCarousel` instance maintains independent state. Multiple carousels on the same page do not interact. Keyboard and swipe handlers are scoped to their respective carousel elements.

## Sizing

The carousel fills its container's width. Height is determined by the container or slide content. No sizing props — the consumer controls dimensions by wrapping the carousel in a sized container.

```html
<div style="height: 400px">
  <NtpCarousel>
    <NtpCard>Slide 1</NtpCard>
    <NtpCard>Slide 2</NtpCard>
  </NtpCarousel>
</div>
```

## Fixed Behavior

### Arrows & Indicators

| Slide Count | Arrows | Indicators (`showIndicators: true`) |
|---|---|---|
| 1 | Never | Never |
| 2+ | On hover | On hover |

### Autoplay

- `autoplayInterval: 0` → disabled.
- Positive value → auto-advance at interval.
- Pauses on hover, resumes on leave.
- `autoplayLoop: false` → stops at last slide.

### Keyboard

- Arrow keys navigate when focus is within the carousel.

### Transition

- Horizontal slide transition.

## Usage Examples

### Basic

```html
<NtpCarousel>
  <img src="slide-1.jpg" alt="Slide 1" />
  <img src="slide-2.jpg" alt="Slide 2" />
  <img src="slide-3.jpg" alt="Slide 3" />
</NtpCarousel>
```

### Mixed Content

```html
<NtpCarousel>
  <NtpCard>
    <NtpCardHeader title="Banner 1" />
    <p>Custom card slide</p>
  </NtpCard>
  <img src="image.jpg" alt="Image slide" />
  <div class="custom-slide">Anything</div>
</NtpCarousel>
```

### Controlled Index

```html
<script setup>
const currentSlide = ref(0)
</script>

<template>
  <NtpCarousel v-model="currentSlide">
    <img src="1.jpg" alt="One" />
    <img src="2.jpg" alt="Two" />
  </NtpCarousel>
</template>
```

### Autoplay

```html
<NtpCarousel :autoplay-interval="5000" :autoplay-loop="true">
  <img src="1.jpg" alt="One" />
  <img src="2.jpg" alt="Two" />
  <img src="3.jpg" alt="Three" />
</NtpCarousel>
```

### Without Indicators

```html
<NtpCarousel :show-indicators="false">
  <NtpCard>Slide 1</NtpCard>
  <NtpCard>Slide 2</NtpCard>
</NtpCarousel>
```

## Accessibility

- Carousel container has `role="region"` and `aria-label` (configurable in future; default "Carousel").
- Active slide is visible to screen readers. Inactive slides have `aria-hidden="true"`.
- Keyboard: Arrow Left/Right navigate slides when focus is within the carousel.
- Autoplay should respect `prefers-reduced-motion` (future consideration).
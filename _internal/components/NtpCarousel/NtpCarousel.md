# NtpCarousel — Implementation Notes

## Structure

```
NtpCarousel/
├── NtpCarousel.vue
├── useCarousel.ts
└── index.ts              # exports NtpCarousel only
```

## Slot VNode Processing

- `useSlots().default()` returns VNode array — one per top-level element.
- Slide count = VNode count.
- Each VNode wrapped in a slide container controlled by the carousel.
- Active/adjacent/offscreen classes applied based on index.

## useCarousel Composable

Internal. Not exported from kit root.

Responsibilities:
- Current index (`modelValue`).
- Navigation: `next()`, `prev()`, `goTo(index)`.
- Autoplay: interval timer, pause on hover, loop handling.
- Keyboard: Arrow Left/Right listeners.
- Swipe: touch/pointer event handling.

## Arrows & Indicators

- Shown on hover (CSS) when slide count > 1.
- Indicators hidden when `showIndicators: false`.
- Arrows have no prop — always available for 2+ slides.

## Autoplay

- `autoplayInterval: 0` → no timer.
- Positive → `setInterval`. Cleared on unmount.
- Hover pause: clear timer on `mouseenter`, restart on `mouseleave`.
- `autoplayLoop: false` → stop at last index.

## Transition

- Horizontal slide via CSS transform/transition.
- Active slide translateX(0). Others translated offscreen.

## Accessibility

- `role="region"` + `aria-label`.
- Inactive slides `aria-hidden="true"`.
- Keyboard listeners on container.

## Future

- Public carousel contract (provide/inject) for specialized items.
- `NtpCarouselImage`, `NtpCarouselVideo` item components.
- `NtpImageCarousel` variant — composition of `NtpCarousel` + `NtpCarouselImage`.
- `prefers-reduced-motion` handling.
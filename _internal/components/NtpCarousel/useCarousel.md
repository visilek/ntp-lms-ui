# useCarousel — Implementation Notes

## Internal Composable

Not exported from kit root in V1. Lives in `NtpCarousel/useCarousel.ts`.

## Responsibilities

- Current index state.
- Navigation: `next()`, `prev()`, `goTo(index)`.
- Autoplay: interval, hover pause, loop handling.
- Keyboard: Arrow Left/Right.
- Swipe: touch/pointer events.

## State Isolation

- `useCarousel` is called per component instance.
- All state (`currentIndex`, timers, hover) is instance-local via `ref`.
- Event listeners bound to the component's root element — never global.
- No module-level mutable state.

## Future

- Will be shared by future carousel variants and item components.
- Public contract via provide/inject when specialized items are introduced.
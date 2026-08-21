# NtpCarousel Family

Carousel components. Generic carousel in V1. Specialized items and variants planned for future.

## Components

| Component | Status | Purpose |
|---|---|---|
| `NtpCarousel` | ✅ V1 | Generic carousel. Slot-based slides. |

## Future

| Component | Purpose |
|---|---|
| `NtpCarouselImage` | Specialized image item |
| `NtpCarouselVideo` | Specialized video item |
| `NtpImageCarousel` | Image carousel variant — composition of `NtpCarousel` + `NtpCarouselImage` |
| `NtpVideoCarousel` | Video carousel variant |

## Naming Convention

| Pattern | Applies To | Example |
|---|---|---|
| `Ntp<Foo>Carousel` | Carousel variants (data-driven compositions) | `NtpImageCarousel` |
| `NtpCarousel<Foo>` | Carousel items (specialized slide components) | `NtpCarouselImage` |
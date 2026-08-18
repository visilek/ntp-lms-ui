# NtpMedia — Implementation Notes

## Render Element

- `src` provided → `<img>`.
- `default` slot → `<div>` wrapping slot content.

## Aspect Ratio

- CSS `aspect-ratio` property.
- `'auto'` → no aspect-ratio applied. Natural image height.
- Any CSS value accepted: `'16 / 9'`, `'1 / 1'`, `'4 / 3'`.

## Object Fit

- `fit` prop maps to CSS `object-fit`.
- Default `cover` — image fills the aspect ratio box, cropping as needed.

## Edge Cases

- `src` empty and no slot → render nothing? For v1: render empty `<div>` (consumer error, don't crash).
- Image load failure → browser default broken image. No custom fallback in v1.
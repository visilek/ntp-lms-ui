# NtpCardHeader — Implementation Notes

## Structure

```
[avatar] [title block] 
          title
          subtitle
```

- Avatar: fixed size (40px circle). Optional.
- Title block: flex-grow 1.
- No action slot — actions handled by consumer layout (e.g., flex utilities).

## Overlay Modes

### scrim
```scss
background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
color: white;
```

### solid
```scss
background: rgba(0,0,0,0.5);
color: white;
```

### none
No background. Text uses `$color-on-surface` for title, `$color-on-surface-variant` for subtitle.

## Slot Overrides

- `title` slot overrides `title` prop.
- `subtitle` slot overrides `subtitle` prop.
- `avatar` slot overrides `avatar` prop.

## Accessibility

- For v1: renders `<div>` elements, not semantic headings. Consumers wrap with `<h2>`/`<h3>` as needed.
- Avatar `<img>` has empty `alt` (decorative) or consumer-provided alt via slot.
# NtpRichTextFigure — Implementation Notes

## Internal Component

Not exported. Used only by `NtpRichText`.

## Props

Receives `FigureData`:

```ts
interface FigureData {
  id: string
  renditionUrl: string
  title: string
  description?: string
  copyrightUrl?: string
  copyrightLabel?: string
}
```

## Rendering

- Image: plain `<img>` or `NtpImage` (future).
- Title: heading level appropriate for content context.
- Description: paragraph.
- Copyright: `<a>` hyperlink.

## Broken Reference

Handled by `NtpRichText`, not this component. This component renders only resolved figures.

## Accessibility
# NtpRichTextFigure

**Internal component.** Not exported from the kit. Renders a figure widget within `NtpRichText`.

## Purpose

Displays a resolved `Figure` entity inside rich text content:

- Display rendition (image)
- Title
- Description
- Copyright hyperlink

## Data

Receives `FigureData` as prop:

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

## Broken Reference

When a `:::figure` block references a UUID not present in the `figures` list, `NtpRichText` renders a "Figure unavailable" placeholder instead of this component.

## Rendering

```
┌─────────────────────────┐
│                         │
│   [rendition image]     │
│                         │
│   Title                 │
│   Description           │
│   © Copyright link      │
└─────────────────────────┘
```

## Accessibility

- Image has `alt` text from figure title.
- Copyright link is a standard hyperlink.
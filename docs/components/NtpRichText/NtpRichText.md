# NtpRichText

Displays rich text content: Markdown with embedded LaTeX and figure references. Figures are resolved from a list of preloaded figure entities.

## Import

```ts
import { NtpRichText } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `string` | `''` | Markdown source text. May contain LaTeX (`$...$`, `$$...$$`) and `:::figure` blocks. |
| `figures` | `FigureData[]` | `[]` | List of figure objects. Component builds the UUID map internally. |

### FigureData

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

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Figure UUID |
| `renditionUrl` | `string` | Display rendition URL |
| `title` | `string` | Figure title |
| `description` | `string` | Optional description |
| `copyrightUrl` | `string` | Optional copyright hyperlink |
| `copyrightLabel` | `string` | Optional copyright link label |

### Slots

None.

### Events

None.

## Supported Syntax

### Markdown

Standard Markdown: headings, paragraphs, lists, links, emphasis, code blocks.

### LaTeX

| Syntax | Type |
|---|---|
| `$...$` | Inline math |
| `$$...$$` | Block math |

### Figures

Fenced block referencing a Figure entity by UUID:

```
:::figure{id=<uuid>}
:::
```

The component resolves the UUID against the `figures` prop. Found → renders the figure widget. Not found → "Figure unavailable" placeholder.

## Behavior

- Re-renders when `content` or `figures` changes.
- Markdown parsing with `html: false` — raw HTML escaped.
- Figure list processed internally into a UUID-keyed map.

## Usage Example

```html
<script setup>
const article = ref({
  content: `
# Newton's Second Law

The force is $F = ma$.

:::figure{id=abc-123-def}
:::

See the diagram above for reference.
  `,
  attachedFigures: [
    {
      id: 'abc-123-def',
      renditionUrl: '/media/figures/newton.png',
      title: 'Force Diagram',
      description: 'Forces acting on a body',
      copyrightUrl: 'https://example.com/license',
      copyrightLabel: 'CC BY 4.0',
    },
  ],
})
</script>

<template>
  <NtpRichText
    :content="article.content"
    :figures="article.attachedFigures"
  />
</template>
```

## Security

- `html: false` on the Markdown parser — raw HTML escaped.
- LaTeX rendered via KaTeX — safe by default.
- Figure data is plain text/URLs — no arbitrary HTML injection.

## Accessibility

- Headings rendered with proper heading levels.
- Figure widget includes `alt` text from figure title.
- Math rendered by KaTeX includes `aria-hidden` where appropriate.

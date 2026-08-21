# renderLatex

Pure utility function. Converts LaTeX expressions in a string to rendered KaTeX HTML.

## Import

```ts
import { renderLatex } from 'ntp-lms-ui'
```

## Signature

```ts
function renderLatex(text: string): string
```

## Supported Syntax

| Syntax | Type | Example |
|---|---|---|
| `$...$` | Inline math | `The force is $F = ma$` |
| `$$...$$` | Block math | `$$\int_0^1 x^2 dx$$` |

## Usage

```ts
const title = 'Energy is $E = mc^2$'
const rendered = renderLatex(title)
// → 'Energy is <span class="katex">...</span>'
```

```html
<h1 v-html="renderLatex(title)" />
```

## Behavior

- Pure function. No side effects.
- Text without LaTeX is returned unchanged.
- Multiple expressions in one string are all rendered.

## Security

KaTeX output is safe — no raw HTML injection from math input.
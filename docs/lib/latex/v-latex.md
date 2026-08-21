# v-latex

Custom directive for rendering LaTeX in string-only DOM elements. Convenience wrapper over `renderLatex`.

## Import

```ts
import { vLatex } from 'ntp-lms-ui'
```

## Registration

Global:

```ts
app.directive('latex', vLatex)
```

Local:

```ts
import { vLatex } from 'ntp-lms-ui'

export default {
  directives: { latex: vLatex },
}
```

## Usage

Apply to any element with string-only content:

```html
<h1 v-latex>{{ element.Title }}</h1>
<p v-latex>{{ element.subtitle }} {{ element.content_element_kind }}</p>
<span v-latex>{{ imageTitle }}</span>
```

## Scope

- **Intended for string-only elements** — text content only, no nested components.
- Works on any element type: `<h1>`, `<p>`, `<span>`, image titles, etc.
- For complex content (nested components), use `renderLatex` explicitly.

## Behavior

- `mounted` hook: initial render after DOM insert.
- `updated` hook: re-render after Vue patches the element's text content.
- Reads `textContent`, processes LaTeX, writes `innerHTML`.

## Limitations

- Do not combine with `v-html` on the same element — the directive owns `innerHTML`.
- Not suitable for elements containing nested Vue components.
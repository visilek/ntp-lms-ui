# v-latex — Implementation Notes

## Hooks

- `mounted`: initial processing.
- `updated`: re-processing after Vue patches text content.

## Process

1. Read `el.textContent` — raw source of truth.
2. Call `renderLatex(text)`.
3. Write `el.innerHTML = rendered`.

## Edge Cases

- Do not combine with `v-html` on same element.
- String-only elements only — no nested components.
- Vue's `updated` hook fires after patch — element already has new raw text.

## Future Considerations

- If nested component support is needed, revisit with DOM-walking approach.
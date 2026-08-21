# renderLatex — Implementation Notes

## Location

`lib/renderLatex.ts`

## Implementation

- Regex-based detection of `$...$` and `$$...$$`.
- KaTeX `renderToString` for each expression.
- Returns HTML string with math replaced.

## Edge Cases

- Nested dollar signs — handle carefully.
- Escaped dollar signs (`\$`) — should not render.
- Multiple expressions — all rendered.
- No expressions — return input unchanged.

## Testing

- Pure function — unit testable.
- Test: no math, inline math, block math, multiple, escaped.
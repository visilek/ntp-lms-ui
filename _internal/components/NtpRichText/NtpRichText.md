# NtpRichText — Implementation Notes

## Structure

```
NtpRichText/
├── NtpRichText.vue           # public component
├── NtpRichTextFigure.vue     # internal figure widget
├── lib/
│   └── markdownParser.ts     # markdown-it instance + custom rules
└── index.ts                  # exports NtpRichText only
```

## Pipeline

```
props.content + props.figures
        │
        ▼
computed figureMap: Map<id, FigureData>
        │
        ▼
markdown-it parse
  ├─ Standard Markdown rules
  ├─ Custom :::figure block rule → custom token
  └─ LaTeX: $...$ / $$...$$ → KaTeX HTML
        │
        ▼
Rendering rules resolve figure tokens against figureMap
        │
        ▼
v-html output
```

## Custom Figure Block Rule

- Block syntax: `:::figure{id=<uuid>}` / `:::`.
- Custom block rule matches pattern, produces token with UUID.
- Rendering rule:
  - UUID in figureMap → `NtpRichTextFigure` HTML.
  - UUID missing → "Figure unavailable" placeholder.

## Reactivity

- `content` and `figures` watched.
- Markdown parse computed — re-runs on prop change.
- No async loading. All data from props.

## Security

- `html: false`.
- KaTeX output safe.
- Figure URLs as attributes.

## Future Considerations

- Lazy figure rendition loading.
- Lightbox.
- Additional entity reference blocks.
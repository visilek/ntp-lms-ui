# NtpRichText

Rich text rendering for main content fields. Supports Markdown, embedded LaTeX, and figure references resolved from a list of preloaded figure entities.

## Components

| Component | Public | Purpose |
|---|---|---|
| `NtpRichText` | ✅ | Markdown + LaTeX + figure rendering |
| `NtpRichTextFigure` | ❌ Internal | Figure widget |

## Related Utilities

| Tool | Type | Purpose |
|---|---|---|
| `renderLatex` | Function | Pure string transform: `$...$` / `$$...$$` → KaTeX HTML |
| `v-latex` | Directive | Consumer-applied to string-only elements |
# NtpRichTextEditor — Implementation Notes

## Library

Milkdown — Markdown-native WYSIWYG editor based on ProseMirror.

## Structure

```
NtpRichTextEditor/
├── NtpRichTextEditor.vue
├── NtpRichTextEditorToolbar.vue
└── index.ts
```

## Markdown Handling

- `modelValue` is a Markdown string.
- Milkdown works with Markdown natively — no conversion layer.
- On editor change: serialize Milkdown state to Markdown, emit `update:modelValue`.

## Toolbar

- Default toolbar: `NtpRichTextEditorToolbar` internal component.
- `toolbar` slot overrides.
- Toolbar commands call Milkdown editor commands.

## Reactivity

- `modelValue` watched. External changes update editor state.
- Editor changes emit `update:modelValue`.
- Guard against update loops: compare incoming vs current value.

## Readonly / Disabled

- `readonly`: editor displays content, no editing.
- `disabled`: editor not interactive.

## Future (V2)

- Figure insertion toolbar button.
- Integrated `NtpFigureOrdering` below editor.
- Custom Milkdown syntax for `:::figure` blocks.
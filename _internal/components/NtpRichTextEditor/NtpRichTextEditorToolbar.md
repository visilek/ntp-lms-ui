# NtpRichTextEditorToolbar — Implementation Notes

## Internal Component

Not exported. Used by `NtpRichTextEditor`.

## Structure

Horizontal row of `NtpButton` icon-only buttons.

## Controls

- Bold, Italic, Strikethrough
- H1, H2, H3
- Ordered list, Unordered list
- Blockquote, Code block
- Inline code
- Link

## Implementation

- Each button calls Milkdown command.
- Active states reflect current editor selection.
- Disabled when editor is `readonly` or `disabled`.
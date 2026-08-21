# NtpRichTextEditor

Markdown editor for rich text content. Built on Milkdown. WYSIWYG Markdown editing with LaTeX support.

## Import

```ts
import { NtpRichTextEditor } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` | `''` | Markdown content (v-model) |
| `placeholder` | `string` | `''` | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `boolean` | `false` | Readonly state |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `toolbar` | — | Custom toolbar. Overrides default toolbar. |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` | Markdown content changed |
| `blur` | — | Editor lost focus |
| `focus` | — | Editor gained focus |

## Default Toolbar

| Group | Controls |
|---|---|
| Text style | Bold, Italic, Strikethrough |
| Headings | H1, H2, H3 |
| Lists | Ordered, Unordered |
| Blocks | Blockquote, Code block |
| Inline | Inline code |
| Links | Link |

## LaTeX Support

- Teachers write LaTeX directly as raw text: `$...$` for inline, `$$...$$` for block.
- No WYSIWYG math editing — raw syntax only.
- Rendered by `NtpRichText` on display.

## Usage Example

```html
<script setup>
const content = ref('')
</script>

<template>
  <NtpRichTextEditor
    v-model="content"
    placeholder="Write article content..."
  />
</template>
```

## Custom Toolbar

```html
<NtpRichTextEditor v-model="content">
  <template #toolbar>
    <div class="custom-toolbar">
      <NtpButton variant="text" size="small" @click="insertCustom">Custom</NtpButton>
    </div>
  </template>
</NtpRichTextEditor>
```

## Accessibility

- Editor area has appropriate ARIA role.
- Toolbar buttons have accessible labels.
- Keyboard shortcuts standard for Markdown editing.
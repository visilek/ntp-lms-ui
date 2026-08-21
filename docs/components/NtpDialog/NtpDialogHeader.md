# NtpDialogHeader

Header for dialogs. Two layout modes: standard (centered) and fullscreen (app-bar style). Automatically switches when inside a fullscreen `NtpDialog`.

## Import

```ts
import { NtpDialogHeader } from 'ntp-lms-ui'
```

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Title text |
| `fullscreenTitle` | `string` | `''` | Brief title for fullscreen. Falls back to `title`. |
| `subtitle` | `string` | `''` | Subtitle below title |
| `icon` | `string` | `''` | Decorative icon. Standard mode only. |
| `fullscreen` | `boolean \| null` | `null` | Force layout mode. `null` = auto (inject from parent dialog). |

### Slots

| Slot | Scope | Description |
|---|---|---|
| `default` | — | Overrides the entire main content block (icon + title + subtitle). Used in both modes. |
| `fullscreenActions` | — | Header actions (fullscreen mode) |
| `close` | — | Custom close button (fullscreen mode) |

### Events

| Event | Payload | Description |
|---|---|---|
| `close` | — | Close button clicked in fullscreen mode. Parent `NtpDialog` (or consumer) catches. |

## Icon

- Purely decorative. Enhances the meaning of the title.
- Standard mode: rendered centered above the title.
- Fullscreen mode: **dropped** — not rendered.

## Close Button

- **Standard mode:** not rendered by header. `NtpDialog` owns the close button.
- **Fullscreen mode:** always rendered by header in the app bar leading position. Emits `close` event.

## Layout Modes

### Standard

```
┌─────────────────────────────┐
│                             │
│           [icon]            │
│                             │
│           Title             │
│          Subtitle           │
└─────────────────────────────┘
```

- Icon centered above title (if provided).
- Title and subtitle centered.
- No close button (dialog handles it).

### Fullscreen

```
┌─────────────────────────────┐
│ ×  Title     [fllscrnActns] │
│    Subtitle                 │
└─────────────────────────────┘
```

- Renders `NtpAppBar` internally.
- Close button left (leading). Always shown.
- Title and subtitle left-aligned.
- FullscreenActions right-aligned.
- No icon.
- Uses `fullscreenTitle` if provided.

## Main Content Override

The `default` slot overrides the entire main content block — icon, title, subtitle — as a unit. The override applies in **both** standard and fullscreen modes.

In fullscreen mode, this content is passed through to the internal `NtpAppBar`'s default slot.

## Auto-Switching

When `fullscreen` prop is `null` (default) and the header is inside an `NtpDialog`, it injects the dialog's fullscreen state automatically.

## Usage Examples

### Standard with Icon

```html
<NtpDialogHeader
  title="Delete Course?"
  subtitle="This action cannot be undone."
  icon="warning"
/>
```

### Fullscreen with Actions

```html
<NtpDialogHeader
  title="Edit Course"
  fullscreen-title="Edit"
  @close="closeDialog"
>
  <template #fullscreen-actions>
    <NtpButton variant="text" @click="save">Save</NtpButton>
  </template>
</NtpDialogHeader>
```

### Custom Close Button (Fullscreen Mode)

```html
<NtpDialogHeader
  title="Edit Course"
  fullscreen-title="Edit"
  @close="closeDialog"
>
  <template #close>
    <NtpButton icon-only aria-label="Close dialog">
      <span class="material-symbols">arrow_back</span>
    </NtpButton>
  </template>
</NtpDialogHeader>
```

### Custom Main Content

```html
<NtpDialogHeader>
  <template #default>
    <div class="custom-header">
      <NtpChip label="Draft" color="warning" />
      <h2>Custom Title</h2>
    </div>
  </template>
</NtpDialogHeader>
```

## Accessibility

- Close button (fullscreen mode) has `aria-label="Close"`.
- Icon is decorative (`aria-hidden="true"`).
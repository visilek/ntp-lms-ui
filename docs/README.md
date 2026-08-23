# NTP LMS UI Kit

Custom UI component library for the NTP LMS platform. Used by both Teacher and Student frontend applications.

## Principles

- **Material Design visual language** — spacing, typography, elevation, color tokens follow MD3.
- **Atomic primitives** — components solve one UI problem each. Composition happens at the application level.
- **No third-party UI libraries** — every component is built in-house for full control over markup, styling, and behavior.
- **Framework-agnostic tokens** — design tokens are plain CSS custom properties and SCSS variables. No CSS-in-JS.

## Installation

```ts
// main.ts
import { createApp } from 'vue'
import uiKit from '@/shared/ui'
import '@/shared/ui/_base/index.scss'

const app = createApp(App)
app.use(uiKit)
```

## Usage

All components are globally registered with the `Ntp` prefix:

```html
<NtpButton variant="filled" color="primary">Save</NtpButton>
```


## Data Handling

This kit has two kinds of components regarding data:

**Display components** — receive data via props, emit events. They never fetch.

**Interactive components** — may load data internally (e.g., dropdown options), but only through a loader function you provide via prop. They don't know your API.

No component in this kit talks to your backend directly.

## Component Structure

The kit uses a flat top-level structure. Most components live in their own folders. Only genuinely coupled families are grouped:

| Location | Contents |
|---|---|
| `NtpInputs/` | All form controls: TextInput, NumberInput, Checkbox, CheckboxGroup, RadioGroup, Toggle, DateInput, DateTimeInput, Select, MultiSelect |
| `NtpCard/` | Card family: Card, CardHeader, CardActions, CardMedia |
| `NtpTable/` | Table and its subcomponents |
| `NtpButton/` | Button |
| `NtpPagination/` | Pagination |
| `NtpBreadcrumb/` | Breadcrumb |
| `NtpModal/` | Modal |
| `NtpConfirmationDialog/` | Confirmation dialog |
| `NtpToolbar/` | Toolbar |
| `NtpSidebar/` | Sidebar |
| `NtpRichText/` | Rich text renderer (Markdown + LaTeX) |
| `NtpTipTapEditor/` | TipTap editor wrapper |
# Implementation Phase Planning

## Guiding Principles

1. **Tokens first.** Everything depends on design tokens (colors, spacing, typography, elevation). No component before tokens.
2. **Base before components.** Reset, global styles, spacing utilities.
3. **Primitives before compositions.** Build leaf components, then composites.
4. **Test as we go.** Unit tests + Storybook stories per component (per ADR-005).
5. **Document as we go.** Consumer docs + internal docs already drafted — update if implementation reveals gaps.

---

# Phase 1: Foundation

| Step | Deliverable | Dependencies |
|---|---|---|
| 1.1 | `_tokens/` — colors, typography, spacing, elevation SCSS variables | None |
| 1.2 | `_base/` — reset, global, spacing utilities | Tokens |
| 1.3 | `lib/` — shared types, dropdown strategy, constants | None |

**Exit criteria:** Token values locked. Utilities usable. Storybook renders a token reference page.

---

# Phase 2: Core Primitives

| Step | Components | Dependencies |
|---|---|---|
| 2.1 | `NtpButton`, `NtpSpinner`, `NtpChip` | Tokens, base |
| 2.2 | `NtpTextInput`, `NtpNumberInput`, `useInputBase` | Tokens, base |
| 2.3 | `NtpCheckbox`, `NtpCheckboxGroup`, `NtpRadioGroup`, `NtpToggle` | Tokens, base |
| 2.4 | `NtpDateInput`, `NtpDateTimeInput` | `useInputBase` |

**Exit criteria:** All form inputs styled, tested, documented.

---

# Phase 3: Overlays & Menus

| Step | Components | Dependencies |
|---|---|---|
| 3.1 | `NtpMenu` | Tokens, teleport, focus management |
| 3.2 | `NtpActionMenu` | `NtpMenu`, `NtpButton` |
| 3.3 | `NtpDialog`, `NtpDialogHeader`, `NtpAppBar` | Tokens, focus trap, provide/inject |
| 3.4 | `NtpConfirmationDialog` | `NtpDialog`, `NtpDialogHeader`, `NtpButton`, `NtpTextInput` |

**Exit criteria:** Overlays accessible, keyboard-navigable, tested.

---

# Phase 4: Dropdowns

| Step | Components | Dependencies |
|---|---|---|
| 4.1 | `lib/dropdown-strategy.ts` formalization | ADR-0005 |
| 4.2 | `NtpSelect` | `NtpMenu`, `useInputBase`, dropdown strategy |
| 4.3 | `NtpMultiSelect` | Same + "All" option + count chip |

**Exit criteria:** Async loading, search, keyboard, preload/async modes tested.

---

# Phase 5: Surfaces & Layout

| Step | Components | Dependencies |
|---|---|---|
| 5.1 | `NtpCard`, `NtpCardHeader` | Tokens, spacing utilities |
| 5.2 | `NtpDrawer`, `useDrawer` | Tokens, breakpoints, RouterLink integration |
| 5.3 | `NtpAppBar` refinements if needed | Drawer usage |

**Exit criteria:** Layout components tested, responsive behavior verified.

---

# Phase 6: Data Display

| Step | Components | Dependencies |
|---|---|---|
| 6.1 | `NtpPagination` | `NtpSelect` (page size) |
| 6.2 | `NtpTable` + `use-row-highlight` | `NtpPagination` (integration), `NtpCheckbox`, `NtpActionMenu` |
| 6.3 | `NtpBreadcrumb` | Standalone |

**Exit criteria:** Table sorting, selection, reorder, filter slots tested.

---

# Phase 7: Rich Text & Carousel

| Step | Components | Dependencies |
|---|---|---|
| 7.1 | `lib/latex/renderLatex.ts` | KaTeX |
| 7.2 | `lib/latex/vLatex.ts` | `renderLatex` |
| 7.3 | `NtpRichText` | markdown-it, `renderLatex` |
| 7.4 | `NtpRichTextEditor` | Milkdown |
| 7.5 | `NtpCarousel` + `useCarousel` | Standalone |

**Exit criteria:** Rich text renders Markdown + LaTeX. Editor roundtrips Markdown. Carousel navigates.

---

# Phase 8: Integration & Demo

| Step | Deliverable |
|---|---|
| 8.1 | Demo layouts in Storybook — form page, table page, detail page |
| 8.2 | Cross-component integration tests |
| 8.3 | Accessibility audit (axe) |
| 8.4 | Visual regression baselines (Chromatic) |
| 8.5 | Package build config, exports, versioning setup |

---

# Suggested Team Workflow

| Phase | Parallelizable? |
|---|---|
| Phase 1 | No — foundation |
| Phase 2 | Partially — inputs depend on `useInputBase` |
| Phase 3 | Yes — menu and dialog are independent |
| Phase 4 | No — depends on menu |
| Phase 5 | Partially — card independent, drawer depends on breakpoints |
| Phase 6 | Table is big — could split sorting/selection/reorder into milestones |
| Phase 7 | Yes — carousel independent from rich text |
| Phase 8 | Final |
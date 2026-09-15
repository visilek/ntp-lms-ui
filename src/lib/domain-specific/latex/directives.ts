import type { Directive } from 'vue'
import { processLatex } from './utils'

/**
 * Vue directive for rendering LaTeX in string-only elements.
 *
 * Hooks:
 * - mounted: initial processing after DOM insert.
 * - updated: re-processing after Vue patches text content.
 *
 * Usage:
 * <h1 v-latex>{{ element.Title }}</h1>
 * <p v-latex>{{ element.subtitle }} {{ element.content_element_kind }}</p>
 */
export const vLatex: Directive<HTMLElement> = {
  mounted: (el) => processLatex(el),
  updated: (el) => processLatex(el),
}
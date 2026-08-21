/**
 * Custom directive — renders LaTeX in string-only DOM elements.
 *
 * Usage:
 * <h1 v-latex>{{ element.Title }}</h1>
 * <p v-latex>{{ element.subtitle }} {{ element.content_element_kind }}</p>
 */

import type { Directive } from 'vue'
import { renderLatex } from './renderLatex'

/**
 * Process an element: read text content, render LaTeX, write inner HTML.
 * Intended for string-only elements — no nested Vue components.
 */
function processLatex(el: HTMLElement): void {
  const raw = el.textContent ?? ''
  const rendered = renderLatex(raw)
  el.innerHTML = rendered
}

/**
 * Vue directive for rendering LaTeX in string-only elements.
 *
 * Hooks:
 * - mounted: initial processing after DOM insert.
 * - updated: re-processing after Vue patches text content.
 */
export const vLatex: Directive<HTMLElement> = {
  mounted: (el) => processLatex(el),
  updated: (el) => processLatex(el),
}
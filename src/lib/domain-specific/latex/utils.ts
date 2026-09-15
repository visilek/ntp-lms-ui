import katex from 'katex'

const ESCAPED_DOLLAR = '\u0000ESCAPED_DOLLAR\u0000'
const BLOCK_MATH_PLACEHOLDER = '\u0000BLOCK'

/**
 * Render all LaTeX expressions in a text string to KaTeX HTML.
 *
 * Supports:
 * - Inline math: $...$
 * - Block math: $$...$$
 * - Escaped dollar signs: \$ (rendered as literal $)
 *
 * @param text - Input string possibly containing $...$ or $$...$$ expressions.
 * @returns String with LaTeX replaced by KaTeX HTML. Unchanged if no math found.
 */
export function renderLatex(text: string): string {
  if (!text) return text

  let result = text

  // Step 1: Protect escaped dollars (\$).
  result = result.replace(/\\\$/g, ESCAPED_DOLLAR)

  // Step 2: Protect block math ($$...$$) — replace with placeholders.
  const blockMath: string[] = []
  result = result.replace(/\$\$([^$]+)\$\$/g, (_, latex: string) => {
    const index = blockMath.length
    blockMath.push(latex.trim())
    return `${BLOCK_MATH_PLACEHOLDER}${index}\u0000`
  })

  // Step 3: Render inline math ($...$).
  // (?<!\$) — not preceded by $
  // (?!\$) — not followed by $
  result = result.replace(/(?<!\$)\$((?:[^$\\]|\\.|\\\$)+)\$(?!\$)/g, (_, latex: string) => {
    return katex.renderToString(latex.trim(), {
      throwOnError: false,
      displayMode: false,
    })
  })

  // Step 4: Restore block math.
  result = result.replace(new RegExp(`${BLOCK_MATH_PLACEHOLDER}(\\d+)\u0000`, 'g'), (_, index: string) => {
    const latex = blockMath[Number(index)]
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    })
  })

  // Step 5: Restore escaped dollars.
  result = result.replace(new RegExp(ESCAPED_DOLLAR, 'g'), '$')

  return result
}


/**
 * Process an element: read text content, render LaTeX, write inner HTML.
 * Intended for string-only elements — no nested Vue components.
 * Used by v-latex directive
 */
export function processLatex(el: HTMLElement): void {
  const raw = el.textContent ?? ''
  const rendered = renderLatex(raw)
  el.innerHTML = rendered
}
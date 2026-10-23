export type PageToken = number | 'ellipsis'

function pushRange(target: Set<number>, range: [number, number], totalPages: number) {
  const clampedStart = Math.max(1, range[0])
  const clampedEnd = Math.min(range[1], totalPages)

  if (clampedEnd < clampedStart) return

  for (let i = clampedStart; i <= clampedEnd; i++) {
    target.add(i)
  }
}

export function computePageTokens(
  currentPage: number,
  totalPages: number,
  centralAdjoinings: number = 1,
  borderAdjoinings: number = 1,
): PageToken[] {
  if (totalPages <= 0) return []

  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages))

  const centerWindow: [number, number] = [
    safeCurrentPage - centralAdjoinings,
    safeCurrentPage + centralAdjoinings,
  ]

  const leftBorder: [number, number] = [1, 1 + borderAdjoinings]
  const rightBorder: [number, number] = [totalPages - borderAdjoinings, totalPages]

  const uniqueNumbers = new Set<number>()

  pushRange(uniqueNumbers, leftBorder, totalPages)
  pushRange(uniqueNumbers, centerWindow, totalPages)
  pushRange(uniqueNumbers, rightBorder, totalPages)

  const sortedPages = Array.from(uniqueNumbers).sort((a, b) => a - b)
  const tokens: PageToken[] = []

  let previous: number | null = null
  for (const page of sortedPages) {
    if (previous !== null && page - previous > 1) {
      tokens.push('ellipsis')
    }
    tokens.push(page)
    previous = page
  }

  return tokens
}

export function formatCount(page: number, pageSize: number, totalCount: number): string {
  if (totalCount === 0) return ''

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize + 1
  const end = Math.min(safePage * pageSize, totalCount)

  return `${start}–${end} of ${totalCount}`
}
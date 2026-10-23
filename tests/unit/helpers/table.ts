import type { PaginatedResult, TableRow } from '@ntp-lms-ui/lib/types'

export function makeResult(
  items: TableRow[],
  totalCount = items.length,
  page = 1,
  pageSize = 20,
): PaginatedResult<TableRow> {
  return { items, totalCount, page, pageSize }
}
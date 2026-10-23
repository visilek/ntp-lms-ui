export interface PaginatedResult<T = Record<string, unknown>> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}
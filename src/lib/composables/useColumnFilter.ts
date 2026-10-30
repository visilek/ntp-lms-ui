import type { ColumnFilter, ColumnType, TableColumn, TableRow } from '@ntp-lms-ui/lib/types'
import { createDevWarn } from '@ntp-lms-ui/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

const warn = createDevWarn('composables/useColumnFilter')

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

function arraysEqual(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, i) => item === b[i])
}

function normalizeToArray(value: string | number | string[]): unknown[] {
  return isArray(value) ? value : [value]
}

function isObjectOrArray(value: unknown): boolean {
  return value !== null && typeof value === 'object'
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-mode matchers
// ─────────────────────────────────────────────────────────────────────────────

function matchExact(value: unknown, filterValue: string | number | string[]): boolean {
  const cellIsArray = isArray(value)
  const filterIsArray = isArray(filterValue)

  if (cellIsArray !== filterIsArray) {
    warn(
      `exact mode: cell value and filter value must have matching shapes ` +
      `(got ${cellIsArray ? 'array' : 'scalar'} cell, ` +
      `${filterIsArray ? 'array' : 'scalar'} filter); filter ignored`,
    )
    return true
  }

  if (cellIsArray && filterIsArray) {
    return arraysEqual(value, filterValue)
  }

  return value === filterValue
}

function matchIn(value: unknown, filterValue: string | number | string[]): boolean {
  const filterArray = normalizeToArray(filterValue)

  if (isArray(value)) {
    return value.some((item) => filterArray.includes(item))
  }

  return filterArray.includes(value)
}

function matchIcontains(value: unknown, filterValue: string | number | string[]): boolean {
  if (isArray(value)) {
    warn('icontains mode is not supported for array cells; filter ignored')
    return true
  }

  return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
}

function matchComparison(
  value: unknown,
  filterValue: string | number | string[],
  mode: 'gte' | 'lte' | 'gt' | 'lt',
  type: ColumnType,
): boolean {
  if (isArray(value)) {
    warn(`${mode} mode is not supported for array cells; filter ignored`)
    return true
  }

  if (type === 'enum') {
    warn(`${mode} mode is not supported for enum columns; filter ignored`)
    return true
  }

  if (type === 'date') {
    const aTime = new Date(value as string | number).getTime()
    const bTime = new Date(filterValue as string | number).getTime()

    if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
      warn(`${mode} mode: could not parse date value(s); filter ignored`)
      return true
    }

    switch (mode) {
      case 'gte': return aTime >= bTime
      case 'lte': return aTime <= bTime
      case 'gt': return aTime > bTime
      case 'lt': return aTime < bTime
    }
  }

  if (type === 'number') {
    const a = Number(value)
    const b = Number(filterValue)

    if (Number.isNaN(a) || Number.isNaN(b)) {
      warn(`${mode} mode: could not coerce numeric value(s); filter ignored`)
      return true
    }

    switch (mode) {
      case 'gte': return a >= b
      case 'lte': return a <= b
      case 'gt': return a > b
      case 'lt': return a < b
    }
  }

  // type === 'text'
  const a = String(value)
  const b = String(filterValue)

  switch (mode) {
    case 'gte': return a >= b
    case 'lte': return a <= b
    case 'gt': return a > b
    case 'lt': return a < b
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dispatch
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dispatches a single ColumnFilter against a cell value.
 *
 * The default branch is unreachable in practice:
 *   - `filter.mode` is typed as FilterMode.
 *   - FilterMode mirrors FILTER_MODES, which mirrors the backend's lookups.
 *   - The `_exhaustive: never` check below makes adding a mode to FilterMode
 *     without adding a case a compile-time error.
 *
 * If this branch fires at runtime, something is broken — typically a typo
 * in a manually-constructed filter, or version skew between frontend and
 * backend. The behavior is fail-open (returns true, i.e. "match"), consistent
 * with the rule that unsupported mode/type combinations ignore the filter
 * rather than hide rows. A dev warning surfaces the condition.
 */
function applyFilter(value: unknown, filter: ColumnFilter, column: TableColumn): boolean {
  switch (filter.mode) {
    case 'exact':
      return matchExact(value, filter.value)
    case 'in':
      return matchIn(value, filter.value)
    case 'icontains':
      return matchIcontains(value, filter.value)
    case 'gte':
    case 'lte':
    case 'gt':
    case 'lt':
      return matchComparison(value, filter.value, filter.mode, column.type ?? 'text')
    default: {
      const _exhaustive: never = filter.mode
      warn(`unhandled filter mode "${String(_exhaustive)}"; filter ignored`)
      return true
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public composable
// ─────────────────────────────────────────────────────────────────────────────

export function useColumnFilter() {
  function matches(value: unknown, filter: ColumnFilter, column: TableColumn, row: TableRow): boolean {
    if (column.filterLocally) {
      try {
        return column.filterLocally(value, filter, row)
      } catch (error) {
        warn(
          `filterLocally for column "${column.key}" threw: ` +
          `${(error as Error).message}; filter ignored`,
        )
        return true
      }
    }

    // Object/array cells without filterLocally → handled at the apply level.
    return applyFilter(value, filter, column)
  }

  function matchesAll(
    row: Record<string, any>,
    filters: ColumnFilter[],
    columns: TableColumn[],
  ): boolean {
    return filters.every((filter) => {
      const column = columns.find((c) => c.key === filter.field)
      if (!column) {
        warn(`filter references unknown column "${filter.field}"; filter ignored`)
        return true
      }
      return matches(row[filter.field], filter, column, row)
    })
  }

  function apply<T extends Record<string, any>>(
    rows: T[],
    filters: ColumnFilter[],
    columns: TableColumn[],
  ): T[] {
    if (filters.length === 0) return rows

    const failedColumns = new Set<string>()

    const filtered = rows.filter((row) =>
      filters.every((filter) => {
        const column = columns.find((c) => c.key === filter.field)
        if (!column) return true

        if (column.filterLocally) {
          return matches(row[filter.field], filter, column, row)
        }

        const cell = row[filter.field]
        if (isObjectOrArray(cell)) {
          failedColumns.add(column.key)
          return true  // fail-open
        }

        return applyFilter(cell, filter, column)
      }),
    )

    if (failedColumns.size > 0) {
      warn(
        `Column(s) ${[...failedColumns].map((k) => `"${k}"`).join(', ')} ` +
        `contain non-scalar values but have no filterLocally callback. ` +
        `Filtering ignores these columns.`,
      )
    }

    return filtered
  }

  return { matches, matchesAll, apply }
}
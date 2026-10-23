import type { SortState, TableColumn } from '@ntp-lms-ui/lib/types'
import { createDevWarn } from '@ntp-lms-ui/lib'

const warn = createDevWarn('composables/useColumnSort')

const collator = new Intl.Collator()

// ─────────────────────────────────────────────────────────────────────────────
// Per-type comparators
// ─────────────────────────────────────────────────────────────────────────────

function compareText(a: unknown, b: unknown): number {
  return collator.compare(String(a), String(b))
}

function compareNumber(a: unknown, b: unknown): number {
  const aNum = Number(a)
  const bNum = Number(b)

  if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
    warn('number comparison: could not coerce value(s); treating as equal')
    return 0
  }

  return aNum - bNum
}

function compareDate(a: unknown, b: unknown): number {
  const aTime = new Date(a as string | number).getTime()
  const bTime = new Date(b as string | number).getTime()

  if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
    warn('date comparison: could not parse value(s); treating as equal')
    return 0
  }

  return aTime - bTime
}

// ─────────────────────────────────────────────────────────────────────────────
// Dispatch
// ─────────────────────────────────────────────────────────────────────────────

function applyComparator(a: unknown, b: unknown, column: TableColumn): number {
    const type = column.type ?? 'text';

    switch (type) {
        case 'text':
        case 'enum': // Enum values are strings; compare as text.
            return compareText(a, b);
        case 'number':
            return compareNumber(a, b);
        case 'date':
            return compareDate(a, b);
        default: {
            const _exhaustive: never = type;
            warn(`unhandled column type "${String(_exhaustive)}"; treating as equal`);
            return 0;
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public composable
// ─────────────────────────────────────────────────────────────────────────────

export function useColumnSort() {
  function compare(a: unknown, b: unknown, column: TableColumn): number {
    if (column.sortComparator) {
      try {
        return column.sortComparator(a, b)
      } catch (error) {
        warn(
          `sortComparator for column "${column.key}" threw: ` +
          `${(error as Error).message}; treating as equal`,
        )
        return 0
      }
    }

    return applyComparator(a, b, column)
  }

  function apply<T extends Record<string, any>>(
    rows: T[],
    sort: SortState | null,
    columns: TableColumn[],
  ): T[] {
    if (!sort) {
      return [...rows]
    }

    const column = columns.find((c) => c.key === sort.key)

    if (!column) {
      warn(`sort references unknown column "${sort.key}"; sort ignored`)
      return [...rows]
    }

    return [...rows].sort((a, b) => {
      const result = compare(a[sort.key], b[sort.key], column)
      return sort.order === 'desc' ? -result : result
    })
  }

  return { compare, apply }
}
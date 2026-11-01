import type { LoadRowsParams, TableColumn } from '@ntp-lms-ui/lib/types'

/**
 * Applies per-column sortRequest callbacks to LoadRowsParams.
 *
 * If params.sort exists, finds the corresponding column and invokes its
 * sortRequest (if present) with the current order and params. Returns the
 * modified params (or the input when no callback applies).
 */
export function applySortRequest(
    params: LoadRowsParams,
    columns: TableColumn[],
): LoadRowsParams {
    if (!params.sort) return params

    const column = columns.find((c) => c.key === params.sort!.key)
    if (!column?.sortRequest) return params

    return column.sortRequest(column, params.sort.order, params)
}

/**
 * Applies per-column filterRequest callbacks to LoadRowsParams.
 *
 * For each filter, finds the corresponding column and invokes its
 * filterRequest (if present), accumulating modifications. Filters without
 * a corresponding request callback are left unchanged.
 */
export function applyFilterRequest(
    params: LoadRowsParams,
    columns: TableColumn[],
): LoadRowsParams {
    if (params.filters.length === 0) return params

    let result = params
    for (const filter of params.filters) {
        const column = columns.find((c) => c.key === filter.field)
        if (!column?.filterRequest) continue
        result = column.filterRequest(column, filter, result)
    }

    return result
}
/**
 * Unified dropdown data loading strategy.
 * Per ADR-0005: preload if total ≤ DROPDOWN_PRELOAD_LIMIT, async search otherwise.
 */

import type { DropdownLoader, DropdownOption } from './types/dropdown'

/** Maximum number of items to preload without search. */
export const DROPDOWN_PRELOAD_LIMIT = 50

/** Dropdown data loading mode. */
export type DropdownMode = 'preload' | 'async'

/**
 * Determine the loading mode based on total count.
 *
 * @param totalCount - Total items from the loader response.
 * @returns 'preload' if totalCount ≤ DROPDOWN_PRELOAD_LIMIT, else 'async'.
 */
export function getDropdownMode(totalCount: number): DropdownMode {
  return totalCount <= DROPDOWN_PRELOAD_LIMIT ? 'preload' : 'async'
}

/**
 * Initial load — fetches first page to determine mode.
 * Used by Select, MultiSelect, and future dropdowns.
 *
 * @param loader - Consumer-provided loader function.
 * @returns Loader response with items and totalCount.
 */
export async function initialDropdownLoad<T extends string | number>(
  loader: DropdownLoader<T>,
): Promise<{ items: DropdownOption<T>[]; totalCount: number }> {
  return loader('', 1, DROPDOWN_PRELOAD_LIMIT)
}
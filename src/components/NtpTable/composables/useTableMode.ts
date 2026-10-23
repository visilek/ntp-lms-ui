import { computed } from 'vue'
import type { Ref } from 'vue'
import type { TableMode } from '@ntp-lms-ui/lib/types'

interface UseTableModeOptions {
  hasLoader: Ref<boolean>
  totalCount: Ref<number>
  pageSize: Ref<number>
}

export function useTableMode(options: UseTableModeOptions) {
  const mode = computed<TableMode>(() => {
    if (!options.hasLoader.value) return 'fixed'
    return options.totalCount.value <= options.pageSize.value ? 'complete' : 'partial'
  })

  return { mode }
}
<script setup lang="ts">
import { computed } from 'vue'
import { NtpSelect } from '@ntp-lms-ui/components'
import type { DropdownOption } from '@ntp-lms-ui/lib/types'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from '@ntp-lms-ui/lib'
import { CENTRAL_ADJOININGS, BORDER_ADJOININGS } from './constants'
import { computePageTokens, formatCount } from './utils'

interface Props {
  page?: number
  pageSize?: number
  totalCount: number
  pageSizeOptions?: number[]
  disabled?: boolean
}

const {
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
  totalCount,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  disabled = false,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalCount / pageSize))
})

const countText = computed(() => {
  return formatCount(page, pageSize, totalCount)
})

const pageTokens = computed(() => {
  return computePageTokens(page, totalPages.value, CENTRAL_ADJOININGS, BORDER_ADJOININGS)
})

const preloadedOptions = computed<DropdownOption[]>(() => {
  return pageSizeOptions.map((size) => ({ value: size, label: String(size) }))
})

function goToPage(target: number) {
  if (disabled) return
  if (target < 1 || target > totalPages.value) return
  if (target === page) return
  emit('update:page', target)
}

function onPageSizeChange(value: string | number | null) {
  if (disabled) return
  const numeric = value === null ? null : Number(value)
  if (numeric === null || Number.isNaN(numeric) || numeric === pageSize) return
  emit('update:pageSize', numeric)
}
</script>

<template>
  <div class="ntp-pagination" :class="{ 'ntp-pagination--disabled': disabled }">
    <div v-if="countText" class="ntp-pagination__count">
      {{ countText }}
    </div>

    <div class="ntp-pagination__controls">
      <template v-if="totalPages > 1">
        <button type="button" class="ntp-pagination__button" aria-label="Previous page"
          :disabled="disabled || page <= 1" @click="goToPage(page - 1)">
          ‹
        </button>

        <template v-for="(token, index) in pageTokens" :key="index">
          <span v-if="token === 'ellipsis'" class="ntp-pagination__ellipsis">…</span>
          <button v-else type="button" class="ntp-pagination__button"
            :class="{ 'ntp-pagination__button--active': token === page }"
            :aria-current="token === page ? 'page' : undefined" :aria-label="`Page ${token}`" :disabled="disabled"
            @click="goToPage(token)">
            {{ token }}
          </button>
        </template>

        <button type="button" class="ntp-pagination__button" aria-label="Next page"
          :disabled="disabled || page >= totalPages" @click="goToPage(page + 1)">
          ›
        </button>
      </template>
    </div>

    <div class="ntp-pagination__size">
      <NtpSelect :model-value="pageSize" label="Per page" :preloaded-options="preloadedOptions" :disabled="disabled"
        :clearable="false" @update:model-value="onPageSizeChange" />
    </div>
  </div>
</template>

<style scoped src="./NtpPagination.css"></style>
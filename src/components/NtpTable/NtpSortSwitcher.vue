<script setup lang="ts">
import type { SortIndicatorState } from '@ntp-lms-ui/lib/types'

interface Props {
  state?: SortIndicatorState
}

const { state = 'none' } = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="ntp-sort-switcher"
    :class="`ntp-sort-switcher--${state || 'none'}`"
    @click="emit('click')"
  >
    <span class="ntp-sort-switcher__label">
      <slot />
    </span>
    <span class="ntp-sort-switcher__arrows" aria-hidden="true">
      <svg
        class="ntp-sort-switcher__arrow ntp-sort-switcher__arrow--up"
        viewBox="0 0 8 5"
        width="8"
        height="5"
      >
        <path d="M4 0 L8 5 L0 5 Z" />
      </svg>
      <svg
        class="ntp-sort-switcher__arrow ntp-sort-switcher__arrow--down"
        viewBox="0 0 8 5"
        width="8"
        height="5"
      >
        <path d="M4 5 L8 0 L0 0 Z" />
      </svg>
    </span>
  </button>
</template>

<style scoped src="./NtpSortSwitcher.css"></style>
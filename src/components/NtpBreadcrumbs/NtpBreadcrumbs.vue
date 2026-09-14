<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { BreadcrumbItem } from '@ntp-lms-ui/lib/types'

interface Props {
  items: BreadcrumbItem[]
}

const {
  items,
} = defineProps<Props>()

function isClickable(item: BreadcrumbItem): boolean {
  return item.to !== undefined
}

function isIconOnly(item: BreadcrumbItem): boolean {
  return !!item.icon && !item.label
}

const hasUnlabeledIconItem = computed(() => {
  return items.some((item) => isIconOnly(item) && !item.ariaLabel)
})

if (import.meta.env.DEV && hasUnlabeledIconItem.value) {
  console.warn('[NtpBreadcrumbs] Icon-only items must provide ariaLabel.')
}
</script>

<template>
  <nav class="ntp-breadcrumbs" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <span class="ntp-breadcrumbs__item">
        <slot name="item" :item="item" :is-last="index === items.length - 1">
          <RouterLink
            v-if="isClickable(item)"
            :to="item.to!"
            class="ntp-breadcrumbs__link"
            :aria-label="item.ariaLabel"
          >
            <span v-if="item.icon" class="ntp-breadcrumbs__icon" aria-hidden="true">
              {{ item.icon }}
            </span>
            <span v-if="item.label">{{ item.label }}</span>
          </RouterLink>

          <span
            v-else
            class="ntp-breadcrumbs__text"
            :aria-label="item.ariaLabel"
          >
            <span v-if="item.icon" class="ntp-breadcrumbs__icon" aria-hidden="true">
              {{ item.icon }}
            </span>
            <span v-if="item.label">{{ item.label }}</span>
          </span>
        </slot>
      </span>

      <span
        v-if="index < items.length - 1"
        class="ntp-breadcrumbs__separator"
        aria-hidden="true"
      >
        <slot name="separator">›</slot>
      </span>
    </template>
  </nav>
</template>

<style scoped src="./NtpBreadcrumbs.css"></style>
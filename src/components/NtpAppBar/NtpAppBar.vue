<script setup lang="ts">
import { computed } from 'vue'

type AppBarHeight = 'small' | 'medium' | 'large'

const defaultHeight: AppBarHeight = 'small'

interface Props {
  title?: string
  subtitle?: string
  height?: AppBarHeight
}

const {
  title = '',
  subtitle = '',
  height = defaultHeight,
} = defineProps<Props>()

const appBarClasses = computed(() => [
  'ntp-app-bar',
  `ntp-app-bar--${height || defaultHeight}`,
])
</script>

<template>
  <header :class="appBarClasses">
    <span v-if="$slots.leading" class="ntp-app-bar__leading">
      <slot name="leading" />
    </span>

    <div class="ntp-app-bar__title-area">
      <slot>
        <span v-if="title" class="ntp-app-bar__title">{{ title }}</span>
        <span v-if="subtitle" class="ntp-app-bar__subtitle">{{ subtitle }}</span>
      </slot>
    </div>

    <span v-if="$slots.actions" class="ntp-app-bar__actions">
      <slot name="actions" />
    </span>
  </header>
</template>

<style scoped src="./NtpAppBar.css"></style>
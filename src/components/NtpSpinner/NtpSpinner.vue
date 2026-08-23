<script setup lang="ts">
import { computed } from 'vue'
import type { SpinnerSize, SpinnerColor } from '@ntp-lms-ui/lib/types/spinner'

const defaultSize: SpinnerSize = 'medium'
const defaultColor: SpinnerColor = 'primary'

interface Props {
  size?: SpinnerSize
  color?: SpinnerColor
}

const {
  size = defaultSize,
  color = defaultColor,
} = defineProps<Props>()

const spinnerClasses = computed(() => [
  'ntp-spinner',
  `ntp-spinner--${size || defaultSize}`,
  `ntp-spinner--${color || defaultColor}`,
])
</script>

<template>
  <div class="ntp-spinner" :class="spinnerClasses" role="progressbar" aria-busy="true" aria-label="Loading">
    <svg class="ntp-spinner__svg" viewBox="0 0 48 48" aria-hidden="true">
      <circle class="ntp-spinner__track" cx="24" cy="24" r="20" fill="none" stroke-width="4" />
      <circle class="ntp-spinner__head" cx="24" cy="24" r="20" fill="none" stroke-width="4" stroke-linecap="round"
        stroke-dasharray="125.6" stroke-dashoffset="94.2" />
    </svg>
  </div>
</template>

<style scoped src="./NtpSpinner.css"></style>
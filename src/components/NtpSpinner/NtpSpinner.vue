<script setup lang="ts">
import { computed } from 'vue'

// 1. Type aliases
type SpinnerSize = 'small' | 'medium' | 'large'
type SpinnerColor = 'primary' | 'on-surface-variant' | 'surface'

// 2. Default constants
const defaultSize: SpinnerSize = 'medium'
const defaultColor: SpinnerColor = 'primary'

// 3. Props interface
interface Props {
  size?: SpinnerSize
  color?: SpinnerColor
}

// 4. Destructured props
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
  <div
    class="ntp-spinner"
    :class="spinnerClasses"
    role="progressbar"
    aria-busy="true"
    aria-label="Loading"
  >
    <svg class="ntp-spinner__svg" viewBox="0 0 48 48" aria-hidden="true">
      <circle
        class="ntp-spinner__track"
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke-width="4"
      />
      <circle
        class="ntp-spinner__head"
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke-width="4"
        stroke-linecap="round"
        stroke-dasharray="125.6"
        stroke-dashoffset="94.2"
      />
    </svg>
  </div>
</template>

<style scoped src="./NtpSpinner.css"></style>
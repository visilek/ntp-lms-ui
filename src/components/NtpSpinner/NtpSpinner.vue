<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'on-surface-variant' | 'surface'
}

const {
  size = 'medium',
  color = 'primary',
} = defineProps<Props>()

const spinnerClasses = computed(() => [
  'ntp-spinner',
  `ntp-spinner--${size}`,
  `ntp-spinner--${color}`,
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
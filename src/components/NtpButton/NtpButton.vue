<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'filled' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'on-surface-variant' | 'surface'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  iconOnly?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
}

const {
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  block = false,
  iconOnly = false,
  ariaLabel = '',
  ariaLabelledby = '',
} = defineProps<Props>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'ntp-button',
  `ntp-button--${variant}`,
  `ntp-button--${color}`,
  `ntp-button--${size}`,
  {
    'ntp-button--block': block,
    'ntp-button--icon-only': iconOnly,
    'ntp-button--disabled': disabled,
    'ntp-button--loading': loading,
  },
])

function onClick(event: MouseEvent): void {
  if (disabled || loading) return
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :aria-label="ariaLabel || undefined"
    :aria-labelledby="ariaLabelledby || undefined"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <span v-if="loading" class="ntp-button__spinner" aria-hidden="true">
      <slot name="loading">
        <span class="ntp-button__spinner-default" />
      </slot>
    </span>
    <span v-else class="ntp-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped src="./NtpButton.css"></style>
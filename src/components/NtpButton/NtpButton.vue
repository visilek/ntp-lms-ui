<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonVariant, ButtonColor, ButtonSize } from '@ntp-lms-ui/lib/types/button'

// Default constants
const defaultVariant: ButtonVariant = 'filled'
const defaultColor: ButtonColor = 'primary'
const defaultSize: ButtonSize = 'medium'

// Props interface
interface Props {
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  block?: boolean
  iconOnly?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
}

const {
  variant = defaultVariant,
  color = defaultColor,
  size = defaultSize,
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
  `ntp-button--${variant || defaultVariant}`,
  `ntp-button--${color || defaultColor}`,
  `ntp-button--${size || defaultSize}`,
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
  <button type="button" :class="buttonClasses" :disabled="disabled || loading" :aria-label="ariaLabel || undefined"
    :aria-labelledby="ariaLabelledby || undefined" :aria-busy="loading || undefined" @click="onClick">
    <span class="ntp-button__content" :class="{ 'ntp-button__content--hidden': loading }">
      <slot />
    </span>

    <span v-if="loading" class="ntp-button__spinner" aria-hidden="true">
      <slot name="loading">
        <span class="ntp-button__spinner-default" />
      </slot>
    </span>
  </button>
</template>

<style scoped src="./NtpButton.css"></style>
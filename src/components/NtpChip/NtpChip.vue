<script setup lang="ts">
import { computed } from 'vue'
import type { ChipVariant, ChipColor, ChipSize } from '@ntp-lms-ui/lib/types/chip'

const defaultVariant: ChipVariant = 'filled'
const defaultColor: ChipColor = 'neutral'
const defaultSize: ChipSize = 'medium'

interface Props {
  label?: string
  variant?: ChipVariant
  color?: ChipColor
  size?: ChipSize
  dismissible?: boolean
  disabled?: boolean
  clickable?: boolean
}

const {
  label = '',
  variant = defaultVariant,
  color = defaultColor,
  size = defaultSize,
  dismissible = false,
  disabled = false,
  clickable = false,
} = defineProps<Props>()

const emit = defineEmits<{
  click: [event: MouseEvent]
  dismiss: []
}>()

const chipClasses = computed(() => [
  'ntp-chip',
  `ntp-chip--${variant || defaultVariant}`,
  `ntp-chip--${color || defaultColor}`,
  `ntp-chip--${size || defaultSize}`,
  {
    'ntp-chip--clickable': clickable,
    'ntp-chip--disabled': disabled,
    'ntp-chip--dismissible': dismissible,
  },
])

function onClick(event: MouseEvent): void {
  if (disabled || !clickable) return
  emit('click', event)
}

function onDismiss(): void {
  if (disabled) return
  emit('dismiss')
}
</script>

<template>
  <component :is="clickable ? 'button' : 'span'" :class="chipClasses"
    :disabled="clickable && disabled ? true : undefined" :type="clickable ? 'button' : undefined" @click="onClick">
    <span v-if="$slots.leading" class="ntp-chip__leading">
      <slot name="leading" />
    </span>

    <span class="ntp-chip__label">
      <slot>{{ label }}</slot>
    </span>

    <span v-if="$slots.trailing" class="ntp-chip__trailing">
      <slot name="trailing" />
    </span>

    <button v-if="dismissible" type="button" class="ntp-chip__dismiss"
      :aria-label="label ? `Remove ${label}` : 'Remove'" :disabled="disabled" @click.stop="onDismiss">
      <span aria-hidden="true">×</span>
    </button>
  </component>
</template>

<style scoped src="./NtpChip.css"></style>
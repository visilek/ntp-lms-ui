<script setup lang="ts">
import { computed } from 'vue'

type CardVariant = 'elevated' | 'filled' | 'outlined'
type CardColor = 'surface' | 'primary' | 'secondary' | 'tertiary'

const defaultVariant: CardVariant = 'elevated'
const defaultColor: CardColor = 'surface'

interface Props {
  variant?: CardVariant
  color?: CardColor
  clickable?: boolean
}

const {
  variant = defaultVariant,
  color = defaultColor,
  clickable = false,
} = defineProps<Props>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardClasses = computed(() => [
  'ntp-card',
  `ntp-card--${variant || defaultVariant}`,
  `ntp-card--color-${color || defaultColor}`,
  {
    'ntp-card--clickable': clickable,
  },
])

function onClick(event: MouseEvent) {
  if (!clickable) return
  emit('click', event)
}
</script>

<template>
  <div
    :class="cardClasses"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="onClick"
  >
    <slot />
  </div>
</template>

<style scoped src="./NtpCard.css"></style>
<script setup lang="ts">
import { ref } from 'vue'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

const defaultPosition: TooltipPosition = 'top'

interface Props {
  text: string
  position?: TooltipPosition
}

const {
  text,
  position = defaultPosition,
} = defineProps<Props>()

const isVisible = ref(false)

function show() {
  isVisible.value = true
}

function hide() {
  isVisible.value = false
}
</script>

<template>
  <span
    class="ntp-tooltip"
    :class="`ntp-tooltip--${position || defaultPosition}`"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <span
      v-if="isVisible"
      class="ntp-tooltip__content"
      role="tooltip"
    >
      {{ text }}
    </span>
  </span>
</template>

<style scoped src="./NtpTooltip.css"></style>
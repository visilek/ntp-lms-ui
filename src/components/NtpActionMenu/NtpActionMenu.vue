<script setup lang="ts">
import { ref } from 'vue'
import { NtpButton, NtpMenu } from '@ntp-lms-ui/components'
import type { ButtonVariant, ButtonColor, ButtonSize, MenuItem, MenuPlacement } from '@ntp-lms-ui/lib/types'

const defaultAriaLabel = 'More actions'
const defaultVariant: ButtonVariant = 'text'
const defaultColor: ButtonColor = 'on-surface-variant'
const defaultSize: ButtonSize = 'medium'
const defaultPlacement: MenuPlacement = 'bottom-end'

interface Props {
  items?: MenuItem[]
  ariaLabel?: string
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  disabled?: boolean
  placement?: MenuPlacement
}

const {
  items = [],
  ariaLabel = defaultAriaLabel,
  variant = defaultVariant,
  color = defaultColor,
  size = defaultSize,
  disabled = false,
  placement = defaultPlacement,
} = defineProps<Props>()

const emit = defineEmits<{
  select: [item: MenuItem]
  open: []
  close: []
}>()

const triggerRef = ref<{ $el: HTMLElement | null } | null>(null)
const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    emit('open')
  }
}

function onMenuClose() {
  isOpen.value = false
  emit('close')
}

function onSelect(item: MenuItem) {
  isOpen.value = false
  emit('select', item)
}
</script>

<template>
  <div class="ntp-action-menu">
    <NtpButton ref="triggerRef" :variant="variant || defaultVariant" :color="color || defaultColor"
      :size="size || defaultSize" :disabled="disabled" icon-only :aria-label="ariaLabel" @click="toggle">
      <slot name="trigger">
        <span aria-hidden="true">⋮</span>
      </slot>
    </NtpButton>

    <NtpMenu :items="items" :anchor="triggerRef" :placement="placement || defaultPlacement" :open="isOpen && !disabled"
      @select="onSelect" @close="onMenuClose">
      <template v-if="$slots.item" #item="slotProps">
        <slot name="item" v-bind="slotProps" />
      </template>

      <template v-if="$slots.default" #default>
        <slot />
      </template>
    </NtpMenu>
  </div>
</template>

<style scoped src="./NtpActionMenu.css"></style>
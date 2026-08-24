<script setup lang="ts">
import { computed } from 'vue'
import type { SelectionLabelPosition } from '@ntp-lms-ui/lib/types/input'

const defaultLabelPosition: SelectionLabelPosition = 'left'

interface Props {
  modelValue?: boolean
  label?: string
  labelPosition?: SelectionLabelPosition
  disabled?: boolean
  readonly?: boolean
}

const {
  modelValue = false,
  label = '',
  labelPosition = defaultLabelPosition,
  disabled = false,
  readonly = false,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const toggleClasses = computed(() => [
  'ntp-toggle',
  `ntp-toggle--label-${labelPosition || defaultLabelPosition}`,
  {
    'ntp-toggle--disabled': disabled,
    'ntp-toggle--readonly': readonly,
  },
])

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const checked = target.checked
  emit('update:modelValue', checked)
  emit('change', checked)
}

function onClick(event: MouseEvent) {
  if (readonly) {
    event.preventDefault()
  }
}
</script>

<template>
  <label :class="toggleClasses">
    <input type="checkbox" role="switch" class="ntp-toggle__input" :checked="modelValue" :disabled="disabled"
      @change="onChange" @click="onClick" />

    <span class="ntp-toggle__track" aria-hidden="true">
      <span class="ntp-toggle__thumb"></span>
    </span>

    <span v-if="label || $slots.default" class="ntp-toggle__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style src="./NtpToggle.css"></style>
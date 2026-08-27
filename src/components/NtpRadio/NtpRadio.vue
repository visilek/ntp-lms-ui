<script setup lang="ts">
import type { SelectionLabelPosition } from '@ntp-lms-ui/lib/types/input'

const defaultLabelPosition: SelectionLabelPosition = 'right'

interface Props {
  modelValue?: string | number | null
  value: string | number
  label?: string
  labelPosition?: SelectionLabelPosition
  disabled?: boolean
  readonly?: boolean
  name?: string
}

const {
  modelValue = null,
  value,
  label = '',
  labelPosition = defaultLabelPosition,
  disabled = false,
  readonly = false,
  name = '',
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.checked) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}

function onClick(event: MouseEvent) {
  if (readonly) {
    event.preventDefault()
  }
}
</script>

<template>
  <label class="ntp-radio" :class="`ntp-radio--label-${labelPosition || defaultLabelPosition}`">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="onChange"
      @click="onClick"
    />

    <span v-if="label || $slots.default" class="ntp-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped src="./NtpRadio.css"></style>
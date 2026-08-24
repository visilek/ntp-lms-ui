<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type CheckboxLabelPosition = 'left' | 'right'

const defaultLabelPosition: CheckboxLabelPosition = 'right'

interface Props {
  modelValue?: boolean
  label?: string
  labelPosition?: CheckboxLabelPosition
  indeterminate?: boolean
  disabled?: boolean
  readonly?: boolean
}

const {
  modelValue = false,
  label = '',
  labelPosition = defaultLabelPosition,
  indeterminate = false,
  disabled = false,
  readonly = false,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

watch(() => indeterminate, (val) => {
  if (inputRef.value) {
    inputRef.value.indeterminate = val
  }
}, { immediate: true })

const checkboxClasses = computed(() => [
  'ntp-checkbox',
  `ntp-checkbox--label-${labelPosition || defaultLabelPosition}`,
  {
    'ntp-checkbox--disabled': disabled,
    'ntp-checkbox--readonly': readonly,
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
  <label :class="checkboxClasses">
    <input
      ref="inputRef"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
      @click="onClick"
    />

    <span v-if="label || $slots.default" class="ntp-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped src="./NtpCheckbox.css"></style>
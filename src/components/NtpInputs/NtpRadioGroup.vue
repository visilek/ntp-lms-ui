<script setup lang="ts">
import { computed, useId } from 'vue'
import NtpRadio from './NtpRadio.vue'
import type { SelectionLabelPosition, SelectionGroupDirection } from '@ntp-lms-ui/lib/types/input'

type RadioGroupOption = {
  value: string | number
  label: string
  disabled?: boolean
}

const defaultLabelPosition: SelectionLabelPosition = 'right'
const defaultDirection: SelectionGroupDirection = 'vertical'

interface Props {
  modelValue?: string | number | null
  options?: RadioGroupOption[]
  label?: string
  labelPosition?: SelectionLabelPosition
  direction?: SelectionGroupDirection
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  errors?: string[]
  hint?: string
}

const {
  modelValue = null,
  options = [],
  label = '',
  labelPosition = defaultLabelPosition,
  direction = defaultDirection,
  required = false,
  disabled = false,
  readonly = false,
  errors = [],
  hint = '',
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const groupName = useId()

const groupClasses = computed(() => [
  'ntp-radio-group',
  `ntp-radio-group--${direction || defaultDirection}`,
  {
    'ntp-radio-group--required': required,
    'ntp-radio-group--disabled': disabled,
    'ntp-radio-group--readonly': readonly,
  },
])
</script>

<template>
  <fieldset :class="groupClasses" :disabled="disabled" :aria-required="required || undefined" role="radiogroup">
    <legend v-if="label" class="ntp-radio-group__label">{{ label }}</legend>

    <div class="ntp-radio-group__options">
      <NtpRadio
        v-for="option in options"
        :key="option.value"
        :model-value="modelValue"
        :value="option.value"
        :label="option.label"
        :label-position="labelPosition"
        :disabled="option.disabled || disabled"
        :readonly="readonly"
        :name="groupName"
        @update:model-value="(val) => emit('update:modelValue', val)"
      >
        <template v-if="$slots.option" #default>
          <slot name="option" :option="option" :checked="modelValue === option.value" />
        </template>
      </NtpRadio>
    </div>

    <div v-if="hint || errors.length" class="ntp-radio-group__support">
      <div v-if="errors.length" class="ntp-radio-group__errors">
        <div v-for="(msg, i) in errors" :key="i">{{ msg }}</div>
      </div>
      <div v-else class="ntp-radio-group__hint">{{ hint }}</div>
    </div>
  </fieldset>
</template>

<style scoped src="./NtpRadioGroup.css"></style>
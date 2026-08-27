<script setup lang="ts">
import { computed } from 'vue'
import type { InputVariant, InputContextColor } from '@ntp-lms-ui/lib/types/input'
import { useInputBase } from '@ntp-lms-ui/lib/useInputBase'

// 1. Type aliases
type TextInputType = 'text' | 'password' | 'email'

// 2. Default constants
const defaultVariant: InputVariant = 'filled'
const defaultContextColor: InputContextColor = 'surface'
const defaultType: TextInputType = 'text'
const defaultAutocomplete = 'off'

// 3. Props interface
interface Props {
  modelValue?: string
  label?: string
  variant?: InputVariant
  contextColor?: InputContextColor
  type?: TextInputType
  disabled?: boolean
  readonly?: boolean
  errors?: string[]
  hint?: string
  required?: boolean
  autocomplete?: string
}

// 4. Destructured props
const {
  modelValue = '',
  label = '',
  variant = defaultVariant,
  contextColor = defaultContextColor,
  type = defaultType,
  disabled = false,
  readonly = false,
  errors = [],
  hint = '',
  required = false,
  autocomplete = defaultAutocomplete,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const hasValue = computed(() => modelValue !== '')

const {
  inputId,
  isLabelFloating,
  wrapperClasses,
  supportText,
  hasError,
  onFocus,
  onBlur,
} = useInputBase({
  label,
  variant: variant || defaultVariant,
  contextColor: contextColor || defaultContextColor,
  disabled,
  readonly,
  errors,
  hint,
  required,
  hasValue,
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleFocus(event: FocusEvent) {
  onFocus()
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  onBlur()
  emit('blur', event)
}
</script>

<template>
  <div :class="wrapperClasses">
    <div class="ntp-input__field">
      <span v-if="$slots.leading" class="ntp-input__leading">
        <slot name="leading" />
      </span>

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="readonly ? 'off' : autocomplete"
        :aria-invalid="hasError || undefined"
        :aria-required="required || undefined"
        class="ntp-input__control"
        @input="onInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <label
        :for="inputId"
        class="ntp-input__label"
        :class="{ 'ntp-input__label--floating': isLabelFloating }"
      >
        {{ label }}
      </label>

      <span v-if="$slots.trailing" class="ntp-input__trailing">
        <slot name="trailing" />
      </span>
    </div>

    <div
      v-if="supportText.length"
      class="ntp-input__support-text"
      :class="{ 'ntp-input__support-text--error': hasError }"
    >
      <div v-for="(msg, i) in supportText" :key="i" class="ntp-input__error-line">
        {{ msg }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InputVariant, InputContextColor } from '@ntp-lms-ui/lib/types'
import { useInputBase } from '@ntp-lms-ui/lib'
import { useNumberInput } from './useNumberInput'

// 1. Type aliases
// (none — using shared types)

// 2. Default constants
const defaultVariant: InputVariant = 'filled'
const defaultContextColor: InputContextColor = 'surface'
const defaultStep = 1

// 3. Props interface
interface Props {
  modelValue?: number | null
  label?: string
  variant?: InputVariant
  contextColor?: InputContextColor
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  readonly?: boolean
  errors?: string[]
  hint?: string
  required?: boolean
}

// 4. Destructured props
const {
  modelValue = null,
  label = '',
  variant = defaultVariant,
  contextColor = defaultContextColor,
  min,
  max,
  step = defaultStep,
  disabled = false,
  readonly = false,
  errors = [],
  hint = '',
  required = false,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const internalErrors = ref<string[]>([])

const numberInput = useNumberInput({
  modelValue: computed(() => modelValue ?? null),
  min,
  max,
  step: step || defaultStep,
})

const mergedErrors = computed(() =>
  errors.concat(internalErrors.value)
)

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
  errors: mergedErrors.value,
  hint,
  required,
  hasValue: numberInput.hasValue,
})

function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  const value = numberInput.parseValue(input)
  internalErrors.value = numberInput.getInternalErrors(input)
  emit('update:modelValue', value)
}

function handleFocus(event: FocusEvent) {
  onFocus()
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  onBlur()
  const input = event.target as HTMLInputElement
  internalErrors.value = numberInput.getInternalErrors(input)
  emit('update:modelValue', numberInput.parseValue(input))
  emit('blur', event)
}

function onIncrement() {
  if (!numberInput.canIncrement()) return
  const next = numberInput.increment()
  emit('update:modelValue', next)
}

function onDecrement() {
  if (!numberInput.canDecrement()) return
  const next = numberInput.decrement()
  emit('update:modelValue', next)
}
</script>

<template>
  <div :class="wrapperClasses">
    <div class="ntp-input__field">
      <span v-if="$slots.leading" class="ntp-input__leading">
        <slot name="leading" />
      </span>

      <input :id="inputId" type="number" :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly" :min="min"
        :max="max" :step="step" :aria-invalid="hasError || undefined" :aria-required="required || undefined"
        class="ntp-input__control" @input="onInput" @focus="handleFocus" @blur="handleBlur" />

      <label :for="inputId" class="ntp-input__label" :class="{ 'ntp-input__label--floating': isLabelFloating }">
        {{ label }}
      </label>

      <span v-if="!readonly && !disabled" class="ntp-input__stepper">
        <button type="button" class="ntp-input__step-btn" aria-label="Increment" :disabled="!numberInput.canIncrement()"
          @click="onIncrement">
          ▲
        </button>
        <button type="button" class="ntp-input__step-btn" aria-label="Decrement" :disabled="!numberInput.canDecrement()"
          @click="onDecrement">
          ▼
        </button>
      </span>

      <span v-if="$slots.trailing" class="ntp-input__trailing">
        <slot name="trailing" />
      </span>
    </div>

    <div v-if="supportText.length" class="ntp-input__support-text"
      :class="{ 'ntp-input__support-text--error': hasError }">
      <div v-for="(msg, i) in supportText" :key="i" class="ntp-input__error-line">
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<style scoped src="./NtpNumberInput.css"></style>
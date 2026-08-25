import { computed, ref, unref, useId } from 'vue'
import type { MaybeRef } from 'vue'
import type { InputVariant, InputContextColor } from './types/input'

export interface UseInputBaseOptions {
  id?: string
  label: string
  variant: InputVariant
  contextColor: InputContextColor
  disabled: boolean
  readonly: boolean
  errors: string[]
  hint: string
  required: boolean
  hasValue: MaybeRef<boolean>
}

export function useInputBase(options: UseInputBaseOptions) {
  const inputId = options.id ?? useId()

  const isFocused = ref(false)

  const isLabelFloating = computed(() => {
    return isFocused.value || unref(options.hasValue)
  })

  const hasError = computed(() => options.errors.length > 0)

  const supportText = computed(() => {
    if (hasError.value) return options.errors
    if (options.hint) return [options.hint]
    return []
  })

  const wrapperClasses = computed(() => [
    'ntp-input',
    `ntp-input--${options.variant}`,
    `ntp-input--context-${options.contextColor}`,
    {
      'ntp-input--focused': isFocused.value,
      'ntp-input--label-floating': isLabelFloating.value,
      'ntp-input--disabled': options.disabled,
      'ntp-input--readonly': options.readonly,
      'ntp-input--error': hasError.value,
      'ntp-input--required': options.required,
      'ntp-input--has-value': unref(options.hasValue),
    },
  ])

  function onFocus() {
    isFocused.value = true
  }

  function onBlur() {
    isFocused.value = false
  }

  return {
    inputId,
    isFocused,
    isLabelFloating,
    wrapperClasses,
    supportText,
    hasError,
    onFocus,
    onBlur,
  }
}
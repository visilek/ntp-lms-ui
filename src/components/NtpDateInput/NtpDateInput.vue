<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InputVariant, InputContextColor } from '@ntp-lms-ui/lib/types/input'
import { useInputBase } from '@ntp-lms-ui/lib'

// 1. Default constants
const defaultVariant: InputVariant = 'filled'
const defaultContextColor: InputContextColor = 'surface'

// 2. Props interface
interface Props {
    modelValue?: string | null
    label?: string
    variant?: InputVariant
    contextColor?: InputContextColor
    min?: string
    max?: string
    disabled?: boolean
    readonly?: boolean
    errors?: string[]
    hint?: string
    required?: boolean
}

// 3. Destructured props
const {
    modelValue = null,
    label = '',
    variant = defaultVariant,
    contextColor = defaultContextColor,
    min,
    max,
    disabled = false,
    readonly = false,
    errors = [],
    hint = '',
    required = false,
} = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: string | null]
    blur: [event: FocusEvent]
    focus: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const hasValue = computed(() => modelValue !== null && modelValue !== '')

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
    emit('update:modelValue', target.value || null)
}

function handleFocus(event: FocusEvent) {
    onFocus()
    emit('focus', event)
}

function handleBlur(event: FocusEvent) {
    onBlur()
    emit('blur', event)
}

function openPicker() {
    if (disabled || readonly) return
    inputRef.value?.showPicker?.()
}

defineExpose({ openPicker })
</script>

<template>
    <div :class="wrapperClasses">
        <div class="ntp-input__field">
            <input ref="inputRef" :id="inputId" type="date" :value="modelValue ?? ''" :disabled="disabled"
                :readonly="readonly" :min="min" :max="max" :aria-invalid="hasError || undefined"
                :aria-required="required || undefined" class="ntp-input__control" @input="onInput" @focus="handleFocus"
                @blur="handleBlur" />

            <label :for="inputId" class="ntp-input__label" :class="{ 'ntp-input__label--floating': isLabelFloating }">
                {{ label }}
            </label>

            <button type="button" class="ntp-input__calendar-btn" :aria-label="`Open calendar for ${label || 'date'}`"
                :disabled="disabled || readonly" @click="openPicker">
            </button>
        </div>

        <div v-if="supportText.length" class="ntp-input__support-text"
            :class="{ 'ntp-input__support-text--error': hasError }">
            <div v-for="(msg, i) in supportText" :key="i" class="ntp-input__error-line">
                {{ msg }}
            </div>
        </div>
    </div>
</template>

<style scoped src="./NtpDateInput.css"></style>
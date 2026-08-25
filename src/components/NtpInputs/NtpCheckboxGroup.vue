<script setup lang="ts">
import { computed } from 'vue'
import NtpCheckbox from './NtpCheckbox.vue'
import type { SelectionLabelPosition, SelectionGroupDirection } from '@ntp-lms-ui/lib/types/input'



type CheckboxGroupOption = {
    value: string | number
    label: string
    disabled?: boolean
}

const defaultLabelPosition: SelectionLabelPosition = 'right'
const defaultDirection: SelectionGroupDirection = 'vertical'

interface Props {
    modelValue?: Array<string | number>
    options?: CheckboxGroupOption[]
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
    modelValue = [],
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
    'update:modelValue': [value: Array<string | number>]
}>()

const groupClasses = computed(() => [
    'ntp-checkbox-group',
    `ntp-checkbox-group--${direction || defaultDirection}`,
    {
        'ntp-checkbox-group--required': required,
        'ntp-checkbox-group--disabled': disabled,
        'ntp-checkbox-group--readonly': readonly,
    },
])

function isChecked(value: string | number): boolean {
    return modelValue.includes(value)
}

function toggleOption(value: string | number): void {
    if (disabled || readonly) return

    const checked = isChecked(value)
    if (checked) {
        emit('update:modelValue', modelValue.filter((v) => v !== value))
    } else {
        emit('update:modelValue', [...modelValue, value])
    }
}
</script>

<template>
    <fieldset :class="groupClasses" :disabled="disabled" :aria-required="required || undefined" role="group">
        <legend v-if="label" class="ntp-checkbox-group__label">{{ label }}</legend>

        <div class="ntp-checkbox-group__options">
            <NtpCheckbox v-for="option in options" :key="option.value" :model-value="isChecked(option.value)"
                :label="option.label" :label-position="labelPosition" :disabled="option.disabled || disabled"
                :readonly="readonly" @change="toggleOption(option.value)">
                <template v-if="$slots.option" #default>
                    <slot name="option" :option="option" :checked="isChecked(option.value)" />
                </template>
            </NtpCheckbox>
        </div>

        <div v-if="hint || errors.length" class="ntp-checkbox-group__support">
            <div v-if="errors.length" class="ntp-checkbox-group__errors">
                <div v-for="(msg, i) in errors" :key="i">{{ msg }}</div>
            </div>
            <div v-else class="ntp-checkbox-group__hint">{{ hint }}</div>
        </div>
    </fieldset>
</template>

<style scoped src="./NtpCheckboxGroup.css"></style>
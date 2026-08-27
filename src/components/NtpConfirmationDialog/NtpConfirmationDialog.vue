<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NtpDialog, NtpDialogHeader, NtpButton, NtpTextInput } from '@ntp-lms-ui/components'

type ConfirmButtonColor = 'primary' | 'error'
type ConfirmButtonVariant = 'text' | 'filled'

const defaultConfirmLabel = 'Confirm'
const defaultCancelLabel = 'Cancel'
const defaultIcon = ''
const defaultConfirmButtonColor: ConfirmButtonColor = 'primary'
const defaultConfirmButtonVariant: ConfirmButtonVariant = 'text'

interface Props {
    open?: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    icon?: string
    confirmButtonColor?: ConfirmButtonColor
    confirmButtonVariant?: ConfirmButtonVariant
    loading?: boolean
    persistent?: boolean
    confirmationPhrase?: string
}

const {
    open = false,
    title = '',
    message = '',
    confirmLabel = defaultConfirmLabel,
    cancelLabel = defaultCancelLabel,
    icon = defaultIcon,
    confirmButtonColor = defaultConfirmButtonColor,
    confirmButtonVariant = defaultConfirmButtonVariant,
    loading = false,
    persistent = false,
    confirmationPhrase = '',
} = defineProps<Props>()

const emit = defineEmits<{
    'update:open': [value: boolean]
    confirm: []
    cancel: []
}>()

const typedPhrase = ref('')

const isPhraseMatched = computed(() => {
    if (!confirmationPhrase) return true
    return typedPhrase.value === confirmationPhrase
})

const isConfirmDisabled = computed(() => {
    return loading || !isPhraseMatched.value
})

const cancelButtonVariant = computed(() => {
    return confirmButtonVariant === 'filled' ? 'outlined' : 'text'
})

watch(
    () => open,
    (isOpen) => {
        if (!isOpen) {
            typedPhrase.value = ''
        }
    },
)

function onConfirm() {
    if (isConfirmDisabled.value) return
    emit('confirm')
}

function onCancel() {
    emit('cancel')
    emit('update:open', false)
}

function onDialogClose() {
    if (persistent) return
    onCancel()
}
</script>

<template>
    <NtpDialog :open="open" :persistent="persistent" @update:open="(val) => emit('update:open', val)"
        @closed="onDialogClose">
        <NtpDialogHeader :title="title" :icon="icon || undefined" @close="onCancel" />

        <div class="ntp-pa-4" style="display: flex; flex-direction: column; gap: 16px;">
            <slot>
                <p>{{ message }}</p>
            </slot>

            <NtpTextInput v-if="confirmationPhrase" v-model="typedPhrase"
                :label="`Type ${confirmationPhrase} to confirm`" />
        </div>

        <div class="ntp-pa-4" style="display: flex; justify-content: flex-end; gap: 8px;">
            <slot name="footer">
                <NtpButton :variant="cancelButtonVariant" color="on-surface-variant" @click="onCancel">
                    {{ cancelLabel }}
                </NtpButton>
                <NtpButton :variant="confirmButtonVariant" :color="confirmButtonColor" :loading="loading"
                    :disabled="isConfirmDisabled" @click="onConfirm">
                    {{ confirmLabel }}
                </NtpButton>
            </slot>
        </div>
    </NtpDialog>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'
import { NtpAppBar, NtpButton } from '@ntp-lms-ui/components'

const fullscreenKey = Symbol('ntp-dialog-fullscreen')

interface Props {
  title?: string
  fullscreenTitle?: string
  subtitle?: string
  icon?: string
  fullscreen?: boolean | null
  showClose?: boolean
}

const {
  title = '',
  fullscreenTitle = '',
  subtitle = '',
  icon = '',
  fullscreen = null,
  showClose = true,
} = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const injectedFullscreen = inject<Ref<boolean> | null>(fullscreenKey, null)

const headerClasses = computed(() => [
  'ntp-dialog-header',
  {
    'ntp-dialog-header--with-icon': !!icon,
  },
])

const isFullscreen = computed(() => {
  if (fullscreen !== null) return fullscreen
  return injectedFullscreen?.value ?? false
})

const effectiveTitle = computed(() => {
  if (isFullscreen.value && fullscreenTitle) return fullscreenTitle
  return title
})

function onClose() {
  emit('close')
}
</script>

<template>
  <!-- Fullscreen: render NtpAppBar -->
  <NtpAppBar v-if="isFullscreen" :title="effectiveTitle" :subtitle="subtitle" height="small">
    <template v-if="showClose" #leading>
      <NtpButton icon-only aria-label="Close" color="on-surface-variant" @click="onClose">
        <slot name="close">×</slot>
      </NtpButton>
    </template>

    <template #default>
      <slot>
        <span class="ntp-dialog-header__title">{{ effectiveTitle }}</span>
      </slot>
    </template>

    <template v-if="$slots.fullscreenActions" #actions>
      <slot name="fullscreenActions" />
    </template>
  </NtpAppBar>

  <!-- Standard: centered -->
  <div v-else :class="headerClasses">
    <span v-if="icon" class="ntp-dialog-header__icon" aria-hidden="true">{{ icon }}</span>

    <div class="ntp-dialog-header__text">
      <slot>
        <span class="ntp-dialog-header__title">{{ title }}</span>
        <span v-if="subtitle" class="ntp-dialog-header__subtitle">{{ subtitle }}</span>
      </slot>
    </div>
  </div>
</template>

<style scoped src="./NtpDialogHeader.css"></style>
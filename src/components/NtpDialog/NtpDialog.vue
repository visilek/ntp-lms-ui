<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'

const defaultWidth = '560px'
const VIEWPORT_MARGIN = 32

interface Props {
  open?: boolean
  persistent?: boolean
  width?: string | number
  fullscreen?: boolean
  showClose?: boolean
}

const {
  open = false,
  persistent = false,
  width = defaultWidth,
  fullscreen = false,
  showClose = true,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  opened: []
  closed: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)
let previousFocus: HTMLElement | null = null

const fullscreenKey = Symbol('ntp-dialog-fullscreen')

provide(fullscreenKey, isFullscreen)

const dialogClasses = computed(() => [
  'ntp-dialog',
  {
    'ntp-dialog--fullscreen': isFullscreen.value,
  },
])

function computeFullscreen() {
  if (fullscreen) {
    isFullscreen.value = true
    return
  }

  const numericWidth = typeof width === 'number' ? width : parseFloat(width)
  isFullscreen.value = window.innerWidth < numericWidth + VIEWPORT_MARGIN
}

function lockScroll() {
  document.body.style.overflow = 'hidden'
}

function unlockScroll() {
  document.body.style.overflow = ''
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return

  const focusable = dialogRef.value?.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  if (!focusable || focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !persistent) {
    emit('update:open', false)
    return
  }
  trapFocus(event)
}

function onBackdropClick(event: MouseEvent) {
  if (persistent) return
  if (event.target === dialogRef.value) {
    emit('update:open', false)
  }
}

function closeDialog() {
  if (persistent) return
  emit('update:open', false)
}

watch(
  () => open,
  async (isOpen) => {
    if (isOpen) {
      previousFocus = document.activeElement as HTMLElement
      computeFullscreen()
      lockScroll()
      await nextTick()
      dialogRef.value?.focus()
      window.addEventListener('keydown', onKeydown)
      window.addEventListener('resize', computeFullscreen)
      emit('opened')
    } else {
      unlockScroll()
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('resize', computeFullscreen)
      previousFocus?.focus()
      emit('closed')
    }
  },
  {immediate: true},
)

onBeforeUnmount(() => {
  unlockScroll()
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', computeFullscreen)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="dialogRef"
      :class="dialogClasses"
      :style="{ width: isFullscreen ? undefined : `${width}px` }"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @click="onBackdropClick"
    >
      <div class="ntp-dialog__surface">
        <slot />
      </div>

      <button
        v-if="showClose && !isFullscreen"
        type="button"
        class="ntp-dialog__close"
        aria-label="Close dialog"
        @click="closeDialog"
      >
        <slot name="close">×</slot>
      </button>
    </div>
  </Teleport>
</template>

<style scoped src="./NtpDialog.css"></style>
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { MenuItem, MenuPlacement } from '@ntp-lms-ui/lib/types/menu'

const defaultPlacement: MenuPlacement = 'bottom-end'
const VIEWPORT_MARGIN = 8
const ANCHOR_GAP = 4

type AnchorLike = HTMLElement | { $el: HTMLElement | null } | null

interface Props {
  items?: MenuItem[]
  anchor?: AnchorLike
  placement?: MenuPlacement
  open?: boolean
}

const {
  items = [],
  anchor = null,
  placement = defaultPlacement,
  open = false,
} = defineProps<Props>()

const emit = defineEmits<{
  select: [payload: { value: string | number; item: MenuItem }]
  close: []
}>()

const menuRef = ref<HTMLElement | null>(null)
const isPositioned = ref(false)
const position = ref<CSSProperties>({})

function getAnchorElement(): HTMLElement | null {
  if (!anchor) return null
  if (anchor instanceof HTMLElement) return anchor
  return anchor.$el ?? null
}

function computePosition() {
  const anchorEl = getAnchorElement()
  if (!anchorEl || !menuRef.value) return

  const anchorRect = anchorEl.getBoundingClientRect()
  const menuRect = menuRef.value.getBoundingClientRect()

  let top = 0
  let left = 0

  switch (placement) {
    case 'bottom-end':
      top = anchorRect.bottom + ANCHOR_GAP
      left = anchorRect.right - menuRect.width
      break
    case 'bottom-start':
      top = anchorRect.bottom + ANCHOR_GAP
      left = anchorRect.left
      break
    case 'top-end':
      top = anchorRect.top - menuRect.height - ANCHOR_GAP
      left = anchorRect.right - menuRect.width
      break
    case 'top-start':
      top = anchorRect.top - menuRect.height - ANCHOR_GAP
      left = anchorRect.left
      break
  }

  const maxLeft = window.innerWidth - menuRect.width - VIEWPORT_MARGIN
  const maxTop = window.innerHeight - menuRect.height - VIEWPORT_MARGIN

  left = Math.max(VIEWPORT_MARGIN, Math.min(left, maxLeft))
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, maxTop))

  position.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

function onSelect(item: MenuItem) {
  if (item.disabled) return
  emit('select', { value: item.value, item })
}

function onOutsideClick(event: MouseEvent) {
  if (!open) return
  if (menuRef.value?.contains(event.target as Node)) return
  if (getAnchorElement()?.contains(event.target as Node)) return
  emit('close')
}

function onScroll(event: Event) {
  if (!open) return
  if (menuRef.value?.contains(event.target as Node)) return
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (!open) return

  if (event.key === 'Escape') {
    emit('close')
    return
  }

  const focusable = menuRef.value?.querySelectorAll<HTMLElement>(
    '.ntp-menu__item:not(:disabled)',
  )

  if (!focusable || focusable.length === 0) return

  const currentIndex = Array.from(focusable).indexOf(document.activeElement as HTMLElement)

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const next = (currentIndex + 1) % focusable.length
    focusable[next].focus()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    const prev = (currentIndex - 1 + focusable.length) % focusable.length
    focusable[prev].focus()
  }
}

watch(
  () => open,
  async (isOpen) => {
    if (isOpen) {
      isPositioned.value = false
      await nextTick()
      computePosition()
      isPositioned.value = true
      requestAnimationFrame(() => {
        menuRef.value?.querySelector<HTMLElement>('.ntp-menu__item:not(:disabled)')?.focus()
      })
    } else {
      isPositioned.value = false
    }
  },
)

onMounted(() => {
  document.addEventListener('mousedown', onOutsideClick)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onOutsideClick)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll, true)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="menuRef"
      class="ntp-menu"
      :class="{ 'ntp-menu--positioned': isPositioned }"
      role="menu"
      :style="position"
      @keydown="onKeydown"
    >
      <div v-if="$slots.header" class="ntp-menu__header">
        <slot name="header" />
      </div>

      <template v-if="$slots.default">
        <slot />
      </template>

      <template v-else>
        <button
          v-for="item in items"
          :key="item.value"
          type="button"
          class="ntp-menu__item"
          :class="{
            'ntp-menu__item--danger': item.danger,
            'ntp-menu__item--disabled': item.disabled,
          }"
          role="menuitem"
          :disabled="item.disabled"
          @click="onSelect(item)"
        >
          <span v-if="item.leading" class="ntp-menu__item-leading" aria-hidden="true">
            {{ item.leading }}
          </span>
          <span class="ntp-menu__item-label">{{ item.label }}</span>
        </button>
      </template>
    </div>
  </Teleport>
</template>

<style scoped src="./NtpMenu.css"></style>
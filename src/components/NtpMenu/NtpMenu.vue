<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { MenuItem, MenuItemValue, MenuPlacement, PositionStyle } from '@ntp-lms-ui/lib/types'
import { computePosition } from '@ntp-lms-ui/lib/utils'

const defaultPlacement: MenuPlacement = 'bottom-end'
const defaultMinWidth = '112px'

type AnchorLike = HTMLElement | { $el: HTMLElement | null } | null

interface Props {
  items?: MenuItem[]
  anchor?: AnchorLike
  placement?: MenuPlacement
  open?: boolean
  minWidth?: string
}

const {
  items = [],
  anchor = null,
  placement = defaultPlacement,
  open = false,
  minWidth = defaultMinWidth,
} = defineProps<Props>()

const emit = defineEmits<{
  select: [item: MenuItem]
  close: []
}>()

const menuRef = ref<HTMLElement | null>(null)
const isPositioned = ref(false)
const position = ref<PositionStyle>({ top: '0px', left: '0px' })

const menuStyle = computed<CSSProperties>(() => ({
  ...position.value,
  minWidth,
}))

function getAnchorElement(): HTMLElement | null {
  if (!anchor) return null
  if (anchor instanceof HTMLElement) return anchor
  return anchor.$el ?? null
}

function computeMenuPosition() {
  const anchorEl = getAnchorElement()
  if (!anchorEl || !menuRef.value) return

  const anchorRect = anchorEl.getBoundingClientRect()
  const menuRect = menuRef.value.getBoundingClientRect()

  position.value = computePosition(
    anchorRect,
    menuRect,
    placement,
    window.innerWidth,
    window.innerHeight,
  )
}

function onSelect(item: MenuItem) {
  if (item.disabled) return
  emit('select', item)
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
      computeMenuPosition()
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
    <div v-if="open" ref="menuRef" class="ntp-menu" :class="{
      'ntp-menu--positioned': isPositioned,
      'ntp-menu--no-header': !$slots.header,
      'ntp-menu--no-footer': !$slots.footer,
    }" role="menu" :style="menuStyle" @keydown="onKeydown">
      <div v-if="$slots.header" class="ntp-menu__header">
        <slot name="header" />
      </div>

      <div class="ntp-menu__items">
        <template v-if="$slots.default">
          <slot />
        </template>

        <template v-else>
          <button v-for="item in items" :key="item.value" type="button" class="ntp-menu__item" :class="{
            'ntp-menu__item--danger': item.danger,
            'ntp-menu__item--disabled': item.disabled,
            'ntp-menu__item--selected': item.selected,
          }" role="menuitem" :disabled="item.disabled" @click="onSelect(item)">
            <span v-if="item.leading" class="ntp-menu__item-leading" aria-hidden="true">
              {{ item.leading }}
            </span>
            <span class="ntp-menu__item-label">{{ item.label }}</span>
          </button>
        </template>
      </div>

      <div v-if="$slots.footer" class="ntp-menu__footer">
        <slot name="footer" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped src="./NtpMenu.css"></style>
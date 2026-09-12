<script setup lang="ts">
import { computed } from 'vue'

type CardHeaderOverlay = 'none' | 'scrim' | 'solid'

const defaultOverlay: CardHeaderOverlay = 'none'

interface Props {
  title?: string
  subtitle?: string
  avatar?: string
  overlay?: CardHeaderOverlay
}

const {
  title = '',
  subtitle = '',
  avatar = '',
  overlay = defaultOverlay,
} = defineProps<Props>()

const hasAvatar = computed(() => !!avatar)

const headerClasses = computed(() => [
  'ntp-card-header',
  `ntp-card-header--overlay-${overlay || defaultOverlay}`,
  {
    'ntp-card-header--with-avatar': hasAvatar.value,
  },
])
</script>

<template>
  <div :class="headerClasses">
    <div v-if="hasAvatar || $slots.avatar" class="ntp-card-header__avatar">
      <slot name="avatar">
        <img :src="avatar" alt="" />
      </slot>
    </div>

    <div class="ntp-card-header__text">
      <div class="ntp-card-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="subtitle || $slots.subtitle" class="ntp-card-header__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
    </div>

    <div v-if="$slots.default" class="ntp-card-header__action">
      <slot />
    </div>
  </div>
</template>

<style scoped src="./NtpCardHeader.css"></style>
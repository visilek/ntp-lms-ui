<script setup lang="ts">
import type { MediaItem, MediaFrame } from '@ntp-lms-ui/lib/types'

const defaultAspectRatio = '4 / 3'
const defaultFit: NonNullable<MediaFrame['fit']> = 'cover'

interface Props extends MediaFrame {
  media: MediaItem
}

const {
  media,
  aspectRatio = defaultAspectRatio,
  fit = defaultFit,
} = defineProps<Props>()
</script>

<template>
  <img
    class="ntp-media"
    :src="media.src"
    :alt="media.alt ?? ''"
    :style="{
      aspectRatio,
      objectFit: fit,
    }"
  />
</template>

<style scoped src="./NtpMedia.css"></style>
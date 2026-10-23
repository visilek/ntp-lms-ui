import type { MediaItem, AttachedFigureCompact } from '@ntp-lms-ui/lib/types'

export function figureToMediaItem(figure: AttachedFigureCompact): MediaItem {
  return {
    src: figure.thumbnail,
    alt: figure.title,
  }
}
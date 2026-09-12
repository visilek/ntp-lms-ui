export interface MediaItem {
  src: string
  alt?: string
}

export interface MediaFrame {
  aspectRatio?: string
  fit?: 'cover' | 'contain' | 'fill' | 'none'
}
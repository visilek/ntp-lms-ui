/** Figure renditions — full detail endpoint. */
export interface FigureRenditions {
  thumbnail: string
  display: string
  original: string
}

/** Figure album reference. */
export interface FigureAlbumRef {
  id: string
  title: string
  slug: string
}

/** Figure data — full figure entity from detail endpoint. */
export interface FigureData {
  id: string
  title: string
  description?: string
  figureAlbum?: FigureAlbumRef
  copyrightOwnerTitle?: string
  copyrightOwnerHref?: string
  renditions: FigureRenditions
  createdAt: string
  updatedAt: string
}

/** Figure attachment renditions — attachment contract. */
export interface FigureAttachmentRenditions {
  thumbnail: string
  display: string
}

/** Figure attachment — full-state replacement contract. */
export interface FigureAttachment {
  figureId: string
  title: string
  position: number
  isCover: boolean
  renditions: FigureAttachmentRenditions
  removable?: boolean
}
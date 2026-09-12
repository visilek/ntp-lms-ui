export interface FigureRenditions {
  thumbnail: string
  display: string
  original: string
}

export type AttachedFigureRenditions = Pick<FigureRenditions, 'thumbnail' | 'display'>

export interface FigureAlbumRef {
  id: string
  title: string
  slug: string
}

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

export interface AttachedFigureFull {
  figureId: string
  title: string
  position: number
  isCover: boolean
  renditions: AttachedFigureRenditions
  removable?: boolean
}

export interface AttachedFigureCompact {
  title: string
  thumbnail: string
}
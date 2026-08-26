export const MENU_PLACEMENTS = ['bottom-end', 'bottom-start', 'top-end', 'top-start'] as const
export type MenuPlacement = (typeof MENU_PLACEMENTS)[number]

export interface MenuItem {
  value: string | number
  label: string
  disabled?: boolean
  danger?: boolean
  leading?: string
}
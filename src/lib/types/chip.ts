export const CHIP_VARIANTS = ['filled', 'outlined'] as const
export type ChipVariant = (typeof CHIP_VARIANTS)[number]

export const CHIP_COLORS = ['primary', 'secondary', 'tertiary', 'error', 'neutral'] as const
export type ChipColor = (typeof CHIP_COLORS)[number]

export const CHIP_SIZES = ['small', 'medium'] as const
export type ChipSize = (typeof CHIP_SIZES)[number]
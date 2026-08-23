export const BUTTON_VARIANTS = ['filled', 'outlined', 'text'] as const
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number]

export const BUTTON_COLORS = ['primary', 'secondary', 'tertiary', 'error', 'on-surface-variant', 'surface'] as const
export type ButtonColor = (typeof BUTTON_COLORS)[number]

export const BUTTON_SIZES = ['small', 'medium', 'large'] as const
export type ButtonSize = (typeof BUTTON_SIZES)[number]
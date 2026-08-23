export const SPINNER_SIZES = ['small', 'medium', 'large'] as const
export type SpinnerSize = (typeof SPINNER_SIZES)[number]

export const SPINNER_COLORS = ['primary', 'on-surface-variant', 'surface'] as const
export type SpinnerColor = (typeof SPINNER_COLORS)[number]
export const INPUT_VARIANTS = ['filled', 'outlined'] as const
export type InputVariant = (typeof INPUT_VARIANTS)[number]
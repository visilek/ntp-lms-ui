import type { MaybeRef } from 'vue'

export const INPUT_VARIANTS = ['filled', 'outlined'] as const
export type InputVariant = (typeof INPUT_VARIANTS)[number]

export const INPUT_CONTEXT_COLORS = ['primary', 'secondary', 'surface'] as const
export type InputContextColor = (typeof INPUT_CONTEXT_COLORS)[number]

export const SELECTION_LABEL_POSITIONS = ['left', 'right'] as const
export type SelectionLabelPosition = (typeof SELECTION_LABEL_POSITIONS)[number]

export const SELECTION_GROUP_DIRECTIONS = ['vertical', 'horizontal'] as const
export type SelectionGroupDirection = (typeof SELECTION_GROUP_DIRECTIONS)[number]

export interface UseInputBaseOptions {
  id?: string
  label: string
  variant: InputVariant
  contextColor: InputContextColor
  disabled: boolean
  readonly: boolean
  errors: string[]
  hint: string
  required: boolean
  hasValue: MaybeRef<boolean>
}
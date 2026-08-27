import { computed, ref, unref, watch } from 'vue'
import type { MaybeRef } from 'vue'

export interface UseNumberInputOptions {
  modelValue: MaybeRef<number | null>
  min?: number
  max?: number
  step: number
}

export function useNumberInput(options: UseNumberInputOptions) {
  const inputRef = ref<HTMLInputElement | null>(null)

  const hasValue = computed(() => unref(options.modelValue) !== null)

  /** Derive decimal places from step. */
  function getDecimalPlaces(step: number): number {
    const stepString = String(step)
    if (stepString.includes('.')) {
      return stepString.split('.')[1].length
    }
    return 0
  }

  /** Round to step's decimal precision. */
  function roundToStep(value: number): number {
    const decimals = getDecimalPlaces(options.step)
    const factor = 10 ** decimals
    return Math.round(value * factor) / factor
  }

  /** Build internal validation errors from native validity. */
  function getInternalErrors(input: HTMLInputElement): string[] {
    const errors: string[] = []

    if (input.validity.badInput) {
      errors.push('Enter a valid number')
    }
    if (input.validity.rangeUnderflow) {
      errors.push(`Must be at least ${options.min}`)
    }
    if (input.validity.rangeOverflow) {
      errors.push(`Must be at most ${options.max}`)
    }
    if (input.validity.stepMismatch) {
      errors.push(`Must be a multiple of ${options.step}`)
    }

    return errors
  }

  /** Parse the input's current value. Returns null for NaN/empty. */
  function parseValue(input: HTMLInputElement): number | null {
    const value = input.valueAsNumber
    return Number.isNaN(value) ? null : value
  }

  /** Increment — clamps to max, rounded to step. */
  function increment(): number {
    const current = unref(options.modelValue) ?? 0
    const next = current + options.step

    if (options.max !== undefined && next > options.max) {
      return roundToStep(options.max)
    }

    return roundToStep(next)
  }

  /** Decrement — clamps to min, rounded to step. */
  function decrement(): number {
    const current = unref(options.modelValue) ?? 0
    const next = current - options.step

    if (options.min !== undefined && next < options.min) {
      return roundToStep(options.min)
    }

    return roundToStep(next)
  }

  function canIncrement(): boolean {
    if (options.max === undefined) return true
    return (unref(options.modelValue) ?? 0) < options.max
  }

  function canDecrement(): boolean {
    if (options.min === undefined) return true
    return (unref(options.modelValue) ?? 0) > options.min
  }

  watch(() => unref(options.modelValue), (val) => {
    console.log('modelValue changed:', val)
  })

  return {
    inputRef,
    hasValue,
    getInternalErrors,
    parseValue,
    increment,
    decrement,
    canIncrement,
    canDecrement,
  }
}
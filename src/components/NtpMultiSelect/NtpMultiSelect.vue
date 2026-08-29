<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import type {
  DropdownOption,
  DropdownOptionLoader,
  DropdownOptionMapper,
  InputVariant,
  InputContextColor,
  MenuItem,
  MasterCheckboxState,
} from '@ntp-lms-ui/lib'
import { useInputBase, DROPDOWN_PRELOAD_LIMIT, defaultOptionMapper, debounce } from '@ntp-lms-ui/lib'
import { NtpMenu, NtpCheckbox, NtpButton, NtpSpinner } from '@ntp-lms-ui/components'

const defaultVariant: InputVariant = 'filled'
const defaultContextColor: InputContextColor = 'surface'
const SEARCH_DEBOUNCE_DELAY = 300
const MASTER_CHECKBOX_VISIBILITY_THRESHOLD = 5

type ViewMode = 'available' | 'selected'

interface Props {
  modelValue?: Array<string | number>
  initialOptions?: DropdownOption[]
  label?: string
  variant?: InputVariant
  contextColor?: InputContextColor
  loadOptions: DropdownOptionLoader
  mapToOptions?: DropdownOptionMapper
  disabled?: boolean
  readonly?: boolean
  errors?: string[]
  hint?: string
  required?: boolean
}

const {
  modelValue = [],
  initialOptions = [],
  label = '',
  variant = defaultVariant,
  contextColor = defaultContextColor,
  loadOptions,
  mapToOptions = defaultOptionMapper,
  disabled = false,
  readonly = false,
  errors = [],
  hint = '',
  required = false,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number>]
  blur: []
  focus: []
  'load-error': [error: Error]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const allOptions = ref<DropdownOption[]>([])
const filteredOptions = ref<DropdownOption[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const isPreloadMode = ref(false)
const isLoading = ref(false)
const fieldRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const menuMinWidth = ref('')
const viewMode = ref<ViewMode>('available')
const selectedOptions = ref<DropdownOption[]>(initialOptions)
const lastSelectedOption = ref<DropdownOption | null>(null)

const hasValue = computed(() => modelValue.length > 0)

const displayedOptions = computed<MenuItem[]>(() => {
  if (viewMode.value === 'selected') {
    return selectedOptions.value.map((o) => ({ ...o, selected: true }))
  }

  return filteredOptions.value.map((o) => ({
    ...o,
    selected: isSelected(o.value),
  }))
})

const masterCheckboxState = computed<MasterCheckboxState>(() => {
  const visibleOptions = displayedOptions.value.filter((o) => !o.disabled)
  const visibleCount = visibleOptions.length
  const selectedVisibleCount = visibleOptions.filter((o) => o.selected).length

  if (selectedVisibleCount === 0) return 'unchecked'
  if (selectedVisibleCount === visibleCount && visibleCount > 0) return 'checked'
  return 'indeterminate'
})

const showMasterCheckbox = computed(() => {
  return viewMode.value === 'available'
    && totalCount.value > MASTER_CHECKBOX_VISIBILITY_THRESHOLD
})

const showMasterCheckboxWarning = computed(() => {
  return !isPreloadMode.value && hasMore.value && viewMode.value === 'available'
})

const hasMore = computed(() => filteredOptions.value.length < totalCount.value)

const showLoadMoreFooter = computed(() => {
  return viewMode.value === 'available' && (hasMore.value || isLoading.value)
})

function findOptionByValues(values: Array<string | number>, source: DropdownOption[]): DropdownOption | null {
  for (const value of values) {
    const found = source.find((o) => o.value === value)
    if (found) return found
  }
  return null
}

function getDisplayLabel(): string {
  if (modelValue.length === 0) return ''

  const reversedValues = [...modelValue].reverse()

  const reference = lastSelectedOption.value
    ?? findOptionByValues(reversedValues, selectedOptions.value)
    ?? findOptionByValues(reversedValues, allOptions.value)

  const referenceValue = reference?.value ?? modelValue[modelValue.length - 1]
  const referenceLabel = reference?.label ?? `#${referenceValue}`

  if (modelValue.length === 1) {
    return referenceLabel
  }
  else {
    const restCount = modelValue.length - 1
    return `${referenceLabel} (+${restCount})`
  }
}

const displayValue = computed(() => {
  if (isOpen.value) return searchQuery.value
  return getDisplayLabel()
})

const {
  inputId,
  isLabelFloating,
  wrapperClasses,
  supportText,
  hasError,
  onFocus,
  onBlur,
} = useInputBase({
  label,
  variant: variant || defaultVariant,
  contextColor: contextColor || defaultContextColor,
  disabled,
  readonly,
  errors,
  hint,
  required,
  hasValue,
})

watch(
  () => initialOptions,
  (newOptions) => {
    selectedOptions.value = newOptions
    const values = newOptions.map((o) => o.value)
    emit('update:modelValue', values)
  },
)

function computeMinWidth() {
  if (fieldRef.value) {
    menuMinWidth.value = `${fieldRef.value.getBoundingClientRect().width}px`
  }
}

function isSelected(value: string | number): boolean {
  return modelValue.includes(value)
}

function onMasterCheckboxToggle(isChecked: boolean) {
  const visibleValues = displayedOptions.value
    .filter((o) => !o.disabled)
    .map((o) => o.value)

  if (!isChecked) {
    emit('update:modelValue', modelValue.filter((v) => !visibleValues.includes(v)))
    selectedOptions.value = selectedOptions.value.filter(
      (o) => !visibleValues.includes(o.value),
    )
  } else {
    const merged = new Set([...modelValue, ...visibleValues])
    emit('update:modelValue', Array.from(merged))

    const newSelected = displayedOptions.value
      .filter((o) => !o.disabled && !o.selected)
      .map((o) => ({ value: o.value, label: o.label }))

    selectedOptions.value = selectedOptions.value.concat(newSelected)
  }
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'available' ? 'selected' : 'available'
}

function filterLocally(query: string) {
  if (query === '') {
    filteredOptions.value = allOptions.value
    return
  }

  const lowerQuery = query.toLowerCase()
  filteredOptions.value = allOptions.value.filter((option) =>
    option.label.toLowerCase().includes(lowerQuery),
  )
}

async function openMenu() {
  if (disabled || readonly) return

  computeMinWidth()
  isOpen.value = true
  emit('focus')
  onFocus()
  searchQuery.value = ''
  viewMode.value = 'available'

  isLoading.value = true
  try {
    const response = await loadOptions('', 1, DROPDOWN_PRELOAD_LIMIT)
    isPreloadMode.value = response.totalCount <= DROPDOWN_PRELOAD_LIMIT
    allOptions.value = response.items.map(mapToOptions)
    filteredOptions.value = allOptions.value
    totalCount.value = response.totalCount
    currentPage.value = 1
  } catch (error) {
    emit('load-error', error as Error)
  } finally {
    isLoading.value = false
  }

  await nextTick()
  inputRef.value?.focus()
}

function closeMenu() {
  isOpen.value = false
  searchQuery.value = ''
  onBlur()
  emit('blur')
}

function toggleMenu() {
  if (isOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

async function performSearch(query: string) {
  if (isPreloadMode.value) {
    filterLocally(query)
    return
  }

  isLoading.value = true
  try {
    const response = await loadOptions(query, 1, DROPDOWN_PRELOAD_LIMIT)
    filteredOptions.value = response.items.map(mapToOptions)
    totalCount.value = response.totalCount
    currentPage.value = 1
  } catch (error) {
    emit('load-error', error as Error)
  } finally {
    isLoading.value = false
  }
}

const onSearchInput = debounce((query: string) => {
  performSearch(query)
}, SEARCH_DEBOUNCE_DELAY)

async function loadMore() {
  const nextPage = currentPage.value + 1

  isLoading.value = true
  try {
    const response = await loadOptions(searchQuery.value, nextPage, DROPDOWN_PRELOAD_LIMIT)
    const newOptions = response.items.map(mapToOptions)

    filteredOptions.value = filteredOptions.value.concat(newOptions)
    totalCount.value = response.totalCount
    currentPage.value = nextPage
  } catch (error) {
    emit('load-error', error as Error)
  } finally {
    isLoading.value = false
  }
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  onSearchInput(searchQuery.value)
}

function onSelect(item: MenuItem) {
  toggleOption(item.value, item.label)
}

function toggleOption(value: string | number, label: string) {
  if (isSelected(value)) {
    emit('update:modelValue', modelValue.filter((v) => v !== value))
    selectedOptions.value = selectedOptions.value.filter((o) => o.value !== value)

    if (lastSelectedOption.value?.value === value) {
      lastSelectedOption.value = null
    }
  } else {
    emit('update:modelValue', [...modelValue, value])
    const option = { value, label }
    selectedOptions.value = selectedOptions.value.concat(option)
    lastSelectedOption.value = option
  }
}
</script>

<template>
  <div :class="wrapperClasses">
    <div ref="fieldRef" class="ntp-input__field ntp-select" @click="toggleMenu">
      <input ref="inputRef" :id="inputId" type="text" :value="displayValue" :disabled="disabled"
        :readonly="readonly || !isOpen" class="ntp-input__control" @focus="onFocus" @blur="onBlur" @input="onInput" />

      <label :for="inputId" class="ntp-input__label" :class="{ 'ntp-input__label--floating': isLabelFloating }">
        {{ label }}
      </label>

      <span class="ntp-input__trailing">
        <span class="ntp-select__arrow" aria-hidden="true">▾</span>
      </span>
    </div>

    <div v-if="supportText.length" class="ntp-input__support-text"
      :class="{ 'ntp-input__support-text--error': hasError }">
      <div v-for="(msg, i) in supportText" :key="i" class="ntp-input__error-line">
        {{ msg }}
      </div>
    </div>

    <NtpMenu :items="displayedOptions" :anchor="fieldRef" :open="isOpen" placement="bottom-start"
      :min-width="menuMinWidth" @select="onSelect" @close="closeMenu">
      <template #header>
        <div class="ntp-multiselect__header">
          <label v-if="showMasterCheckbox" class="ntp-multiselect__master-checkbox">
            <NtpCheckbox :model-value="masterCheckboxState === 'checked'"
              :indeterminate="masterCheckboxState === 'indeterminate'" label="All" @change="onMasterCheckboxToggle" />
          </label>

          <span v-if="showMasterCheckboxWarning" class="ntp-multiselect__warning"
            title="Selects only what's currently loaded. Load more to expand."
            aria-label="Selects only what's currently loaded. Load more to expand.">
            ⚠
          </span>

          <NtpButton variant="text" size="small" class="ntp-multiselect__mode-button" @click="toggleViewMode">
            {{ viewMode === 'available' ? 'Show selected' : 'Show available' }}
          </NtpButton>
        </div>
      </template>

      <template v-if="!isLoading && displayedOptions.length === 0" #default>
        <div class="ntp-select__empty">Empty</div>
      </template>

      <template v-if="showLoadMoreFooter" #footer>
        <div class="ntp-select__footer-content">
          <NtpButton v-if="!isLoading" variant="text" size="small" @click="loadMore">
            Load more
          </NtpButton>
          <NtpSpinner v-else size="small" />
        </div>
      </template>
    </NtpMenu>
  </div>
</template>

<style scoped src="./NtpMultiSelect.css"></style>
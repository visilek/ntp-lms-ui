<script setup lang="ts">
// Load functions intentionally follow the same pattern.
// TODO(v2): Re-evaluate extraction once core app usage patterns are known.
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { useInputBase, DROPDOWN_PRELOAD_LIMIT, debounce, mergeDropdownOptions, defaultOptionMapper } from '@ntp-lms-ui/lib'
import type {
  DropdownOption,
  DropdownValue,
  DropdownOptionLoader,
  DropdownOptionMapper,
  InputVariant,
  InputContextColor,
  MenuItem,
  MasterCheckboxState,
} from '@ntp-lms-ui/lib/types'
import { NtpMenu, NtpButton, NtpSpinner, NtpCheckbox, NtpTooltip } from '@ntp-lms-ui/components'

const defaultVariant: InputVariant = 'filled'
const defaultContextColor: InputContextColor = 'surface'
const SEARCH_DEBOUNCE_DELAY = 300
const MASTER_CHECKBOX_VISIBILITY_THRESHOLD = 5
const LABEL_RESOLUTION_PAGE_SIZE = 100

type ViewMode = 'available' | 'selected'

interface Props {
  modelValue?: DropdownValue[]
  label?: string
  variant?: InputVariant
  contextColor?: InputContextColor
  loadOptions?: DropdownOptionLoader
  preloadedOptions?: DropdownOption[]
  mapToOptions?: DropdownOptionMapper
  disabled?: boolean
  readonly?: boolean
  errors?: string[]
  hint?: string
  required?: boolean
}

const {
  modelValue = [],
  label = '',
  variant = defaultVariant,
  contextColor = defaultContextColor,
  loadOptions,
  preloadedOptions = [],
  mapToOptions = defaultOptionMapper,
  disabled = false,
  readonly = false,
  errors = [],
  hint = '',
  required = false,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: DropdownValue[]]
  blur: []
  focus: []
  'load-error': [error: Error]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const loadedOptions = ref<DropdownOption[]>([])
const filteredOptions = ref<DropdownOption[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const isPreloadMode = ref(false)
const isLoading = ref(false)
const fieldRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const menuMinWidth = ref('')
const viewMode = ref<ViewMode>('available')
const selectedOptions = ref<DropdownOption[]>([])
const lastSelectedOption = ref<DropdownOption | null>(null)


function resolveOption(
  value: DropdownValue,
  availableOptions: DropdownOption[],
): DropdownOption | undefined {
  return availableOptions.find((o) => o.value === value)
}

function getUnresolvedValues(
  values: DropdownValue[],
  availableOptions: DropdownOption[],
): DropdownValue[] {
  return values.filter((v) => !availableOptions.some((o) => o.value === v))
}

const hasValue = computed(() => modelValue.length > 0)

const displayedOptions = computed<MenuItem[]>(() => {
  const optionsToDisplay = viewMode.value === 'selected' ? selectedOptions.value : filteredOptions.value

  return optionsToDisplay.map((o) => ({
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
  return viewMode.value === 'available' && !isPreloadMode.value && hasMore.value
})

const hasMore = computed(() => filteredOptions.value.length < totalCount.value)

const showLoadMoreFooter = computed(() => {
  return viewMode.value === 'available' && (hasMore.value || isLoading.value)
})

function getDisplayLabel(): string {
  if (modelValue.length === 0) return ''

  let reference: DropdownOption | null = lastSelectedOption.value

  if (!reference) {
    const reversedValues = [...modelValue].reverse()
    for (const value of reversedValues) {
      const fromSelected = resolveOption(value, selectedOptions.value)
      if (fromSelected) {
        reference = fromSelected
        break
      }

      const fromLoaded = resolveOption(value, loadedOptions.value)
      if (fromLoaded) {
        reference = fromLoaded
        break
      }
    }
  }

  const referenceValue = reference?.value ?? modelValue[modelValue.length - 1]
  const referenceLabel = reference?.label ?? `#${referenceValue}`

  if (modelValue.length === 1) {
    return referenceLabel
  } else {
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

function addToSelectedOptions(value: DropdownValue) {
  if (selectedOptions.value.some((o) => o.value === value)) return

  const fromLoaded = resolveOption(value, loadedOptions.value)
  if (fromLoaded) {
    selectedOptions.value = selectedOptions.value.concat(fromLoaded)
  }
}

async function ensureOptionsLoaded(values: DropdownValue[]) {
  const missing = getUnresolvedValues(values, loadedOptions.value)

  if (missing.length === 0) return

  if (preloadedOptions.some((o) => missing.includes(o.value))) {
    loadedOptions.value = mergeDropdownOptions(loadedOptions.value, preloadedOptions)
  }

  const stillMissing = getUnresolvedValues(values, loadedOptions.value)

  if (stillMissing.length === 0) return

  if (loadOptions) {
    isLoading.value = true
    try {
      const response = await loadOptions('', 1, LABEL_RESOLUTION_PAGE_SIZE)
      loadedOptions.value = mergeDropdownOptions(loadedOptions.value, response.items.map(mapToOptions))
      totalCount.value = response.totalCount
    } catch (error) {
      emit('load-error', error as Error)
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(async () => {
  await ensureOptionsLoaded(modelValue)

  if (modelValue.length > 0) {
    modelValue.forEach(addToSelectedOptions)
  }
})

watch(
  () => modelValue,
  async (newValue) => {
    await ensureOptionsLoaded(newValue)

    const newValues = getUnresolvedValues(newValue, selectedOptions.value)
    newValues.forEach(addToSelectedOptions)
  },
)

function computeMinWidth() {
  if (fieldRef.value) {
    menuMinWidth.value = `${fieldRef.value.getBoundingClientRect().width}px`
  }
}

function isSelected(value: DropdownValue): boolean {
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

    selectedOptions.value = mergeDropdownOptions(selectedOptions.value, newSelected)
  }
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'available' ? 'selected' : 'available'
}

function filterLocally(query: string) {
  if (query === '') {
    filteredOptions.value = loadedOptions.value
    return
  }

  const lowerQuery = query.toLowerCase()
  filteredOptions.value = loadedOptions.value.filter((option) =>
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

  if (!loadOptions) {
    loadedOptions.value = mergeDropdownOptions(loadedOptions.value, preloadedOptions)
    filteredOptions.value = loadedOptions.value
    totalCount.value = loadedOptions.value.length
    isPreloadMode.value = true
  } else {
    isLoading.value = true
    try {
      const response = await loadOptions('', 1, DROPDOWN_PRELOAD_LIMIT)
      isPreloadMode.value = response.totalCount <= DROPDOWN_PRELOAD_LIMIT
      loadedOptions.value = mergeDropdownOptions(loadedOptions.value, response.items.map(mapToOptions))
      filteredOptions.value = loadedOptions.value
      totalCount.value = response.totalCount
      currentPage.value = 1
    } catch (error) {
      emit('load-error', error as Error)
    } finally {
      isLoading.value = false
    }
  }
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
  if (!loadOptions || isPreloadMode.value) {
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
  if (!loadOptions) return

  const nextPage = currentPage.value + 1

  isLoading.value = true
  try {
    const response = await loadOptions(searchQuery.value, nextPage, DROPDOWN_PRELOAD_LIMIT)
    const newOptions = response.items.map(mapToOptions)
    filteredOptions.value = mergeDropdownOptions(filteredOptions.value, newOptions)
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

  if (!loadOptions || isPreloadMode.value) {
    filterLocally(searchQuery.value)
    return
  }
  
  onSearchInput(searchQuery.value)
}

async function onInputClick(event: MouseEvent) {
  if (isOpen.value) {
    event.stopPropagation()
    return
  }

  const target = event.target as HTMLInputElement
  await nextTick()
  target.focus()
}

function onSelect(item: MenuItem) {
  toggleOption(item.value, item.label)
  nextTick(() => {
    if (isOpen.value) {
      inputRef.value?.focus()
    }
  })
}

function toggleOption(value: DropdownValue, label: string) {
  if (isSelected(value)) {
    emit('update:modelValue', modelValue.filter((v) => v !== value))
    selectedOptions.value = selectedOptions.value.filter((o) => o.value !== value)

    if (lastSelectedOption.value?.value === value) {
      lastSelectedOption.value = null
    }
  } else {
    emit('update:modelValue', [...modelValue, value])
    const option = { value, label }
    selectedOptions.value = mergeDropdownOptions(selectedOptions.value, [option])
    lastSelectedOption.value = option
  }
}
</script>

<template>
  <div :class="wrapperClasses">
    <div ref="fieldRef" class="ntp-input__field ntp-select" @click="toggleMenu">
      <input ref="inputRef" :id="inputId" type="text" :value="displayValue" :disabled="disabled"
        :readonly="readonly || !isOpen" class="ntp-input__control" @click="onInputClick" @focus="onFocus" @blur="onBlur" @input="onInput" />

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
          <NtpCheckbox v-if="showMasterCheckbox" :model-value="masterCheckboxState === 'checked'"
            :indeterminate="masterCheckboxState === 'indeterminate'" label="All" @change="onMasterCheckboxToggle" />

          <NtpTooltip v-if="showMasterCheckboxWarning"
            text="Selects only what's currently loaded. Load more to expand.">
            <span class="ntp-multiselect__warning"
              aria-label="Selects only what's currently loaded. Load more to expand.">
              ⚠
            </span>
          </NtpTooltip>

          <div class="ntp-multiselect__header-actions">
            <NtpButton variant="text" size="small" @click="toggleViewMode">
              {{ viewMode === 'available' ? 'Show selected' : 'Show available' }}
            </NtpButton>
          </div>
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
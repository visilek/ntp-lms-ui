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
} from '@ntp-lms-ui/lib/types'
import { NtpMenu, NtpButton, NtpSpinner } from '@ntp-lms-ui/components'

const defaultVariant: InputVariant = 'filled'
const defaultContextColor: InputContextColor = 'surface'
const SEARCH_DEBOUNCE_DELAY = 300
const LABEL_RESOLUTION_PAGE_SIZE = 100

interface Props {
  modelValue?: DropdownValue | null
  label?: string
  variant?: InputVariant
  contextColor?: InputContextColor
  loadOptions?: DropdownOptionLoader
  preloadedOptions?: DropdownOption[]
  mapToOptions?: DropdownOptionMapper
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  errors?: string[]
  hint?: string
  required?: boolean
}

const {
  modelValue = null,
  label = '',
  variant = defaultVariant,
  contextColor = defaultContextColor,
  loadOptions,
  preloadedOptions = [],
  mapToOptions = defaultOptionMapper,
  clearable = true,
  disabled = false,
  readonly = false,
  errors = [],
  hint = '',
  required = false,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: DropdownValue | null]
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
const menuMinWidth = ref('')

const hasValue = computed(() => modelValue !== null && modelValue !== '')

const selectedLabel = computed(() => {
  if (!hasValue.value) return ''

  const resolved = loadedOptions.value.find((o) => o.value === modelValue)
  return resolved?.label ?? `#${modelValue}`
})

const displayValue = computed(() => {
  if (isOpen.value) return searchQuery.value
  return selectedLabel.value
})

const hasMore = computed(() => filteredOptions.value.length < totalCount.value)

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
  hasValue: computed(() => displayValue.value !== ''),
})

async function ensureOptionsLoaded(value: DropdownValue) {

  if (loadedOptions.value.some((o) => o.value === value)) return

  if (preloadedOptions.some((o) => o.value === value)) {
    loadedOptions.value = mergeDropdownOptions(loadedOptions.value, preloadedOptions)
    return
  }

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
  if (modelValue !== null && modelValue !== '') {
    await ensureOptionsLoaded(modelValue)
  }
})

watch(
  () => modelValue,
  async (newValue) => {
    if (newValue === null || newValue === '') return
    await ensureOptionsLoaded(newValue)
  },
)

function computeMinWidth() {
  if (fieldRef.value) {
    menuMinWidth.value = `${fieldRef.value.getBoundingClientRect().width}px`
  }
}

function filterLocally(query: string) {
  if (query === '') {
    filteredOptions.value = [...loadedOptions.value]
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

  if (!loadOptions) {
    loadedOptions.value = mergeDropdownOptions(loadedOptions.value, preloadedOptions)
    filteredOptions.value = loadedOptions.value
    totalCount.value = loadedOptions.value.length
    isPreloadMode.value = true
  }
  else {
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

async function onInputClick(event: MouseEvent) {
  if (isOpen.value) {
    event.stopPropagation()
    return
  }

  const target = event.target as HTMLInputElement
  await nextTick()
  target.focus()
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

function onSelect(item: MenuItem) {
  emit('update:modelValue', item.value)
  closeMenu()
}

function onClear() {
  emit('update:modelValue', null)
}
</script>

<template>
  <div :class="wrapperClasses">
    <div ref="fieldRef" class="ntp-input__field ntp-select" @click="toggleMenu">
      <input :id="inputId" type="text" :value="displayValue" :disabled="disabled" :readonly="readonly || !isOpen"
        class="ntp-input__control" @click="onInputClick" @focus="onFocus" @blur="onBlur" @input="onInput" />

      <label :for="inputId" class="ntp-input__label" :class="{ 'ntp-input__label--floating': isLabelFloating }">
        {{ label }}
      </label>

      <span class="ntp-input__trailing">
        <button v-if="clearable && hasValue && !isOpen" type="button" class="ntp-select__clear"
          aria-label="Clear selection" @click.stop="onClear">
          ×
        </button>
        <span class="ntp-select__arrow" aria-hidden="true">▾</span>
      </span>
    </div>

    <div v-if="supportText.length" class="ntp-input__support-text"
      :class="{ 'ntp-input__support-text--error': hasError }">
      <div v-for="(msg, i) in supportText" :key="i" class="ntp-input__error-line">
        {{ msg }}
      </div>
    </div>

    <NtpMenu :items="filteredOptions" :anchor="fieldRef" :open="isOpen" placement="bottom-start"
      :min-width="menuMinWidth" @select="onSelect" @close="closeMenu">
      <template v-if="!isLoading && filteredOptions.length === 0" #default>
        <div class="ntp-select__empty">Empty</div>
      </template>

      <template v-if="hasMore || isLoading" #footer>
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

<style scoped src="./NtpSelect.css"></style>
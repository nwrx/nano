<script setup lang="ts">
import type { SocketListOption } from '@nwrx/core'
import type { BaseInputListProps } from '@unshared/vue'

const props = defineProps<{
  name?: string
  badge?: boolean
  modelValue: unknown
  defaultValue?: unknown
} & BaseInputListProps<SocketListOption<unknown>, unknown, false>>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// --- Localize
const { t } = useI18n()

// --- State
const isOpen = ref(false)
const search = ref<string>('')
const input = ref<HTMLInputElement>()

// --- Two-way binding for the model value.
const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})

// --- Search the options based on the search query.
const filteredOptions = computed(() => {
  if (!props.options) return []
  if (!search.value) return Object.values(props.options)
  const searchLower = search.value.toLowerCase()
  const result: Array<SocketListOption<unknown>> = []
  for (const option of Object.values(props.options)) {
    if (option.label.toLowerCase().includes(searchLower)) result.push(option)
    else if (option.description?.toLowerCase().includes(searchLower)) result.push(option)
    else if (typeof option.value !== 'string') continue
    else if (option.value.toLowerCase().includes(searchLower)) result.push(option)
  }
  return result
})

// --- Resolve the label of the current value if it is set.
const currentValue = computed(() => {
  if (!model.value) return
  if (!props.options) return
  return Object.values(props.options).find(option => option.value === model.value)
})

// --- Resolve the label of the default value if it exists.
const defaultValue = computed(() => {
  if (!props.defaultValue) return
  if (!props.options) return
  return Object.values(props.options)
    .find(option => option.value === props.defaultValue)
    ?.label
})

// --- Track the list position so we can auto-scale the height based on the viewport.
const list = ref<HTMLDivElement>()
const listBounding = useElementBounding(list)
watch(listBounding, () => {
  if (!list.value) return
  list.value.style.maxHeight = `${window.innerHeight - listBounding.top.value - 16}px`
})

function focus() {
  if (input.value) input.value.focus()
}

function setOption(option: SocketListOption<unknown>) {
  model.value = option.value
  if (input.value) input.value.blur()
}
</script>

<template>
  <FlowEditorSocketGroup class="relative cursor-pointer" @mousedown.prevent="() => focus()">

    <!-- Label -->
    <FlowEditorSocketLabel :label="name" />

    <!-- Current value label -->
    <p
      class="truncate shrink-0"
      :class="{ 'text-subtle': !model, 'italic font-light': !model && !defaultValue }"
      v-text="currentValue?.label ?? model ?? defaultValue ?? t('empty')"
    />

    <!-- Search -->
    <input
      ref="input"
      v-model="search"
      :class="{ 'op-0': !isOpen }"
      class="px-sm rd bg-transparent outline-none text-subtle transition w-full"
      @focus="() => isOpen = true"
      @blur="() => isOpen = false"
      @mousedown.stop
    />

    <!-- List -->
    <Transition>
      <div
        v-if="isOpen && options"
        ref="list"
        class="
            absolute left-0 w-full top-full
            bg-editor-panel backdrop-blur-2xl
            p-sm rounded space-y-xs rd
            b b-editor z-10
            overflow-y-auto max-h-100
          "
        @wheel.stop>

        <template v-if="filteredOptions.length === 0">
          <p class="text-xs text-subtle">
            {{ t('list.empty') }}
          </p>
        </template>

        <template v-else>
          <FlowEditorSocketSelectItem
            v-for="(option, index) in filteredOptions"
            :key="index"
            :icon="option.icon"
            :label="option.label"
            :description="option.description"
            :isSelected="option.value === model"
            @mousedown.stop="() => setOption(option)"
          />
        </template>
      </div>
    </Transition>
  </FlowEditorSocketGroup>
</template>

<i18n lang="yaml">
  en:
    empty: No default value
    list.empty: Select list is empty or search query does not match any results.
  fr:
    empty: Aucune valeur par défaut
    list.empty: La liste de sélection est vide ou la requête de recherche ne correspond à aucun résultat.
  de:
    empty: Kein Standardwert
    list.empty: Die Liste ist leer oder die Suchanfrage ergibt keine Treffer.
  es:
    empty: Sin valor predeterminado
    list.empty: La lista está vacía o la consulta de búsqueda no coincide con ningún resultado.
  zh:
    empty: 无默认值
    list.empty: 列表为空或搜索查询不匹配任何结果。
</i18n>

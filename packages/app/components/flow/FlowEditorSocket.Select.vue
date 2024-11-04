<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { SocketListOption } from '@nwrx/core'

const props = defineProps<{
  name?: string
  badge?: boolean
  search?: string
  modelValue: unknown
  defaultValue?: unknown
  options?: SocketListOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [query: string]
}>()

// --- Localize
const { t } = useI18n()

// --- State
const isOpen = ref(false)
const input = ref<HTMLInputElement>()

// --- Two-way binding for the model value.
const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})

// --- Two-way binding for the search query.
const search = useVModel(props, 'search', emit, {
  passive: true,
  eventName: 'search',
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
      @mousedown.stop>

    <!-- List -->
    <Transition>
      <div
        v-if="isOpen && options"
        ref="list"
        class="
            absolute left-0 w-full top-full
            bg-editor-panel backdrop-blur-2xl
            p-sm rounded space-y-xs rd
            b b-editor z-10 mt-sm
            overflow-y-auto max-h-100
          "
        @wheel.stop>

        <template v-if="options.length === 0">
          <p class="text-xs text-subtle">
            {{ t('list.empty') }}
          </p>
        </template>

        <template v-else>
          <FlowEditorSocketSelectItem
            v-for="(option, index) in options"
            :key="index"
            :icon="option.icon"
            :label="option.label"
            :description="option.description"
            :is-selected="option.value === model"
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
  list.empty: No items available, check your search query or node data.
fr:
  empty: Aucune valeur par défaut
  list.empty: Aucun élément disponible, vérifiez votre requête de recherche ou les données du nœud.
de:
  empty: Kein Standardwert
  list.empty: Keine Elemente verfügbar, überprüfen Sie Ihre Suchanfrage oder Knotendaten.
es:
  empty: Sin valor predeterminado
  list.empty: No hay elementos disponibles, verifique su consulta de búsqueda o los datos del nodo.
zh:
  empty: 无默认值
  list.empty: 没有可用的项目，请检查您的搜索查询或节点数据。
</i18n>

<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
import type { SchemaOption } from '@nwrx/nano/utils'

const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
}>()

const { t } = useI18n()
const isOpen = ref(false)
const search = ref('')
const searchOptions = ref<SchemaOption[]>([])
const input = ref<HTMLInputElement>()
const schema = computed(() => props.node.inputs[props.name])
const model = computed({
  get: () => props.node.input[props.name],
  set: (value: any) => props.editor.model.setNodesInputValue({
    id: props.node.id,
    name: props.name,
    value,
  }),
})

const options = computed(() => {
  if (searchOptions.value.length > 0) return searchOptions.value
  return props.options
})

// --- Resolve the label of the current value if it is set.
const currentValue = computed(() => {
  if (!model.value) return
  if (!props.options) return
  return Object
    .values(props.options)
    .find(option => JSON.stringify(option.value) === JSON.stringify(model.value))
})

function isOptionSelected(option: SchemaOption<unknown>) {
  return JSON.stringify(option.value) === JSON.stringify(model.value)
}

// --- Resolve the label of the default value if it exists.
const defaultValue = computed(() => {
  if (!props.defaultValue) return
  if (!props.options) return
  return props.defaultValue
})

// --- Resolve the list of options based on the search query.
const isLoading = ref(false)
const isLoadingDelayed = refDebounced(isLoading, 100)
async function startSearch() {
  if (!props.getOptions) return
  isLoading.value = true
  try { searchOptions.value = await props.getOptions(search.value) }
  catch { searchOptions.value = [] }
  isLoading.value = false
}

// --- Get the options from the server if the `getOptions` function is provided.
watchDebounced(search, startSearch, { debounce: 200 })

function focus() {
  if (input.value) input.value.focus()
  void startSearch()
}

function setOption(option: SchemaOption<unknown>) {
  model.value = option.value
  if (input.value) input.value.blur()
}
</script>

<template>
  <EditorNodeInputGroup
    class="flex items-center relative cursor-pointer"
    :class="{ '!b-editor-active': isOpen }"
    @mousedown.prevent="() => focus()">

    <!-- Label -->
    <EditorNodeInputLabel :label="name" />

    <!-- Current value label -->
    <p
      v-if="!isOpen || model"
      class="break-all line-clamp-1"
      :class="{
        'text-subtle': !model,
        'italic font-light': !model && !defaultValue,
      }"
      v-text="currentValue?.label ?? model ?? defaultValue ?? t('none')"
    />

    <!-- Search -->
    <input
      ref="input"
      v-model="search"
      :class="{ 'w-0 op-0': !isOpen }"
      class="px-sm rd bg-transparent outline-none text-subtle transition max-w-24"
      @focus="() => isOpen = true"
      @blur="() => isOpen = false"
      @mousedown.stop>

    <!-- Loading -->
    <div :class="{ '!op-100': isLoadingDelayed }" class="ml-auto px-sm transition op-0">
      <BaseIcon icon="i-line-md:loading-loop" class="size-4" />
    </div>

    <!-- List -->
    <Transition>
      <div
        v-if="isOpen"
        ref="list"
        class="
          absolute left-0 w-full top-full
          bg-editor-panel backdrop-blur-2xl
          p-sm rounded space-y-xs rd
          b b-editor z-10 mt-sm
          overflow-y-auto overflow-x-hidden
          max-h-100
        "
        @wheel.stop>

        <!-- When no options are available, show a message. -->
        <p v-if="!options || options.length === 0" class="text-xs text-subtle">
          {{ isLoadingDelayed ? t('loading') : t('empty') }}
        </p>

        <!-- Otherwise, show the list of options. -->
        <template v-else>
          <EditorNodeInputSelectItem
            v-for="(option, index) in options"
            :key="index"
            :icon="option.icon"
            :label="option.label"
            :description="option.description"
            :is-selected="isOptionSelected(option)"
            @mousedown.stop="() => setOption(option)"
          />
        </template>
      </div>
    </Transition>
  </EditorNodeInputGroup>
</template>

<i18n lang="yaml">
en:
  none: No default value
  empty: No items available, check your search query or node data.
  loading: Loading options from the server...
fr:
  none: Aucune valeur par défaut
  empty: Aucun élément disponible, vérifiez votre requête de recherche ou les données du nœud.
  loading: Chargement des options depuis le serveur...
de:
  none: Kein Standardwert
  empty: Keine Elemente verfügbar, überprüfen Sie Ihre Suchanfrage oder Knotendaten.
  loading: Optionen vom Server laden...
es:
  none: Sin valor predeterminado
  empty: No hay elementos disponibles, verifique su consulta de búsqueda o los datos del nodo.
  loading: Cargando opciones desde el servidor...
zh:
  none: 无默认值
  empty: 没有可用的项目，请检查您的搜索查询或节点数据。
  loading: 从服务器加载选项...
</i18n>

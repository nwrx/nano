<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { SocketListOption } from '@nwrx/core'

const props = defineProps<{
  name?: string
  modelValue: unknown
  defaultValue?: unknown
  options?: SocketListOption[]
  getOptions?: (query: string) => Promise<SocketListOption[]>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const isOpen = ref(false)
const search = ref('')
const searchOptions = ref<SocketListOption[]>([])
const isLoading = ref(false)
const input = ref<HTMLInputElement>()
const model = useVModel(props, 'modelValue', emit, { passive: true })

const options = computed(() => {
  if (search.value.length > 0) return searchOptions.value
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

// --- Resolve the label of the default value if it exists.
const defaultValue = computed(() => {
  if (!props.defaultValue) return
  if (!props.options) return
  return props.defaultValue
})

// --- Resolve the list of options based on the search query.
async function startSearch() {
  if (!props.getOptions) return
  isLoading.value = true
  await props.getOptions(search.value)
    .then(options => searchOptions.value = options)
    .finally(() => isLoading.value = false)
}

// --- Get the options from the server if the `getOptions` function is provided.
watch(search, startSearch)

// --- Track the list position so we can auto-scale the height based on the viewport.
const list = ref<HTMLDivElement>()
const listBounding = useElementBounding(list)
watch(listBounding, () => {
  if (!list.value) return
  list.value.style.maxHeight = `${window.innerHeight - listBounding.top.value - 16}px`
})

function focus() {
  if (input.value) input.value.focus()
  void startSearch()
}

function setOption(option: SocketListOption<unknown>) {
  model.value = option.value
  if (input.value) input.value.blur()
}
</script>

<template>
  <EditorNodeSocketGroup class="relative cursor-pointer" @mousedown.prevent="() => focus()">

    <!-- Label -->
    <EditorNodeSocketLabel :label="name" />

    <!-- Current value label -->
    <p
      class="truncate shrink-0"
      :class="{ 'text-subtle': !model, 'italic font-light': !model && !defaultValue }"
      v-text="currentValue?.label ?? model ?? defaultValue ?? t('none')"
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
        v-if="isOpen"
        ref="list"
        class="
            absolute left-0 w-full top-full
            bg-editor-panel backdrop-blur-2xl
            p-sm rounded space-y-xs rd
            b b-editor z-10 mt-sm
            overflow-y-auto max-h-100
          "
        @wheel.stop>

        <!-- When no options are available, show a message. -->
        <p v-if="!options || options.length === 0" class="text-xs text-subtle">
          {{ isLoading ? t('loading') : t('empty') }}
        </p>

        <!-- Otherwise, show the list of options. -->
        <template v-else>
          <EditorNodeSocketSelectItem
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

    <!-- Loading -->
    <BaseIcon
      :class="{ '!op-100': isLoading }"
      class="size-8"
      icon="i-line-md:loading-loop mx-sm transition op-0"
    />
  </EditorNodeSocketGroup>
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

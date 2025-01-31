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
const input = ref<HTMLInputElement>()
const model = useVModel(props, 'modelValue', emit, { passive: true })

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

// --- Get the options from the server if the `getOptions` function is provided.
watch(search, async() => {
  if (!props.getOptions) return
  searchOptions.value = await props.getOptions(search.value)
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
  <EditorNodeSocketGroup class="relative cursor-pointer" @mousedown.prevent="() => focus()">

    <!-- Label -->
    <EditorNodeSocketLabel :label="name" />

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
        <template v-if="!options || options.length === 0">
          <p class="text-xs text-subtle">
            {{ t('list.empty') }}
          </p>
        </template>

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
  </EditorNodeSocketGroup>
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

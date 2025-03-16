<script setup lang="ts">
import type { EditorNodeObject, VaultVariableObject } from '@nwrx/nano-api'
const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
}>()

const { t } = useI18n()
const input = ref<HTMLInputElement>()
const schema = computed(() => props.node.inputs[props.name])
const isFocused = ref(false)
const isLoading = ref(false)

const model = computed({
  get: () => props.node.input[props.name],
  set: (value: any) => props.editor.model.setNodesInputValue({
    id: props.node.id,
    name: props.name,
    value,
  }),
})

const search = ref('')
const variables = ref<VaultVariableObject[]>([])
function searchVariables() {
  isLoading.value = true
  props.editor.model.searchVariables({
    search: search.value,
  })
  const stop = props.editor.channel.on('message', (message) => {
    setTimeout(() => stop(), 100)
    if (message.event === 'searchVariablesResult') {
      variables.value = message.data
      isLoading.value = false
      stop()
    }
  })
}
watch(search, searchVariables)

const placeholder = computed(() => {
  if (model.value) return ''
  const defaultValue = schema.value.default
  return typeof defaultValue === 'string' ? defaultValue : t('empty')
})

function onFocus() {
  isFocused.value = true
  searchVariables()
}

function onBlur() {
  isFocused.value = false
  search.value = ''
}

function setOption(variable: VaultVariableObject) {
  model.value = { $ref: `#/Variables/${variable.vault!.name}/${variable.name}` }
  search.value = ''
  isFocused.value = false
}

function isOptionSelected(variable: VaultVariableObject) {
  return model.value === variable.name
}
</script>

<template>
  <EditorNodeInputGroup
    class="flex items-center cursor-text relative"
    :class="{ '!ring-editor-active': isFocused }"
    @mousedown.prevent="() => input!.focus()">

    <!-- Label -->
    <EditorNodeInputLabel
      :editor="editor"
      :node="node"
      :name="name"
    />

    <!-- Current -->
    <EditorReferenceBadge
      v-if="!isFocused && model"
      :value="model"
      class="mr-sm"
    />

    <!-- Field -->
    <input
      ref="input"
      v-model="search"
      :class="{ '!w-0': !isFocused }"
      class="grow outline-none bg-transparent text-sm font-mono placeholder:text-subtle"
      :placeholder="placeholder"
      @focus="() => onFocus()"
      @blur="() => onBlur()">

    <!-- Clear -->
    <BaseIcon
      icon="i-carbon:close"
      class="op-0 group-hover:op-100 size-4 text-app cursor-pointer shrink-0"
      @mousedown.stop
      @click.stop="() => { model = ''; search = ''; }"
    />

    <!-- List -->
    <EditorMenu :show="isFocused" :is-loading="isLoading" :is-empty="variables.length === 0">
      <EditorMenuItem
        v-for="(variable, index) in variables"
        :key="index"
        icon="i-carbon:locked"
        :label="`${variable.vault!.name}/${variable.name}`"
        :is-selected="isOptionSelected(variable)"
        @mousedown.stop="() => setOption(variable)"
      />
    </EditorMenu>
  </EditorNodeInputGroup>
</template>

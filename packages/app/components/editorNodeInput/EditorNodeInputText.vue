<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
}>()

const { t } = useI18n()
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

const placeholder = computed(() => {
  const defaultValue = schema.value.default
  return typeof defaultValue === 'string' ? defaultValue : t('empty')
})
</script>

<template>
  <EditorNodeInputGroup
    class="flex items-center cursor-text"
    @click="() => input?.focus()">

    <!-- Label -->
    <EditorNodeInputLabel :label="schema.title ?? name" />

    <!-- Field -->
    <input
      ref="input"
      v-model="model"
      :class="{ 'font-light text-sm italic': !model }"
      class="w-full outline-none bg-transparent text-sm"
      :placeholder="placeholder">
  </EditorNodeInputGroup>
</template>

<i18n lang="yaml">
en:
  empty: No default value
fr:
  empty: Aucune valeur
de:
  empty: Kein Standardwert
es:
  empty: Sin valor predeterminado
zh:
  empty: 无默认值
</i18n>

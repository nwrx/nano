<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'

const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
}>()

const isDialogOpen = ref(false)
const schema = computed(() => props.node.inputs[props.name])
const model = computed({
  get: () => props.node.input[props.name],
  set: (value: any) => props.editor.model.setNodesInputValue({
    id: props.node.id,
    name: props.name,
    value,
  }),
})
</script>

<template>
  <EditorNodeInputGroup
    class="flex items-center cursor-text"
    @mousedown.stop="() => isDialogOpen = true">

    <!-- Label -->
    <EditorNodeInputLabel
      :editor="editor"
      :node="node"
      :name="name"
    />

    <span class="text-sm">
      {{ model ?? schema.default }}
    </span>
  </EditorNodeInputGroup>

  <!-- Dialog -->
  <EditorNodeInputTextareaDialog
    v-model="model"
    v-model:is-open="isDialogOpen"
    :name="schema.title ?? name"
    :description="schema.description"
  />
</template>

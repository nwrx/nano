<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
import type { Schema } from '@nwrx/nano/utils'
const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
}>()

const visibleInputs = computed(() => {
  const inputs: Record<string, Schema> = {}
  const node = props.node
  if (!node) return inputs
  if (!node.inputs) return inputs
  for (const [name, schema] of Object.entries(props.node.inputs))
    if (!schema['x-internal']) inputs[name] = schema
  return inputs
})
</script>

<template>
  <div
    :ref="(el) => editor.view.setViewNode(node.id, el as HTMLDivElement)"
    :style="editor.view.getNodeStyle(node)"
    class="min-h-24 w-100 backdrop-blur-2xl rd ring bg-editor-node">

    <!-- Node Header -->
    <EditorNodeHeader :node :editor />

    <!-- Node Body -->
    <div class="flex flex-col py-sm space-y-xs relative">
      <div
        v-if="node.error"
        class="
          absolute top-0 left-0 right-0 bottom-0
          bg-diagonalstripes-danger-500/60 rd-b
          mask-to-t-0/120 pointer-events-none
        "
      />
      <EditorNodeInput
        v-for="(_, name) in visibleInputs"
        :key="name"
        :name="name"
        :node="node"
        :editor="editor"
      />
      <EditorNodeOutput
        v-for="(_, name) in node.outputs"
        :key="name"
        :name="name"
        :node="node"
        :editor="editor"
      />
    </div>

  </div>
</template>

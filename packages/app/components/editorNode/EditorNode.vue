<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
defineProps<{ editor: Editor; node: EditorNodeObject }>()
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
      <EditorNodeInput v-for="(_, name) in node.inputs" :key="name" :name :node :editor />
      <EditorNodeOutput v-for="(_, name) in node.outputs" :key="name" :name :node :editor />
    </div>

  </div>
</template>

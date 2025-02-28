<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
const props = defineProps<{ editor: Editor; node: EditorNodeObject; name: string }>()

const schema = computed(() => props.node.outputs[props.name])
const dataId = computed(() => ['pin', 'source', props.node.id, props.name].join('-'))
</script>

<template>
  <div
    class="flex items-center w-full hover:bg-emphasized cursor-pointer"
    @mousedown.stop="() => editor.view.onLinkGrab({ sourceId: node.id, sourceName: name })"
    @mouseenter="() => editor.view.onLinkAssign({ sourceId: node.id, sourceName: name })"
    @mouseleave="() => editor.view.onLinkUnassign()">

    <!-- Node pin, used to connect to other nodes. -->
    <div class="truncate px-sm py-xs text-right grow">
      <span class="text-sm" v-text="schema.title ?? name" />
    </div>

    <!-- Node pin, used to connect to other nodes. -->
    <EditorNodePin
      :data-id="dataId"
      :data-color="getSchemaTypeColor(schema)"
      :color="getSchemaTypeColor(schema)"
      appearance="right"
    />
  </div>
</template>

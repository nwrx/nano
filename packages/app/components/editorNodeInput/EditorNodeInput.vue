<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
const props = defineProps<{ editor: Editor; node: EditorNodeObject; name: string }>()

// --- Use the `useModel` composition function to create a two-way binding.
const schema = computed(() => props.node.inputs[props.name])
const type = computed(() => getSchemaType(schema.value))
const control = computed(() => schema.value['x-control'])
const color = computed(() => getSchemaTypeColor(schema.value))
const dataId = computed(() => ['pin', 'target', props.node.id, props.name].filter(Boolean).join('-'))
</script>

<template>
  <div
    class="flex items-center w-full relative pr-md group"
    :class="{ 'hover:bg-emphasized cursor-pointer': control === undefined }"
    @mousedown.stop="() => editor.view.onLinkGrab({ targetId: node.id, targetName: name })"
    @mouseenter="() => editor.view.onLinkAssign({ targetId: node.id, targetName: name })"
    @mouseleave="() => editor.view.onLinkUnassign()">

    <!-- Node pin, used to connect to other nodes. -->
    <EditorNodePin
      :data-id="dataId"
      :data-color="color"
      :appearance="control !== undefined ? 'dot' : 'left'"
      :color="color"
    />

    <!-- Text input -->
    <EditorNodeInputText v-if="control === 'text'" :name :node :editor />

    <EditorNodeInputTextarea v-else-if="control === 'textarea'" :name :node :schema />

    <!-- <EditorNodeInputSelect v-else-if="control === 'select'" :name :node :schema /> -->

    <!-- Debug -->
    <p v-else class="text-xs font-mono text-gray-500 bg-gray-100 rounded-md px-xs py-xxs">
      <span class="font-bold" v-text="name" />:
      <span>{{ type ?? 'unknown' }}</span>
      <span>({{ control }})</span>
    </p>
  </div>
</template>

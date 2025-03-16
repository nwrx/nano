<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'

const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
}>()

// --- Use the `useModel` composition function to create a two-way binding.
const schema = computed(() => props.node.inputs[props.name])
const control = computed(() => schema.value['x-control'])
const color = computed(() => getSchemaTypeColor(schema.value))
const dataId = computed(() => ['pin', 'target', props.node.id, props.name].filter(Boolean).join('-'))

// --- Check if the model is a link reference.
const isLinkValue = computed(() => {
  const model = props.node.input[props.name]
  if (typeof model !== 'object') return false
  if ( model === null) return false
  if ('$ref' in model === false) return false
  if (typeof model.$ref !== 'string') return false
  return model.$ref.startsWith('#/Nodes/') !== false
})

// --- Flag that indicates if the input can be linked.
const isLinkable = computed(() => {
  if (control.value === 'language-model') return true
  if (control.value === undefined) return true
  return isLinkValue.value
})
</script>

<template>
  <div
    class="flex items-center w-full relative pr-md group"
    :class="{ 'hover:bg-emphasized cursor-pointer': isLinkable }"
    @mousedown.stop="() => isLinkable && editor.view.onLinkGrab({ targetId: node.id, targetName: name })"
    @mouseenter="() => editor.view.onLinkAssign({ targetId: node.id, targetName: name })"
    @mouseleave="() => editor.view.onLinkUnassign()">

    <!-- Node pin, used to connect to other nodes. -->
    <EditorTooltip class="self-start">
      <EditorNodePin
        :data-id="dataId"
        :data-color="color"
        :appearance="isLinkable ? 'left' : 'dot'"
        :color="color"
        class="cursor-pointer"
      />
      <template #tooltip>
        <EditorNodeInputTooltip
          :editor="editor"
          :node="node"
          :name="name"
        />
      </template>
    </EditorTooltip>

    <!-- Control -->
    <template v-if="control">
      <EditorNodeInputText v-if="control === 'text'" :editor :node :name />
      <EditorNodeInputTextarea v-else-if="control === 'textarea'" :editor :node :name />
      <EditorNodeInputVariable v-else-if="control === 'variable'" :editor :node :name />
      <EditorNodeInputSelect v-else-if="control === 'select'" :editor :node :name />
      <EditorNodeInputTable v-else-if="control === 'table'" :editor :node :name />
      <EditorNodeInputLink v-else-if="control === 'language-model'" :editor :node :name />
      <p v-else class="text-xs font-mono text-app bg-prominent b b-app rd-md px-sm py-xs">
        <span>{{ schema.title ?? name }} ({{ schema.type ?? 'any' }} - {{ control ?? 'none' }})</span>
      </p>
    </template>

    <p v-else class="text-xs font-mono text-app bg-prominent b b-app rd-md px-sm py-xs">
      <span>{{ schema.title ?? name }} ({{ schema.type ?? 'any' }} - {{ control ?? 'none' }})</span>
    </p>
  </div>
</template>

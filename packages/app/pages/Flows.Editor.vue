<script setup lang="ts">
import type { FlowModuleObject } from '~/server/flow'

definePageMeta({
  name: 'FlowsEditor',
  path: '/flows/:id/edit',
})

const id = getRouteId()!
const {
  flow,
  createLink,
  createNode,
  removeLink,
  removeNode,
  moveNode,
  updateSettings,
  setNodeDataValue,
} = useFlowEditor(id)

const { data: modules } = useRequest('GET /api/modules', {
  data: { withNodes: true },
  default: () => [] as FlowModuleObject[],
})

useHead({
  title: flow.name,
  meta: [
    { name: 'description', content: flow.description },
  ],
})
</script>

<template>
  <div class="relative overflow-hidden w-screen h-screen fixed flex flex-col">

    <!-- Visual editor layer. -->
    <FlowEditor
      :nodes="flow.nodes"
      :links="flow.links"
      @moveNode="(id, x, y) => moveNode(id, x, y)"
      @createLink="(source, target) => createLink(source, target)"
      @createNode="(kind, x, y) => createNode(kind, x, y)"
      @removeLink="(id) => removeLink(id)"
      @removeNode="(id) => removeNode(id)"
      @setNodeDataValue="(id, portId, value) => setNodeDataValue(id, portId, value)"
    />

    <!-- Overlay layer. -->
    <div
      class="
      flex flex-col pointer-events-none
      absolute top-0 left-0 w-screen h-screen
      space-y-16 p-16">

      <!-- Edit panel -->
      <FlowEditorPanel
        :flow="flow"
        :modules="modules"
        class="
          pointer-events-auto
          ml-auto h-full !w-120 bg-gray-100/50 shadow-xl p-4
          border border-gray-300 rounded-md
          backdrop-blur-md
          "
        @update:flow="(flow) => updateSettings(flow)"
      />

      <!-- Node drawer -->
      <FlowEditorDrawer
        :modules="modules"
        class="
          pointer-events-auto
          w-full bg-gray-100/20 shadow-xl p-4
          border border-gray-300 rounded-md
          backdrop-blur-md
        "
      />
    </div>

  </div>
</template>

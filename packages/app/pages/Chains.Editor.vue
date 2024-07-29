<script setup lang="ts">
definePageMeta({
  name: 'ChainEdit',
  path: '/chains/:id/edit',
})

const id = getRouteId()!
const { chain, createLink, removeLink, updateNodePosition, updateSettings } = useChainEditor(id)

useHead({
  title: chain.value.name,
  meta: [
    { name: 'description', content: chain.value.description },
  ],
})
</script>

<template>
  <div class="overflow-hidden w-screen h-screen fixed flex flex-col">

    <!-- Visual chain editor to manage the chain nodes link them together. -->
    <ChainEditor
      :nodes="chain.nodes"
      :links="chain.links"
      @updateNodePosition="(id, x, y) => updateNodePosition(id, x, y)"
      @createLink="(source, target) => createLink(source, target)"
      @removeLink="(id) => removeLink(id)"
    />

    <!-- Drawer to add new nodes to the chain. -->
    <NodeDrawer
      @dragNodeStart="(node) => createNode(node)"
      class="bg-gray-100/50 border border-gray-200 rounded-lg backdrop-blur-md h-16"
    />

    <!-- Side panel to manage the chain settings, view logs, etc. -->
    <ChainEditorPanel
      :name="chain.name"
      :description="chain.description"
      @update:name="(name) => updateSettings({ name })"
      @update:description="(description) => updateSettings({ description })"
      class="
        absolute top-16 right-16 bottom-16 !w-xl bg-gray-100/50
        border border-gray-200 rounded-lg backdrop-blur-md
      "
    />
  </div>
</template>

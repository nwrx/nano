<script setup lang="ts">
import type { FlowModuleObject } from '~/server/flow'

defineProps<{
  modules: FlowModuleObject[]
}>()
</script>

<template>
  <!-- Drawer where all available modules are listed. -->
  <div class="space-y-4">

    <!-- Modules -->
    <div class="flex space-x-8">
      <div v-for="module in modules" :key="module.id">

        <!-- Title & Text -->
        <div class="flex flex-col">
          <div class="text-lg font-bold">{{ module.name }}</div>
          <div class="text-sm text-gray-500">{{ module.description }}</div>
        </div>

        <!-- Nodes -->
        <div class="space-y-2 mt-2">
          <FlowEditorDrawerModuleNode
            v-for="node in module.nodes"
            :key="node.name"
            :module="module"
            :node="node"
            class="max-w-xs"
          />

          <!--
            <div
            v-for="node in module.nodes"
            :key="node.name">
            <div class="text-lg font-bold">{{ node.label }}</div>
            <div class="text-sm text-gray-500">{{ node.description }}</div>
            </div>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlowCategoryNodesJSON } from '@nwrx/api'

defineProps<FlowCategoryNodesJSON>()
</script>

<template>
  <div
    class="
      p-4 bg-primary-50 rounded
      border border-black/10
    ">

    <!-- Title -->
    <div class="text-xs font-medium text-gray-500 uppercase">
      {{ name }}
    </div>

    <!-- Nodes -->
    <div class="flex flex-col space-y-1 mt-4">
      <FlowEditorDrawerNode
        v-for="node in nodes"
        :key="node.kind"
        v-bind="node"
      />
    </div>
  </div>
</template>

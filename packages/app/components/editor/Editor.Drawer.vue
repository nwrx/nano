<script setup lang="ts">
import type { FlowCategoryNodesJSON } from '@nwrx/api'

defineProps<{
  categories?: FlowCategoryNodesJSON[]
}>()

const activeCategory = ref<FlowCategoryNodesJSON>()
</script>

<template>
  <div class="flex items-start space-x-md" @mouseleave="() => activeCategory = undefined">

    <!-- Categories -->
    <div class="bg-editor-panel rounded border border-editor backdrop-blur-2xl max-w-16">
      <div
        v-for="category in categories"
        :key="category.kind"
        :class="activeCategory === category ? 'text-app' : 'text-subtle'"
        class="w-16 my-md flex items-center justify-center"
        @mouseenter="() => activeCategory = category">

        <!-- Trigger -->
        <BaseIcon
          load
          :icon="category.icon"
          class="size-8 transition cursor-pointer group-hover:text-app"
        />
      </div>
    </div>

    <!-- Menu -->
    <div
      v-if="activeCategory"
      class="
        transition pl-md min-w-64 max-w-96
        p-4 bg-editor-panel rounded border border-editor backdrop-blur-md
      ">

      <!-- Title -->
      <div
        class="text-xs font-medium text-subtle uppercase"
        v-text="activeCategory.name"
      />

      <!-- Nodes -->
      <div class="flex flex-col space-y-1 mt-4">
        <EditorDrawerItem
          v-for="node in activeCategory.nodes"
          :key="node.kind"
          v-bind="node"
        />
      </div>
    </div>
  </div>
</template>

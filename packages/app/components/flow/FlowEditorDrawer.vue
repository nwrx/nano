<script setup lang="ts">
import type { FlowCategoryNodesJSON } from '@nwrx/api'

defineProps<{
  categories: FlowCategoryNodesJSON[]
}>()
</script>

<template>
  <!-- Drawer where all available modules are listed. -->
  <div
    class="
      bg-primary-50/20 rounded
      border border-black/10
      backdrop-blur-md
      max-h-[calc(100%-6rem)]
    ">

    <!-- Categories -->
    <div
      v-for="category in categories"
      :key="category.kind"
      class="group">

      <!-- Trigger -->
      <div class="w-16 my-4 flex items-center justify-center">
        <BaseIcon
          load
          :icon="category.icon"
          class="w-8 h-8 transition-all text-black duration-300 cursor-pointer opacity-60 group-hover:opacity-100"
        />
      </div>

      <!-- Menu -->
      <div
        class="
          flex items-end
          absolute bottom-0 top-0 left-full pl-4
          group-hover:opacity-100 opacity-0
          group-hover:translate-x-0 -translate-x-4
          group-hover:pointer-events-auto pointer-events-none
          transition-all duration-100
        ">
        <FlowEditorDrawerCategory
          v-bind="category"
          class="w-64"
        />
      </div>
    </div>
  </div>
</template>

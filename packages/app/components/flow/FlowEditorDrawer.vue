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
      flex flex-col items-center justify-start
      w-16 py-4 space-y-4
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
      <BaseIcon
        :icon="category.icon"
        class="w-16 h-8 transition-all duration-300 cursor-pointer opacity-60 group-hover:opacity-100"
      />

      <!-- Menu -->
      <div
        class="
          absolute bottom-0 left-full pl-4
          group-hover:opacity-100 opacity-0
          group-hover:translate-y-0 -translate-y-4
          group-hover:pointer-events-auto pointer-events-none
          transition-all duration-100
        ">
        <FlowEditorDrawerCategory
          v-bind="category"
          class="
            w-64
          "
        />
      </div>
    </div>
  </div>
</template>

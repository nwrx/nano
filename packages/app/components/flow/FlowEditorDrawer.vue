<script setup lang="ts">
import type { FlowCategoryNodesJSON } from '@nwrx/api'

defineProps<{
  categories: FlowCategoryNodesJSON[]
}>()

const activeCategory = ref<FlowCategoryNodesJSON >()
</script>

<template>
  <div class="flex space-x-md items-end" @mouseleave="() => activeCategory = undefined">

    <!-- Categories -->
    <div class="bg-editor-panel rounded border border-editor backdrop-blur-2xl max-w-16">
      <div
        v-for="category in categories"
        :key="category.kind"
        :class="{
          'text-app': activeCategory === category,
          'text-subtle': activeCategory !== category,
        }"
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
    <Transition
      :duration="200"
      enter-active-class="transition duration-200"
      leave-active-class="transition duration-200"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave-from="opacity-100"
      leave-to="opacity-0">
      <div
        v-if="activeCategory"
        class="
          transition pl-md min-w-64 max-w-96
          p-4 bg-editor-panel rounded border border-editor backdrop-blur-md
        ">

        <!-- Title -->
        <div class="text-xs font-medium text-subtle uppercase">
          {{ activeCategory.name }}
        </div>

        <!-- Nodes -->
        <div class="flex flex-col space-y-1 mt-4">
          <FlowEditorDrawerNode
            v-for="node in activeCategory.nodes"
            :key="node.kind"
            v-bind="node"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

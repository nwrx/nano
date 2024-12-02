<script setup lang="ts">
import type { CategoryJSON } from '@nwrx/api'

defineProps<{
  categories?: CategoryJSON[]
}>()

const activeCategory = ref<CategoryJSON>()
</script>

<template>
  <div class="flex items-start space-x-md overflow-hidden h-full" @mouseleave="() => activeCategory = undefined">

    <!-- Categories -->
    <div class="bg-editor-panel rounded border border-editor backdrop-blur-2xl max-w-16">
      <div
        v-for="category in categories"
        :key="category.kind"
        :class="activeCategory === category ? 'op-100' : 'op-50'"
        class="w-16 py-3 last:pb-4 first:pt-4 flex items-center justify-center transition  cursor-pointer"
        @mouseenter="() => activeCategory = category">

        <!-- Trigger -->
        <template v-if="category.icon">
          <img v-if="!category.icon.endsWith('.svg')" :src="category.icon" class="size-8 rd">
          <BaseIcon v-else :icon="category.icon" class="size-8" load />
        </template>
      </div>
    </div>

    <!-- Menu -->
    <div
      v-if="activeCategory"
      class="
        transition pl-md min-w-64 max-w-96
        p-4 bg-editor-panel rd b b-editor backdrop-blur-md
        max-h-full overflow-y-auto
      ">

      <!-- Title -->
      <div
        class="text-xs font-medium text-subtle uppercase"
        v-text="activeCategory.name"
      />

      <!-- Nodes -->
      <div class="flex flex-col space-y-1 mt-4">
        <EditorDrawerItem
          v-for="node in activeCategory.components"
          :key="node.kind"
          v-bind="node"
        />
      </div>
    </div>
  </div>
</template>

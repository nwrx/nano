<script setup lang="ts">
import type { ThreadTree } from '~/composables/useThread'
import EventTreeItem from './ThreadTree.EventTreeItem.vue'

defineProps<{
  maxDepth: number
  item: ThreadTree.Item
}>()

const element = ref<HTMLElement>()
const { height } = useElementBounding(element)
</script>

<template>
  <div
    ref="element"
    class="flex pr-5 pointer-events-none">
    <div
      v-for="depth in maxDepth"
      :key="depth"
      class="relative w-5 shrink-0 -mb-2px">

      <EventTreeItem
        class="absolute top-1/2 transform -translate-y-1/2"
        :width="20"
        :height="height"
        :thickness="2"
        :color="item.tree[depth - 1]?.color ?? 'transparent'"
        :show-pin="item.tree[depth - 1]?.showPin"
        :show-line="item.tree[depth - 1]?.showLine"
      />
    </div>
  </div>
</template>

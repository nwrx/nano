<script setup lang="ts">
defineProps<{
  item: EditorMessageTreeItem
  maxConcurrency: number
}>()

const element = ref<HTMLElement>()
const { height } = useElementBounding(element)
</script>

<template>
  <div
    ref="element"
    class="flex pr-[28px] pointer-events-none">
    <div
      v-for="depth in maxConcurrency"
      :key="depth"
      class="relative w-5 shrink-0 -mb-2px">

      <template v-if="item.tree && item.tree[depth - 1]">
        <EditorPanelMessagesMessageTreeCurve
          class="absolute top-1/2 transform -translate-y-1/2"
          :style="{ zIndex: maxConcurrency - depth }"
          :width="28"
          :height="height"
          :tension="0.15"
          :color="item.tree[depth - 1].color"
          :show-pin="item.tree[depth - 1].showPin"
          :show-line="item.tree[depth - 1].showLine"
        />
      </template>
    </div>
  </div>
</template>

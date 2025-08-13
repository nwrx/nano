<script setup lang="ts">
import type { Editor, FlowObject } from '@nwrx/nano-api'
import type { VNode } from 'vue'
import EditorFab from '../editor/EditorFab.vue'
import EditorPanelTabs from './EditorPanel.Tabs.vue'

const props = defineProps<{
  flow: FlowObject
  nodes: Editor.NodeObject[]
  components: Editor.ComponentObject[]
  componentGroups: Editor.ComponentGroup[]
  panelWidth: number
  selectedNodes: Editor.NodeObject[]
}>()

const slots = defineSlots<{
  default?: () => VNode
}>()

const isOpen = defineModel('isOpen', { default: true })
const isResizing = defineModel('isResizing', { default: false })
const selectedTab = defineModel('selectedTab', { default: 'flow' })

// --- Reactive tabs based on the selected nodes.
const tabs = computed(() => {
  const tabs = ['evaluation', 'playground']
  if (props.selectedNodes.length > 0) tabs.unshift('node')
  else tabs.unshift('flow')
  return tabs
})

// --- When a node is selected, switch to the node tab if the flow tab is selected.
watch(() => props.selectedNodes, () => {
  if (props.selectedNodes.length > 0 && selectedTab.value === 'flow') selectedTab.value = 'node'
  if (props.selectedNodes.length === 0 && selectedTab.value === 'node') selectedTab.value = 'flow'
})
</script>

<template>
  <div
    :style="{
      maxWidth: `${isOpen ? panelWidth : 48}px`,
      height: isOpen ? undefined : '48px',
    }"
    :class="{
      'transition-all duration-slow': !isResizing,
    }"
    class="flex flex-col rd backdrop-blur-2xl overflow-hidden relative bg-editor-panel b b-app grow w-full"
    @mousedown.stop>

    <!-- PatternGrain -->
    <!-- <PatternGrain class="absolute top-0 left-0 w-full h-full pointer-events-none op-15" /> -->

    <!-- Resize handle -->
    <!-- eslint-disable vue/no-mutating-props -->
    <div
      :class="{
        'pointer-events-none': !isOpen,
        'op-0': !isResizing,
        '!op-100': isResizing,
      }"
      class="absolute top-0 bottom-0 left-0 w-4 cursor-ew-resize hover:op-50 z-10"
      @mousedown="() => isResizing = true"
      @mouseup="() => isResizing = false">
      <div class="w-px h-full bg-editor-active" />
    </div>

    <!-- Tabs -->
    <EditorPanelTabs
      v-model="selectedTab"
      :values="tabs"
      :class="{ 'op-0': !isOpen }"
    />

    <!-- Toggle -->
    <EditorFab
      class="absolute top-0 right-0 mt-2 mr-2 z-10"
      icon="i-carbon:chevron-left"
      :class-icon="{ 'rotate-180': isOpen }"
      @click="() => isOpen = !isOpen"
    />

    <!-- Content -->
    <div
      class="flex flex-col h-full overflow-y-auto overflow-x-hidden transition"
      :class="{ 'op-0': !isOpen }">
      <component :is="slots.default" v-if="isOpen" />
    </div>
  </div>
</template>

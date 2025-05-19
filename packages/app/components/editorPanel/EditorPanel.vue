<script setup lang="ts">
import type { ThreadInputObject } from '@nwrx/nano'
import type { FlowNodeObject, FlowObject } from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import EditorFab from '../editor/EditorFab.vue'
import EditorPanelFlow from './EditorPanelFlow.vue'
import EditorPanelPlayground from './EditorPanelPlayground.vue'

const props = withDefaults(
  defineProps<{
    flow?: FlowObject
    nodes?: FlowNodeObject[]
    panelWidth?: number
    isPanelResizing?: boolean
    nodesSelected?: FlowNodeObject[]
    messagesThread?: ThreadServerMessage[]
  }>(),
  {
    panelWidth: 300,
    nodesSelected: () => [],
  },
)

const emit = defineEmits<{
  'setMetadata': Array<{ name: string; value: unknown }>
  'panelResizeStart': []
  'panelResizeEnd': []
  'startThread': [ThreadInputObject]
}>()

const settings = useLocalSettings()
const selectedTab = ref('flow')

// --- Reactive tabs based on the selected nodes.
const tabs = computed(() => {
  const tabs = ['evaluation', 'playground']
  if (props.nodesSelected.length > 0) tabs.unshift('node')
  else tabs.unshift('flow')
  return tabs
})

// --- When a node is selected, switch to the node tab if the flow tab is selected.
watch(() => props.nodesSelected, () => {
  if (props.nodesSelected.length > 0 && selectedTab.value === 'flow') selectedTab.value = 'node'
  if (props.nodesSelected.length === 0 && selectedTab.value === 'node') selectedTab.value = 'flow'
})

// --- Scroll to bottom if the container is already at the bottom.
// const container = ref<HTMLElement>()
// async function scrollToBottom() {
//   if (!container.value) return
//   const { scrollHeight, scrollTop, clientHeight } = container.value
//   const stickyHeight = 250
//   if (scrollHeight - scrollTop > clientHeight + stickyHeight) return
//   await nextTick()
//   if (!container.value) return
//   container.value.scrollTo({ top: scrollHeight, behavior: 'instant' })
// }
</script>

<template>
  <div
    :style="{
      width: `${settings.editorPanelOpen ? panelWidth : 48}px`,
      height: settings.editorPanelOpen ? undefined : '48px',
    }"
    :class="{
      'transition-all duration-slow': !isPanelResizing,
    }"
    class="
      flex flex-col rd backdrop-blur-2xl overflow-hidden relative
      bg-editor-panel border border-editor
    "
    @mousedown.stop>

    <!-- Resize handle -->
    <!-- eslint-disable vue/no-mutating-props -->
    <div
      :class="{
        'pointer-events-none': !settings.editorPanelOpen,
        'op-0': !isPanelResizing,
        '!op-100': isPanelResizing,
      }"
      class="absolute top-0 bottom-0 left-0 w-4 cursor-ew-resize hover:op-50 z-10"
      @mousedown="() => emit('panelResizeStart')"
      @mouseup="() => emit('panelResizeEnd')">
      <div class="w-px h-full bg-editor-active" />
    </div>

    <!-- Tabs -->
    <EditorPanelTabs
      v-model="selectedTab"
      :values="tabs"
      :class="{ 'op-0': !settings.editorPanelOpen }"
    />

    <!-- Toggle -->
    <EditorFab
      class="absolute top-0 right-0 mt-2 mr-2 z-10"
      icon="i-carbon:chevron-left"
      :class-icon="{ 'rotate-180': settings.editorPanelOpen }"
      @click="() => settings.editorPanelOpen = !settings.editorPanelOpen"
    />

    <!-- Content -->
    <div
      ref="container"
      class="flex flex-col h-full overflow-y-auto overflow-x-hidden transition"
      :class="{ 'op-0': !settings.editorPanelOpen }">
      <KeepAlive :key="selectedTab">
        <Transition>
          <template v-if="settings.editorPanelOpen">

            <!-- Flow informations -->
            <EditorPanelFlow
              v-if="selectedTab === 'flow'"
              :flow="flow"
              @set-metadata="(metadata) => emit('setMetadata', metadata)"
            />

            <!-- Node informations -->
            <!-- <LazyEditorPanelNode v-else-if="selectedTab === 'node'" :editor /> -->

            <!-- Evaluation -->
            <!-- <EditorPanelEvaluation v-else-if="selectedTab === 'evaluation'" :editor /> -->

            <!-- Playground -->
            <EditorPanelPlayground
              v-else-if="selectedTab === 'playground'"
              :messages="messagesThread"
              :nodes="nodes"
              @start-thread="(input) => emit('startThread', input)"
            />
          </template>
        </Transition>
      </KeepAlive>
    </div>
  </div>
</template>

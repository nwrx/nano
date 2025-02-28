<script setup lang="ts">
const props = defineProps<{
  view: EditorView
}>()

// const view = useEditorView()
const session = useEditor()
const settings = useLocalSettings()
const view = computed(() => props.view)

const isOpen = computed(() => ({
  get: () => Boolean(settings.value.editorPanelOpen),
  set: (value: boolean) => { settings.value.editorPanelOpen = value },
})) as unknown as Ref<boolean>

// --- Compute tabs based on selected node.
const selectedTab = ref('flow')
const tabs = computed(() => {
  const nodeSelected = view.value.nodeSelected ?? []
  const tabs = ['events', 'playground']
  if (nodeSelected.length > 0) tabs.unshift('node')
  else tabs.unshift('flow')
  return tabs
})

// --- When a node is selected, switch to the node tab if the flow tab is selected.
// watch(() => props.nodeSelected, () => {
//   const nodeSelected = props.nodeSelected ?? []
//   if (nodeSelected.length > 0 && selectedTab.value === 'flow') selectedTab.value = 'node'
//   if (nodeSelected.length === 0 && selectedTab.value === 'node') selectedTab.value = 'flow'
// })

// --- Scroll to bottom if the container is already at the bottom.
const container = ref<HTMLElement>()
// async function scrollToBottom() {
//   if (!container.value) return
//   const { scrollHeight, scrollTop, clientHeight } = container.value
//   const stickyHeight = 250
//   if (scrollHeight - scrollTop > clientHeight + stickyHeight) return
//   await nextTick()
//   if (!container.value) return
//   container.value.scrollTo({ top: scrollHeight, behavior: 'instant' })
// }

// --- When a new event is added, scroll to the bottom if the container is already at the bottom.
// watch(() => view.events, scrollToBottom, { deep: true })
</script>

<template>
  <div
    :style="{
      width: `${isOpen ? view.panelWidth : 48}px`,
      height: isOpen ? undefined : '48px',
    }"
    :class="{
      'transition-all duration-slow': !view.isPanelResizing,
    }"
    class="
      flex flex-col rd backdrop-blur-2xl overflow-hidden relative
      bg-editor-panel border border-editor
    "
    @mousedown.stop>

    <!-- Resize handle -->
    <div
      :class="{ 'pointer-events-none': !isOpen, 'op-0': !view.isPanelResizing, '!op-100': view.isPanelResizing }"
      class="absolute top-0 bottom-0 left-0 w-4 cursor-ew-resize transition hover:op-50 z-10 py-xs"
      @mousedown="() => view.isPanelResizing = true"
      @mouseup="() => view.isPanelResizing = false">
      <div class="w-px h-full bg-editor-active" />
    </div>

    <!-- Tabs -->
    <EditorPanelTabs
      v-model="selectedTab"
      :values="tabs"
      :class="{ 'op-0': !isOpen }"
      class="transition-all"
    />

    <!-- Toggle -->
    <EditorFab
      class="absolute top-0 right-0 mt-2 mr-2 z-10"
      @click="() => isOpen = !isOpen">
      <BaseIcon
        icon="i-carbon:chevron-left"
        :class="{ 'rotate-180': isOpen }"
        class="size-5 shrink-0 transition-all"
      />
    </EditorFab>

    <!-- Flow -->
    <div
      ref="container"
      class="flex flex-col h-full overflow-y-auto overflow-x-hidden transition"
      :class="{ 'op-0': !isOpen }">
      {{ session.data.name }}

      <!--
        <EditorPanelFlow v-if="selectedTab === 'flow'" />
        <EditorPanelNode v-else-if="selectedTab === 'node'" />
        <EditorPanelEvents v-else-if="selectedTab === 'events'" />
        <EditorPanelPlayground v-else-if="selectedTab === 'playground'" />
      -->
    </div>
  </div>
</template>

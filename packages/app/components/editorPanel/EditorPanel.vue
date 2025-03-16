<script setup lang="ts">
const props = defineProps<{
  editor: Editor
}>()

// const view = useEditorView()
const settings = useLocalSettings()
const selectedTab = ref('flow')
const tabs = computed(() => {
  const view = props.editor.view
  const nodeSelected = view.nodeSelected ?? []
  const tabs = ['events', 'playground']
  if (nodeSelected.length > 0) tabs.unshift('node')
  else tabs.unshift('flow')
  return tabs
})

// --- When a node is selected, switch to the node tab if the flow tab is selected.
watch(() => props.editor.view.nodeSelected, () => {
  const nodeSelected = props.editor.view.nodeSelected ?? []
  if (nodeSelected.length > 0 && selectedTab.value === 'flow') selectedTab.value = 'node'
  if (nodeSelected.length === 0 && selectedTab.value === 'node') selectedTab.value = 'flow'
})

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
</script>

<template>
  <div
    :style="{
      width: `${settings.editorPanelOpen ? editor.view.panelWidth : 48}px`,
      height: settings.editorPanelOpen ? undefined : '48px',
    }"
    :class="{
      'transition-all duration-slow': !editor.view.isPanelResizing,
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
        'op-0': !editor.view.isPanelResizing,
        '!op-100': editor.view.isPanelResizing,
      }"
      class="absolute top-0 bottom-0 left-0 w-4 cursor-ew-resize hover:op-50 z-10 py-xs"
      @mousedown="() => editor.view.isPanelResizing = true"
      @mouseup="() => editor.view.isPanelResizing = false">
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
      @click="() => settings.editorPanelOpen = !settings.editorPanelOpen">
      <BaseIcon
        icon="i-carbon:chevron-left"
        :class="{ 'rotate-180': settings.editorPanelOpen }"
        class="size-5 shrink-0 transition"
      />
    </EditorFab>

    <!-- Content -->
    <div
      ref="container"
      class="flex flex-col h-full overflow-y-auto overflow-x-hidden transition"
      :class="{ 'op-0': !settings.editorPanelOpen }">
      <KeepAlive :key="selectedTab">
        <Transition>
          <template v-if="settings.editorPanelOpen">
            <LazyEditorPanelFlow v-if="selectedTab === 'flow'" :editor />
            <LazyEditorPanelNode v-else-if="selectedTab === 'node'" :editor />
            <!-- <EditorPanelEvents v-else-if="selectedTab === 'events'" :editor /> -->
            <EditorPanelMessages v-else-if="selectedTab === 'playground'" :editor />
          </template>
        </Transition>
      </KeepAlive>
    </div>
  </div>
</template>

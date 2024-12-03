<script setup lang="ts">
import type { ComponentInstanceJSON, EditorSessionServerMessage } from '@nwrx/api'

const props = defineProps<{
  width?: number
  isOpen?: boolean
  isResizing?: boolean
  isSecretsOpen?: boolean
  isVariablesOpen?: boolean
  isNodeInputOpen?: boolean
  isNodeOutputOpen?: boolean
  isNodeMetadataOpen?: boolean

  name?: string
  description?: string
  secrets?: string[]
  variables?: string[]
  nodeSelected?: ComponentInstanceJSON[]
  events?: EditorSessionServerMessage[]
  nodes?: ComponentInstanceJSON[]
}>()

const emit = defineEmits<{
  start: [Record<string, string>]
  setName: [string]
  setDescription: [string]

  variableCreate: [string, string]
  variableUpdate: [string, string]
  variableRemove: [string]
  secretCreate: [string, string]
  secretUpdate: [string, string]
  secretRemove: [string]

  setNodeLabel: [string, string]
  setNodeComment: [string, string]
  setNodeInputValue: [string, key: string, unknown]

  clearEvents: []

  'update:isOpen': [boolean]
  'update:isResizing': [boolean]
  'update:isSecretsOpen': [boolean]
  'update:isVariablesOpen': [boolean]
  'update:isNodeInputOpen': [boolean]
  'update:isNodeOutputOpen': [boolean]
  'update:isNodeMetadataOpen': [boolean]
}>()

// --- Data.
const name = useVModel(props, 'name', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })

// --- State.
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const isResizing = useVModel(props, 'isResizing', emit, { passive: true })
const isSecretsOpen = useVModel(props, 'isSecretsOpen', emit, { passive: true })
const isVariablesOpen = useVModel(props, 'isVariablesOpen', emit, { passive: true })
const isNodeInputOpen = useVModel(props, 'isNodeInputOpen', emit, { passive: true })
const isNodeOutputOpen = useVModel(props, 'isNodeOutputOpen', emit, { passive: true })
const isNodeMetadataOpen = useVModel(props, 'isNodeMetadataOpen', emit, { passive: true })

// --- Compute tabs based on selected node.
const selectedTab = ref('flow')
const tabs = computed(() => {
  const nodeSelected = props.nodeSelected ?? []
  const tabs = ['events', 'playground']
  if (nodeSelected.length > 0) tabs.unshift('node')
  else tabs.unshift('flow')
  return tabs
})

const node = computed(() => {
  if (props.nodeSelected?.length === 1) return props.nodeSelected[0]
})

// --- When a node is selected, switch to the node tab if the flow tab is selected.
watch(() => props.nodeSelected, () => {
  const nodeSelected = props.nodeSelected ?? []
  if (nodeSelected.length > 0 && selectedTab.value === 'flow') selectedTab.value = 'node'
  if (nodeSelected.length === 0 && selectedTab.value === 'node') selectedTab.value = 'flow'
})

// --- Scroll to bottom if the container is already at the bottom.
const container = ref<HTMLElement>()
async function scrollToBottom() {
  if (!container.value) return
  const { scrollHeight, scrollTop, clientHeight } = container.value
  const stickyHeight = 250
  if (scrollHeight - scrollTop > clientHeight + stickyHeight) return
  await nextTick()
  if (!container.value) return
  container.value.scrollTo({ top: scrollHeight, behavior: 'instant' })
}

// --- When a new event is added, scroll to the bottom if the container is already at the bottom.
watch(() => props.events, scrollToBottom, { deep: true })
</script>

<template>
  <div
    :style="{
      width: `${isOpen ? width : 48}px`,
      height: isOpen ? undefined : '48px',
    }"
    :class="{
      'transition-all duration-slow': !isResizing,
    }"
    class="
      flex flex-col rd backdrop-blur-2xl overflow-hidden relative
      bg-editor-panel border border-editor
    "
    @mousedown.stop>

    <!-- Width Control -->
    <EditorPanelResize
      :is-resizing="isResizing"
      class="z-10"
      :class="{ 'pointer-events-none': !isOpen }"
      @start-resize="() => isResizing = true"
      @stop-resize="() => isResizing = false"
    />

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
      <EditorPanelFlow
        v-if="selectedTab === 'flow'"
        v-model:is-secrets-open="isSecretsOpen"
        v-model:is-variables-open="isVariablesOpen"
        :name="name"
        :description="description"
        :secrets="props.secrets"
        :variables="props.variables"
        @set-name="(name) => emit('setName', name)"
        @set-description="(description) => emit('setDescription', description)"
        @variable-create="(name, value) => emit('variableCreate', name, value)"
        @variable-update="(name, value) => emit('variableUpdate', name, value)"
        @variable-remove="(name) => emit('variableRemove', name)"
        @secret-create="(name, value) => emit('secretCreate', name, value)"
        @secret-update="(name, value) => emit('secretUpdate', name, value)"
        @secret-remove="(name) => emit('secretRemove', name)"
      />

      <!-- Node -->
      <EditorPanelNode
        v-else-if="selectedTab === 'node' && node"
        v-model:is-input-open="isNodeInputOpen"
        v-model:is-output-open="isNodeOutputOpen"
        v-model:is-metadata-open="isNodeMetadataOpen"
        :node="node"
        :nodes="nodes"
        @set-label="(label) => emit('setNodeLabel', node!.id, label)"
        @set-comment="(comment) => emit('setNodeComment', node!.id, comment)"
        @set-input-value="(key, value) => emit('setNodeInputValue', node!.id, key, value)"
      />

      <!-- Events -->
      <EditorPanelEvents
        v-else-if="selectedTab === 'events'"
        :events="events"
        :nodes="nodes"
        @clear="() => emit('clearEvents')"
      />

      <!-- Playground -->
      <EditorPanelPlayground
        v-else-if="selectedTab === 'playground'"
        :nodes="nodes"
        :events="events"
        @start="(input) => emit('start', input)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlowSessionEventPayload, FlowSessionSecretJSON, FlowSessionVariableJSON, NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  name: string
  methods: string[]
  description: string
  secrets: FlowSessionSecretJSON[]
  variables: FlowSessionVariableJSON[]
  nodeSelected: NodeInstanceJSON[]
  events: FlowSessionEventPayload[]
  isOpen: boolean
  nodes: NodeInstanceJSON[]
  isFlowMethodsOpen?: boolean
  isFlowSecretsOpen?: boolean
  isFlowVariablesOpen?: boolean
  isNodeDataOpen?: boolean
  isNodeResultOpen?: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean]
  'update:isFlowMethodsOpen': [isOpen: boolean]
  'update:isFlowSecretsOpen': [isOpen: boolean]
  'update:isFlowVariablesOpen': [isOpen: boolean]
  'update:isNodeDataOpen': [isOpen: boolean]
  'update:isNodeResultOpen': [isOpen: boolean]
  start: [Record<string, string>]
  setName: [name: string]
  setMethods: [methods: string[]]
  setDescription: [description: string]
  setNodeDataValue: [nodeId: string, key: string, value: unknown]
  variableCreate: [name: string, value: string]
  variableUpdate: [name: string, value: string]
  variableRemove: [name: string]
  secretCreate: [name: string, value: string]
  secretUpdate: [name: string, value: string]
  secretRemove: [name: string]
  eventsClear: []
}>()

// --- Data.
const name = useVModel(props, 'name', emit, { passive: true })
const methods = useVModel(props, 'methods', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })

// --- State.
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const isFlowMethodsOpen = useVModel(props, 'isFlowMethodsOpen', emit, { passive: true })
const isFlowSecretsOpen = useVModel(props, 'isFlowSecretsOpen', emit, { passive: true })
const isFlowVariablesOpen = useVModel(props, 'isFlowVariablesOpen', emit, { passive: true })
const isNodeDataOpen = useVModel(props, 'isNodeDataOpen', emit, { passive: true })
const isNodeResultOpen = useVModel(props, 'isNodeResultOpen', emit, { passive: true })

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
  return
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
  container.value.scrollTo({ top: scrollHeight, behavior: 'smooth' })
}

// --- When a new event is added, scroll to the bottom if the container is already at the bottom.
watch(() => props.events, scrollToBottom, { deep: true })
</script>

<template>
  <div
    :class="{
      'w-16 !h-16': !isOpen,
      'w-128': isOpen,
    }"
    class="
      flex flex-col rd backdrop-blur-2xl overflow-hidden
      bg-editor-panel border border-editor transition-all duration-slow
    "
    @mousedown.stop>

    <!-- Tabs -->
    <FlowEditorPanelTabs
      v-model="selectedTab"
      :values="tabs"
      :class="{ 'op-0': !isOpen }"
      class="transition-all"
    />

    <!-- Toggle -->
    <FlowEditorFab
      class="absolute top-0 right-0 mt-3 mr-3"
      :icon="isOpen ? 'i-carbon:right-panel-close-filled' : 'i-carbon:right-panel-open'"
      @click="() => isOpen = !isOpen"
    />

    <!-- Flow -->
    <div ref="container" class="flex flex-col h-full overflow-y-auto transition" :class="{ 'op-0': !isOpen }">
      <FlowEditorPanelFlow
        v-if="selectedTab === 'flow'"
        v-model:is-methods-open="isFlowMethodsOpen"
        v-model:is-secrets-open="isFlowSecretsOpen"
        v-model:is-variables-open="isFlowVariablesOpen"
        :name="name"
        :methods="methods"
        :description="description"
        :secrets="props.secrets"
        :variables="props.variables"
        @set-name="(name) => emit('setName', name)"
        @set-methods="(methods) => emit('setMethods', methods)"
        @set-description="(description) => emit('setDescription', description)"
        @variable-create="(name, value) => emit('variableCreate', name, value)"
        @variable-update="(name, value) => emit('variableUpdate', name, value)"
        @variable-remove="(name) => emit('variableRemove', name)"
        @secret-create="(name, value) => emit('secretCreate', name, value)"
        @secret-update="(name, value) => emit('secretUpdate', name, value)"
        @secret-remove="(name) => emit('secretRemove', name)"
      />

      <!-- Node -->
      <FlowEditorPanelNode
        v-else-if="selectedTab === 'node' && node"
        v-model:is-data-open="isNodeDataOpen"
        v-model:is-result-open="isNodeResultOpen"
        :node="node"
        :nodes="nodes"
        :name="node.name"
        :description="node.description"
        @set-data-value="(key, value) => emit('setNodeDataValue', node!.id, key, value)"
        @update:is-data-open="(isOpen) => emit('update:isNodeDataOpen', isOpen)"
        @update:is-result-open="(isOpen) => emit('update:isNodeResultOpen', isOpen)"
      />

      <!-- Events -->
      <FlowEditorPanelEvents
        v-else-if="selectedTab === 'events'"
        :events="events"
        :nodes="nodes"
        @clear="() => emit('eventsClear')"
      />

      <!-- Playground -->
      <FlowEditorPanelPlayground
        v-else-if="selectedTab === 'playground'"
        :nodes="nodes"
        :events="events"
        @start="(input) => emit('start', input)"
      />
    </div>
  </div>
</template>

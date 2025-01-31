<script setup lang="ts">
import type { FlowNodeInstanceJSON, FlowSessionEventPayload, FlowSessionSecretJSON, FlowSessionVariableJSON } from '@nwrx/api'

const props = defineProps<{
  name: string
  methods: string[]
  description: string
  secrets: FlowSessionSecretJSON[]
  variables: FlowSessionVariableJSON[]
  nodeSelected: FlowNodeInstanceJSON[]
  events: FlowSessionEventPayload[]
  isOpen: boolean
  isFlowMethodsOpen?: boolean
  isFlowSecretsOpen?: boolean
  isFlowVariablesOpen?: boolean
  isNodeDataOpen?: boolean
  isNodeResultOpen?: boolean
  isEventsOpen?: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean]
  'update:isFlowMethodsOpen': [isOpen: boolean]
  'update:isFlowSecretsOpen': [isOpen: boolean]
  'update:isFlowVariablesOpen': [isOpen: boolean]
  'update:isNodeDataOpen': [isOpen: boolean]
  'update:isNodeResultOpen': [isOpen: boolean]
  'update:isEventsOpen': [isOpen: boolean]
  setName: [name: string]
  setMethods: [methods: string[]]
  setDescription: [description: string]
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
const isEventsOpen = useVModel(props, 'isEventsOpen', emit, { passive: true })

// --- Compute tabs based on selected node.
const selectedTab = ref('flow')
const tabs = computed(() => {
  const nodeSelected = props.nodeSelected ?? []
  const tabs = [{ label: 'Logs', id: 'logs' }]
  if (nodeSelected.length > 0) tabs.unshift({ label: 'Node', id: 'node' })
  else tabs.unshift({ label: 'Settings', id: 'flow' })
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
</script>

<template>
  <div
    class="
      flex flex-col max-h-full rd overflow-hidden relative
      bg-editor-panel border border-editor backdrop-blur-2xl
    "
    :class="{
      'w-16': !isOpen,
      'w-128': isOpen,
    }"
    @mousedown.stop>

    <Button
      filled
      variant="secondary"
      icon="i-carbon:close"
      class="!absolute right-md top-md z-10"
      @click="() => isOpen = !isOpen"
    />

    <!-- Tab selector -->
    <div class="flex gap-md p-md" :class="{ 'opacity-0': !isOpen }">
      <BaseInputToggle
        v-for="tab in tabs"
        :key="tab.id"
        v-model="selectedTab"
        :value="tab.id"
        eager
        as="div"
        type="radio"
        class="
          cursor-pointer px-md py-sm rd font-medium transition
          !selected:bg-primary-500
          selected:text-white
          hover:bg-prominent
        ">
        {{ tab.label }}
      </BaseInputToggle>
    </div>

    <!-- Flow settings -->
    <div :class="{ 'opacity-0': !isOpen }" class="flex-grow overflow-y-auto">
      <FlowEditorPanelFlow
        v-if="selectedTab === 'flow'"
        v-model:isMethodsOpen="isFlowMethodsOpen"
        v-model:isSecretsOpen="isFlowSecretsOpen"
        v-model:isVariablesOpen="isFlowVariablesOpen"
        :name="name"
        :methods="methods"
        :description="description"
        :secrets="props.secrets"
        :variables="props.variables"
        @setName="(name) => emit('setName', name)"
        @setMethods="(methods) => emit('setMethods', methods)"
        @setDescription="(description) => emit('setDescription', description)"
        @variableCreate="(name, value) => emit('variableCreate', name, value)"
        @variableUpdate="(name, value) => emit('variableUpdate', name, value)"
        @variableRemove="(name) => emit('variableRemove', name)"
        @secretCreate="(name, value) => emit('secretCreate', name, value)"
        @secretUpdate="(name, value) => emit('secretUpdate', name, value)"
        @secretRemove="(name) => emit('secretRemove', name)"
      />

      <!-- Selected node settings -->
      <FlowEditorPanelNode
        v-else-if="selectedTab === 'node' && node"
        v-model:isDataOpen="isNodeDataOpen"
        v-model:isResultOpen="isNodeResultOpen"
        :node="node"
        :name="node.name"
        :description="node.description"
        @update:isDataOpen="(isOpen) => emit('update:isNodeDataOpen', isOpen)"
        @update:isResultOpen="(isOpen) => emit('update:isNodeResultOpen', isOpen)"
      />

      <!-- Events -->
      <FlowEditorPanelEvents
        v-else-if="selectedTab === 'logs'"
        v-model:isEventsOpen="isEventsOpen"
        :events="events"
        @clear="() => emit('eventsClear')"
      />
    </div>
  </div>
</template>

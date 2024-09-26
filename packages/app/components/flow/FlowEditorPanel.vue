<script setup lang="ts">
import type { FlowNodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  name: string
  description: string
  methods: string[]
  secrets: Array<{ name: string }>
  variables: Array<{ name: string; value: string }>
  nodeSelected: FlowNodeInstanceJSON[]
  isOpen: boolean
  isFlowMethodsOpen: boolean
  isFlowSecretsOpen: boolean
  isFlowVariablesOpen: boolean
}>()

const emit = defineEmits<{
  'update:name': [name: string]
  'update:description': [description: string]
  'update:methods': [methods: string[]]
  'update:isOpen': [isOpen: boolean]
  'update:isFlowMethodsOpen': [isOpen: boolean]
  'update:isFlowSecretsOpen': [isOpen: boolean]
  'update:isFlowVariablesOpen': [isOpen: boolean]
  variableCreate: [name: string, value: string]
  variableUpdate: [name: string, value: string]
  variableRemove: [name: string]
  secretCreate: [name: string, value: string]
  secretUpdate: [name: string, value: string]
  secretRemove: [name: string]
}>()

// --- Two-way binding
const title = useVModel(props, 'name', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })
const methods = useVModel(props, 'methods', emit, { passive: true })
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const isFlowMethodsOpen = useVModel(props, 'isFlowMethodsOpen', emit, { passive: true })
const isFlowSecretsOpen = useVModel(props, 'isFlowSecretsOpen', emit, { passive: true })
const isFlowVariablesOpen = useVModel(props, 'isFlowVariablesOpen', emit, { passive: true })

// --- Compute tabs based on selected node.
const selectedTab = ref('flow')
const tabs = computed(() => {
  const nodeSelected = props.nodeSelected ?? []
  const tabs = [{ label: 'Logs', id: 'logs' }]
  if (nodeSelected.length > 0) tabs.unshift({ label: 'Node', id: 'node' })
  else tabs.unshift({ label: 'Settings', id: 'flow' })
  return tabs
})

// --- Get the selected node if only one is selected.
const node = computed(() => {
  if (!props.nodeSelected) return
  if (props.nodeSelected.length === 1) return props.nodeSelected[0]
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
      flex flex-col w-96 max-h-full
      bg-primary-50/60 rounded
      border border-black/10
      backdrop-blur-md
      overflow-hidden
    "
    @mousedown.stop>

    <!-- Tab selector -->
    <div class="flex gap-4 p-4">
      <BaseInputToggle
        v-for="tab in tabs"
        :key="tab.id"
        v-model="selectedTab"
        :value="tab.id"
        eager
        as="div"
        type="radio"
        class="
          cursor-pointer
          px-4 py-2 rounded font-medium
          transition-all duration-100
          bg-primary-500
          selected:text-white

          bg-opacity-0
          hover:bg-opacity-10
          selected:bg-opacity-80
          hover:selected:bg-opacity-100
        ">
        {{ tab.label }}
      </BaseInputToggle>
    </div>

    <!-- Flow settings -->
    <FlowEditorPanelFlow
      v-if="selectedTab === 'flow'"
      v-model:name="name"
      v-model:description="description"
      v-model:methods="methods"
      v-model:isMethodsOpen="isFlowMethodsOpen"
      v-model:isSecretsOpen="isFlowSecretsOpen"
      v-model:isVariablesOpen="isFlowVariablesOpen"
      :secrets="props.secrets"
      :variables="props.variables"
    />

    <!-- Selected node settings -->
    <!--
      <FlowEditorPanelNode
      v-else-if="selectedTab === 'node' && node"
      :node="node"
      />
    -->
  </div>
</template>

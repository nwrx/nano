<script setup lang="ts">
import type {
  FlowCategoryNodesJSON,
  FlowSessionEventPayload,
  FlowSessionParticipantJSON,
  FlowSessionSecretJSON,
  FlowSessionVariableJSON,
  NodeInstanceJSON,
} from '@nwrx/api'
import { throttle } from '@unshared/functions/throttle'
import PATTERN_EDITOR_URL from '~/assets/pattern-editor.svg'

const props = defineProps<{
  peerId: string
  peers: FlowSessionParticipantJSON[]
  name: string
  icon: string
  description: string
  nodes: NodeInstanceJSON[]
  categories: FlowCategoryNodesJSON[]
  methods: string[]
  secrets: FlowSessionSecretJSON[]
  variables: FlowSessionVariableJSON[]
  events: FlowSessionEventPayload[]
  isLocked: boolean
  isRunning: boolean
  isBookmarked: boolean
  isPanelOpen?: boolean
  isPanelFlowMethodsOpen?: boolean
  isPanelFlowSecretsOpen?: boolean
  isPanelFlowEnvironmentsOpen?: boolean
  isPanelNodeDataOpen?: boolean
  isPanelNodeResultOpen?: boolean
}>()

const emit = defineEmits<{

  // --- Flow.
  start: [Record<string, string>]
  abort: []
  setName: [name: string]
  setMethods: [methods: string[]]
  setDescription: [description: string]
  secretCreate: [name: string, value: string]
  secretRemove: [name: string]
  variableCreate: [name: string, value: string]
  variableUpdate: [name: string, value: string]
  variableRemove: [name: string]

  // --- Nodes.
  nodeStart: [id: string]
  nodeAbort: [id: string]
  nodeCreate: [kind: string, x: number, y: number]
  nodeDuplicate: [id: string, x: number, y: number]
  nodeSetDataValue: [id: string, key: string, value: unknown]
  nodeSearchDataOptions: [id: string, key: string, query: string]
  nodesMove: [payload: FlowNodePosition[]]
  nodesRemove: [ids: string[]]

  // --- Links.
  linkCreate: [source: string, target: string]
  linkRemove: [source: string]

  // --- User.
  userSetPosition: [x: number, y: number]

  // --- Events.
  eventsClear: []

  // --- UI state.
  'update:isPanelFlowMethodsOpen': [isOpen: boolean]
  'update:isPanelFlowSecretsOpen': [isOpen: boolean]
  'update:isPanelFlowEnvironmentsOpen': [isOpen: boolean]
  'update:isPanelNodeDataOpen': [isOpen: boolean]
  'update:isPanelNodeResultOpen': [isOpen: boolean]
}>()

// --- Two-way binding.
const isPanelOpen = useVModel(props, 'isPanelOpen', emit, { passive: true })
const isPanelFlowMethodsOpen = useVModel(props, 'isPanelFlowMethodsOpen', emit, { passive: true })
const isPanelFlowSecretsOpen = useVModel(props, 'isPanelFlowSecretsOpen', emit, { passive: true })
const isPanelFlowEnvironmentsOpen = useVModel(props, 'isPanelFlowEnvironmentsOpen', emit, { passive: true })
const isPanelNodeDataOpen = useVModel(props, 'isPanelNodeDataOpen', emit, { passive: true })
const isPanelNodeResultOpen = useVModel(props, 'isPanelNodeResultOpen', emit, { passive: true })

// --- Instanciate all composition functions from the FlowEditor component.
// --- The entire view logic is encapsulated in this composition function.
const editor = useFlowEditor({
  viewSize: 10e4,

  // Data
  nodes: computed(() => props.nodes),
  peers: computed(() => props.peers),
  peerId: computed(() => props.peerId),

  // Handlers
  onNodeCreate: (kind, x, y) => emit('nodeCreate', kind, x, y),
  onNodeDuplicate: (nodeId, x, y) => emit('nodeDuplicate', nodeId, x, y),
  onNodesRemove: ids => emit('nodesRemove', ids),
  onLinkCreate: (source, target) => emit('linkCreate', source, target),
  onLinkRemove: id => emit('linkRemove', id),
  onNodesMove: throttle((payload: FlowNodePosition[]) => emit('nodesMove', payload), 50),
  onUserSetPosition: throttle((x: number, y: number) => emit('userSetPosition', x, y), 50),
})
</script>

<template>
  <div
    :ref="(el) => editor.viewContainer = el as HTMLDivElement"
    tabindex="0"
    disabled
    :style="editor.viewContainerStyle"
    class="w-full h-full bg-editor select-none relative overflow-hidden z-0 select-none transform-gpu"
    @drop="(event) => editor.onScreenDrop(event)"
    @mouseup="() => editor.onScreenMouseUp()"
    @mousemove="(event) => editor.onScreenMouseMove(event)"
    @mousedown="(event) => editor.onScreenMouseDown(event)"
    @keydown="(event) => editor.onScreenKeyDown(event)"
    @wheel="(event) => editor.onScreenWheel(event)">

    <!-- Selector box -->
    <div
      v-if="editor.viewSelecting"
      :style="editor.viewSelectorStyle"
      class="absolute border-2 border-editor-select border-dashed rounded bg-editor-select z-9999"
    />

    <!-- View -->
    <div
      :ref="(el) => editor.view = (el as HTMLDivElement)"
      :style="editor.viewStyle"
      @dragover.prevent
      @dragenter.prevent
      @contextmenu.prevent>

      <!-- Pattern -->
      <div
        class="absolute top-0 left-0 right-0 bottom-0 dark:op-5 op-10 dark:invert"
        :style="{
          backgroundImage: `url(${PATTERN_EDITOR_URL})`,
          backgroundSize: '60px',
          backgroundRepeat: 'repeat',
        }"
      />

      <!-- Peer Cursors -->
      <FlowEditorPeer
        v-for="peer in editor.cursorPeers"
        :key="peer.id"
        :style="editor.getPeerStyle(peer)"
        :name="peer.name"
        :color="peer.color"
        :zoom="editor.viewZoom"
      />

      <!-- Nodes -->
      <FlowEditorNode
        v-for="node in nodes"
        :ref="(el) => editor.nodeComponents[node.id] = (el as ComponentPublicInstance)"
        :key="node.id"
        :secrets="secrets"
        :variables="variables"
        :style="editor.getNodeStyle(node)"
        :zoom="editor.viewZoom"
        :is-dragging="editor.nodeDragging"
        :is-selected="editor.isNodeSelected(node.id)"
        :is-highlighted="false"
        v-bind="node"
        @start="() => emit('nodeStart', node.id)"
        @abort="() => emit('nodeAbort', node.id)"
        @click="(event) => editor.onNodeClick(event, node.id)"
        @set-data-value="(key, value) => emit('nodeSetDataValue', node.id, key, value)"
        @search-data-options="(key, query) => emit('nodeSearchDataOptions', node.id, key, query)"
        @handle-grab="(event) => editor.onNodeHandleGrab(event, node.id)"
        @handle-release="() => editor.onNodeHandleRelease()"
        @port-grab="(state) => editor.onNodePortGrab(state)"
        @port-assign="(state) => editor.onNodePortAssign(state)"
        @port-release="() => editor.onNodePortRelease()"
      />

      <!-- Links -->
      <FlowEditorLink
        v-for="(link, index) in editor.linksProps"
        :key="index"
        v-bind="link"
        class="absolute z-0 pointer-events-none"
        :zoom="editor.viewZoom"
      />

      <!-- Active Link -->
      <FlowEditorLink
        v-if="editor.linkDragProps"
        v-bind="editor.linkDragProps"
        class="absolute z-1000 pointer-events-none"
        :zoom="editor.viewZoom"
      />
    </div>

    <!-- Overlay -->
    <div class="absolute top-0 left-0 h-full w-full z-1000 pointer-events-none p-md">
      <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-md w-full h-full" @wheel.stop>

        <!-- Toolbar -->
        <FlowEditorToolbar
          class="pointer-events-auto justify-self-start"
          :name="name"
          :is-running="isRunning"
          @start="() => emit('start', {})"
          @abort="() => emit('abort')"
          @mousedown.stop
        />

        <!-- Panel -->
        <FlowEditorPanel
          v-model:is-open="isPanelOpen"
          v-model:is-flow-methods-open="isPanelFlowMethodsOpen"
          v-model:is-flow-secrets-open="isPanelFlowSecretsOpen"
          v-model:is-flow-variables-open="isPanelFlowEnvironmentsOpen"
          v-model:is-node-data-open="isPanelNodeDataOpen"
          v-model:is-node-result-open="isPanelNodeResultOpen"
          class="pointer-events-auto row-span-2 justify-self-end h-full"
          :name="name"
          :methods="methods"
          :secrets="secrets"
          :variables="variables"
          :description="description"
          :node-selected="editor.nodeSelected"
          :events="events"
          :nodes="nodes"
          @start="(input) => emit('start', input)"
          @set-name="(name) => emit('setName', name)"
          @set-methods="(methods) => emit('setMethods', methods)"
          @set-description="(description) => emit('setDescription', description)"
          @set-node-data-value="(nodeId, key, value) => emit('nodeSetDataValue', nodeId, key, value)"
          @secret-create="(name, value) => emit('secretCreate', name, value)"
          @secret-remove="(name) => emit('secretRemove', name)"
          @variable-create="(name, value) => emit('variableCreate', name, value)"
          @variable-update="(name, value) => emit('variableUpdate', name, value)"
          @variable-remove="(name) => emit('variableRemove', name)"
          @events-clear="() => emit('eventsClear')"
          @mousedown.stop
        />

        <!-- Drawer -->
        <FlowEditorDrawer
          :categories="categories"
          class="pointer-events-auto self-start justify-self-start"
          @mousedown.stop
        />
      </div>
    </div>
  </div>
</template>

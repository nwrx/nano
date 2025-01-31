<script setup lang="ts">
import type { FlowCategoryNodesJSON, FlowNodeInstanceJSON, FlowSessionEventPayload, FlowSessionParticipantJSON, FlowSessionSecretJSON, FlowSessionVariableJSON } from '@nwrx/api'
import { throttle } from '@unshared/functions/throttle'
import PATTERN_EDITOR_URL from '~/assets/pattern-editor.svg'

const props = defineProps<{
  peerId: string
  peers: FlowSessionParticipantJSON[]
  name: string
  icon: string
  description: string
  nodes: FlowNodeInstanceJSON[]
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
  run: []
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
  nodeDuplicate: [nodeId: string, x: number, y: number]
  nodeSetDataValue: [nodeId: string, key: string, value: unknown]
  nodesMove: [payload: FlowNodePosition[]]
  nodesRemove: [nodeIds: string[]]

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
    class="w-full h-full bg-editor select-none relative overflow-hidden z-0 select-none"
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
        class="absolute top-0 left-0 right-0 bottom-0 dark:op-5 op-20 dark:invert"
        :style="{
          backgroundImage: `url(${PATTERN_EDITOR_URL})`,
          backgroundSize: '60px',
          backgroundRepeat: 'repeat',
        }"
      />

      <!-- Cursors -->
      <FlowEditorPeer
        v-for="peer in editor.cursorPeers"
        :style="editor.getPeerStyle(peer)"
        :name="peer.name"
        :color="peer.color"
        :zoom="editor.viewZoom"
      />

      <!-- Nodes -->
      <FlowEditorNode
        v-for="node in nodes"
        :id="node.id"
        :ref="(el) => editor.nodeComponents[node.id] = (el as ComponentPublicInstance)"
        :key="node.id"
        :data="node.data"
        :result="node.result"
        :name="node.name ?? node.kind"
        :secrets="secrets"
        :variables="variables"
        :icon="node.icon"
        :color="node.categoryColor"
        :dataSchema="node.dataSchema"
        :resultSchema="node.resultSchema"
        :position="node.position"
        :error="node.error"
        :style="editor.getNodeStyle(node)"
        :zoom="editor.viewZoom"
        :isRunning="node.isRunning"
        :isCollapsed="node.isCollapsed"
        :isDragging="editor.nodeDragging"
        :isSelected="editor.isNodeSelected(node.id)"
        @run="() => emit('nodeStart', node.id)"
        @abort="() => emit('nodeAbort', node.id)"
        @click="(event) => editor.onNodeClick(event, node.id)"
        @setDataValue="(key, value) => emit('nodeSetDataValue', node.id, key, value)"
        @handleGrab="(event) => editor.onNodeHandleGrab(event, node.id)"
        @handleRelease="() => editor.onNodeHandleRelease()"
        @portGrab="(state) => editor.onNodePortGrab(state)"
        @portAssign="(state) => editor.onNodePortAssign(state)"
        @portRelease="() => editor.onNodePortRelease()"
      />

      <!-- Links -->
      <FlowEditorLink
        v-for="(link, index) in editor.linksProps"
        :key="index"
        v-bind="link"
        class="absolute z-9999 pointer-events-none"
        :zoom="editor.viewZoom"
      />

      <!-- Link used to drag from one node to another. -->
      <FlowEditorLink
        v-if="editor.linkDragProps"
        v-bind="editor.linkDragProps"
        class="absolute z-9999 pointer-events-none"
        :zoom="editor.viewZoom"
      />
    </div>

    <!-- Overlay -->
    <div
      class="absolute top-md left-md bottom-md right-md z-9999 pointer-events-none children:pointer-events-auto"
      @wheel.stop>

      <!-- Toolbar -->
      <FlowEditorToolbar
        :name="name"
        :isRunning="isRunning"
        class="absolute top-0 left-0"
        @run="() => emit('run')"
        @abort="() => emit('abort')"
      />

      <!-- Edit panel -->
      <div class="absolute top-0 right-0 bottom-0 pointer-events-none">
        <FlowEditorPanel
          v-model:isOpen="isPanelOpen"
          v-model:isFlowMethodsOpen="isPanelFlowMethodsOpen"
          v-model:isFlowSecretsOpen="isPanelFlowSecretsOpen"
          v-model:isFlowVariablesOpen="isPanelFlowEnvironmentsOpen"
          v-model:isNodeDataOpen="isPanelNodeDataOpen"
          v-model:isNodeResultOpen="isPanelNodeResultOpen"
          :name="name"
          :methods="methods"
          :secrets="secrets"
          :variables="variables"
          :description="description"
          :nodeSelected="editor.nodeSelected"
          :events="events"
          class="pointer-events-auto"
          @setName="(name) => emit('setName', name)"
          @setMethods="(methods) => emit('setMethods', methods)"
          @setDescription="(description) => emit('setDescription', description)"
          @secretCreate="(name, value) => emit('secretCreate', name, value)"
          @secretRemove="(name) => emit('secretRemove', name)"
          @variableCreate="(name, value) => emit('variableCreate', name, value)"
          @variableUpdate="(name, value) => emit('variableUpdate', name, value)"
          @variableRemove="(name) => emit('variableRemove', name)"
          @eventsClear="() => emit('eventsClear')"
        />
      </div>

      <!-- Drawer -->
      <FlowEditorDrawer
        :categories="categories"
        class="absolute bottom-0 left-0"
      />
    </div>
  </div>
</template>

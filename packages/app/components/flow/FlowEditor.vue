<script setup lang="ts">
import type { FlowCategoryNodesJSON, FlowNodeInstanceJSON, FlowSessionParticipantJSON } from '@nwrx/api'
import type { FlowLink } from '@nwrx/core'
import { throttle } from '@unshared/functions/throttle'

const props = defineProps<{
  peerId: string
  peers: FlowSessionParticipantJSON[]
  name: string
  icon: string
  description: string
  links: FlowLink[]
  nodes: FlowNodeInstanceJSON[]
  categories: FlowCategoryNodesJSON[]
  methods: string[]
  secrets: string[]
  variables: Array<{ name: string; value: string }>
  projectSecrets: string[]
  projectVariables: Array<{ name: string; value: string }>
  isLocked: boolean
  isRunning: boolean
  isBookmarked: boolean
  isPanelOpen: boolean
  isPanelFlowMethodsOpen: boolean
  isPanelFlowSecretsOpen: boolean
  isPanelFlowEnvironmentsOpen: boolean
}>()

const emit = defineEmits<{
  run: []
  abort: []
  nodeStart: [id: string]
  nodeAbort: [id: string]
  nodeCreate: [kind: string, x: number, y: number]
  nodeDuplicate: [nodeId: string, x: number, y: number]
  nodeSetDataValue: [nodeId: string, key: string, value: unknown]
  nodesMove: [payload: FlowNodePosition[]]
  nodesRemove: [nodeIds: string[]]
  linkCreate: [source: string, target: string]
  linkRemove: [source: string]
  userSetPosition: [x: number, y: number]
  'update:name': [name: string]
  'update:description': [description: string]
  'update:isPanelOpen': [isOpen: boolean]
  'update:isPanelFlowMethodsOpen': [isOpen: boolean]
  'update:isPanelFlowSecretsOpen': [isOpen: boolean]
  'update:isPanelFlowEnvironmentsOpen': [isOpen: boolean]
}>()

// --- Two-way binding.
const title = useVModel(props, 'name', emit, { passive: true })
const methods = useVModel(props, 'methods', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })
const isPanelOpen = useVModel(props, 'isPanelOpen', emit, { passive: true })
const isPanelFlowMethodsOpen = useVModel(props, 'isPanelFlowMethodsOpen', emit, { passive: true })
const isPanelFlowSecretsOpen = useVModel(props, 'isPanelFlowSecretsOpen', emit, { passive: true })
const isPanelFlowEnvironmentsOpen = useVModel(props, 'isPanelFlowEnvironmentsOpen', emit, { passive: true })

// --- Instanciate all composition functions from the FlowEditor component.
// --- The entire view logic is encapsulated in this composition function.
const editor = useFlowEditor({
  viewSize: 10e4,

  // Data
  nodes: computed(() => props.nodes),
  links: computed(() => props.links),
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
    class="w-full h-full select-none relative overflow-hidden z-0 bg-white select-none"
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
      class="absolute border-3 border-primary-500 border-dashed rounded bg-primary-500/10 z-9999"
    />

    <!-- View -->
    <div
      :ref="(el) => editor.view = el as HTMLDivElement"
      :style="editor.viewStyle"
      class="bg-graphpaper-primary-100"
      @dragover.prevent
      @dragenter.prevent
      @contextmenu.prevent>

      <!-- Cursors -->
      <FlowEditorPeer
        v-for="peer in editor.cursorPeers"
        :style="editor.getPeerStyle(peer)"
        name="John Doe"
        color="blue"
        :zoom="editor.viewZoom"
      />

      <!-- Nodes -->
      <FlowEditorNode
        v-for="node in nodes"
        :id="node.id"
        :ref="(el) => editor.nodeComponents[node.id] = el as ComponentPublicInstance"
        :key="node.id"
        :data="node.data"
        :result="node.result"
        :name="node.name ?? node.kind"
        :icon="node.icon"
        :color="node.categoryColor"
        :dataSchema="node.dataSchema"
        :resultSchema="node.resultSchema"
        :position="node.position"
        :style="editor.getNodeStyle(node)"
        :links="links"
        :zoom="editor.viewZoom"
        :isRunning="node.isRunning"
        :isCollapsed="node.isCollapsed"
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
    <div class="absolute top-4 left-4 bottom-4 right-4 z-9999 pointer-events-none children:pointer-events-auto">

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
          v-model:name="name"
          v-model:description="description"
          v-model:methods="methods"
          v-model:isOpen="isPanelOpen"
          v-model:isFlowMethodsOpen="isPanelFlowMethodsOpen"
          v-model:isFlowSecretsOpen="isPanelFlowSecretsOpen"
          v-model:isFlowVariablesOpen="isPanelFlowEnvironmentsOpen"
          class="pointer-events-auto"
          :secrets="secrets"
          :variables="variables"
          :nodeSelected="editor.nodeSelected"
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

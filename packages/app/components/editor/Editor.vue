<script setup lang="ts">
import type { FlowJSON } from '@nwrx/api'
import { throttle } from '@unshared/functions/throttle'
import PATTERN_EDITOR_URL from '~/assets/pattern-editor.svg'

const props = defineProps<Partial<FlowJSON>>()

const emit = defineEmits<{
  clearEvents: []

  // Run
  start: [Record<string, string>]
  abort: []
  startNode: [string]
  abortNode: [string]

  // Flow
  setName: [string]
  setDescription: [string]

  // Secrets & Variables
  createSecret: [string, string]
  // updateSecret: [string, string]
  removeSecret: [string]
  createVariable: [string, string]
  updateVariable: [string, string]
  removeVariable: [string]

  // Nodes
  createNode: [string, number, number]
  cloneNodes: [string, number, number]
  setNodesPosition: [FlowNodePosition[]]
  setNodeLabel: [string, string]
  setNodeComment: [string, string]
  setNodeInputValue: [string, string, unknown]
  getNodeInputOptions: [string, string, string | undefined]
  removeNodes: [string[]]

  // Links
  createLink: [string, string]
  removeLink: [string]

  // User
  setUserPosition: [number, number]
}>()

const editor = useFlowEditor({
  viewSize: 10e4,
  nodes: computed(() => props.nodes ?? []),
  peers: computed(() => props.peers ?? []),
  peerId: computed(() => props.peerId ?? '0'),
  onNodeCreate: (kind, x, y) => emit('createNode', kind, x, y),
  onNodeDuplicate: (id, x, y) => emit('cloneNodes', id, x, y),
  onNodesRemove: ids => emit('removeNodes', ids),
  onNodesSetPosition: throttle((positions: FlowNodePosition[]) => emit('setNodesPosition', positions), 50),
  onLinkCreate: (source, target) => emit('createLink', source, target),
  onLinkRemove: sourceOrTarget => emit('removeLink', sourceOrTarget),
  onUserSetPosition: throttle((x: number, y: number) => emit('setUserPosition', x, y), 50),
})
</script>

<template>
  <div
    :ref="(el) => editor.viewContainer = (el as HTMLDivElement)"
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
      <EditorPeer
        v-for="peer in editor.cursorPeers"
        :key="peer.id"
        :style="editor.getPeerStyle(peer)"
        :name="peer.name"
        :color="peer.color"
        :zoom="editor.viewZoom"
      />

      <!-- Nodes -->
      <EditorNode
        v-for="node in nodes"
        :key="node.id"
        :ref="(el) => editor.nodeComponents[node.id] = (el as ComponentPublicInstance)"
        v-bind="node"
        :secrets="secrets"
        :variables="variables"
        :style="editor.getNodeStyle(node)"
        :zoom="editor.viewZoom"
        :is-dragging="editor.nodeDragging"
        :is-selected="editor.isNodeSelected(node.id)"
        :is-highlighted="false"
        @start="() => emit('startNode', node.id)"
        @abort="() => emit('abortNode', node.id)"
        @click="(event) => editor.onNodeClick(event, node.id)"
        @set-input-value="(key, value) => emit('setNodeInputValue', node.id, key, value)"
        @get-input-options="(key, query) => emit('getNodeInputOptions', node.id, key, query)"
        @handle-grab="(event) => editor.onNodeHandleGrab(event, node.id)"
        @handle-release="() => editor.onNodeHandleRelease()"
        @link-grab="(state) => editor.onLinkGrab(state)"
        @link-assign="(state) => editor.onLinkAssign(state)"
        @link-release="() => editor.onLinkRelease()"
      />

      <!-- Links -->
      <EditorLink
        v-for="(link, index) in editor.linksProps"
        :key="index"
        v-bind="link"
        class="absolute z-0 pointer-events-none"
        :zoom="editor.viewZoom"
      />

      <!-- Active Link -->
      <EditorLink
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
        <EditorToolbar
          class="pointer-events-auto justify-self-start"
          :name="name"
          :is-running="isRunning"
          @start="() => emit('start', {})"
          @abort="() => emit('abort')"
          @mousedown.stop
        />

        <!-- Panel -->
        <EditorPanel
          v-model:is-open="editor.isPanelOpen"
          v-model:is-resizing="editor.isPanelResizing"
          v-model:is-secrets-open="editor.isPanelSecretsOpen"
          v-model:is-variables-open="editor.isPanelVariablesOpen"
          v-model:is-node-input-open="editor.isPanelNodeInputOpen"
          v-model:is-node-output-open="editor.isPanelNodeOutputOpen"
          :width="editor.panelWidth"

          :name="name"
          :secrets="secrets"
          :variables="variables"
          :description="description"
          :node-selected="editor.nodeSelected"
          :events="events"
          :nodes="nodes"

          class="pointer-events-auto row-span-2 justify-self-end h-full"

          @start="(input) => emit('start', input)"
          @set-name="(name) => emit('setName', name)"
          @set-description="(description) => emit('setDescription', description)"

          @set-node-label="(id, label) => emit('setNodeLabel', id, label)"
          @set-node-comment="(id, comment) => emit('setNodeComment', id, comment)"
          @set-node-input-value="(id, key, value) => emit('setNodeInputValue', id, key, value)"

          @secret-create="(name, value) => emit('createSecret', name, value)"
          @secret-remove="(name) => emit('removeSecret', name)"
          @variable-create="(name, value) => emit('createVariable', name, value)"
          @variable-update="(name, value) => emit('updateVariable', name, value)"
          @variable-remove="(name) => emit('removeVariable', name)"
          @events-clear="() => emit('clearEvents')"
          @mousedown.stop
        />

        <!-- Drawer -->
        <EditorDrawer
          :categories="categories"
          class="pointer-events-auto self-start justify-self-start"
          @mousedown.stop
        />

        <!-- Console -->
        <EditorConsole
          :events="events"
          class="pointer-events-auto select-auto col-span-2"
          @clear="() => emit('clearEvents')"
          @mousedown.stop
        />
      </div>
    </div>
  </div>
</template>

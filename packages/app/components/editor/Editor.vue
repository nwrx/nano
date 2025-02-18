<script setup lang="ts">
import type { SocketListOption } from '@nwrx/nano'
import type { EditorSessionJSON, LinkJSON } from '@nwrx/nano-api'
import { throttle } from '@unshared/functions/throttle'
import PATTERN_EDITOR_URL from '~/assets/pattern-editor.svg?no-inline'

const props = defineProps<Partial<EditorSessionJSON> & {
  getOptions?: (id: string, key: string, query: string) => Promise<SocketListOption[]>
}>()

const emit = defineEmits<{
  clearEvents: []
  start: [Record<string, string>]
  abort: []
  startNode: [string]
  abortNode: [string]
  setName: [string]
  setDescription: [string]
  createSecret: [string, string]
  // updateSecret: [string, string]
  removeSecret: [string]
  createVariable: [string, string]
  updateVariable: [string, string]
  removeVariable: [string]
  createNode: [string, number, number]
  cloneNodes: [string, number, number]
  setNodesPosition: [FlowNodePosition[]]
  setNodeLabel: [string, string]
  setNodeComment: [string, string]
  setNodeInputValue: [string, string, unknown]
  getNodeInputOptions: [string, string, string | undefined]
  setNodeSocketVisibility: [string, string, boolean]
  removeNodes: [string[]]
  createLink: [LinkJSON, LinkJSON]
  removeLink: [LinkJSON]
  setUserPosition: [number, number]
}>()

const settings = useLocalSettings()
const panelWidth = computed({
  get: () => settings.value.editorPanelWidth,
  set: value => settings.value.editorPanelWidth = value,
})

const editor = useFlowEditorView({
  viewSize: 10e4,
  panelWidth: panelWidth as Ref<number>,
  nodes: computed(() => props.nodes ?? []),
  peers: computed(() => props.peers ?? []),
  peerId: computed(() => props.peerId ?? '0'),
  onNodeCreate: (kind, x, y) => emit('createNode', kind, x, y),
  onNodeDuplicate: (id, x, y) => emit('cloneNodes', id, x, y),
  onNodesRemove: ids => emit('removeNodes', ids),
  onNodesSetPosition: throttle((positions: FlowNodePosition[]) => emit('setNodesPosition', positions), 50),
  onLinkCreate: (from, to) => emit('createLink', from, to),
  onLinkRemove: link => emit('removeLink', link),
  onUserSetPosition: throttle((x: number, y: number) => emit('setUserPosition', x, y), 50),
})
</script>

<template>
  <div
    id="editor"
    :ref="(el) => editor.viewContainer = (el as HTMLDivElement)"
    tabindex="0"
    disabled
    :style="editor.viewContainerStyle"
    class="w-full h-full bg-editor select-none relative overflow-hidden z-0 select-none transform-gpu"
    @mousemove="(event) => editor.onScreenMouseMove(event)"
    @mouseup="() => editor.onScreenMouseUp()"
    @keydown="(event) => editor.onScreenKeyDown(event)">

    <!-- Selector box -->
    <div
      v-if="editor.viewSelecting"
      :style="editor.viewSelectorStyle"
      class="absolute border-2 border-editor-select border-dashed rounded bg-editor-select z-800"
    />

    <!-- View -->
    <div
      :ref="(el) => editor.view = (el as HTMLDivElement)"
      :style="editor.viewStyle"
      @dragover.prevent
      @dragenter.prevent
      @contextmenu.prevent
      @drop="(event) => editor.onScreenDrop(event)"
      @mousedown="(event) => editor.onScreenMouseDown(event)"
      @wheel="(event) => editor.onScreenWheel(event)">

      <!-- Pattern -->
      <div
        class="absolute top-0 left-0 right-0 bottom-0 dark:op-10 op-10 dark:invert"
        :style="{
          backgroundImage: `url('${PATTERN_EDITOR_URL}')`,
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
        :get-options="getOptions ? (key, query) => getOptions!(node.id, key, query) : undefined"
        @start="() => emit('startNode', node.id)"
        @abort="() => emit('abortNode', node.id)"
        @click="(event) => editor.onNodeClick(event, node.id)"
        @set-input-value="(key, value) => emit('setNodeInputValue', node.id, key, value)"
        @get-input-options="(key, query) => emit('getNodeInputOptions', node.id, key, query)"
        @set-socket-visibility="(key, visible) => emit('setNodeSocketVisibility', node.id, key, visible)"
        @handle-grab="(event) => editor.onNodeHandleGrab(event, node.id)"
        @handle-release="() => editor.onNodeHandleRelease()"
        @link-grab="(link) => editor.onLinkGrab(link)"
        @link-assign="(link) => editor.onLinkAssign(link)"
        @link-unassign="() => editor.onLinkUnassign()"
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
      <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-md w-full h-full">

        <!-- Toolbar -->
        <EditorToolbar
          class="pointer-events-auto justify-self-start"
          :name="name"
          :is-running="isRunning"
          @start="() => emit('start', {})"
          @abort="() => emit('abort')"
        />

        <!-- Panel -->
        <EditorPanel
          v-model:is-open="settings.editorPanelOpen"
          v-model:is-resizing="editor.isPanelResizing"
          v-model:is-secrets-open="settings.editorPanelSecretsOpen"
          v-model:is-variables-open="settings.editorPanelVariablesOpen"
          v-model:is-node-input-open="settings.editorPanelNodeInputOpen"
          v-model:is-node-output-open="settings.editorPanelNodeOutputOpen"
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
          @clear-events="() => emit('clearEvents')"
        />

        <!-- Drawer -->
        <EditorDrawer
          :categories="categories"
          class="pointer-events-auto self-start justify-self-start"
        />

        <!-- Console -->
        <!--
          <EditorConsole
          class="pointer-events-auto select-auto col-span-2"
          @clear="() => emit('clearEvents')"
          @mousedown.stop>
          {{ editor.linkDragFrom }}
          {{ editor.linkDragTo }}
          </EditorConsole>
        -->
      </div>
    </div>
  </div>
</template>

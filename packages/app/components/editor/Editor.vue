<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { Link, ThreadInputObject } from '@nwrx/nano'
import type {
  Editor,
  EditorSessionClientMessage,
  EditorSessionServerMessage,
  FlowObject,
} from '@nwrx/nano-api'
import type { ThreadServerMessage } from '@nwrx/nano-runner'
import type { SchemaOption } from '@nwrx/nano/utils'
import { useEditorView } from '~/composables/useEditor'
import EditorConsole from '../editorConsole/EditorConsole.vue'
import EditorDrawer from '../editorDrawer/EditorDrawer.vue'
import EditorNode from '../editorNode/EditorNode.vue'
import EditorPanel from '../editorPanel/EditorPanel.vue'
import EditorBackground from './EditorBackground.vue'
import EditorLink from './EditorLink.vue'
import EditorPeer from './EditorParticipant.vue'
import EditorSelection from './EditorSelection.vue'
import EditorToolbar from './EditorToolbar.vue'

const props = withDefaults(
  defineProps<{
    flow?: FlowObject
    nodes?: Editor.NodeObject[]
    participants?: Editor.ParticipantObject[]
    components: Editor.ComponentObject[]
    componentGroups?: Editor.ComponentGroup[]
    messagesClient?: EditorSessionClientMessage[]
    messagesServer?: EditorSessionServerMessage[]
    messagesThread?: ThreadServerMessage[]
    searchOptions?: (id: string, name: string, query: string) => Promise<SchemaOption[]>
    getFlowExport?: (format?: 'json' | 'yaml') => Promise<string>
  }>(),
  {
    flow: () => ({ name: '', title: '' }),
    nodes: () => [],
    participants: () => [],
    messagesClient: () => [],
    messagesServer: () => [],
    messagesThread: () => [],
    searchOptions: () => Promise.resolve([]),
    getFlowExport: () => Promise.resolve(''),
  },
)

const emit = defineEmits<{
  'metadataUpdate': [name: string, value: unknown]

  // Nodes
  'nodesCreate': Array<{ specifier: string; x: number; y: number }>
  'nodesClone': Array<{ ids: string[]; origin: { x: number; y: number } }>
  'nodesRemove': string[]
  'nodesMetadataUpdate': Array<{ id: string; name: string; value: unknown }>
  'nodesInputUpdate': Array<{ id: string; name: string; value: unknown }>
  'nodesLinksCreate': Link[]
  'nodesLinksRemove': Link[]

  // 'clearMessagesServer': []
  // 'clearMessagesClient': []
  // 'startThread': [ThreadInputObject]
}>()

const view = useEditorView({
  nodes: computed(() => props.nodes ?? []),
  components: computed(() => props.components ?? []),
  componentGroups: computed(() => props.componentGroups ?? []),
  handleNodesClone: (...values) => emit('nodesClone', ...values),
  handleNodesCreate: (...values) => emit('nodesCreate', ...values),
  handleNodesRemove: (...values) => emit('nodesRemove', ...values),
  handleNodesLinksCreate: (...values) => emit('nodesLinksCreate', ...values),
  handleNodesLinksRemove: (...values) => emit('nodesLinksRemove', ...values),
  handleNodesMetadataUpdate: (...values) => emit('nodesMetadataUpdate', ...values),
})

function getNodeComponent(node: Editor.NodeObject): Editor.ComponentObject | undefined {
  if (!props.components) return
  return props.components.find(component => component.name === node.specifier)
}
</script>

<template>
  <div
    :ref="view.setViewContainer"
    tabindex="0"
    disabled
    :style="view.viewContainerStyle"
    class="w-full h-full bg-editor select-none relative overflow-hidden z-0 select-none transform-gpu translate-z-0"
    @mousemove="(event) => view.onScreenMouseMove(event)"
    @mouseup="(event) => view.onScreenMouseUp(event)"
    @keydown="(event) => view.onScreenKeyDown(event)"
    @keyup="(event) => view.onScreenKeyUp(event)">

    <!-- Selector box -->
    <EditorSelection
      v-if="view.viewSelecting"
      :style="view.viewSelectorStyle"
    />

    <!-- View -->
    <div
      :ref="view.setView"
      :style="view.viewStyle"
      @dragover.prevent
      @dragenter.prevent
      @contextmenu.prevent
      @drop="(event) => view.onScreenDrop(event)"
      @wheel="(event) => view.onScreenWheel(event)"
      @mousedown="(event) => view.onScreenMouseDown(event)">

      <!-- Background -->
      <EditorBackground />

      <!-- Links between nodes -->
      <EditorLink
        v-for="(link, index) in view.linksProps"
        :key="index"
        v-bind="link"
        class="absolute z-0 pointer-events-none"
        :zoom="view.viewZoom"
      />

      <!-- Current user link -->
      <EditorLink
        v-if="view.linkDragProps"
        v-bind="view.linkDragProps"
        class="absolute z-1000 pointer-events-none"
        :zoom="view.viewZoom"
      />

      <!-- Peers -->
      <EditorPeer
        v-for="participant in participants"
        :key="participant.id"
        :zoom="view.viewZoom"
        :name="participant.name"
        :color="participant.color"
        :position="view.worldToView(participant.position)"
      />

      <!-- Nodes -->

      <EditorNode
        v-for="node in nodes"
        :ref="(el) => view.setViewNode(node.id, el)"
        :key="node.id"
        :style=" view.getNodeStyle(node)"
        :style-header="view.getNodeHeaderStyle(node)"
        :node="node"
        :component="getNodeComponent(node)"
        :search-options="async(name, query) => searchOptions(node.id, name, query)"
        @release="() => view.onNodeHandleRelease()"
        @grab="(event) => view.onNodeHandleGrab(event, node.id)"
        @input-update="(name, value) => emit('nodesInputUpdate', { id: node.id, name, value })"
        @input-grab="(name, path) => view.onInputGrab(node.id, name, path)"
        @input-assign="(name, path) => view.onInputAssign(node.id, name, path)"
        @input-unassign="() => view.onInputUnassign()"
        @output-grab="(name, path) => view.onOutputGrab(node.id, name, path)"
        @output-assign="(name, path) => view.onOutputAssign(node.id, name, path)"
        @output-unassign="() => view.onOutputUnassign()"
      />

    </div>

    <!-- Overlay -->
    <div class="absolute top-0 left-0 h-full w-full z-10 pointer-events-none p-md">
      <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto] gap-md w-full h-full">

        <!-- Toolbar -->
        <EditorToolbar
          :flow="flow"
          class="pointer-events-auto justify-self-start"
          :get-flow-export="getFlowExport"
        />

        <div />
        <!-- Panel -->
        <!--
          <EditorPanel
          v-model:is-panel-resizing="view.isPanelResizing"
          :flow="flow"
          :nodes="nodes"
          :panel-width="view.panelWidth"
          :selected-nodes="view.nodeSelected"
          :messages-thread="messagesThread"
          class="pointer-events-auto row-span-2 justify-self-end h-full"
          @panel-resize-start="() => view.isPanelResizing = true"
          @panel-resize-end="() => view.isPanelResizing = false"
          @set-metadata="({ name, value }) => emit('metadataUpdate', name, value)"
          @start-thread="(input) => emit('startThread', input)"
          />
        -->

        <!-- Drawer -->
        <EditorDrawer
          :components="components"
          :component-groups="componentGroups"
          class="pointer-events-auto self-start justify-self-start"
        />

        <!-- Console -->
        <!--
          <EditorConsole
          :view="view"
          :flow="flow"
          :nodes="nodes"
          :categories="components"
          :participants="participants"
          :messages-client="messagesClient"
          :messages-server="messagesServer"
          :messages-thread="messagesThread"
          class="pointer-events-auto col-span-2 self-end justify-self-end select-text"
          @syncronize="() => emit('requestReload')"
          @clear-messages-client="() => emit('clearMessagesClient')"
          @clear-messages-server="() => emit('clearMessagesServer')"
          />
        -->
      </div>
    </div>
  </div>
</template>

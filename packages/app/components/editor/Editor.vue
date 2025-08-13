<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { Editor, FlowObject } from '@nwrx/nano-api'
import type { Schema, SchemaOption } from '@nwrx/nano/utils'
import { useEditorView } from '~/composables/useEditor'
// import EditorConsole from '../editorConsole/EditorConsole.vue'
import EditorDrawer from '../editorDrawer/EditorDrawer.vue'
import EditorNode from '../editorNode/EditorNode.vue'
// import EditorPanelNode from '../editorPanel/ditorPanelNode.vue'
import EditorPanel from '../editorPanel/EditorPanel.vue'
import EditorPanelFlow from '../editorPanel/EditorPanelFlow.vue'
import EditorPanelPlayground from '../editorPanel/EditorPanelPlayground.vue'
import EditorBackground from './EditorBackground.vue'
import EditorLink from './EditorLink.vue'
import EditorPeer from './EditorParticipant.vue'
import EditorSelection from './EditorSelection.vue'
import EditorToolbar from './EditorToolbar.vue'

const props = withDefaults(
  defineProps<{
    workspace: string
    project: string
    flow: FlowObject
    nodes?: Editor.NodeObject[]
    components?: Editor.ComponentObject[]
    componentGroups?: Editor.ComponentGroup[]
    participants?: Editor.ParticipantObject[]
    requestExport?: (format: 'json' | 'yaml') => Promise<string>
    searchOptions?: (id: string, name: string, query: string) => Promise<SchemaOption[]>
    searchProperties?: (id: string, name: string, query: string) => Promise<Record<string, Schema>>
  }>(),
  {
    nodes: () => [],
    participants: () => [],
    components: () => [],
    componentGroups: () => [],
    requestExport: () => Promise.resolve(''),
    searchOptions: () => Promise.resolve([]),
    searchProperties: () => Promise.resolve({}),
  },
)

const emit = defineEmits<{
  'metadataUpdate': Editor.MessageClientDataByName<'metadata.update'>
  'nodesClone': Editor.MessageClientDataByName<'nodes.clone'>
  'nodesCreate': Editor.MessageClientDataByName<'nodes.create'>
  'nodesRemove': Editor.MessageClientDataByName<'nodes.remove'>
  'nodesInputUpdate': Editor.MessageClientDataByName<'nodes.input.update'>
  'nodesLinksCreate': Editor.MessageClientDataByName<'nodes.links.create'>
  'nodesLinksRemove': Editor.MessageClientDataByName<'nodes.links.remove'>
  'nodesMetadataUpdate': Editor.MessageClientDataByName<'nodes.metadata.update'>
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
</script>

<template>
  <div
    id="editor"
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
        v-for="x in view.nodesView"
        :ref="(el) => view.setViewNode(x.id, el)"
        :key="x.id"
        :node="x.node"
        :style=" x.style"
        :component="x.component"
        :style-header="x.styleHeader"
        :search-options="async(name, query) => searchOptions(x.id, name, query)"
        :search-properties="async(name, query) => searchProperties(x.id, name, query)"
        @release="() => view.onNodeHandleRelease()"
        @grab="(event) => view.onNodeHandleGrab(event, x.id)"
        @input-update="(name, value) => emit('nodesInputUpdate', { id: x.id, name, value })"
        @input-grab="(name, path) => view.onInputGrab(x.id, name, path)"
        @input-assign="(name, path) => view.onInputAssign(x.id, name, path)"
        @input-unassign="() => view.onInputUnassign()"
        @output-grab="(name, path) => view.onOutputGrab(x.id, name, path)"
        @output-assign="(name, path) => view.onOutputAssign(x.id, name, path)"
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
          :request-export="requestExport"
        />

        <!-- Panel -->
        <EditorPanel
          v-model:is-open="view.isPanelOpen"
          v-model:selected-tab="view.panelTab"
          v-model:is-resizing="view.isPanelResizing"
          :flow="flow"
          :nodes="nodes"
          :components="components"
          :component-groups="componentGroups"
          :panel-width="view.panelWidth"
          :selected-nodes="view.nodeSelected"
          class="pointer-events-auto row-span-2 justify-self-end h-full">

          <!-- Flow informations -->
          <EditorPanelFlow
            v-if="view.panelTab === 'flow'"
            :flow="flow"
            @metadata-update="(...data) => emit('metadataUpdate', ...data)"
          />

          <!-- Node informations -->
          <!--
            <EditorPanelNode
            v-else-if="view.panelTab === 'node'"
            :node="view."
            :component="selectedComponent"
            />
          -->

          <!-- Evaluation -->
          <!-- <EditorPanelEvaluation v-else-if="selectedTab === 'evaluation'" :editor /> -->

          <!-- Playground -->
          <EditorPanelPlayground
            v-else-if="view.panelTab === 'playground'"
            :workspace="workspace"
            :project="project"
            :flow="flow.name"
            :nodes="nodes"
          />
        </EditorPanel>

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
          :messages-thread="messagesThread"
          class="pointer-events-auto col-span-2 self-end justify-self-end select-text"
          @syncronize="() => emit('requestReload')"
          />
        -->
      </div>
    </div>
  </div>
</template>

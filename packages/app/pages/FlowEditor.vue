<script setup lang="ts">
definePageMeta({
  name: 'FlowEditor',
  path: '/:workspace/:project/:flow',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

// --- Extract route parameters.
const route = useRoute()
const flow = computed(() => route.params.flow as string)
const project = computed(() => route.params.project as string)
const workspace = computed(() => route.params.workspace as string)

// --- Start the flow editor session.
const session = useFlowSession(workspace, project, flow)

// --- Set the page title and description.
useHead(() => ({
  title: session.flow.name,
  meta: [
    { title: 'description', content: session.flow.description },
  ],
}))

// --- Make sure to leave the flow session when the user navigates away.
onBeforeRouteLeave(() => {
  session.userLeave()
})

// --- Mock variables
const isLocked = ref(false)
const isBookmarked = ref(false)

// --- Section open state from local storage
const isPanelOpen = useLocalStorage<boolean>('__FlowEditorPanel_FlowOpen', true)
const isPanelFlowMethodsOpen = useLocalStorage<boolean>('__FlowEditorPanel_FlowMethodsOpen', true)
const isPanelFlowSecretsOpen = useLocalStorage<boolean>('__FlowEditorPanel_FlowSecretsOpen', true)
const isPanelFlowEnvironmentsOpen = useLocalStorage<boolean>('__FlowEditorPanel_FlowEnvironmentsOpen', true)
const isPanelNodeDataOpen = useLocalStorage<boolean>('__FlowEditorPanel_NodeDataOpen', true)
const isPanelNodeResultOpen = useLocalStorage<boolean>('__FlowEditorPanel_NodeResultOpen', true)
</script>

<template>
  <AppPage class="relative w-full h-full flex flex-col">
    <FlowEditor
      v-model:isPanelOpen="isPanelOpen"
      v-model:isPanelFlowMethodsOpen="isPanelFlowMethodsOpen"
      v-model:isPanelFlowSecretsOpen="isPanelFlowSecretsOpen"
      v-model:isPanelFlowEnvironmentsOpen="isPanelFlowEnvironmentsOpen"
      v-model:isPanelNodeDataOpen="isPanelNodeDataOpen"
      v-model:isPanelNodeResultOpen="isPanelNodeResultOpen"

      :name="session.flow.name"
      :icon="session.flow.icon"
      :description="session.flow.description"
      :nodes="session.flow.nodes"
      :links="session.flow.links"
      :methods="[]"
      :categories="session.flow.categories"
      :secrets="session.flow.secrets"
      :variables="session.flow.variables"
      :peers="session.flow.peers"
      :peerId="session.flow.peerId"
      :events="session.events.value"

      :isLocked="isLocked"
      :isRunning="session.flow.isRunning"
      :isBookmarked="isBookmarked"

      @run="() => session.flowRun()"
      @abort="() => session.flowAbort()"
      @setName="(name) => session.flowSetMetaValue('name', name)"
      @setMethods="(methods) => session.flowSetMetaValue('methods', methods)"
      @setDescription="(description) => session.flowSetMetaValue('description', description)"
      @variableCreate="(name, value) => session.flowVariableCreate(name, value)"
      @variableUpdate="(name, value) => session.flowVariableUpdate(name, value)"
      @variableRemove="(name) => session.flowVariableRemove(name)"
      @secretCreate="(name, value) => session.flowSecretCreate(name, value)"
      @secretUpdate="(name, value) => session.flowSecretUpdate(name, value)"
      @secretRemove="(name) => session.flowSecretRemove(name)"

      @nodeStart="(id) => session.nodeStart(id)"
      @nodeAbort="(id) => session.nodeAbort(id)"
      @nodeCreate="(kind, x, y) => session.nodeCreate(kind, x, y)"
      @nodeDuplicate="(nodeId, x, y) => session.nodeDuplicate(nodeId, x, y)"
      @nodesMove="(nodes) => session.nodeSetPosition(...nodes)"
      @nodeSetDataValue="(id, portId, value) => session.nodeSetDataValue(id, portId, value)"
      @nodesRemove="(ids) => session.nodeRemove(ids)"

      @linkRemove="(id) => session.linkRemove(id)"
      @linkCreate="(source, target) => session.linkCreate(source, target)"

      @userSetPosition="(x, y) => session.userSetPosition(x, y)"

      @eventsClear="() => session.eventsClear()"
    />
  </AppPage>
</template>

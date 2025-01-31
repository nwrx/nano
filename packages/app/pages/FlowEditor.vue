<script setup lang="ts">
definePageMeta({
  name: 'FlowEditor',
  path: '/:workspace/:project/:flow',
  middleware: ['protected', 'workspace'],
})

// --- Start the WebSocket connection with the server and
// --- subscribe to the flow session with the given ID.
const idOrSlug = getRouteId()!
const session = useFlowSession(idOrSlug)

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
</script>

<template>
  <AppPage class="relative w-full h-full flex flex-col">
    <FlowEditor
      v-model:isPanelOpen="isPanelOpen"
      v-model:isPanelFlowMethodsOpen="isPanelFlowMethodsOpen"
      v-model:isPanelFlowSecretsOpen="isPanelFlowSecretsOpen"
      v-model:isPanelFlowEnvironmentsOpen="isPanelFlowEnvironmentsOpen"
      :description="session.flow.description"
      :nodes="session.flow.nodes"
      :links="session.flow.links"
      :categories="session.flow.categories"
      :peers="session.flow.peers"
      :peerId="session.flow.peerId"
      :name="session.flow.name"
      :icon="session.flow.icon"
      :isLocked="isLocked"
      :isRunning="session.flow.isRunning"
      :isBookmarked="isBookmarked"
      :methods="[]"
      :secrets="[]"
      :variables="[]"
      :projectSecrets="[]"
      :projectVariables="[]"
      @run="() => session.flowRun()"
      @abort="() => session.flowAbort()"
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
      @update:name="(name) => session.flowSetMetaValue('name', name)"
      @update:description="(description) => session.flowSetMetaValue('description', description)"
    />
  </AppPage>
</template>

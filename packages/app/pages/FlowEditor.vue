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
  meta: [{ title: 'description', content: session.flow.description }],
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
  <div class="bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-500 w-full h-full p-2px">
    <AppPage class="relative w-full h-full flex flex-col rounded-3.5">
      <FlowEditor
        v-model:is-panel-open="isPanelOpen"
        v-model:is-panel-flow-methods-open="isPanelFlowMethodsOpen"
        v-model:is-panel-flow-secrets-open="isPanelFlowSecretsOpen"
        v-model:is-panel-flow-environments-open="isPanelFlowEnvironmentsOpen"
        v-model:is-panel-node-data-open="isPanelNodeDataOpen"
        v-model:is-panel-node-result-open="isPanelNodeResultOpen"
        :name="session.flow.name"
        :icon="session.flow.icon"
        :description="session.flow.description"
        :nodes="session.flow.nodes"
        :methods="[]"
        :categories="session.flow.categories"
        :secrets="session.flow.secrets"
        :variables="session.flow.variables"
        :peers="session.flow.peers"
        :peer-id="session.flow.peerId"
        :events="session.events.value"
        :is-locked="isLocked"
        :is-running="session.flow.isRunning"
        :is-bookmarked="isBookmarked"
        @start="(input) => session.flowStart(input)"
        @abort="() => session.flowAbort()"
        @set-name="(name) => session.flowSetMetaValue('name', name)"
        @set-methods="(methods) => session.flowSetMetaValue('methods', methods)"
        @set-description="(description) => session.flowSetMetaValue('description', description)"
        @variable-create="(name, value) => session.flowVariableCreate(name, value)"
        @variable-update="(name, value) => session.flowVariableUpdate(name, value)"
        @variable-remove="(name) => session.flowVariableRemove(name)"
        @secret-create="(name, value) => session.flowSecretCreate(name, value)"
        @secret-update="(name, value) => session.flowSecretUpdate(name, value)"
        @secret-remove="(name) => session.flowSecretRemove(name)"
        @node-start="(id) => session.nodeStart(id)"
        @node-abort="(id) => session.nodeAbort(id)"
        @node-create="(kind, x, y) => session.nodeCreate(kind, x, y)"
        @node-duplicate="(nodeId, x, y) => session.nodeDuplicate(nodeId, x, y)"
        @nodes-move="(nodes) => session.nodeSetPosition(...nodes)"
        @node-set-data-value="(id, key, value) => session.nodeSetDataValue(id, key, value)"
        @node-search-data-options="(id, key, query) => session.nodeSearchDataOptions(id, key, query)"
        @nodes-remove="(ids) => session.nodeRemove(ids)"
        @link-remove="(id) => session.linkRemove(id)"
        @link-create="(source, target) => session.linkCreate(source, target)"
        @user-set-position="(x, y) => session.userSetPosition(x, y)"
        @events-clear="() => session.eventsClear()"
      />
    </AppPage>
  </div>
</template>

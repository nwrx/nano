<script setup lang="ts">
definePageMeta({
  name: 'FlowEditor',
  path: '/:workspace/:project/:flow',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

const route = useRoute()
const flow = computed(() => route.params.flow as string)
const project = computed(() => route.params.project as string)
const workspace = computed(() => route.params.workspace as string)
const session = useFlowSession(workspace, project, flow)

useHead(() => ({
  title: session.data.name,
  meta: [{ title: 'description', content: session.data.description }],
}))

onBeforeRouteLeave(() => {
  session.userLeave()
})
</script>

<template>
  <div class="bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-500 w-full h-full p-2px">
    <AppPage class="relative w-full h-full flex flex-col rounded-3.5">
      <Editor
        v-bind="session.data"
        @clear-events="() => session.clearEvents()"
        @start="(input) => session.start(input)"
        @abort="() => session.abort()"
        @start-node="(id) => session.startNode(id)"
        @abort-node="(id) => session.abortNode(id)"
        @set-name="(name) => session.setName(name)"
        @set-description="(description) => session.setDescription(description)"
        @create-secret="(name, value) => session.createSecret(name, value)"
        @remove-secret="(name) => session.removeSecret(name)"
        @create-variable="(name, value) => session.createVariable(name, value)"
        @update-variable="(name, value) => session.updateVariable(name, value)"
        @remove-variable="(name) => session.removeVariable(name)"
        @create-node="(kind, x, y) => session.createNode(kind, x, y)"
        @clone-nodes="(id, x, y) => session.cloneNodes(id, x, y)"
        @remove-nodes="(ids) => session.removeNodes(ids)"
        @set-nodes-position="(positions) => session.setNodesPosition(positions)"
        @set-node-label="(id, label) => session.setNodeLabel(id, label)"
        @set-node-comment="(id, comment) => session.setNodeComment(id, comment)"
        @set-node-input-value="(id, key, value) => session.setNodeInputValue(id, key, value)"
        @get-node-input-options="(id, key, query) => session.getNodeInputOptions(id, key, query)"
        @create-link="(from, to) => session.createLink(from, to)"
        @remove-link="(id) => session.removeLink(id)"
      />
    </AppPage>
  </div>
</template>

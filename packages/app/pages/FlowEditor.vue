<script setup lang="ts">
definePageMeta({
  name: 'ProjectFlowEditor',
  path: '/:workspace/:project/:name',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

const route = useRoute()
const name = computed(() => route.params.name as string)
const project = computed(() => route.params.project as string)
const workspace = computed(() => route.params.workspace as string)
const editor = useFlowEditor(workspace, project, name)

useHead(() => ({
  title: editor.data.name,
  meta: [{ title: 'description', content: editor.data.description }],
}))

onMounted(async() => {
  await editor.channel
})

onBeforeRouteLeave(() => {
  editor.userLeave()
})
</script>

<template>
  <div class="bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-500 w-full h-full p-2px">
    <AppPage class="relative w-full h-full flex flex-col rounded-3.5">
      <Editor
        v-bind="editor.data"
        :get-options="editor.getNodeInputOptions"
        @clear-events="() => editor.clearEvents()"
        @start="(input) => editor.start(input)"
        @abort="() => editor.abort()"
        @start-node="(id) => editor.startNode(id)"
        @abort-node="(id) => editor.abortNode(id)"
        @set-name="(name) => editor.setName(name)"
        @set-description="(description) => editor.setDescription(description)"
        @create-secret="(name, value) => editor.createSecret(name, value)"
        @remove-secret="(name) => editor.removeSecret(name)"
        @create-variable="(name, value) => editor.createVariable(name, value)"
        @update-variable="(name, value) => editor.updateVariable(name, value)"
        @remove-variable="(name) => editor.removeVariable(name)"
        @create-node="(kind, x, y) => editor.createNode(kind, x, y)"
        @clone-nodes="(id, x, y) => editor.cloneNodes(id, x, y)"
        @remove-nodes="(ids) => editor.removeNodes(ids)"
        @set-nodes-position="(positions) => editor.setNodesPosition(positions)"
        @set-node-label="(id, label) => editor.setNodeLabel(id, label)"
        @set-node-comment="(id, comment) => editor.setNodeComment(id, comment)"
        @set-node-input-value="(id, key, value) => editor.setNodeInputValue(id, key, value)"
        @get-node-input-options="(id, key, query) => editor.getNodeInputOptions(id, key, query)"
        @create-link="(source, target) => editor.createLink(source, target)"
        @remove-link="(link) => editor.removeLink(link)"
      />
    </AppPage>
  </div>
</template>

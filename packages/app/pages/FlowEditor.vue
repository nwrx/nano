<script setup lang="ts">
import AppPage from '~/components/app/AppPage.vue'
import Editor from '~/components/editor/Editor.vue'
import { useEditorModel } from '~/composables/useEditor'

definePageMeta({
  name: 'ProjectFlowEditor',
  path: '/:workspace/:project/:name',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

// --- Parse the route parameters.
const route = useRoute()
const editor = useEditorModel({
  name: route.params.name as string,
  project: route.params.project as string,
  workspace: route.params.workspace as string,
})

// --- Fetch the categories.
const categories = useRegistryCategories({
  type: 'Purpose',
  withComponents: true,
  withCollection: true,
  withWorkspace: true,
  withInputs: true,
  withOutputs: true,
})

useHead(() => ({
  title: editor.state.value.flow.title,
  meta: [{ title: 'description', content: editor.state.value.flow.description }],
}))

onMounted(async() => {
  await categories.searchCategories()
  await editor.connect()
})

onBeforeRouteLeave(() => {
  editor.send('userLeave')
})
</script>

<template>
  <div class="bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-500 w-full h-full p-2px">
    <AppPage class="relative w-full h-full flex flex-col rounded-3.5">
      <Editor
        v-if="editor"
        :flow="editor.state.value.flow"
        :nodes="editor.state.value.nodes"
        :participants="editor.state.value.participants"
        :categories="categories.categories.value"
        :messages-client="editor.messagesClient.value"
        :messages-server="editor.messagesServer.value"
        :search-options="editor.searchOptions"
        :get-flow-export="editor.getFlowExport"
        @syncronize="() => editor.send('syncronize')"
        @create-nodes="(...data) => editor.send('createNodes', ...data)"
        @clone-nodes="(...data) => editor.send('cloneNodes', ...data)"
        @remove-nodes="(...data) => editor.send('removeNodes', ...data)"
        @set-nodes-metadata="(...data) => editor.send('setNodesMetadata', ...data)"
        @set-nodes-input-value="(...data) => editor.send('setNodesInputValue', ...data)"
        @create-links="(...data) => editor.send('createLinks', ...data)"
        @remove-links="(...data) => editor.send('removeLinks', ...data)"
        @clear-messages-client="() => editor.clearMessagesClient()"
        @clear-messages-server="() => editor.clearMessagesServer()"
      />
    </AppPage>
  </div>
</template>

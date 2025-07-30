<script setup lang="ts">
import AppPage from '~/components/app/AppPage.vue'
import Editor from '~/components/editor/Editor.vue'
import { useEditorModel, useEditorThread, useFlowEditorComponents } from '~/composables/useEditor'

definePageMeta({
  name: 'FlowEditor',
  path: '/:workspace/:project/:name/editor',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

// --- Parse the route parameters.
const route = useRoute()
const options = {
  workspace: route.params.workspace as string,
  project: route.params.project as string,
  name: route.params.name as string,
}

const editor = useEditorModel(options)
const components = useFlowEditorComponents(options)
const thread = useEditorThread({
  flow: route.params.name as string,
  project: route.params.project as string,
  workspace: route.params.workspace as string,
  nodes: toRef(editor.state.value.nodes),
})

useHead(() => ({
  title: editor.state.value.flow.title,
  meta: [{ title: 'description', content: editor.state.value.flow.description }],
}))

onMounted(() => {
  void editor.connect()
  void components.fetchComponents()
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
        :components="components.data"
        :messages-client="editor.messagesClient.value"
        :messages-server="editor.messagesServer.value"
        :search-options="editor.searchOptions"
        :get-flow-export="editor.getFlowExport"

        :messages-thread="thread.messages"

        @syncronize="() => editor.send('syncronize')"
        @set-metadata="(...data) => editor.send('setMetadata', ...data)"
        @create-nodes="(...data) => editor.send('createNodes', ...data)"
        @clone-nodes="(...data) => editor.send('cloneNodes', ...data)"
        @remove-nodes="(...data) => editor.send('removeNodes', ...data)"
        @set-nodes-metadata="(...data) => editor.send('setNodesMetadata', ...data)"
        @set-nodes-input-value="(...data) => editor.send('setNodesInputValue', ...data)"
        @create-links="(link) => editor.send('createLinks', link)"
        @remove-links="(...data) => editor.send('removeLinks', ...data)"
        @clear-messages-client="() => editor.clearMessagesClient()"
        @clear-messages-server="() => editor.clearMessagesServer()"

        @start-thread="(input) => thread.start(input)"
      />
    </AppPage>
  </div>
</template>

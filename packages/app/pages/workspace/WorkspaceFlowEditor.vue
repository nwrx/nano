<script setup lang="ts">
import AppPage from '~/components/app/AppPage.vue'
import Editor from '~/components/editor/Editor.vue'
import { useEditorComponents, useEditorModel, useEditorThread } from '~/composables/useEditor'

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
const components = useEditorComponents(options)
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

onMounted(async() => {
  await components.fetchComponents()
  await editor.connect()
})

onBeforeRouteLeave(() => {
  editor.sendMessage('user.leave')
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

        :components="components.data.components"
        :component-groups="components.data.groups"

        :messages-client="editor.messagesClient.value"
        :messages-server="editor.messagesServer.value"
        :search-options="editor.searchOptions"
        :get-flow-export="editor.requestExport"

        :messages-thread="thread.messages"

        @request-reload="() => editor.sendMessage('request.reload')"
        @metadata-update="(...data) => editor.sendMessage('metadata.update', ...data)"

        @nodes-clone="(...data) => editor.sendMessage('nodes.clone', ...data)"
        @nodes-create="(...data) => editor.sendMessage('nodes.create', ...data)"
        @nodes-remove="(...data) => editor.sendMessage('nodes.remove', ...data)"
        @nodes-input-update="(...data) => editor.sendMessage('nodes.input.update', ...data)"
        @nodes-links-create="(...data) => editor.sendMessage('nodes.links.create', ...data)"
        @nodes-links-remove="(...data) => editor.sendMessage('nodes.links.remove', ...data)"
        @nodes-metadata-update="(...data) => editor.sendMessage('nodes.metadata.update', ...data)"

        @clear-messages-client="() => editor.clearMessagesClient()"
        @clear-messages-server="() => editor.clearMessagesServer()"

        @start-thread="(input) => thread.start(input)"
      />
    </AppPage>
  </div>
</template>

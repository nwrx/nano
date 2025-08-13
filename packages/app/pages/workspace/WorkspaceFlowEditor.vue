<script setup lang="ts">
import AppPage from '~/components/app/AppPage.vue'
import Editor from '~/components/editor/Editor.vue'
import { useEditorModel } from '~/composables/useEditor'

definePageMeta({
  name: 'FlowEditor',
  path: '/:workspace/:project/:name/editor',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

// --- Get the route parameters.
const route = useRoute()
const options = {
  workspace: route.params.workspace as string,
  project: route.params.project as string,
  flow: route.params.name as string,
}

// --- Initialize the thread and editor model.
const editor = useEditorModel(options)

// --- Set the page title and description.
const title = computed(() => editor.state.flow.title || editor.state.flow.name)
const description = computed(() => editor.state.flow.description)
useHead(() => ({ title, meta: [{ title: 'description', content: description }] }))

onMounted(async() => {
  await editor.fetchComponents()
  await editor.connect()
})

onBeforeRouteLeave(() => {
  editor.sendMessage('user.leave')
})
</script>

<template>
  <AppPage class="relative w-full h-full flex flex-col rounded-3.5">
    <Editor
      :workspace="options.workspace"
      :project="options.project"
      :flow="editor.state.flow"
      :nodes="editor.state.nodes"
      :components="editor.components"
      :component-groups="editor.componentGroups"
      :participants="editor.state.participants"
      :search-options="editor.searchOptions"
      :search-properties="editor.searchProperties"
      :request-export="editor.requestExport"

      @request-reload="() => editor.sendMessage('request.reload')"
      @metadata-update="(...data) => editor.sendMessage('metadata.update', ...data)"
      @nodes-clone="(...data) => editor.sendMessage('nodes.clone', ...data)"
      @nodes-create="(...data) => editor.sendMessage('nodes.create', ...data)"
      @nodes-remove="(...data) => editor.sendMessage('nodes.remove', ...data)"
      @nodes-input-update="(...data) => editor.sendMessage('nodes.input.update', ...data)"
      @nodes-links-create="(...data) => editor.sendMessage('nodes.links.create', ...data)"
      @nodes-links-remove="(...data) => editor.sendMessage('nodes.links.remove', ...data)"
      @nodes-metadata-update="(...data) => editor.sendMessage('nodes.metadata.update', ...data)"
    />
  </AppPage>
</template>

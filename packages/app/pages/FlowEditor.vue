<script setup lang="ts">
definePageMeta({
  name: 'ProjectFlowEditor',
  path: '/:workspace/:project/:name',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

// --- Parse the route parameters.
const route = useRoute()
const editor = ref<Editor>()

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
  title: editor.value?.model.title,
  meta: [{ title: 'description', content: editor.value?.model.description }],
}))

onMounted(async() => {
  await categories.searchCategories()
  editor.value = await useEditor({
    name: route.params.name as string,
    project: route.params.project as string,
    workspace: route.params.workspace as string,
  })
})

onBeforeRouteLeave(() => {
  if (!editor.value) return
  editor.value.model.userLeave()
})
</script>

<template>
  <div class="bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-500 w-full h-full p-2px">
    <AppPage class="relative w-full h-full flex flex-col rounded-3.5">
      <Editor v-if="editor" :categories="categories.categories.value" :editor="editor" />
    </AppPage>
  </div>
</template>

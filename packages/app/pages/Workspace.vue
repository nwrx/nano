<script setup lang="ts">
definePageMeta({
  name: 'Workspace',
  path: '/:workspace',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

const open = useLocalStorage<Record<string, boolean>>('__Workspace_Open', {})
const name = computed(() => useRoute().params.workspace as string)
const createProjectDialog = ref(false)
const workspace = useWorkspace(name, {
  withProjects: true,
  withProjectFlows: true,
  withProjectAssignments: true,
  withAssignments: true,
})

useSeoMeta({
  title: 'Workspace',
  description: 'Create, edit, and delete your flows',
})

onMounted(async() => {
  await workspace.refresh()
})
</script>

<template>
  <AppPage class="flex flex-col overflow-hidden w-full space-y-8">
    <AppPageHeader
      icon="i-carbon:flow"
      title="Workspace"
      description="Create, edit, and delete your flows."
      badge="Beta"
      badgeVariant="primary"
    />

    <ProjectDialogCreate
      v-model="createProjectDialog"
      :workspaceName="workspace.data.name"
      @submit="options => workspace.createProject(options)"
    />

    <!-- Create project -->
    <div class="flex justify-end">
      <Button icon="i-carbon:add" variant="primary" @click="() => createProjectDialog = true">
        Create Project
      </Button>
    </div>

    <!-- Project list -->
    <AppPageContainer>
      <ProjectList
        v-model="open"
        :workspace="workspace.data.name"
        :projects="workspace.data.projects"
        @flowCreate="(project) => workspace.createFlow(project)"
        @flowDelete="(project, flow) => workspace.deleteFlow(project, flow)"
      />
    </AppPageContainer>
  </AppPage>
</template>

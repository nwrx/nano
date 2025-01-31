<script setup lang="ts">
definePageMeta({
  name: 'Workspace',
  path: '/:workspace',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

useSeoMeta({
  title: 'Workspace',
  description: 'Create, edit, and delete your flows',
})

// --- Remote data.
const route = useRoute()
const workspace = useWorkspace(route.params.workspace as string, {
  withProjects: true,
  withProjectFlows: true,
  withProjectAssignments: true,
  withAssignments: true,
})

// --- Dialog and list state.
const isDialogCreateProjectOpen = ref(false)
const isWorkspaceOpen = useLocalStorage<Record<string, boolean>>('__Workspace_Open', {})

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
      v-model="isDialogCreateProjectOpen"
      :workspaceName="workspace.data.name"
      @submit="options => workspace.createProject(options)"
    />

    <!-- Create project -->
    <div class="flex justify-end">
      <Button icon="i-carbon:add" variant="primary" @click="() => isDialogCreateProjectOpen = true">
        Create Project
      </Button>
    </div>

    <!-- Project list -->
    <AppPageContainer>
      <ProjectList
        v-model="isWorkspaceOpen"
        :workspace="workspace.data.name"
        :projects="workspace.data.projects"
        @flowCreate="(project) => workspace.createFlow(project)"
        @flowDelete="(project, flow) => workspace.deleteFlow(project, flow)"
      />
    </AppPageContainer>
  </AppPage>
</template>

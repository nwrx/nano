<script setup lang="ts">
definePageMeta({
  name: 'Workspace',
  path: '/:workspace',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

const { t } = useI18n({ useScope: 'local' })
useHead(() => ({
  title: t('title'),
  meta: [
    { name: 'description', content: t('description') },
  ],
}))

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
  <AppPage class="flex flex-col overflow-hidden w-full space-y-md">
    <AppPageHeader
      icon="i-carbon:flow"
      :title="t('title')"
      :description="t('description')"
      badge="Beta"
      badgeVariant="primary"
    />

    <!-- Create project dialog -->
    <ProjectListDialogCreate
      v-model="isDialogCreateProjectOpen"
      :workspace="workspace.data.name"
      :baseUrl="CONSTANTS.appHost"
      @submit="options => workspace.createProject(options)"
    />

    <!-- Create project -->
    <AppPageContainer class="space-y-lg">
      <div class="flex items-center space-x-md">
        <Button
          link
          variant="primary"
          icon="i-carbon:add"
          label="Create Project"
          @click="() => isDialogCreateProjectOpen = true"
        />
      </div>

      <!-- Project list -->
      <ProjectList
        v-model="isWorkspaceOpen"
        :workspace="workspace.data.name"
        :projects="workspace.data.projects"
        :baseUrl="CONSTANTS.appHost"
        @flowCreate="(project) => workspace.createFlow(project)"
        @flowDelete="(project, flow) => workspace.deleteFlow(project, flow)"
      />
    </AppPageContainer>
  </AppPage>
</template>

<i18n lang="yaml">
  en:
    title: Workspace
    description: Create, edit, and delete your flows.
  fr:
    title: Espace de travail
    description: Créez, éditez et supprimez vos flux.
  de:
    title: Arbeitsbereich
    description: Erstellen, bearbeiten und löschen Sie Ihre Flows.
  es:
    title: Espacio de trabajo
    description: Crea, edita y elimina tus flujos.
  zh:
    title: 工作区
    description: 创建、编辑和删除您的流程。
</i18n>

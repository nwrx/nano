<script setup lang="ts">
definePageMeta({
  name: 'Workspace',
  path: '/:workspace',
  middleware: ['redirect-when-guest', 'abort-reserved'],
})

const { t } = useI18n()
useHead(() => ({
  title: t('title'),
  meta: [{ name: 'description', content: t('description') }],
}))

const route = useRoute()
const workspaceName = computed(() => route.params.workspace as string)
const workspace = useWorkspace(workspaceName, {
  withFlows: true,
  withAssignments: true,
})

const isDialogCreateProjectOpen = ref(false)
const localSettings = useLocalSettings()
onMounted(workspace.refresh)

const bookmarkFlows = computed(() => workspace.data.value
  ?.flatMap(project => (project.flows ?? []).map(flow => ({
    ...flow,
    workspace: workspaceName.value,
    project: project.name,
  })))
  ?.slice(0, 3) ?? [])
</script>

<template>
  <AppPage>
    <ProjectHeader
      icon="i-carbon:flow"
      :title="t('title')"
      :workspace="workspaceName"
      :description="t('description')"
    />

    <!-- Project list -->
    <AppPageContainer class="space-y-lg">

      <!-- Bookmarks -->
      <!-- <ProjectBookmarks :flows="bookmarkFlows" /> -->

      <ProjectList
        v-model="localSettings.workspaceOpenProjects"
        :workspace="workspaceName"
        :projects="workspace.data.value"
        :base-url="CONSTANTS.appHost"
        @flow-create="(project) => workspace.createFlow(project)"
        @flow-import="(project, file) => workspace.importFlow(project, file)"
        @flow-delete="(project, flow) => workspace.deleteFlow(project, flow)"
      />

      <!-- Create project button -->
      <div class="flex items-center space-x-md">
        <Button
          link
          variant="primary"
          icon="i-carbon:add"
          :label="t('createProject')"
          @click="() => isDialogCreateProjectOpen = true"
        />
      </div>
    </AppPageContainer>

    <!-- Create project dialog -->
    <ProjectListDialogCreate
      v-model="isDialogCreateProjectOpen"
      :workspace="workspaceName"
      :base-url="CONSTANTS.appHost"
      @submit="options => workspace.createProject(options)"
    />
  </AppPage>
</template>

<i18n lang="yaml">
en:
  title: Workspace
  description: Create, edit, and delete your flows.
  createProject: Create new project
fr:
  title: Espace de travail
  description: Créez, éditez et supprimez vos flux.
  createProject: Créer nouveau projet
de:
  title: Arbeitsbereich
  description: Erstellen, bearbeiten und löschen Sie Ihre Flows.
  createProject: Neues Projekt erstellen
es:
  title: Espacio de trabajo
  description: Crea, edita y elimina tus flujos.
  createProject: Crear nuevo proyecto
zh:
  title: 工作区
  description: 创建、编辑和删除您的流程。
  createProject: 创建新项目
</i18n>

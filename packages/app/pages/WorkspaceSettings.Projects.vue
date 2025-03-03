<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsProjects',
  path: '/:workspace/settings/projects',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-settings',
  icon: 'i-carbon:folder',
  title: {
    en: 'Projects',
    fr: 'Projets',
    de: 'Projekte',
    es: 'Proyectos',
    zh: '项目',
  },
  description: {
    en: 'Manage projects and their configurations.',
    fr: 'Gérer les projets et leurs configurations.',
    de: 'Verwalten Sie Projekte und deren Konfigurationen.',
    es: 'Administrar proyectos y sus configuraciones.',
    zh: '管理项目及其配置。',
  },
})

// --- Route and i18n.
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)

// --- Data and actions.
const { data, getWorkspace } = useWorkspace(workspace)
onMounted(getWorkspace)
</script>

<template>
  <AppPageContainer contained>
    <!-- Project management content will go here -->
    <AppPageForm
      :title="t('projects.title')"
      :text="t('projects.text')">
      <!-- Project list and management UI will go here -->
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  projects:
    title: Projects
    text: Manage projects in your workspace and their configurations.
    empty: No projects found in this workspace.
    create: Create new project
</i18n>

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

// const route = useRoute()
// const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained />
</template>

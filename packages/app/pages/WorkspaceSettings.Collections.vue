<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsCollections',
  path: '/:workspace/settings/collections',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-settings',
  icon: 'i-carbon:catalog',
  title: {
    en: 'Collections',
    fr: 'Collections',
    de: 'Sammlungen',
    es: 'Colecciones',
    zh: '集合',
  },
  description: {
    en: 'Manage collections and resource organization.',
    fr: 'Gérer les collections et l\'organisation des ressources.',
    de: 'Verwalten Sie Sammlungen und die Organisation von Ressourcen.',
    es: 'Administrar colecciones y organización de recursos.',
    zh: '管理集合和资源组织。',
  },
})

// --- Route and i18n.
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained />
</template>

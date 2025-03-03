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
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)

// --- Data and actions.
const { data, getWorkspace } = useWorkspace(workspace)
onMounted(getWorkspace)
</script>

<template>
  <AppPageContainer contained>
    <!-- Collections management content will go here -->
    <AppPageForm
      :title="t('collections.title')"
      :text="t('collections.text')">
      <!-- Collections list and management UI will go here -->
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  collections:
    title: Collections
    text: Organize your resources into collections for better management and access control.
    empty: No collections found in this workspace.
    create: Create new collection
</i18n>

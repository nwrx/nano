<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsIntegrations',
  path: '/:workspace/settings/integrations',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-settings',
  icon: 'i-carbon:connect',
  title: {
    en: 'Integrations',
    fr: 'Intégrations',
    de: 'Integrationen',
    es: 'Integraciones',
    zh: '集成',
  },
  description: {
    en: 'Manage third-party integrations and API connections.',
    fr: 'Gérez les intégrations tierces et les connexions API.',
    de: 'Verwalten Sie Drittanbieter-Integrationen und API-Verbindungen.',
    es: 'Administre integraciones de terceros y conexiones API.',
    zh: '管理第三方集成和API连接。',
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
    <!-- Integrations content will go here -->
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  title: Integrations
  description: Manage third-party integrations and API connections for your workspace.
</i18n>

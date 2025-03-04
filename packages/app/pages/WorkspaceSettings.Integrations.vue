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

// const route = useRoute()
// const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained />
</template>

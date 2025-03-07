<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettings',
  path: '/:workspace/settings',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Settings',
    fr: 'Paramètres',
    de: 'Einstellungen',
    es: 'Configuración',
    zh: '工作区设置',
  },
  description: {
    en: 'Manage your workspace settings and configurations.',
    fr: 'Gérez les paramètres et configurations de votre espace.',
    de: 'Verwalten Sie Ihre Arbeitsbereich-Einstellungen und Konfigurationen.',
    es: 'Administre la configuración de su espacio de trabajo.',
    zh: '管理您的工作区设置和配置。',
  },
})

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained>
    <WorkspaceSettingsGeneral :workspace />
    <WorkspaceSettingsDangerZone :workspace />
  </AppPageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsVaults',
  path: '/:workspace/settings/vaults',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-security',
  icon: 'i-carbon:locked',
  title: {
    en: 'Secrets & Vaults',
    fr: 'Secrets et coffres',
    de: 'Geheimnisse und Tresore',
    es: 'Secretos y bóvedas',
    zh: '秘密和保险库',
  },
  description: {
    en: 'Manage your workspace vaults and secrets.',
    fr: 'Gérez les coffres et secrets de votre espace de travail.',
    de: 'Verwalten Sie Ihre Arbeitsbereichstresore und Geheimnisse.',
    es: 'Administre las cajas fuertes y secretos de su espacio de trabajo.',
    zh: '管理您的工作区保险库和秘密。',
  },
})

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained>
    <WorkspaceSettingsVaults :workspace="workspace" />
    <WorkspaceSettingsVariables :workspace="workspace" />
  </AppPageContainer>
</template>

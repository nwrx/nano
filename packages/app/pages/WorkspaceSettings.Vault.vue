<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsVault',
  parent: 'WorkspaceSettingsVaults',
  path: '/:workspace/settings/vaults/:vault',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  icon: 'i-carbon:edit',
  title: {
    en: 'Edit Vault',
    fr: 'Modifier le coffre',
    de: 'Tresor bearbeiten',
    es: 'Editar bóveda',
    zh: '编辑保险库',
  },
  description: {
    en: 'Configure vault settings, permissions, and project access.',
    fr: 'Configurer les paramètres, les autorisations et l\'accès aux projets du coffre.',
    de: 'Konfigurieren Sie Tresoreinstellungen, Berechtigungen und Projektzugriff.',
    es: 'Configurar ajustes de bóveda, permisos y acceso a proyectos.',
    zh: '配置保险库设置、权限和项目访问权限。',
  },
})

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const vault = computed(() => route.params.vault as string)
</script>

<template>
  <AppPageContainer contained>
    <WorkspaceSettingsVaultGeneral :workspace :vault />
    <WorkspaceSettingsVaultAssignments :workspace :vault />
    <WorkspaceSettingsVaultProjectAssignments :workspace :vault />
  </AppPageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsAssignments',
  path: '/:workspace/settings/access',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-security',
  icon: 'i-carbon:user-role',
  title: {
    en: 'Access & Permissions',
    fr: 'Accès et autorisations',
    de: 'Zugriff und Berechtigungen',
    es: 'Acceso y permisos',
    zh: '访问和权限',
  },
  description: {
    en: 'Manage workspace members and their permissions. Control who can access and modify resources in this workspace.',
    fr: 'Gérez les membres de l\'espace de travail et leurs autorisations. Contrôlez qui peut accéder et modifier les ressources dans cet espace de travail.',
    de: 'Verwalten Sie Arbeitsbereichsmitglieder und deren Berechtigungen. Steuern Sie, wer auf Ressourcen in diesem Arbeitsbereich zugreifen und diese ändern kann.',
    es: 'Administre los miembros del espacio de trabajo y sus permisos. Controle quién puede acceder y modificar recursos en este espacio de trabajo.',
    zh: '管理工作区成员及其权限。控制谁可以访问和修改此工作区中的资源。',
  },
})

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained>
    <WorkspaceSettingsAssignments :name="workspace" />
  </AppPageContainer>
</template>

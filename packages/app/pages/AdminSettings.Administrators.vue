<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsAdministators',
  path: '/admin/administrators',
  layout: 'admin-settings',
  group: 'admin-users',
  icon: 'i-carbon:user-admin',
  title: {
    en: 'Administrators',
    fr: 'Administrateurs',
    de: 'Administratoren',
    es: 'Administradores',
    zh: '管理员',
  },
  description: {
    en: 'Manage system administrators and their permissions.',
    fr: 'Gérer les administrateurs système et leurs autorisations.',
    de: 'Verwalten Sie Systemadministratoren und ihre Berechtigungen.',
    es: 'Administre los administradores del sistema y sus permisos.',
    zh: '管理系统管理员及其权限。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

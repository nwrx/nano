<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsUsers',
  path: '/admin/users',
  middleware: 'redirect-when-guest',
  layout: 'admin-settings',
  group: 'admin-settings',
  icon: 'i-carbon:user-profile',
  title: {
    en: 'User Management',
    fr: 'Gestion des utilisateurs',
    de: 'Benutzerverwaltung',
    es: 'Gestión de usuarios',
    zh: '用户管理',
  },
  description: {
    en: 'Manage users across the platform. Create, disable, or delete user accounts.',
    fr: 'Gérez les utilisateurs à travers la plateforme. Créez, désactivez ou supprimez des comptes utilisateurs.',
    de: 'Verwalten Sie Benutzer auf der gesamten Plattform. Erstellen, deaktivieren oder löschen Sie Benutzerkonten.',
    es: 'Administre usuarios en toda la plataforma. Cree, deshabilite o elimine cuentas de usuario.',
    zh: '管理整个平台的用户。创建、禁用或删除用户账户。',
  },
})
</script>

<template>
  <AppPageContainer contained>
    <AdminSettingsUsers />
  </AppPageContainer>
</template>

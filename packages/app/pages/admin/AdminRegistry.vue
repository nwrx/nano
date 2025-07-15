<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsRegistry',
  path: '/admin/registry',
  layout: 'admin-settings',
  group: 'admin-registry',
  icon: 'i-carbon:app-registry',
  title: {
    en: 'Registry',
    fr: 'Registre',
    de: 'Registrierung',
    es: 'Registro',
    zh: '注册表',
  },
  description: {
    en: 'Manage the application registry and package repositories.',
    fr: 'Gérez le registre des applications et les dépôts de packages.',
    de: 'Verwalten Sie das Anwendungsregister und Paketrepositorien.',
    es: 'Administre el registro de aplicaciones y los repositorios de paquetes.',
    zh: '管理应用程序注册表和软件包存储库。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

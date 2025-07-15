<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsLicenses',
  path: '/admin/licenses',
  layout: 'admin-settings',
  group: 'admin-settings',
  icon: 'i-carbon:license',
  title: {
    en: 'Licenses',
    fr: 'Licences',
    de: 'Lizenzen',
    es: 'Licencias',
    zh: '许可证',
  },
  description: {
    en: 'Manage system licenses and activation.',
    fr: 'Gérer les licences du système et l\'activation.',
    de: 'Verwalten Sie Systemlizenzen und Aktivierung.',
    es: 'Administre las licencias del sistema y la activación.',
    zh: '管理系统许可证和激活。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

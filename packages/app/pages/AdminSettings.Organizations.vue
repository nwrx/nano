<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsOrganizations',
  path: '/admin/organizations',
  layout: 'admin-settings',
  group: 'admin-settings',
  icon: 'i-carbon:building',
  title: {
    en: 'Organizations',
    fr: 'Organisations',
    de: 'Organisationen',
    es: 'Organizaciones',
    zh: '组织',
  },
  description: {
    en: 'Manage organizations across the platform.',
    fr: 'Gérer les organisations sur la plateforme.',
    de: 'Verwalten Sie Organisationen auf der Plattform.',
    es: 'Administre organizaciones en toda la plataforma.',
    zh: '管理平台上的组织。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

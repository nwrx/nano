<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsAnnouncements',
  path: '/admin/announcements',
  layout: 'admin-settings',
  group: 'admin-settings',
  icon: 'i-carbon:volume-down',
  title: {
    en: 'Announcements',
    fr: 'Annonces',
    de: 'Ankündigungen',
    es: 'Anuncios',
    zh: '公告',
  },
  description: {
    en: 'Create and manage system-wide announcements.',
    fr: 'Créer et gérer les annonces à l\'échelle du système.',
    de: 'Erstellen und verwalten Sie systemweite Ankündigungen.',
    es: 'Cree y administre anuncios para todo el sistema.',
    zh: '创建和管理系统范围的公告。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

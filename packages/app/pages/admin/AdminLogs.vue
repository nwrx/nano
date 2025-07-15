<script lang="ts">
definePageMeta({
  name: 'AdminSettingsLogs',
  path: '/admin/logs',
  layout: 'admin-settings',
  group: 'admin-analytics',
  icon: 'i-carbon:catalog',
  title: {
    en: 'Logs',
    fr: 'Journaux',
    de: 'Protokolle',
    es: 'Registros',
    zh: '日志',
  },
  description: {
    en: 'View and manage application logs and activity history.',
    fr: 'Afficher et gérer les journaux d\'application et l\'historique des activités.',
    de: 'Anwendungsprotokolle und Aktivitätsverlauf anzeigen und verwalten.',
    es: 'Ver y administrar los registros de la aplicación y el historial de actividades.',
    zh: '查看和管理应用程序日志和活动历史记录。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

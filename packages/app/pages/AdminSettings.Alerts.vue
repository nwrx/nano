<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsAlerts',
  path: '/admin/alerts',
  layout: 'admin-settings',
  group: 'admin-analytics',
  icon: 'i-carbon:notification',
  title: {
    en: 'Alerts',
    fr: 'Alertes',
    de: 'Benachrichtigungen',
    es: 'Alertas',
    zh: '警报',
  },
  description: {
    en: 'Manage alert settings and notifications.',
    fr: 'Gérez les paramètres d\'alerte et les notifications.',
    de: 'Verwalten Sie Benachrichtigungseinstellungen und Benachrichtigungen.',
    es: 'Administre la configuración de alertas y notificaciones.',
    zh: '管理警报设置和通知。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

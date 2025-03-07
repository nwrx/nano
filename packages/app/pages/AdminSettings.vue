<script setup lang="ts">
definePageMeta({
  name: 'AdminSettings',
  path: '/admin/settings',
  layout: 'admin-settings',
  group: 'admin-server',
  icon: 'i-carbon:settings',
  title: {
    en: 'Server Settings',
    fr: 'Paramètres du serveur',
    de: 'Servereinstellungen',
    es: 'Ajustes del servidor',
    zh: '服务器设置',
  },
  description: {
    en: 'Configure global system settings.',
    fr: 'Configurer les paramètres globaux du système.',
    de: 'Konfigurieren Sie globale Systemeinstellungen.',
    es: 'Configure los ajustes globales del sistema.',
    zh: '配置全局系统设置。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsCustomizations',
  path: '/settings/customizations',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-settings',
  icon: 'i-carbon:settings-adjust',
  title: {
    en: 'Customizations',
    fr: 'Personnalisation',
    de: 'Anpassungen',
    es: 'Personalizaciones',
    zh: '定制',
  },
  description: {
    en: 'Manage your customization settings and preferences.',
    fr: 'Gérez vos paramètres et préférences de personnalisation.',
    de: 'Verwalten Sie Ihre Anpassungseinstellungen und -präferenzen.',
    es: 'Administre la configuración y preferencias de personalización.',
    zh: '管理您的定制设置和偏好。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

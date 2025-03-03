<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsApiKeys',
  path: '/settings/api-keys',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-security',
  icon: 'i-carbon:api-key',
  title: {
    en: 'API Keys',
    fr: 'Clés API',
    de: 'API-Schlüssel',
    es: 'Claves API',
    zh: 'API 密钥',
  },
  description: {
    en: 'Manage your API keys and access tokens.',
    fr: 'Gérez vos clés API et jetons d\'accès.',
    de: 'Verwalten Sie Ihre API-Schlüssel und Zugriffstoken.',
    es: 'Administre sus claves API y tokens de acceso.',
    zh: '管理您的 API 密钥和访问令牌。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

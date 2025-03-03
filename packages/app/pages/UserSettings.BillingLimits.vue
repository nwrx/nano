<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsBillingLimits',
  path: '/settings/usage',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-billing',
  icon: 'i-carbon:analytics',
  title: {
    en: 'Usage & limits',
    fr: 'Utilisation & limites',
    de: 'Nutzung & Grenzen',
    es: 'Uso y límites',
    zh: '使用 & 限制',
  },
  description: {
    en: 'View your usage metrics and limits.',
    fr: 'Consultez vos métriques d\'utilisation et limites.',
    de: 'Sehen Sie sich Ihre Nutzungsdaten und Grenzen an.',
    es: 'Vea sus métricas de uso y límites.',
    zh: '查看您的使用情况指标和限制。',
  },
})
</script>

<template>
  <AppPageContainer contained>
    <!-- Usage metrics and limits content will go here -->
  </AppPageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsLimits',
  path: '/:workspace/settings/limits',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-billing',
  icon: 'i-carbon:chart-maximum',
  title: {
    en: 'Usage & Limits',
    fr: 'Utilisation et limites',
    de: 'Nutzung und Grenzen',
    es: 'Uso y límites',
    zh: '使用和限制',
  },
  description: {
    en: 'Configure usage limits and quotas for your workspace.',
    fr: 'Configurez les limites d\'utilisation et les quotas pour votre espace de travail.',
    de: 'Konfigurieren Sie Nutzungslimits und Kontingente für Ihren Arbeitsbereich.',
    es: 'Configure límites de uso y cuotas para su espacio de trabajo.',
    zh: '为您的工作区配置使用限制和配额。',
  },
})

// const route = useRoute()
// const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsBillingLimits',
  path: '/:workspace/settings/billing/limits',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-billing',
  icon: 'i-carbon:chart-maximum',
  title: {
    en: 'Usage Limits',
    fr: 'Limites d\'utilisation',
    de: 'Nutzungslimits',
    es: 'Límites de uso',
    zh: '使用限制',
  },
  description: {
    en: 'Configure usage limits and quotas for your workspace.',
    fr: 'Configurez les limites d\'utilisation et les quotas pour votre espace de travail.',
    de: 'Konfigurieren Sie Nutzungslimits und Kontingente für Ihren Arbeitsbereich.',
    es: 'Configure límites de uso y cuotas para su espacio de trabajo.',
    zh: '为您的工作区配置使用限制和配额。',
  },
})

// --- Route and i18n.
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)

// --- Data and actions.
const { data, getWorkspace } = useWorkspace(workspace)
onMounted(getWorkspace)
</script>

<template>
  <AppPageContainer contained>
    <!-- Billing limits content will go here -->
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  title: Usage Limits
  description: Configure usage limits and quotas for your workspace.
</i18n>

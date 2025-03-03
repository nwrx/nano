<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsBillingUpgrade',
  path: '/:workspace/settings/billing/upgrade',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-billing',
  icon: 'i-carbon:upgrade',
  title: {
    en: 'Upgrade',
    fr: 'Mise à niveau',
    de: 'Upgrade',
    es: 'Actualizar',
    zh: '升级',
  },
  description: {
    en: 'Upgrade your workspace subscription plan.',
    fr: 'Mettez à niveau votre forfait d\'abonnement d\'espace de travail.',
    de: 'Aktualisieren Sie Ihr Arbeitsbereich-Abonnement.',
    es: 'Actualice su plan de suscripción de espacio de trabajo.',
    zh: '升级您的工作区订阅计划。',
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
    <AppPageForm
      :title="t('billing.upgrade.title')"
      :text="t('billing.upgrade.text')">
      <!-- Upgrade options and flow will go here -->
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  billing:
    upgrade:
      title: Upgrade Plan
      text: Explore available plans and upgrade your workspace subscription.
</i18n>

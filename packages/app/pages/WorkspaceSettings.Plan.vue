<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsBillingPlan',
  path: '/:workspace/settings/billing/plan',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-billing',
  icon: 'i-carbon:purchase',
  title: {
    en: 'Plan',
    fr: 'Forfait',
    de: 'Tarif',
    es: 'Plan',
    zh: '方案',
  },
  description: {
    en: 'View and manage your current subscription plan.',
    fr: 'Consultez et gérez votre forfait d\'abonnement actuel.',
    de: 'Sehen und verwalten Sie Ihren aktuellen Abonnementplan.',
    es: 'Ver y administrar su plan de suscripción actual.',
    zh: '查看和管理您当前的订阅计划。',
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
      :title="t('billing.plan.title')"
      :text="t('billing.plan.text')">
      <!-- Plan information and management content will go here -->
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  billing:
    plan:
      title: Current Plan
      text: View and manage your workspace's subscription plan.
</i18n>

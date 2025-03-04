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

// const route = useRoute()
// const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained />
</template>

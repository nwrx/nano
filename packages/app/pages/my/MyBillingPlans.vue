<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsBillingPlans',
  path: '/settings/plans',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-billing',
  icon: 'i-carbon:document',
  title: {
    en: 'Plan & subscription',
    fr: 'Plan & abonnement',
    de: 'Plan & Abonnement',
    es: 'Plan y suscripción',
    zh: '计划 & 订阅',
  },
  description: {
    en: 'Manage your subscription plan and billing cycles.',
    fr: 'Gérez votre plan d\'abonnement et vos cycles de facturation.',
    de: 'Verwalten Sie Ihr Abonnement und Abrechnungszeiträume.',
    es: 'Administre su plan de suscripción y ciclos de facturación.',
    zh: '管理您的订阅计划和结算周期。',
  },
})
</script>

<template>
  <AppPageContainer contained>
    <!-- Plan management content will go here -->
  </AppPageContainer>
</template>

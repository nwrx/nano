<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsPayment',
  path: '/:workspace/settings/billing/payment',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-billing',
  icon: 'i-carbon:currency-euro',
  title: {
    en: 'Payment methods',
    fr: 'Moyens de paiement',
    de: 'Zahlungsmethoden',
    es: 'Métodos de pago',
    zh: '支付方式',
  },
  description: {
    en: 'Manage your payment methods and billing information.',
    fr: 'Gérez vos moyens de paiement et vos informations de facturation.',
    de: 'Verwalten Sie Ihre Zahlungsmethoden und Rechnungsdaten.',
    es: 'Administre sus métodos de pago e información de facturación.',
    zh: '管理您的支付方式和账单信息。',
  },
})

// const route = useRoute()
// const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained />
</template>

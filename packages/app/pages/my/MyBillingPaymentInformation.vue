<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsBillingPaymentInformation',
  path: '/settings/payment-methods',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-billing',
  icon: 'i-carbon:money',
  title: {
    en: 'Payment methods',
    fr: 'Moyens de paiement',
    de: 'Zahlungsmethoden',
    es: 'Métodos de pago',
    zh: '付款方式',
  },
  description: {
    en: 'Manage your payment methods and billing information.',
    fr: 'Gérez vos moyens de paiement et vos informations de facturation.',
    de: 'Verwalten Sie Ihre Zahlungsmethoden und Rechnungsinformationen.',
    es: 'Administre sus métodos de pago e información de facturación.',
    zh: '管理您的付款方式和账单信息。',
  },
})
</script>

<template>
  <AppPageContainer contained>
    <!-- Payment methods management content will go here -->
  </AppPageContainer>
</template>

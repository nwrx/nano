<script setup lang="ts">
definePageMeta({
  name: 'UserSettingsBillingInvoices',
  path: '/settings/invoices',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-billing',
  icon: 'i-carbon:document-multiple-01',
  title: {
    en: 'Invoices',
    fr: 'Factures',
    de: 'Rechnungen',
    es: 'Facturas',
    zh: '发票',
  },
  description: {
    en: 'Manage your invoices and billing history.',
    fr: 'Gérez vos factures et votre historique de facturation.',
    de: 'Verwalten Sie Ihre Rechnungen und Abrechnungshistorie.',
    es: 'Administre sus facturas y su historial de facturación.',
    zh: '管理您的发票和账单历史。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsBillingInvoices',
  path: '/:workspace/settings/billing/invoices',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-billing',
  icon: 'i-carbon:document-multiple-01',
  title: {
    en: 'Invoices',
    fr: 'Factures',
    de: 'Rechnungen',
    es: 'Facturas',
    zh: '发票',
  },
  description: {
    en: 'View and download your billing invoices.',
    fr: 'Consultez et téléchargez vos factures de facturation.',
    de: 'Sehen und laden Sie Ihre Abrechnungen herunter.',
    es: 'Ver y descargar sus facturas de facturación.',
    zh: '查看和下载您的账单发票。',
  },
})

// const route = useRoute()
// const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained />
</template>

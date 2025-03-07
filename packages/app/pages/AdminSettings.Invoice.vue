<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsInvoice',
  path: '/admin/invoice',
  layout: 'admin-settings',
  group: 'admin-server',
  icon: 'i-carbon:document',
  title: {
    en: 'Invoice',
    fr: 'Factures',
    de: 'Rechnungen',
    es: 'Facturas',
    zh: '发票',
  },
  description: {
    en: 'View and manage system invoices and billing records.',
    fr: 'Consulter et gérer les factures du système et les registres de facturation.',
    de: 'Sehen und verwalten Sie Systemrechnungen und Abrechnungsunterlagen.',
    es: 'Vea y administre las facturas del sistema y los registros de facturación.',
    zh: '查看和管理系统发票和账单记录。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

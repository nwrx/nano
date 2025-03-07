<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsBilling',
  path: '/admin/billing',
  layout: 'admin-settings',
  group: 'admin-settings',
  icon: 'i-carbon:currency',
  title: {
    en: 'Billing',
    fr: 'Facturation',
    de: 'Abrechnung',
    es: 'Facturación',
    zh: '账单',
  },
  description: {
    en: 'Manage billing settings and payment configurations.',
    fr: 'Gérer les paramètres de facturation et les configurations de paiement.',
    de: 'Verwalten Sie Abrechnungseinstellungen und Zahlungskonfigurationen.',
    es: 'Administre la configuración de facturación y los ajustes de pago.',
    zh: '管理账单设置和支付配置。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

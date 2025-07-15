<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsInferenceProviders',
  path: '/admin/inference-providers',
  layout: 'admin-settings',
  group: 'admin-server',
  icon: 'i-carbon:ai-label',
  title: {
    en: 'Inference Providers',
    fr: 'Fournisseurs d\'inférence',
    de: 'Inferenzanbieter',
    es: 'Proveedores de inferencia',
    zh: '推理提供商',
  },
  description: {
    en: 'Manage inference providers and settings.',
    fr: 'Gérez les fournisseurs d\'inférence et les paramètres.',
    de: 'Verwalten Sie Inferenzanbieter und Einstellungen.',
    es: 'Administre los proveedores de inferencia y la configuración.',
    zh: '管理推理提供商和设置。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

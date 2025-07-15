<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsIdentityProviders',
  path: '/admin/identity-providers',
  layout: 'admin-settings',
  group: 'admin-users',
  icon: 'i-carbon:connect',
  title: {
    en: 'Identity Providers',
    fr: 'Fournisseurs d\'identité',
    de: 'Identitätsanbieter',
    es: 'Proveedores de identidad',
    zh: '身份提供商',
  },
  description: {
    en: 'Manage identity providers and authentication settings.',
    fr: 'Gérer les fournisseurs d\'identité et les paramètres d\'authentification.',
    de: 'Verwalten Sie Identitätsanbieter und Authentifizierungseinstellungen.',
    es: 'Administre los proveedores de identidad y la configuración de autenticación.',
    zh: '管理身份提供商和身份验证设置。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

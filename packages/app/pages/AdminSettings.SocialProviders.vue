<script setup lang="ts">
definePageMeta({
  name: 'AdminSettingsSocialProviders',
  path: '/admin/social-providers',
  layout: 'admin-settings',
  group: 'admin-users',
  icon: 'i-carbon:connect',
  title: {
    en: 'Social Providers',
    fr: 'Fournisseurs sociaux',
    de: 'Soziale Anbieter',
    es: 'Proveedores sociales',
    zh: '社交提供商',
  },
  description: {
    en: 'Manage social login providers and authentication settings.',
    fr: 'Gérer les fournisseurs de connexion sociale et les paramètres d\'authentification.',
    de: 'Verwalten Sie soziale Anmeldeanbieter und Authentifizierungseinstellungen.',
    es: 'Administre los proveedores de inicio de sesión social y la configuración de autenticación.',
    zh: '管理社交登录提供商和身份验证设置。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

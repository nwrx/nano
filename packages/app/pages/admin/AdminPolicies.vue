<script lang="ts">
definePageMeta({
  name: 'AdminSettingsPolicies',
  path: '/admin/policies',
  layout: 'admin-settings',
  group: 'admin-users',
  icon: 'i-carbon:security',
  title: {
    en: 'Policies',
    fr: 'Politiques',
    de: 'Richtlinien',
    es: 'Políticas',
    zh: '策略',
  },
  description: {
    en: 'Manage security policies and access control settings.',
    fr: 'Gérer les politiques de sécurité et les paramètres de contrôle d\'accès.',
    de: 'Verwalten Sie Sicherheitsrichtlinien und Zugriffskontrolleinstellungen.',
    es: 'Administre las políticas de seguridad y la configuración de control de acceso.',
    zh: '管理安全策略和访问控制设置。',
  },
})
</script>

<template>
  <AppPageContainer contained />
</template>

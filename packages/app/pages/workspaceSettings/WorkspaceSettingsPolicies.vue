<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsSecurityPolicies',
  path: '/:workspace/settings/security',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-security',
  icon: 'i-carbon:security',
  title: {
    en: 'Security Policies',
    fr: 'Politiques de sécurité',
    de: 'Sicherheitsrichtlinien',
    es: 'Políticas de seguridad',
    zh: '安全策略',
  },
  description: {
    en: 'Configure workspace security settings and access policies.',
    fr: 'Configurer les paramètres de sécurité et les politiques d\'accès de l\'espace de travail.',
    de: 'Konfigurieren Sie Sicherheitseinstellungen und Zugriffsrichtlinien für den Arbeitsbereich.',
    es: 'Configure los ajustes de seguridad y las políticas de acceso del espacio de trabajo.',
    zh: '配置工作区安全设置和访问策略。',
  },
})

// const route = useRoute()
// const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained />
</template>

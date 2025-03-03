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

// --- Route and i18n.
const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)

// --- Data and actions.
const { data, getWorkspace } = useWorkspace(workspace)
onMounted(getWorkspace)
</script>

<template>
  <AppPageContainer contained>
    <!-- Security settings content -->
    <AppPageForm
      :title="t('security.access.title')"
      :text="t('security.access.text')">
      <!-- Access controls will go here -->
    </AppPageForm>

    <AppPageForm
      :title="t('security.authentication.title')"
      :text="t('security.authentication.text')">
      <!-- Authentication settings will go here -->
    </AppPageForm>

    <AppPageForm
      :title="t('security.audit.title')"
      :text="t('security.audit.text')">
      <!-- Audit log settings will go here -->
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  security:
    access:
      title: Access Control
      text: Manage who can access your workspace and what actions they can perform.
    authentication:
      title: Authentication Requirements
      text: Configure additional authentication requirements for accessing this workspace.
    audit:
      title: Audit Log
      text: Configure audit logging and review security events.
</i18n>

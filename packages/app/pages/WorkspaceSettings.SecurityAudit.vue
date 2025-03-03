<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsSecurityAudit',
  path: '/:workspace/settings/security/audit',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
  group: 'workspace-security',
  icon: 'i-carbon:list-bulleted',
  title: {
    en: 'Audit Logs',
    fr: 'Journaux d\'audit',
    de: 'Prüfprotokolle',
    es: 'Registros de auditoría',
    zh: '审计日志',
  },
  description: {
    en: 'Review security logs and audit trails for your workspace.',
    fr: 'Examinez les journaux de sécurité et les pistes d\'audit de votre espace de travail.',
    de: 'Überprüfen Sie Sicherheitsprotokolle und Prüfpfade für Ihren Arbeitsbereich.',
    es: 'Revise los registros de seguridad y pistas de auditoría para su espacio de trabajo.',
    zh: '查看您工作区的安全日志和审计追踪。',
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
    <AppPageForm
      :title="t('security.audit.title')"
      :text="t('security.audit.text')">
      <!-- Security audit logs and filtering controls will go here -->
    </AppPageForm>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  security:
    audit:
      title: Security Audit Logs
      text: Review security events and user activities in your workspace.
</i18n>

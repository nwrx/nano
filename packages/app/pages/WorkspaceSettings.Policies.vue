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

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained>
    <!--
      General security settings for the workspace. This includes those
      settings that are not covered by the other security settings components.
      - Enable: Whether the security settings are enabled.
      - Features: List of security features that can be enabled/disabled.
      + - SSH access: Enable/disable SSH access to the workspace. (Checkbox)
      + - API access: Enable/disable API access to the workspace. (Checkbox)
      + - Email access: Enable/disable email access to the workspace. (Checkbox)
    -->
    <WorkspaceSettingsPolicies :name="workspace" />

    <!--
      Table of ingress and egress network policies. Allows centralized
      managment of what, where, and how traffic is allowed in and out of
      the flows within the workspace.
      - Enable: Whether the network filtering is enabled.
      - Policies: Table of network policies. Kind of like a firewall.
      - Create Button: Create a new network policy.
    -->
    <WorkspaceSettingsNetworkPolicies :name="workspace" />
  </AppPageContainer>
</template>

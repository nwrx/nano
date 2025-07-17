<script setup lang="ts">
import Pattern from '~/components/base/Pattern.vue'

definePageMeta({
  name: 'WorkspaceMcp',
  path: '/:workspace/pools',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace-mcp',
  icon: 'i-carbon:connect',
  groups: ['nav-items-workspace'],
  title: {
    en: 'Integration Hub',
    fr: 'Hub d\'Intégration',
    de: 'Integrations-Hub',
    es: 'Centro de Integración',
    zh: '集成中心',
  },
  description: {
    en: 'Connect and manage your MCP servers and third-party integrations.',
    fr: 'Connectez et gérez vos serveurs MCP et intégrations tierces.',
    de: 'Verbinden und verwalten Sie Ihre MCP-Server und Drittanbieter-Integrationen.',
    es: 'Conecta y administra tus servidores MCP e integraciones de terceros.',
    zh: '连接和管理您的MCP服务器和第三方集成。',
  },
})

const { t } = useI18n()
</script>

<template>
  <Pattern
    class="b-0"
    :title="t('title')"
    :text="t('text')"
    icon="i-carbon:connect"
  />
</template>

<i18n lang="yaml">
en:
  title: Integration Hub
  text: Connect and manage your MCP servers and third-party integrations. Select an integration to configure its settings, monitor performance, and optimize resource allocation for your workspace.
fr:
  title: Hub d'Intégration
  text: Connectez et gérez vos serveurs MCP et intégrations tierces. Sélectionnez une intégration pour configurer ses paramètres, surveiller les performances et optimiser l'allocation des ressources pour votre espace de travail.
de:
  title: Integrations-Hub
  text: Verbinden und verwalten Sie Ihre MCP-Server und Drittanbieter-Integrationen. Wählen Sie eine Integration aus, um ihre Einstellungen zu konfigurieren, die Leistung zu überwachen und die Ressourcenzuweisung für Ihren Arbeitsbereich zu optimieren.
es:
  title: Centro de Integración
  text: Conecta y administra tus servidores MCP e integraciones de terceros. Selecciona una integración para configurar sus ajustes, monitorear el rendimiento y optimizar la asignación de recursos para tu espacio de trabajo.
zh:
  title: 集成中心
  text: 连接和管理您的MCP服务器和第三方集成。选择一个集成来配置其设置，监控性能并优化工作区的资源分配。
</i18n>

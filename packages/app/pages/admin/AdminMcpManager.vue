<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import McpManagerSettings from '~/components/mcpManager/McpManagerSettings.vue'

definePageMeta({
  name: 'AdminSettingsMcpManager',
  path: '/admin/mcp-managers/:manager',
  layout: 'admin-settings',
  icon: 'i-carbon:server',
  parent: 'AdminSettingsMcpManagers',
  title: {
    en: 'MCP Manager',
    fr: 'Gestionnaire MCP',
    de: 'MCP-Manager',
    es: 'Administrador MCP',
    zh: 'MCP管理器',
  },
  description: {
    en: 'Manage individual MCP manager configuration.',
    fr: 'Gérer la configuration du gestionnaire MCP individuel.',
    de: 'Einzelne MCP-Manager-Konfiguration verwalten.',
    es: 'Administrar la configuración individual del administrador MCP.',
    zh: '管理单个MCP管理器配置。',
  },
})

const route = useRoute()
const identity = computed(() => route.params.manager as string)
</script>

<template>
  <AppPageContainer contained>
    <McpManagerSettings :identity="identity" />
  </AppPageContainer>
</template>

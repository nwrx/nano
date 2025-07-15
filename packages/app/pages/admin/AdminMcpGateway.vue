<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import McpGatewaySettings from '~/components/mcpGateway/McpGatewaySettings.vue'

definePageMeta({
  name: 'McpGateway',
  path: '/admin/mcp-managers/:manager/gateway/:gateway',
  layout: 'admin-settings',
  icon: 'i-carbon:gateway',
  parent: 'AdminSettingsMcpManagers',
  title: {
    en: 'MCP Gateway',
    fr: 'Passerelle MCP',
    de: 'MCP-Gateway',
    es: 'Puerta de enlace MCP',
    zh: 'MCP网关',
  },
  description: {
    en: 'Manage MCP gateway configuration and routing.',
    fr: 'Gérer la configuration et le routage de la passerelle MCP.',
    de: 'MCP-Gateway-Konfiguration und -Routing verwalten.',
    es: 'Administrar la configuración y el enrutamiento de la puerta de enlace MCP.',
    zh: '管理MCP网关配置和路由。',
  },
})

const route = useRoute()
const manager = computed(() => route.params.manager as string)
const gateway = computed(() => route.params.gateway as string)
</script>

<template>
  <AppPageContainer contained>
    <McpGatewaySettings :manager="manager" :identity="gateway" />
  </AppPageContainer>
</template>

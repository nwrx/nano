<script setup lang="ts">
import FormDangerZone from '~/components/mcpServer/McpServerFormDangerZone.vue'
import FormSettings from '~/components/mcpServer/McpServerFormSettings.vue'

definePageMeta({
  name: 'WorkspaceMcpServer',
  path: '/:workspace/pools/:pool/servers/:server',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace-mcp',
  icon: 'i-carbon:box',
  groups: ['workspace-mcp-server'],
  title: {
    en: 'Integrations',
    fr: 'Intégrations',
    de: 'Integrationen',
    es: 'Integraciones',
    zh: '集成',
  },
  description: {
    en: 'Manage your integrations and MCP servers.',
    fr: 'Gérez vos intégrations et serveurs MCP.',
    de: 'Verwalten Sie Ihre Integrationen und MCP-Server.',
    es: 'Administra tus integraciones y servidores MCP.',
    zh: '管理您的集成和MCP服务器。',
  },
})

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const selectedPool = computed(() => route.params.pool as string)
const selectedServer = computed(() => route.params.server as string)
</script>

<template>
  <div>
    <FormSettings
      class="p-lg !m-0"
      :workspace="workspace"
      :pool="selectedPool"
      :name="selectedServer"
    />
    <FormDangerZone
      class="p-lg !m-0"
      :workspace="workspace"
      :pool="selectedPool"
      :name="selectedServer"
    />
  </div>
</template>

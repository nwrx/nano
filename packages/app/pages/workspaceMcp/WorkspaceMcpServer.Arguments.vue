<script setup lang="ts">
import FormArguments from '~/components/mcpServer/McpServerFormArguments.vue'
import FormArgumentsCreate from '~/components/mcpServer/McpServerFormArgumentsCreate.vue'

definePageMeta({
  name: 'WorkspaceMcpServerArguments',
  path: '/:workspace/pools/:pool/servers/:server/arguments',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace-mcp',
  icon: 'i-carbon:terminal',
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
    <FormArgumentsCreate
      class="p-lg !m-0"
      :workspace="workspace"
      :pool="selectedPool"
      :name="selectedServer"
    />
    <FormArguments
      class="p-lg !m-0"
      :workspace="workspace"
      :pool="selectedPool"
      :name="selectedServer"
    />
  </div>
</template>

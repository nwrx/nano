<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import McpManagerTable from '~/components/mcpManager/McpManagerTable.vue'

definePageMeta({
  name: 'AdminSettingsMcpManagers',
  path: '/admin/mcp-managers',
  layout: 'admin-settings',
  group: 'admin-server',
  icon: 'i-carbon:bare-metal-server-02',
  title: {
    en: 'MCP Infrastructure',
    fr: 'Infrastructure MCP',
    de: 'MCP-Infrastruktur',
    es: 'Infraestructura MCP',
    zh: 'MCP基础设施',
  },
  description: {
    en: 'Manage MCP infrastructure and remote operators.',
    fr: 'Gérer l\'infrastructure MCP et les opérateurs distants.',
    de: 'MCP-Infrastruktur und Remote-Operatoren verwalten.',
    es: 'Administrar la infraestructura MCP y los operadores remotos.',
    zh: '管理MCP基础设施和远程操作员。',
  },
})
</script>

<template>
  <AppPageContainer contained>
    <McpManagerTable />
  </AppPageContainer>
</template>

<script setup lang="ts">
import FormHeader from '~/components/mcpPool/McpPoolFormHeader.vue'
import FormStatus from '~/components/mcpPool/McpPoolFormStatus.vue'

definePageMeta({
  name: 'WorkspaceMcpPoolStatus',
  path: '/:workspace/integrations/:pool/status',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace-mcp',
  icon: 'i-carbon:box',
  groups: ['workspace-mcp-pool'],
  title: {
    en: 'Pool Status',
    fr: 'Statut du pool',
    de: 'Pool-Status',
    es: 'Estado del pool',
    zh: '池状态',
  },
  description: {
    en: 'View the status of your MCP pool.',
    fr: 'Voir le statut de votre pool MCP.',
    de: 'Status Ihres MCP-Pools anzeigen.',
    es: 'Ver el estado de su grupo MCP.',
    zh: '查看您的MCP池状态。',
  },
})

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const selectedPool = computed(() => route.params.pool as string)
</script>

<template>
  <div>
    <FormHeader
      :workspace="workspace"
      :name="selectedPool"
    />
    <FormStatus
      class="p-lg !m-0"
      :workspace="workspace"
      :name="selectedPool"
    />
  </div>
</template>

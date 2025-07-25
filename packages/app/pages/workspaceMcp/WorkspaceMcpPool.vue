<script setup lang="ts">
import FormDangerZone from '~/components/mcpPool/McpPoolFormDangerZone.vue'
import FormHeader from '~/components/mcpPool/McpPoolFormHeader.vue'
import FormSettings from '~/components/mcpPool/McpPoolFormSettings.vue'
import FormSpecs from '~/components/mcpPool/McpPoolFormSpecs.vue'

definePageMeta({
  name: 'WorkspaceMcpPool',
  path: '/:workspace/pools/:pool',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace-mcp',
  icon: 'i-carbon:box',
  groups: ['workspace-mcp-pool'],
  title: {
    en: 'Pool Settings',
    fr: 'Paramètres du pool',
    de: 'Pool-Einstellungen',
    es: 'Configuración del pool',
    zh: '池设置',
  },
  description: {
    en: 'Manage your MCP pool settings.',
    fr: 'Gérez les paramètres de votre pool MCP.',
    de: 'Verwalten Sie die Einstellungen Ihres MCP-Pools.',
    es: 'Administra la configuración de tu grupo MCP.',
    zh: '管理您的MCP池设置。',
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
    <FormSettings
      class="p-lg !m-0"
      :workspace="workspace"
      :name="selectedPool"
    />
    <FormSpecs
      class="p-lg !m-0"
      :workspace="workspace"
      :name="selectedPool"
    />
    <FormDangerZone
      class="p-lg !m-0"
      :workspace="workspace"
      :name="selectedPool"
    />
  </div>
</template>

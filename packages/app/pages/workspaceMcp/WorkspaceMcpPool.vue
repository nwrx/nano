<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import McpPoolList from '~/components/mcpPool/McpPool.List.vue'
import McpPool from '~/components/mcpPool/McpPool.vue'
import McpServer from '~/components/mcpServer/McpServer.vue'

definePageMeta({
  name: 'WorkspaceMcpPool',
  path: '/:workspace/pools/:pool',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace-mcp',
  icon: 'i-carbon:box',
  // groups: ['nav-items-workspace'],
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

const { t } = useI18n()
useHead(() => ({
  title: t('title'),
  meta: [{ name: 'description', content: t('description') }],
}))

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const search = ref('')
const selectedPool = ref<string>()
const selectedServer = ref<string>()

const client = useClient()
const pools = ref<McpPoolObject[]>([])
async function getPools() {
  await client.requestAttempt('GET /api/workspaces/:workspace/pools', {
    data: {
      workspace: workspace.value,
      search: search.value,
      withServers: true,
    },
    onData: (data) => {
      pools.value = data
    },
  })
}

watch([search, workspace], getPools, { immediate: true })
</script>

<template>
  <McpPool
    v-if="selectedPool && !selectedServer"
    :workspace="workspace"
    :name="selectedPool"
    @refresh="() => getPools()"
  />
</template>

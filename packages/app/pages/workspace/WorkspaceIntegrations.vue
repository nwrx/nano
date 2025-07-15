<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import McpPoolList from '~/components/mcpPool/McpPool.List.vue'
import McpPool from '~/components/mcpPool/McpPool.vue'
import McpServer from '~/components/mcpServer/McpServer.vue'

definePageMeta({
  name: 'WorkspaceContext',
  path: '/:workspace/integrations',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace',
  icon: 'i-carbon:box',
  groups: ['nav-items-workspace'],
  title: {
    en: 'Context',
    fr: 'Contexte',
    de: 'Kontext',
    es: 'Contexto',
    zh: '上下文',
  },
  description: {
    en: 'Manage your context servers.',
    fr: 'Gérez vos serveurs de contexte.',
    de: 'Verwalten Sie Ihre Kontextserver.',
    es: 'Administra tus servidores de contexto.',
    zh: '管理您的上下文服务器。',
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
const pool = ref<string>()
const server = ref<string>()

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
  <div class="flex h-full w-full flex-row">

    <!-- Select -->
    <McpPoolList
      v-model:pool="pool"
      v-model:server="server"
      v-model:search="search"
      :workspace="workspace"
      :pools="pools"
      class="b-r b-app h-full overflow-y-auto grow max-w-sm w-full"
      @refresh="() => getPools()"
    />

    <!-- Server -->
    <McpServer
      v-if="server && pool"
      :workspace="workspace"
      :pool="pool"
      :name="server"
      @refresh="() => getPools()"
    />

    <!-- Pool -->
    <McpPool
      v-if="pool && !server"
      :workspace="workspace"
      :name="pool"
      @refresh="() => getPools()"
    />
  </div>
</template>

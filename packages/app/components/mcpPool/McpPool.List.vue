<script setup lang="ts">
import type { McpPoolObject, McpServerObject } from '@nwrx/nano-api'
import PanelGroup from '~/components/base/Panel.Group.vue'
import PanelItem from '~/components/base/Panel.Item.vue'
import Panel from '~/components/base/Panel.vue'
import { useLocalSettings } from '~/composables/useLocalSettings'
import { getMcpServerStatusIcon, useMcpPools } from '~/composables/useMcp'
import ContextPanelActionsPool from '../mcpPool/McpPool.Actions.vue'
import ContextPanelDialogCreatePool from '../mcpPool/McpPool.DialogCreate.vue'
import ContextPanelActionsServer from '../mcpServer/McpServerActions.vue'
import ContextPanelDialogCreateServer from '../mcpServer/McpServerDialogCreate.vue'

const props = defineProps<{
  workspace: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const route = useRoute()
const settings = useLocalSettings()
const selectedPool = computed(() => route.params.pool as string)
const selectedServer = computed(() => route.params.server as string)
const search = defineModel<string>('search')

// --- Data.
const pools = useMcpPools(props)
pools.options.withServers = true
await pools.fetchPools()

// --- Flags.
const showCreatePoolDialog = ref(false)
const showCreateServerDialog = ref(false)
const showCreateServerPool = ref('')

function setContextMenuOpen(poolName: string, value: boolean): void {
  settings.value.contextMenuOpen = {
    ...settings.value.contextMenuOpen,
    [poolName]: value,
  }
}

function getContextMenuOpen(poolName: string): boolean {
  return settings.value.contextMenuOpen?.[poolName] ?? false
}

function isSelected(pool: McpPoolObject, server: McpServerObject): boolean {
  return selectedPool.value === pool.name
    && selectedServer.value === server.name
}
</script>

<template>
  <Panel v-model:search="search" show-search>

    <!-- Pools -->
    <PanelGroup
      v-for="pool in pools.data"
      :key="pool.name"
      :label="pool.title || pool.name"
      :description="pool.title ? pool.description : undefined"
      :model-value="getContextMenuOpen(pool.name)"
      @update:model-value="(value) => setContextMenuOpen(pool.name, value)">

      <!-- Servers -->
      <template #default>
        <PanelItem
          v-for="server in pool.servers"
          :key="server.name"
          :icon="getMcpServerStatusIcon(server)"
          class="group"
          :label="server.title || server.name"
          :description="server.title ? server.description : undefined"
          :is-active="isSelected(pool, server)"
          :to="{
            name: 'WorkspaceMcpServer',
            params: {
              workspace,
              pool: pool.name,
              server: server.name,
            },
          }">

          <!-- Context menu -->
          <template #menu>
            <ContextPanelActionsServer
              :workspace="workspace"
              :pool="pool"
              :server="server"
              class="op-0 group-hover:op-100 transition"
              @refresh="() => emit('refresh')"
            />
          </template>
        </PanelItem>

        <!-- Create new server -->
        <PanelItem
          icon="i-carbon:add"
          :description="t('createServer')"
          @click="() => {
            showCreateServerPool = pool.name
            showCreateServerDialog = true
          }"
        />
      </template>

      <!-- Context menu -->
      <template #menu>
        <ContextPanelActionsPool
          :pool="pool"
          :workspace="workspace"
          @refresh="() => emit('refresh')"
        />
      </template>
    </PanelGroup>

    <!-- Create new pool button -->
    <PanelItem
      icon="i-carbon:folder-add"
      :description="t('createPool')"
      @click="() => showCreatePoolDialog = true"
    />

    <!-- Create new pool dialog -->
    <ContextPanelDialogCreatePool
      v-model="showCreatePoolDialog"
      :workspace="workspace"
      @submit="() => emit('refresh')"
    />

    <!-- Create new server dialog -->
    <ContextPanelDialogCreateServer
      v-model="showCreateServerDialog"
      :workspace="workspace"
      :pool="showCreateServerPool"
      @submit="() => emit('refresh')"
    />
  </Panel>
</template>

<i18n lang="yaml">
en:
  createPool: Create a new pool
  createServer: Create a new Server
fr:
  createPool: Créer un nouveau groupe
  createServer: Créer un nouveau serveur
de:
  createPool: Neuen Pool erstellen
  createServer: Neuen Server erstellen
es:
  createPool: Crear un nuevo grupo
  createServer: Crear un nuevo servidor
zh:
  createPool: 创建新的池
  createServer: 创建新的服务器
</i18n>

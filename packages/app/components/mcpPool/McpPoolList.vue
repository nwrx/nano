<script setup lang="ts">
import Panel from '~/components/base/Panel.vue'
import { useMcpPools } from '~/composables/useMcp'
import DialogCreateServer from '../mcpServer/McpServerDialogCreate.vue'
import DialogCreatePool from './McpPoolDialogCreate.vue'
import McpPoolListPool from './McpPoolList.Pool.vue'

const props = defineProps<{
  workspace: string
}>()

const { t } = useI18n()
const route = useRoute()
const selectedPool = computed(() => route.params.pool as string)
const selectedServer = computed(() => route.params.server as string)

// --- Data.
const pools = useMcpPools(props)
pools.options.withServers = true

watchThrottled(
  () => pools.options.search,
  () => void pools.fetchPools(),
  { throttle: 300, immediate: true },
)

// --- Dialogs.
const showCreatePoolDialog = ref(false)
const showCreateServerDialog = ref(false)
const showCreateServerPool = ref('')
</script>

<template>
  <Panel
    v-model:search="pools.options.search"
    show-search>

    <!-- Pools -->
    <McpPoolListPool
      v-for="pool in pools.data"
      :key="pool.name"
      :workspace="workspace"
      :pool="pool"
      :is-selected="selectedPool === pool.name"
      :selected-server="selectedServer"
      @create-server="() => {
        showCreateServerDialog = true
        showCreateServerPool = pool.name
      }"
    />

    <!-- Create new pool button -->
    <PanelItem
      icon="i-carbon:folder-add"
      :description="t('createPool')"
      @click="() => showCreatePoolDialog = true"
    />

    <!-- Create new pool dialog -->
    <DialogCreatePool
      v-model="showCreatePoolDialog"
      :workspace="workspace"
    />

    <!-- Create new server dialog -->
    <DialogCreateServer
      v-model="showCreateServerDialog"
      :workspace="workspace"
      :pool="showCreateServerPool"
    />
  </Panel>
</template>

<i18n lang="yaml">
en:
  createPool: Create a new pool
fr:
  createPool: Créer un nouveau groupe
de:
  createPool: Neuen Pool erstellen
es:
  createPool: Crear un nuevo grupo
zh:
  createPool: 创建新的池
</i18n>

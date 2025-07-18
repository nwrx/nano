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
const isOpen = ref(false)
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
  <div
    class="transition-all duration-slow overflow-hidden"
    :class="{
      'w-16 cursor-pointer': !isOpen,
      'w-168': isOpen,
    }"
    @mousedown="() => {
      if (isOpen) return
      isOpen = true
    }">

    <!-- Search -->
    <div
      class="
        flex items-center justify-center gap-md
        transition-all duration-slow
        "
      :class="{
        'p-x-md py-md b-b-app': isOpen,
        'p-x-xs py-md b-b-app': !isOpen,
      }">
      <InputText
        v-model="pools.options.search"
        type="text"
        :placeholder="t('search')"
        icon="i-carbon:search"
        class="transition-all duration-slow shrink"
        :class="{ hidden: !isOpen }"
      />

      <!-- Expand/Contact Fab -->
      <Button
        class="button-fab shrink-0"
        :class="{ 'bg-transparent b-transparent hover:bg-transparent': !isOpen }"
        :icon="isOpen ? 'i-carbon:side-panel-close-filled' : 'i-carbon:side-panel-open'"
        @click="() => isOpen = !isOpen"
      />
    </div>

    <!-- Pools -->
    <Panel
      class="transition-all duration-slow"
      :class="{ 'op-0 pointer-events-none': !isOpen }">
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
  </div>
</template>

<i18n lang="yaml">
en:
  search: Search Pools
  createPool: Create a new pool
fr:
  search: Rechercher des groupes
  createPool: Créer un nouveau groupe
de:
  search: Suche Pools
  createPool: Neuen Pool erstellen
es:
  search: Buscar grupos
  createPool: Crear un nuevo grupo
zh:
  search: 搜索池
  createPool: 创建新的池
</i18n>

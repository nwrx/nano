<script setup lang="ts">
import type { McpPoolObject } from '@nwrx/nano-api'
import PanelGroup from '~/components/base/Panel.Group.vue'
import PanelItem from '~/components/base/Panel.Item.vue'
import Actions from '../mcpPool/McpPoolActions.vue'
import McpPoolListServer from './McpPoolList.Server.vue'

defineProps<{
  workspace: string
  pool: McpPoolObject
  isSelected?: boolean
  selectedServer?: string
}>()

const emit = defineEmits<{
  'createServer': []
}>()

const { t } = useI18n()
</script>

<template>
  <PanelGroup
    icon="i-carbon:folder"
    class-button="h-12"
    :label="pool.title || pool.name"
    :description="pool.title ? pool.description : undefined">

    <!-- Servers -->
    <template #default>
      <McpPoolListServer
        v-for="server in pool.servers"
        :key="server.name"
        :workspace="workspace"
        :pool="pool.name"
        :server="server"
        :is-selected="selectedServer === server.name"
      />

      <!-- Create new server -->
      <PanelItem
        icon="i-carbon:add"
        class="h-9"
        :description="t('createServer')"
        @click="() => emit('createServer')"
      />
    </template>

    <!-- Context menu -->
    <template #menu>
      <Actions
        :workspace="workspace"
        :name="pool.name"
      />
    </template>
  </PanelGroup>
</template>

<i18n lang="yaml">
en:
  createServer: Create a new Server
fr:
  createServer: Créer un nouveau serveur
de:
  createServer: Neuen Server erstellen
es:
  createServer: Crear un nuevo servidor
zh:
  createServer: 创建新的服务器
</i18n>

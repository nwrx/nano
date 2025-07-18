<script setup lang="ts">
import type { McpServerObject } from '@nwrx/nano-api'
import PanelItem from '~/components/base/Panel.Item.vue'
import { getMcpServerStatusIcon } from '~/composables/useMcp'
import ActionsServer from '../mcpServer/McpServerActions.vue'

const props = defineProps<{
  workspace: string
  pool: string
  server: McpServerObject
  isSelected: boolean
}>()

const route = useRoute()
const linkTo = computed(() => {
  const isWorkspaceMcpRoute = route.name?.toString().startsWith('WorkspaceMcpServer')
  return {
    name: isWorkspaceMcpRoute ? route.name : 'WorkspaceMcpServer',
    params: {
      workspace: props.workspace,
      pool: props.pool,
      server: props.server.name,
    },
  }
})
</script>

<template>
  <PanelItem
    class="h-9"
    :icon="getMcpServerStatusIcon(server)"
    :label="server.title || server.name"
    :description="server.title ? server.description : undefined"
    :is-active="isSelected"
    :to="linkTo">

    <!-- Context menu -->
    <template #menu>
      <ActionsServer
        :workspace="workspace"
        :pool="pool"
        :server="server"
        class="op-0 group-hover:op-100 transition"
      />
    </template>
  </PanelItem>
</template>

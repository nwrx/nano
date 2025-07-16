<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import { toCamelCase } from '@unshared/string/toCamelCase'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Hyperlink from '~/components/base/Hyperlink.vue'
import TableCellDate from '~/components/base/Table.CellDate.vue'
import Table from '~/components/base/Table.vue'
import McpGatewayActions from './McpGatewayActions.vue'
import McpGatewayCard from './McpGatewayCard.vue'
import McpGatewayDialogRegister from './McpGatewayDialogRegister.vue'

defineProps<{
  manager: McpManagerObject
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const showAddDialog = ref(false)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <Table
      :rows="manager.gateways"
      :columns="['identity', 'address', 'lastSeenAt', 'actions']">
      <template #header="name">
        {{ t(toCamelCase('header', name)) }}
      </template>

      <!-- Identity -->
      <template #cell.identity="gateway">
        <McpGatewayCard :gateway is-link inline />
      </template>

      <!-- Address -->
      <template #cell.address="{ address }">
        <span class="text-sm text-subtle">{{ address }}</span>
      </template>

      <!-- Last Seen At -->
      <template #cell.lastSeenAt="{ lastSeenAt }">
        <TableCellDate :last-seen-at="lastSeenAt" />
      </template>

      <!-- Actions -->
      <template #cell.actions="gateway">
        <McpGatewayActions
          :gateway="gateway"
          :manager="manager.identity"
          @submit="() => emit('refresh')"
        />
      </template>
    </Table>

    <!-- Add Gateway Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('addGateway')"
      @click="() => showAddDialog = true"
    />

    <!-- Add Gateway Dialog -->
    <McpGatewayDialogRegister
      v-model="showAddDialog"
      :manager="manager"
      @submit="() => emit('refresh')"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Gateways
  text: Manage MCP gateways assigned to this manager. Gateways serve as connection points for MCP servers and handle protocol communication.
  addGateway: Add gateway
  headerIdentity: Gateway
  headerAddress: Address
  headerLastSeenAt: Last Seen
  headerActions: ''
fr:
  title: Passerelles
  text: Gérez les passerelles MCP assignées à ce gestionnaire. Les passerelles servent de points de connexion pour les serveurs MCP et gèrent la communication de protocole.
  addGateway: Ajouter une passerelle
  headerIdentity: Passerelle
  headerAddress: Adresse
  headerLastSeenAt: Dernière vue
  headerActions: ''
de:
  title: Gateways
  text: Verwalten Sie MCP-Gateways, die diesem Manager zugewiesen sind. Gateways dienen als Verbindungspunkte für MCP-Server und handhaben die Protokollkommunikation.
  addGateway: Gateway hinzufügen
  headerIdentity: Gateway
  headerAddress: Adresse
  headerLastSeenAt: Zuletzt gesehen
  headerActions: ''
es:
  title: Puertas de Enlace
  text: Administre las puertas de enlace MCP asignadas a este administrador. Las puertas de enlace sirven como puntos de conexión para servidores MCP y manejan la comunicación de protocolo.
  addGateway: Agregar puerta de enlace
  headerIdentity: Puerta de Enlace
  headerAddress: Dirección
  headerLastSeenAt: Última vista
  headerActions: ''
zh:
  title: 网关
  text: 管理分配给此管理器的MCP网关。网关作为MCP服务器的连接点并处理协议通信。
  addGateway: 添加网关
  headerIdentity: 网关
  headerAddress: 地址
  headerLastSeenAt: 最后查看
  headerActions: ''
</i18n>

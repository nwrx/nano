<script setup lang="ts">
import type { McpManagerObject } from '@nwrx/nano-api'
import { toCamelCase } from '@unshared/string/toCamelCase'
import Hyperlink from '~/components/base/Hyperlink.vue'
import TableCellDate from '~/components/base/Table.CellDate.vue'
import Table from '~/components/base/Table.vue'
import AppPageForm from '../app/AppPageForm.vue'
import McpManagerActions from './McpManagerActions.vue'
import McpManagerCard from './McpManagerCard.vue'
import DialogRegister from './McpManagerDialogRegister.vue'

const { t } = useI18n()
const client = useClient()
const showRegisterDialog = ref(false)

const managers = ref<McpManagerObject[]>([])
async function getManagers() {
  await client.request('GET /api/mcp', {
    onData: data => managers.value = data,
  })
}

onMounted(getManagers)
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Table -->
    <Table
      :rows="managers"
      :columns="['identity', 'address', 'lastSeenAt', 'actions']">

      <!-- Headers -->
      <template #header="name">
        {{ t(toCamelCase('header', name)) }}
      </template>

      <!-- Identity -->
      <template #cell.identity="manager">
        <McpManagerCard :manager is-link inline />
      </template>

      <!-- Address -->
      <template #cell.address="{ address }">
        <span class="text-sm text-subtle">{{ address }}</span>
      </template>

      <!-- Last Seen At -->
      <template #cell.lastSeenAt="{ lastSeenAt }">
        <TableCellDate :created-at="lastSeenAt" />
      </template>

      <!-- Actions -->
      <template #cell.actions="manager">
        <McpManagerActions
          :manager="manager"
          @submit="() => getManagers()"
        />
      </template>
    </Table>

    <!-- Register Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('register')"
      @click="() => showRegisterDialog = true"
    />

    <!-- Register Dialog -->
    <DialogRegister
      v-model="showRegisterDialog"
      @submit="() => getManagers()"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: MCP Infrastructure
  text: Manage and monitor MCP manager servers. MCP managers are responsible for orchestrating and coordinating Model Context Protocol resources across your infrastructure.
  register: Register a new manager
  headerIdentity: Manager
  headerAddress: Address
  headerLastSeenAt: Last Seen
  headerActions: ''
fr:
  title: Infrastructure MCP
  text: Gérez et surveillez les serveurs de gestionnaire MCP. Les gestionnaires MCP sont responsables de l'orchestration et de la coordination des ressources du protocole de contexte de modèle dans votre infrastructure.
  register: Enregistrer un nouveau gestionnaire
  headerIdentity: Gestionnaire
  headerAddress: Adresse
  headerLastSeenAt: Dernière vue
  headerActions: ''
de:
  title: MCP-Infrastruktur
  text: Verwalten und überwachen Sie MCP-Manager-Server. MCP-Manager sind für die Orchestrierung und Koordination von Model Context Protocol-Ressourcen in Ihrer Infrastruktur verantwortlich.
  register: Neuen Manager registrieren
  headerIdentity: Manager
  headerAddress: Adresse
  headerLastSeenAt: Zuletzt gesehen
  headerActions: ''
es:
  title: Infraestructura MCP
  text: Administre y supervise los servidores de administrador MCP. Los administradores MCP son responsables de orquestar y coordinar los recursos del protocolo de contexto del modelo en su infraestructura.
  register: Registrar un nuevo administrador
  headerIdentity: Administrador
  headerAddress: Dirección
  headerLastSeenAt: Última vista
  headerActions: ''
zh:
  title: MCP基础设施
  text: 管理和监控MCP管理器服务器。MCP管理器负责在您的基础设施中编排和协调模型上下文协议资源。
  register: 注册新管理器
  headerIdentity: 管理器
  headerAddress: 地址
  headerLastSeenAt: 最后查看
  headerActions: ''
</i18n>

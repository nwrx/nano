<script setup lang="ts">
import type { McpPoolObject, McpPoolStatus } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Badge from '~/components/base/Badge.vue'
import Button from '~/components/base/Button.vue'
import RecordsEntry from '~/components/base/Records.Entry.vue'
import RecordsField from '~/components/base/Records.Field.vue'
import Records from '~/components/base/Records.vue'

const props = defineProps<{
  pool: McpPoolObject
  workspace: string
}>()

const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

// --- Pool status reactive state
const status = ref<McpPoolStatus>({
  isSynchronized: false,
  activeServersCount: 0,
  managedServersCount: 0,
  pendingServersCount: 0,
  totalServersCount: 0,
  unmanagedServersCount: 0,
  remoteSpec: {
    defaultIdleTimeout: 0,
    maxServersActive: 0,
    maxServersLimit: 0,
  },
  localSpec: {
    defaultIdleTimeout: 0,
    maxServersActive: 0,
    maxServersLimit: 0,
  },
})

const isLoading = ref(false)
const isSynchronizing = ref(false)

// --- Fetch pool status
async function fetchStatus() {
  if (isLoading.value) return
  isLoading.value = true
  await client.requestAttempt('GET /api/workspaces/:workspace/pools/:pool/status', {
    data: {
      workspace: props.workspace,
      pool: props.pool.name,
    },
    onData: (data: McpPoolStatus) => {
      status.value = data
    },
    onEnd: () => {
      isLoading.value = false
    },
  })
}

// --- Synchronize pool
async function synchronizePool() {
  if (isSynchronizing.value) return
  isSynchronizing.value = true
  await client.requestAttempt('POST /api/workspaces/:workspace/pools/:pool/synchronize', {
    data: {
      workspace: props.workspace,
      pool: props.pool.name,
    },
    onSuccess: () => {
      alerts.success(t('synchronizeSuccessMessage'))
      void fetchStatus()
    },
    onEnd: () => {
      isSynchronizing.value = false
    },
  })
}

// --- Lifecycle
onMounted(fetchStatus)
watch(() => props.pool, fetchStatus, { immediate: true })
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Status Overview -->
    <Records>
      <!-- Server Status Badges -->
      <div class="flex items-center space-x-md p-lg">
        <Badge
          :label="status.isSynchronized ? t('statusSyncronized') : t('statusNotSyncronized')"
          :class="status.isSynchronized ? 'badge-success' : 'badge-danger'"
          :icon="status.isSynchronized ? 'i-carbon:checkmark' : 'i-carbon:close'"
        />
        <Badge
          :label="t('activeServersLabel', { count: status.activeServersCount })"
          class="badge-success font-normal"
          icon="i-carbon:play-outline"
        />
        <Badge
          :label="t('pendingServersLabel', { count: status.pendingServersCount })"
          class="badge-warning font-normal"
          icon="i-carbon:time"
        />
        <Badge
          :label="t('totalServersLabel', { count: status.totalServersCount })"
          class="badge-primary font-normal"
          icon="i-carbon:box"
        />
      </div>

      <!-- Server Counts -->
      <RecordsEntry :title="t('serverCountsTitle')" icon="i-carbon:box">
        <template #fields>
          <RecordsField :label="t('activeServersField')" :value="status.activeServersCount" />
          <RecordsField :label="t('managedServersField')" :value="status.managedServersCount" />
          <RecordsField :label="t('unmanagedServersField')" :value="status.unmanagedServersCount" />
          <RecordsField :label="t('pendingServersField')" :value="status.pendingServersCount" />
          <RecordsField :label="t('totalServersField')" :value="status.totalServersCount" />
        </template>
      </RecordsEntry>

      <!-- Remote spec -->
      <RecordsEntry :title="t('remoteSpecTitle')" icon="i-carbon:cloud">
        <template #fields>
          <RecordsField :label="t('defaultIdleTimeoutField')" :value="status.remoteSpec?.defaultIdleTimeout" />
          <RecordsField :label="t('maxActiveServersField')" :value="status.remoteSpec?.maxServersActive" />
          <RecordsField :label="t('maxServerLimitField')" :value="status.remoteSpec?.maxServersLimit" />
        </template>
      </RecordsEntry>

      <!-- Local -->

      <!-- Remote spec -->
      <RecordsEntry :title="t('localSpecTitle')" icon="i-carbon:cloud-satellite">
        <template #fields>
          <RecordsField :label="t('defaultIdleTimeoutField')" :value="status.localSpec?.defaultIdleTimeout" />
          <RecordsField :label="t('maxActiveServersField')" :value="status.localSpec?.maxServersActive" />
          <RecordsField :label="t('maxServerLimitField')" :value="status.localSpec?.maxServersLimit" />
        </template>
      </RecordsEntry>
    </Records>

    <!-- Actions -->
    <div class="w-full flex items-center justify-between pt-md">
      <Button
        :loading="isLoading"
        icon-prepend="i-carbon:renew"
        :label="t('refreshStatusAction')"
        @click="() => fetchStatus()"
      />

      <Button
        :loading="isSynchronizing"
        class="button-primary"
        icon-prepend="i-carbon:upload"
        :label="t('synchronizePoolAction')"
        @click="() => synchronizePool()"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Resource Status
  text: Monitor real-time server metrics and resource configuration. Track active connections, pending requests, and synchronization status across your MCP server resources.
  statusSyncronized: Synchronized
  statusNotSyncronized: Desynchronized
  activeServersLabel: '{count} Active'
  pendingServersLabel: '{count} Pending'
  totalServersLabel: '{count} Total'
  serverCountsTitle: Server Metrics
  activeServersField: Active Servers
  managedServersField: Managed Servers
  unmanagedServersField: Unmanaged Servers
  pendingServersField: Pending Servers
  totalServersField: Total Servers
  remoteSpecTitle: Remote Configuration
  localSpecTitle: Local Configuration
  defaultIdleTimeoutField: Default Idle Timeout
  maxActiveServersField: Max Active Servers
  maxServerLimitField: Server Limit
  refreshStatusAction: Refresh Status
  synchronizePoolAction: Synchronize Resource
  synchronizeSuccessMessage: Resource synchronized successfully
  synchronizeErrorMessage: Failed to synchronize resource
fr:
  title: État des Ressources
  text: Surveillez les métriques de serveur en temps réel et la configuration des ressources. Suivez les connexions actives, les requêtes en attente et l'état de synchronisation de vos ressources de serveurs MCP.
  statusSyncronized: Synchronisé
  statusNotSyncronized: Désynchronisé
  activeServersLabel: '{count} Actifs'
  pendingServersLabel: '{count} En attente'
  totalServersLabel: '{count} Total'
  serverCountsTitle: Métriques des Serveurs
  activeServersField: Serveurs Actifs
  managedServersField: Serveurs Gérés
  unmanagedServersField: Serveurs Non Gérés
  pendingServersField: Serveurs En Attente
  totalServersField: Total des Serveurs
  remoteSpecTitle: Configuration Distante
  localSpecTitle: Configuration Locale
  defaultIdleTimeoutField: Délai d'Inactivité Par Défaut
  maxActiveServersField: Serveurs Actifs Maximum
  maxServerLimitField: Limite de Serveurs
  refreshStatusAction: Actualiser l'État
  synchronizePoolAction: Synchroniser la Ressource
  synchronizeSuccessMessage: Ressource synchronisée avec succès
  synchronizeErrorMessage: Échec de la synchronisation de la ressource
de:
  title: Ressourcenstatus
  text: Überwachen Sie Echtzeit-Server-Metriken und Ressourcenkonfiguration. Verfolgen Sie aktive Verbindungen, ausstehende Anfragen und den Synchronisationsstatus Ihrer MCP-Server-Ressourcen.
  statusSyncronized: Synchronisiert
  statusNotSyncronized: Desynchronisiert
  activeServersLabel: '{count} Aktiv'
  pendingServersLabel: '{count} Ausstehend'
  totalServersLabel: '{count} Gesamt'
  serverCountsTitle: Server-Metriken
  activeServersField: Aktive Server
  managedServersField: Verwaltete Server
  unmanagedServersField: Nicht verwaltete Server
  pendingServersField: Ausstehende Server
  totalServersField: Server Gesamt
  remoteSpecTitle: Remote-Konfiguration
  localSpecTitle: Lokale Konfiguration
  defaultIdleTimeoutField: Standard-Leerlaufzeit
  maxActiveServersField: Max. Aktive Server
  maxServerLimitField: Server-Limit
  refreshStatusAction: Status Aktualisieren
  synchronizePoolAction: Ressource Synchronisieren
  synchronizeSuccessMessage: Ressource erfolgreich synchronisiert
  synchronizeErrorMessage: Ressource-Synchronisation fehlgeschlagen
es:
  title: Estado de Recursos
  text: Monitoree métricas de servidor en tiempo real y configuración de recursos. Rastree conexiones activas, solicitudes pendientes y estado de sincronización en sus recursos de servidores MCP.
  statusSyncronized: Sincronizado
  statusNotSyncronized: Desincronizado
  activeServersLabel: '{count} Activos'
  pendingServersLabel: '{count} Pendientes'
  totalServersLabel: '{count} Total'
  serverCountsTitle: Métricas de Servidores
  activeServersField: Servidores Activos
  managedServersField: Servidores Administrados
  unmanagedServersField: Servidores No Administrados
  pendingServersField: Servidores Pendientes
  totalServersField: Total de Servidores
  remoteSpecTitle: Configuración Remota
  localSpecTitle: Configuración Local
  defaultIdleTimeoutField: Tiempo de Inactividad Predeterminado
  maxActiveServersField: Servidores Activos Máximos
  maxServerLimitField: Límite de Servidores
  refreshStatusAction: Actualizar Estado
  synchronizePoolAction: Sincronizar Recurso
  synchronizeSuccessMessage: Recurso sincronizado exitosamente
  synchronizeErrorMessage: Error al sincronizar el recurso
zh:
  title: 资源状态
  text: 监控实时服务器指标和资源配置。跟踪您的 MCP 服务器资源中的活跃连接、待处理请求和同步状态。
  statusSyncronized: 已同步
  statusNotSyncronized: 未同步
  activeServersLabel: '{count} 个活跃'
  pendingServersLabel: '{count} 个待处理'
  totalServersLabel: '{count} 个总计'
  serverCountsTitle: 服务器指标
  activeServersField: 活跃服务器
  managedServersField: 受管理服务器
  unmanagedServersField: 未管理服务器
  pendingServersField: 待处理服务器
  totalServersField: 服务器总数
  remoteSpecTitle: 远程配置
  localSpecTitle: 本地配置
  defaultIdleTimeoutField: 默认空闲超时
  maxActiveServersField: 最大活跃服务器数
  maxServerLimitField: 服务器限制
  refreshStatusAction: 刷新状态
  synchronizePoolAction: 同步资源
  synchronizeSuccessMessage: 资源同步成功
  synchronizeErrorMessage: 资源同步失败
</i18n>

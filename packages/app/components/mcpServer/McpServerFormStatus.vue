<!-- eslint-disable unicorn/no-null -->
<script setup lang="ts">
import type { McpServerStatus } from '@nwrx/nano-api'
import { toCamelCase } from '@unshared/string/toCamelCase'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Badge from '~/components/base/Badge.vue'
import Button from '~/components/base/Button.vue'
import RecordsEntry from '~/components/base/Records.Entry.vue'
import RecordsField from '~/components/base/Records.Field.vue'
import Records from '~/components/base/Records.vue'
import { useMcpServer } from '~/composables/useMcp'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const server = useMcpServer(props)
onMounted(server.fetchStatus)

function toReadableTransport(transport?: McpServerStatus['localSpec']['transport']) {
  if (!transport) return t('transportUnknown')
  const key = toCamelCase('transport', transport.type)
  return t(key, { port: transport.port ?? t('transportDefaultPort') })
}

const readableStatus = computed(() => {
  const status = server.status
  return ({
    statusStartedAt: status.startedAt ? formatDateFromNow(status.startedAt) : t('never'),
    statusStoppedAt: status.stoppedAt ? new Date(status.stoppedAt).toLocaleString() : t('never'),
    statusLastRequestAt: status.lastRequestAt ? new Date(status.lastRequestAt).toLocaleString() : t('never'),
    localTransport: toReadableTransport(status.localSpec.transport),
    localIdleTimeout: formatDuration(status.localSpec.idleTimeout),
    localCommand: status.localSpec.command ? status.localSpec.command.join(' ') : '',
    remoteTransport: toReadableTransport(status.remoteSpec.transport),
    remoteIdleTimeout: formatDuration(status.remoteSpec.idleTimeout),
    remoteCommand: status.remoteSpec.command ? status.remoteSpec.command.join(' ') : '',
  })
})
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Status Overview -->
    <Records>
      <div class="flex items-center space-x-md p-lg">
        <Badge
          :label="server.status.isSynchronized ? t('statusSynchronized') : t('statusNotSynchronized')"
          :class="server.status.isSynchronized ? 'badge-success' : 'badge-danger'"
          :icon="server.status.isSynchronized ? 'i-carbon:checkmark' : 'i-carbon:close'"
        />
        <Badge
          :label="server.status.phase"
          :icon="server.statusIcon"
          :class="server.statusBadge"
        />
      </div>

      <!-- Server Runtime -->
      <RecordsEntry :title="t('serverStatus')" icon="i-carbon:play-outline">
        <template #fields>
          <RecordsField :label="t('totalRequests')" :value="server.status.totalRequests" />
          <RecordsField :label="t('currentConnections')" :value="server.status.currentConnections" />
          <RecordsField :label="t('startedAt')" :value="readableStatus.statusStartedAt" />
          <RecordsField :label="t('stoppedAt')" :value="readableStatus.statusStoppedAt" />
          <RecordsField :label="t('lastRequestAt')" :value="readableStatus.statusLastRequestAt" />
        </template>
      </RecordsEntry>

      <!-- Remote Spec -->
      <RecordsEntry :title="t('remoteSpec')" icon="i-carbon:cloud">
        <template #fields>
          <RecordsField :label="t('pool')" :value="server.status.remoteSpec.pool" />
          <RecordsField :label="t('image')" :value="server.status.remoteSpec.image" />
          <RecordsField :label="t('command')" :value="readableStatus.remoteCommand" />
          <RecordsField :label="t('transport')" :value="readableStatus.remoteTransport" />
          <RecordsField :label="t('idleTimeout')" :value="readableStatus.remoteIdleTimeout" />
        </template>
      </RecordsEntry>

      <!-- Local Spec -->
      <RecordsEntry :title="t('localSpec')" icon="i-carbon:cloud-satellite">
        <template #fields>
          <RecordsField :label="t('image')" :value="server.status.localSpec.image" />
          <RecordsField :label="t('command')" :value="readableStatus.localCommand" />
          <RecordsField :label="t('transport')" :value="readableStatus.localTransport" />
          <RecordsField :label="t('idleTimeout')" :value="readableStatus.localIdleTimeout" />
        </template>
      </RecordsEntry>
    </Records>

    <!-- Actions -->
    <div class="w-full flex items-center justify-between pt-md">
      <Button
        :loading="server.isLoading"
        icon-prepend="i-carbon:renew"
        :label="t('refreshStatus')"
        @click="() => server.fetchStatus()"
      />

      <Button
        :loading="server.isSynchronizing"
        class="button-success"
        icon-prepend="i-carbon:upload"
        :label="t('synchronizeServer')"
        @click="() => server.syncronizeServer()"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Server Status
  text: Monitor the current status and configuration of your MCP server instance
  statusSynchronized: Synchronized
  statusNotSynchronized: Not Synchronized
  serverStatus: Server Runtime
  totalRequests: Total Requests
  currentConnections: Current Connections
  startedAt: Started At
  stoppedAt: Stopped At
  lastRequestAt: Last Request At
  remoteSpec: Remote Configuration
  localSpec: Local Configuration
  pool: Pool
  image: Image
  command: Command
  transport: Transport
  idleTimeout: Idle Timeout
  refreshStatus: Refresh Status
  synchronizeServer: Synchronize Server
  synchronizeSuccessMessage: Server synchronized successfully
  never: Never
  transportUnknown: Unknown
  transportDefaultPort: default port
  transportStdio: Standard I/O
  transportSse: 'Server-Sent Events ({port})'
  transportStreamableHttp: 'Streamable HTTP ({port})'
fr:
  title: Statut du Serveur
  text: Surveillez le statut actuel et la configuration de votre instance de serveur MCP
  statusSynchronized: Synchronisé
  statusNotSynchronized: Non Synchronisé
  serverStatus: Exécution du Serveur
  totalRequests: Requêtes Totales
  currentConnections: Connexions Actuelles
  startedAt: Démarré À
  stoppedAt: Arrêté À
  lastRequestAt: Dernière Requête À
  remoteSpec: Configuration Distante
  localSpec: Configuration Locale
  pool: Pool
  image: Image
  command: Commande
  transport: Transport
  idleTimeout: "Délai d'Inactivité"
  refreshStatus: Actualiser le Statut
  synchronizeServer: Synchroniser le Serveur
  synchronizeSuccessMessage: Serveur synchronisé avec succès
  never: Jamais
  transportUnknown: Inconnu
  transportDefaultPort: port par défaut
  transportStdio: Entrée/Sortie Standard
  transportSse: 'Événements Envoyés par le Serveur ({port})'
  transportStreamableHttp: 'HTTP Diffusable ({port})'
de:
  title: Server-Status
  text: Überwachen Sie den aktuellen Status und die Konfiguration Ihrer MCP-Server-Instanz
  statusSynchronized: Synchronisiert
  statusNotSynchronized: Nicht Synchronisiert
  serverStatus: Server-Laufzeit
  totalRequests: Gesamtanfragen
  currentConnections: Aktuelle Verbindungen
  startedAt: Gestartet Um
  stoppedAt: Gestoppt Um
  lastRequestAt: Letzte Anfrage Um
  remoteSpec: Remote-Konfiguration
  localSpec: Lokale Konfiguration
  pool: Pool
  image: Image
  command: Befehl
  transport: Transport
  idleTimeout: Leerlauf-Timeout
  refreshStatus: Status Aktualisieren
  synchronizeServer: Server Synchronisieren
  synchronizeSuccessMessage: Server erfolgreich synchronisiert
  never: Nie
  transportUnknown: Unbekannt
  transportDefaultPort: Standard-Port
  transportStdio: Standard Ein-/Ausgabe
  transportSse: 'Server-Sent Events ({port})'
  transportStreamableHttp: 'Streamable HTTP ({port})'
es:
  title: Estado del Servidor
  text: Monitoree el estado actual y la configuración de su instancia de servidor MCP
  statusSynchronized: Sincronizado
  statusNotSynchronized: No Sincronizado
  serverStatus: Tiempo de Ejecución del Servidor
  totalRequests: Solicitudes Totales
  currentConnections: Conexiones Actuales
  startedAt: Iniciado En
  stoppedAt: Detenido En
  lastRequestAt: Última Solicitud En
  remoteSpec: Configuración Remota
  localSpec: Configuración Local
  pool: Pool
  image: Imagen
  command: Comando
  transport: Transporte
  idleTimeout: Tiempo de Espera de Inactividad
  refreshStatus: Actualizar Estado
  synchronizeServer: Sincronizar Servidor
  synchronizeSuccessMessage: Servidor sincronizado exitosamente
  never: Nunca
  transportUnknown: Desconocido
  transportDefaultPort: puerto predeterminado
  transportStdio: Entrada/Salida Estándar
  transportSse: 'Eventos Enviados por el Servidor ({port})'
  transportStreamableHttp: 'HTTP Transmisible ({port})'
zh:
  title: 服务器状态
  text: 监控您的 MCP 服务器实例的当前状态和配置
  statusSynchronized: 已同步
  statusNotSynchronized: 未同步
  serverStatus: 服务器运行时
  totalRequests: 总请求数
  currentConnections: 当前连接数
  startedAt: 启动时间
  stoppedAt: 停止时间
  lastRequestAt: 最后请求时间
  remoteSpec: 远程配置
  localSpec: 本地配置
  pool: 池
  image: 镜像
  command: 命令
  transport: 传输方式
  idleTimeout: 空闲超时
  refreshStatus: 刷新状态
  synchronizeServer: 同步服务器
  synchronizeSuccessMessage: 服务器同步成功
  never: 从未
  transportUnknown: 未知
  transportDefaultPort: 默认端口
  transportStdio: 标准输入输出
  transportSse: '服务器发送事件 ({port})'
  transportStreamableHttp: '可流式 HTTP ({port})'
</i18n>

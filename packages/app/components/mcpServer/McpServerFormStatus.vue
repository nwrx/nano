<!-- eslint-disable unicorn/no-null -->
<script setup lang="ts">
import AppPageFormEmpty from '~/components/app/AppPageForm.Empty.vue'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Badge from '~/components/base/Badge.vue'
import Button from '~/components/base/Button.vue'
import RecordsEntry from '~/components/base/Records.Entry.vue'
import RecordsField from '~/components/base/Records.Field.vue'
import Records from '~/components/base/Records.vue'
import { useMcpServer } from '~/composables/useMcp'
import { formatDateFromNow } from '~/utils/formatDate'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const server = useMcpServer(props)
onMounted(server.fetchStatus)
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
          v-if="!server.status.isReachable"
          :label="t('statusUnreachable')"
          class="badge-danger"
          icon="i-carbon:close"
        />
        <Badge
          v-else
          :label="server.status.phase"
          :icon="server.statusIcon"
          :class="server.statusBadge"
        />
      </div>

      <!-- Show status details -->
      <RecordsEntry
        v-if="server.status.isReachable"
        :title="t('serverStatus')"
        icon="i-carbon:play-outline">
        <template #fields>
          <RecordsField :label="t('totalRequests')" :value="server.status.totalRequests" />
          <RecordsField :label="t('currentConnections')" :value="server.status.currentConnections" />
          <RecordsField :label="t('startedAt')" :value=" formatDateFromNow(server.status.startedAt, t('never'))" />
          <RecordsField :label="t('stoppedAt')" :value="formatDateFromNow(server.status.stoppedAt, t('never'))" />
          <RecordsField :label="t('lastRequestAt')" :value="formatDateFromNow(server.status.lastRequestAt, t('never'))" />
        </template>
      </RecordsEntry>

      <!-- If the server is not reachable or does not exists in Kubernetes -->
      <AppPageFormEmpty
        v-else
        icon="i-carbon:warning-alt"
        :title="t('serverStatusNotReachable')"
        :text="t('serverStatusNotReachableText')"
      />
    </Records>

    <!-- Actions -->
    <Button
      class="button-success"
      icon-prepend="i-carbon:upload"
      :label="t('applyServer')"
      @click="() => server.applySpecifications()"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Server Status
  text: Monitor the current status and configuration of your MCP server instance
  statusUnreachable: Unreachable
  serverStatus: Server Status
  totalRequests: Total Requests
  currentConnections: Current Connections
  startedAt: Started At
  stoppedAt: Stopped At
  lastRequestAt: Last Request At
  serverStatusNotReachable: Server Not Reachable
  serverStatusNotReachableText: The server is currently not reachable or does not exist in the infrastructure. Check your configuration or try applying the server specifications.
  applyServer: Apply Server
  never: Never
fr:
  title: État du Serveur
  text: Surveillez l'état actuel et la configuration de votre instance de serveur MCP
  statusUnreachable: Injoignable
  serverStatus: État du Serveur
  totalRequests: Total des Requêtes
  currentConnections: Connexions Actuelles
  startedAt: Démarré À
  stoppedAt: Arrêté À
  lastRequestAt: Dernière Requête À
  serverStatusNotReachable: Serveur Non Joignable
  serverStatusNotReachableText: Le serveur n'est actuellement pas joignable ou n'existe pas dans l'infrastructure. Vérifiez votre configuration ou essayez d'appliquer les spécifications du serveur.
  applyServer: Appliquer le Serveur
  never: Jamais
de:
  title: Server-Status
  text: Überwachen Sie den aktuellen Status und die Konfiguration Ihrer MCP-Server-Instanz
  statusUnreachable: Nicht Erreichbar
  serverStatus: Server-Status
  totalRequests: Gesamte Anfragen
  currentConnections: Aktuelle Verbindungen
  startedAt: Gestartet Um
  stoppedAt: Gestoppt Um
  lastRequestAt: Letzte Anfrage Um
  serverStatusNotReachable: Server Nicht Erreichbar
  serverStatusNotReachableText: Der Server ist derzeit nicht erreichbar oder existiert nicht in der Infrastruktur. Überprüfen Sie Ihre Konfiguration oder versuchen Sie, die Server-Spezifikationen anzuwenden.
  applyServer: Server Anwenden
  never: Niemals
es:
  title: Estado del Servidor
  text: Monitoree el estado actual y la configuración de su instancia de servidor MCP
  statusUnreachable: No Alcanzable
  serverStatus: Estado del Servidor
  totalRequests: Total de Solicitudes
  currentConnections: Conexiones Actuales
  startedAt: Iniciado En
  stoppedAt: Detenido En
  lastRequestAt: Última Solicitud En
  serverStatusNotReachable: Servidor No Alcanzable
  serverStatusNotReachableText: El servidor actualmente no es alcanzable o no existe en la infraestructura. Verifique su configuración o intente aplicar las especificaciones del servidor.
  applyServer: Aplicar Servidor
  never: Nunca
zh:
  title: 服务器状态
  text: 监控您的 MCP 服务器实例的当前状态和配置
  statusUnreachable: 无法访问
  serverStatus: 服务器状态
  totalRequests: 总请求数
  currentConnections: 当前连接数
  startedAt: 启动时间
  stoppedAt: 停止时间
  lastRequestAt: 最后请求时间
  serverStatusNotReachable: 服务器无法访问
  serverStatusNotReachableText: 服务器当前无法访问或在基础设施中不存在。请检查您的配置或尝试应用服务器规格。
  applyServer: 应用服务器
  never: 从未
</i18n>

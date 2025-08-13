<script setup lang="ts">
import type { McpGatewayObject, NmcpGateway } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import RecordsEntry from '~/components/base/Records.Entry.vue'
import RecordsField from '~/components/base/Records.Field.vue'
import Records from '~/components/base/Records.vue'

const props = defineProps<{
  gateway: McpGatewayObject
  manager: string
}>()

const { t } = useI18n()
const client = useClient()
const status = ref<Partial<NmcpGateway.Status>>({})
const abortController = new AbortController()

const readableStatus = computed(() => ({
  uptime: formatDuration(status.value.uptime),
  systemUptime: formatDuration(status.value.system?.uptime),
  memoryFree: formatDataVolume(status.value.system?.memoryFree),
  memoryTotal: formatDataVolume(status.value.system?.memoryTotal),
  memoryAvailable: formatDataVolume(status.value.system?.memoryAvailable),
  memoryUsed: formatDataVolume(status.value.system?.memoryUsed),
  cpuCores: t('cpusCoresCount', { count: status.value.system?.cpus?.length ?? 0 }),
  cpuModel: status.value.system?.cpus?.[0]?.model ?? t('cpusModelUnknown'),
  cpuSpeed: formatFrequency(status.value.system?.cpuAverageSpeed),
  cpuLoad: t('cpusLoadValue', { load: status.value.system?.cpuAverageLoad?.[0] ?? 0 }),
  connectionsActive: status.value.connections?.active ?? 0,
  connectionsTotal: status.value.connections?.total ?? 0,
}))

async function subscribe() {
  await client.requestAttempt(
    'GET /mcp/:manager/gateways/:identity/status',
    {
      signal: abortController.signal,
      parameters: {
        manager: props.manager,
        identity: props.gateway.identity,
      },
      onData: (data) => {
        status.value = data.data
      },
      onError: () => {
        status.value.isReachable = false
        status.value.isRunning = false
      },
    },
  )
}

onMounted(subscribe)
onScopeDispose(() => abortController.abort())
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')">

    <!-- Connection Status -->
    <Records>
      <div class="flex items-center space-x-md p-lg">
        <Badge
          class="font-normal"
          :class="status.ok ? 'badge-success' : 'badge-danger'"
          :icon="status.ok ? 'i-carbon:checkmark' : 'i-carbon:close'"
          :label="status.ok ? t('connected') : t('disconnected')"
        />
        <Badge
          class="font-normal"
          :class="gateway.disabledAt ? 'badge-warning' : 'badge-success'"
          :icon="gateway.disabledAt ? 'i-carbon:stop-outline' : 'i-carbon:play-outline'"
          :label="gateway.disabledAt ? t('disabled') : t('running')"
        />
      </div>

      <!-- Gateway -->
      <RecordsEntry :title="t('gateway')" icon="i-carbon:gateway">
        <template #fields>
          <RecordsField :label="t('gatewayVersion')" :value="status.version" />
          <RecordsField :label="t('gatewayUptime')" :value="readableStatus.uptime" />
          <RecordsField :label="t('gatewaySystemUptime')" :value="readableStatus.systemUptime" />
        </template>
      </RecordsEntry>

      <!-- Connections -->
      <RecordsEntry :title="t('connections')" icon="i-carbon:network-3">
        <template #fields>
          <RecordsField :label="t('connectionsActive')" :value="readableStatus.connectionsActive" />
          <RecordsField :label="t('connectionsTotal')" :value="readableStatus.connectionsTotal" />
        </template>
      </RecordsEntry>

      <!-- Platform -->
      <RecordsEntry :title="t('platform')" icon="i-carbon:screen">
        <template #fields>
          <RecordsField :label="t('platformArch')" :value="status.system?.arch" />
          <RecordsField :label="t('platformFamily')" :value="status.system?.family" />
          <RecordsField :label="t('platformPlatform')" :value="status.system?.platform" />
          <RecordsField :label="t('platformRelease')" :value="status.system?.release" />
          <RecordsField :label="t('platformVersion')" :value="status.system?.version" />
        </template>
      </RecordsEntry>

      <!-- Memory -->
      <RecordsEntry :title="t('memory')" icon="i-ph:memory">
        <template #fields>
          <RecordsField :label="t('memoryTotal')" :value="readableStatus.memoryTotal" />
          <RecordsField :label="t('memoryUsed')" :value="readableStatus.memoryUsed" />
          <RecordsField :label="t('memoryFree')" :value="readableStatus.memoryFree" />
          <RecordsField :label="t('memoryAvailable')" :value="readableStatus.memoryAvailable" />
        </template>
      </RecordsEntry>

      <!-- CPUs -->
      <RecordsEntry :title="t('cpus')" icon="i-ph:cpu">
        <template #fields>
          <RecordsField :label="t('cpusModel')" :value="readableStatus.cpuModel" />
          <RecordsField :label="t('cpusCores')" :value="readableStatus.cpuCores" />
          <RecordsField :label="t('cpusSpeed')" :value="readableStatus.cpuSpeed" />
          <RecordsField :label="t('cpusLoad')" :value="readableStatus.cpuLoad" />
        </template>
      </RecordsEntry>
    </Records>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Status
  text: Real-time monitoring dashboard for your MCP gateway. Track performance metrics, connection status, and resource utilization to ensure optimal gateway operation.
  connected: Connected
  disconnected: Disconnected
  disabled: Disabled
  running: Running
  gateway: Gateway
  gatewayVersion: Version
  gatewayUptime: Uptime
  gatewaySystemUptime: System Uptime
  connections: Connections
  connectionsActive: Active Connections
  connectionsTotal: Total Connections
  platform: Platform
  platformArch: Architecture
  platformFamily: Family
  platformPlatform: Platform
  platformRelease: Release
  platformVersion: Version
  memory: Memory
  memoryTotal: Total
  memoryUsed: Used
  memoryFree: Free
  memoryAvailable: Available
  cpus: CPUs
  cpusModel: Model
  cpusCores: Cores
  cpusCoresCount: '{count} Logical Cores'
  cpusModelUnknown: Unknown
  cpusSpeed: Speed
  cpusLoad: Load
  cpusLoadValue: '{load}%'
fr:
  title: Statut
  text: Tableau de bord de surveillance en temps réel pour votre passerelle MCP. Suivez les métriques de performance, l'état des connexions et l'utilisation des ressources pour garantir un fonctionnement optimal de la passerelle.
  connected: Connecté
  disconnected: Déconnecté
  disabled: Désactivé
  running: En cours d'exécution
  gateway: Passerelle
  gatewayVersion: Version
  gatewayUptime: Temps de fonctionnement
  gatewaySystemUptime: Temps de fonctionnement du système
  connections: Connexions
  connectionsActive: Connexions actives
  connectionsTotal: Connexions totales
  platform: Plateforme
  platformArch: Architecture
  platformFamily: Famille
  platformPlatform: Plateforme
  platformRelease: Version
  platformVersion: Version
  memory: Mémoire
  memoryTotal: Total
  memoryUsed: Utilisée
  memoryFree: Libre
  memoryAvailable: Disponible
  cpus: Processeurs
  cpusModel: Modèle
  cpusCores: Cœurs
  cpusCoresCount: '{count} cœurs logiques'
  cpusModelUnknown: Inconnu
  cpusSpeed: Vitesse
  cpusLoad: Charge
  cpusLoadValue: '{load}%'
de:
  title: Status
  text: Echtzeit-Überwachungsdashboard für Ihr MCP-Gateway. Verfolgen Sie Leistungskennzahlen, Verbindungsstatus und Ressourcennutzung, um einen optimalen Gateway-Betrieb sicherzustellen.
  connected: Verbunden
  disconnected: Getrennt
  disabled: Deaktiviert
  running: Laufend
  gateway: Gateway
  gatewayVersion: Version
  gatewayUptime: Betriebszeit
  gatewaySystemUptime: Systembetriebszeit
  connections: Verbindungen
  connectionsActive: Aktive Verbindungen
  connectionsTotal: Gesamte Verbindungen
  platform: Plattform
  platformArch: Architektur
  platformFamily: Familie
  platformPlatform: Plattform
  platformRelease: Release
  platformVersion: Version
  memory: Speicher
  memoryTotal: Gesamt
  memoryUsed: Verwendet
  memoryFree: Frei
  memoryAvailable: Verfügbar
  cpus: CPUs
  cpusModel: Modell
  cpusCores: Kerne
  cpusCoresCount: '{count} Logische Kerne'
  cpusModelUnknown: Unbekannt
  cpusSpeed: Geschwindigkeit
  cpusLoad: Last
  cpusLoadValue: '{load}%'
es:
  title: Estado
  text: Panel de monitoreo en tiempo real para tu puerta de enlace MCP. Sigue las métricas de rendimiento, el estado de las conexiones y la utilización de recursos para garantizar un funcionamiento óptimo de la puerta de enlace.
  connected: Conectado
  disconnected: Desconectado
  disabled: Deshabilitado
  running: En ejecución
  gateway: Puerta de enlace
  gatewayVersion: Versión
  gatewayUptime: Tiempo de actividad
  gatewaySystemUptime: Tiempo de actividad del sistema
  connections: Conexiones
  connectionsActive: Conexiones activas
  connectionsTotal: Conexiones totales
  platform: Plataforma
  platformArch: Arquitectura
  platformFamily: Familia
  platformPlatform: Plataforma
  platformRelease: Lanzamiento
  platformVersion: Versión
  memory: Memoria
  memoryTotal: Total
  memoryUsed: Usado
  memoryFree: Libre
  memoryAvailable: Disponible
  cpus: CPUs
  cpusModel: Modelo
  cpusCores: Núcleos
  cpusCoresCount: '{count} núcleos lógicos'
  cpusModelUnknown: Desconocido
  cpusSpeed: Velocidad
  cpusLoad: Carga
  cpusLoadValue: '{load}%'
zh:
  title: 状态
  text: 您的MCP网关的实时监控仪表板。跟踪性能指标、连接状态和资源利用率，以确保网关的最佳运行。
  connected: 已连接
  disconnected: 已断开连接
  disabled: 已禁用
  running: 正在运行
  gateway: 网关
  gatewayVersion: 版本
  gatewayUptime: 正常运行时间
  gatewaySystemUptime: 系统正常运行时间
  connections: 连接
  connectionsActive: 活动连接
  connectionsTotal: 总连接数
  platform: 平台
  platformArch: 架构
  platformFamily: 家族
  platformPlatform: 平台
  platformRelease: 发布版本
  platformVersion: 版本号
  memory: 内存
  memoryTotal: 总内存
  memoryUsed: 已用内存
  memoryFree: 空闲内存
  memoryAvailable: 可用内存
  cpus: CPU
  cpusModel: 型号
  cpusCores: 核心数
  cpusCoresCount: '{count} 个逻辑核心'
  cpusModelUnknown: 未知型号
  cpusSpeed: 时钟速度
  cpusLoad: CPU负载
  cpusLoadValue: '{load}%'
</i18n>

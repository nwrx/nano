<script setup lang="ts">
import type { application, ThreadRunnerObject } from '@nwrx/nano-api'
import type { ThreadRunnerStatus } from '@nwrx/nano-runner'
import type { ChannelConnectOptions } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'
import AppPageForm from '~/components/app/AppPageForm.vue'
import RecordsEntry from '~/components/base/Records.Entry.vue'
import RecordsField from '~/components/base/Records.Field.vue'
import Records from '~/components/base/Records.vue'
type Channel = WebSocketChannel<ChannelConnectOptions<typeof application, 'WS /ws/runners/:identity'>>

const props = defineProps<{
  runner: ThreadRunnerObject
}>()

const { t } = useI18n()
const client = useClient()
const channel = ref<Channel>()
const previous = ref<Partial<ThreadRunnerStatus>>({})
const status = ref<Partial<ThreadRunnerStatus>>({})

function getMemoryFree() {
  if (!status.value.freemem || !status.value.totalmem) return 0
  return `${(status.value.freemem / 2e9).toFixed(2)} GB`
}
function getMemoryTotal() {
  if (!status.value.totalmem) return 0
  return `${(status.value.totalmem / 2e9).toFixed(2)} GB`
}
function getMemoryAvailable() {
  if (!status.value.availmem) return 0
  return `${(status.value.availmem / 2e9).toFixed(2)} GB`
}
function getMemoryUsed() {
  if (!status.value.totalmem || !status.value.freemem) return 0
  return `${((status.value.totalmem - status.value.freemem) / 2e9).toFixed(2)} GB`
}
function getCpuCores() {
  return t('cpusCoresCount', { count: status.value.cpus?.length ?? 0 })
}
function getCpuModel() {
  return status.value.cpus?.[0]?.model ?? t('cpusModelUnknown')
}
function getCpuSpeed() {
  const speeds = status.value.cpus?.map(cpu => cpu.speed) ?? []
  const speed = speeds.length > 0 ? speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length : 0
  return `${(speed / 1000).toFixed(2)} GHz`
}
function getCpuAverageLoad() {
  const cpus = status.value.cpus ?? []
  if (cpus.length === 0) return 0
  let totalLoad = 0
  for (const cpu of cpus) {
    if (!cpu?.times.user) continue
    const load = Math.round(cpu.times.user / (cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq) * 100)
    totalLoad += load
  }
  return t('cpusLoadValue', { load: (totalLoad / cpus.length).toFixed(2) })
}

async function subscribe() {
  if (!props.runner) return
  channel.value = await client.connect('WS /ws/runners/:identity', {
    autoReconnect: true,
    reconnectDelay: 1000,
    reconnectLimit: 3,
    data: { identity: props.runner.identity },
    onMessage: (message: Partial<ThreadRunnerStatus>) => {
      previous.value = status.value
      status.value = message
    },
  }).open()
}

function unsubscribe() {
  if (!channel.value) return
  void channel.value.close()
  channel.value = undefined
}

onMounted(subscribe)
onUnmounted(unsubscribe)
</script>

<template>
  <AppPageForm
    v-if="runner"
    :title="t('title')"
    :text="t('text')">

    <!-- Status -->
    <Records>
      <div class="flex items-center space-x-md p-lg">
        <Badge
          class="font-normal"
          :class="status.isReachable ? 'badge-success' : 'badge-danger'"
          :icon="status.isReachable ? 'i-carbon:checkmark' : 'i-carbon:close'"
          :label="status.isReachable ? t('connected') : t('disconnected')"
        />
        <Badge
          v-if="status.isReachable"
          class="font-normal"
          :class="status.isRunning ? 'badge-warning' : ''"
          :icon="status.isRunning ? 'i-carbon:play-filled' : 'i-carbon:stop-filled'"
          :label="status.isRunning ? t('running') : t('inactive')"
        />
      </div>

      <!-- Memory -->
      <RecordsEntry :title="t('memory')" icon="i-ph:memory">
        <template #fields>
          <RecordsField :label="t('memoryFree')" :value="getMemoryFree()" />
          <RecordsField :label="t('memoryTotal')" :value="getMemoryTotal()" />
          <RecordsField :label="t('memoryAvailable')" :value="getMemoryAvailable()" />
          <RecordsField :label="t('memoryUsed')" :value="getMemoryUsed()" />
        </template>
      </RecordsEntry>

      <!-- Platform -->
      <RecordsEntry :title="t('platform')" icon="i-carbon:screen">
        <template #fields>
          <RecordsField :label="t('platformPlatform')" :value="status.platform" />
          <RecordsField :label="t('platformRelease')" :value="status.release" />
          <RecordsField :label="t('platformVersion')" :value="status.version" />
        </template>
      </RecordsEntry>

      <!-- CPUs -->
      <RecordsEntry :title="t('cpus')" icon="i-ph:cpu">
        <template #fields>
          <RecordsField :label="t('cpusCores')" :value="getCpuCores()" />
          <RecordsField :label="t('cpusModel')" :value="getCpuModel()" />
          <RecordsField :label="t('cpusSpeed')" :value="getCpuSpeed()" />
          <RecordsField :label="t('cpusLoad')" :value="getCpuAverageLoad()" />
        </template>
      </RecordsEntry>
    </Records>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Status
  text: Real-time monitoring dashboard for your runner server. Track performance metrics, system health, and resource utilization to ensure optimal operation.
  disabled: Disabled
  connected: Connected
  disconnected: Disconnected
  lastSeen: Last seen {distance}
  running: Running
  inactive: Inactive
  memory: Memory
  memoryFree: Free
  memoryTotal: Total
  memoryAvailable: Available
  memoryUsed: Used
  platform: Platform
  platformPlatform: Platform
  platformRelease: Release
  platformVersion: Version
  cpus: CPUs
  cpusCores: Cores
  cpusCoresCount: '{count} Logical Cores'
  cpusModel: Model
  cpusModelUnknown: Unknown
  cpusSpeed: Speed
  cpusLoad: Load
  cpusLoadValue: '{load}%'
fr:
  title: Statut
  text: Tableau de bord de surveillance en temps réel pour votre serveur d'exécution. Suivez les métriques de performance, l'état du système et l'utilisation des ressources pour garantir un fonctionnement optimal.
  disabled: Désactivé
  connected: Connecté
  disconnected: Déconnecté
  lastSeen: Vu pour la dernière fois {distance}
  running: En cours d'exécution
  inactive: Inactif
  memory: Mémoire
  memoryFree: Libre
  memoryTotal: Total
  memoryAvailable: Disponible
  memoryUsed: Utilisé
  platform: Plateforme
  platformPlatform: Plateforme
  platformRelease: Version
  platformVersion: Version
  cpus: CPUs
  cpusCores: Cœurs
  cpusCoresCount: '{count} Cœurs logiques'
  cpusModel: Modèle
  cpusModelUnknown: Inconnu
  cpusSpeed: Vitesse
  cpusLoad: Charge
  cpusLoadValue: '{load}%'
de:
  title: Status
  text: Echtzeit-Monitoring-Dashboard für Ihren Ausführungsserver. Verfolgen Sie Leistungsmetriken, Systemgesundheit und Ressourcennutzung, um einen optimalen Betrieb sicherzustellen.
  disabled: Deaktiviert
  connected: Verbunden
  disconnected: Getrennt
  lastSeen: Zuletzt gesehen {distance}
  running: Läuft
  inactive: Inaktiv
  memory: Speicher
  memoryFree: Frei
  memoryTotal: Gesamt
  memoryAvailable: Verfügbar
  memoryUsed: Verwendet
  platform: Plattform
  platformPlatform: Plattform
  platformRelease: Release
  platformVersion: Version
  cpus: CPUs
  cpusCores: Kerne
  cpusCoresCount: '{count} Logische Kerne'
  cpusModel: Modell
  cpusModelUnknown: Unbekannt
  cpusSpeed: Geschwindigkeit
  cpusLoad: Auslastung
  cpusLoadValue: '{load}%'
es:
  title: Estado
  text: Panel de monitoreo en tiempo real para su servidor de ejecución. Rastree métricas de rendimiento, salud del sistema y utilización de recursos para garantizar un funcionamiento óptimo.
  disabled: Deshabilitado
  connected: Conectado
  disconnected: Desconectado
  lastSeen: Visto por última vez {distance}
  running: En ejecución
  inactive: Inactivo
  memory: Memoria
  memoryFree: Libre
  memoryTotal: Total
  memoryAvailable: Disponible
  memoryUsed: Usado
  platform: Plataforma
  platformPlatform: Plataforma
  platformRelease: Versión
  platformVersion: Versión
  cpus: CPUs
  cpusCores: Núcleos
  cpusCoresCount: '{count} Núcleos lógicos'
  cpusModel: Modelo
  cpusModelUnknown: Desconocido
  cpusSpeed: Velocidad
  cpusLoad: Carga
  cpusLoadValue: '{load}%'
zh:
  title: 状态
  text: 执行服务器的实时监控仪表板。跟踪性能指标、系统健康状况和资源利用率，确保最佳运行状态。
  disabled: 已禁用
  connected: 已连接
  disconnected: 未连接
  lastSeen: 最后查看 {distance}
  running: 正在运行
  inactive: 未活动
  memory: 内存
  memoryFree: 空闲
  memoryTotal: 总计
  memoryAvailable: 可用
  memoryUsed: 已用
  platform: 平台
  platformPlatform: 平台
  platformRelease: 发行版
  platformVersion: 版本
  cpus: CPUs
  cpusCores: 核心
  cpusCoresCount: '{count} 个逻辑核心'
  cpusModel: 型号
  cpusModelUnknown: 未知
  cpusSpeed: 速度
  cpusLoad: 负载
  cpusLoadValue: '{load}%'
</i18n>

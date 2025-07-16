<script setup lang="ts">
import type { McpManagerObject, NmcpManager } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import RecordsEntry from '~/components/base/Records.Entry.vue'
import RecordsField from '~/components/base/Records.Field.vue'
import Records from '~/components/base/Records.vue'

const props = defineProps<{
  manager: McpManagerObject
}>()

const { t } = useI18n()
const client = useClient()
const status = ref<Partial<NmcpManager.Status>>({})
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
}))

async function subscribe() {
  await client.requestAttempt(
    'GET /api/mcp/:identity/status',
    {
      signal: abortController.signal,
      parameters: {
        identity: props.manager.identity,
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
          :class="manager.disabledAt ? 'badge-warning' : 'badge-success'"
          :icon="manager.disabledAt ? 'i-carbon:stop-outline' : 'i-carbon:play-outline'"
          :label="manager.disabledAt ? t('disabled') : t('running')"
        />
      </div>

      <!-- Memory -->
      <RecordsEntry :title="t('manager')" icon="i-carbon:process">
        <template #fields>
          <RecordsField :label="t('managerVersion')" :value="status.version" />
          <RecordsField :label="t('managerUptime')" :value="readableStatus.uptime" />
          <RecordsField :label="t('managerSystemUptime')" :value="readableStatus.systemUptime" />
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
  text: Real-time monitoring dashboard for your MCP manager. Track performance metrics, gateway health, and resource coordination to ensure optimal infrastructure operation.
  connected: Connected
  disconnected: Disconnected
  disabled: Disabled
  running: Running
  manager: Manager
  managerVersion: Version
  managerUptime: Uptime
  managerSystemUptime: System Uptime
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
  text: Tableau de bord de surveillance en temps réel pour votre gestionnaire MCP. Suivez les métriques de performance, la santé de la passerelle et la coordination des ressources pour garantir un fonctionnement optimal de l'infrastructure.
  connected: Connecté
  disconnected: Déconnecté
  disabled: Désactivé
  running: En cours d'exécution
  manager: Gestionnaire
  managerVersion: Version
  managerUptime: Temps de fonctionnement
  managerSystemUptime: Temps de fonctionnement du système
  platform: Plateforme
  platformArch: Architecture
  platformFamily: Famille
  platformPlatform: Plateforme
  platformRelease: Version
  platformVersion: Version
  memory: Mémoire
  memoryTotal: Total
  memoryUsed: Utilisée
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
  text: Echtzeit-Überwachungsdashboard für Ihren MCP-Manager. Verfolgen Sie Leistungskennzahlen, Gateway-Gesundheit und Ressourcenkoordination, um einen optimalen Infrastrukturbetrieb sicherzustellen.
  connected: Verbunden
  disconnected: Getrennt
  disabled: Deaktiviert
  running: Laufend
  manager: Manager
  managerVersion: Version
  managerUptime: Betriebszeit
  managerSystemUptime: Systembetriebszeit
  platform: Plattform
  platformArch: Architektur
  platformFamily: Familie
  platformPlatform: Plattform
  platformRelease: Release
  platformVersion: Version
  memory: Speicher
  memoryTotal: Gesamt
  memoryUsed: Verwendet
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
  text: Panel de monitoreo en tiempo real para tu gestor MCP. Sigue las métricas de rendimiento, la salud del gateway y la coordinación de recursos para garantizar un funcionamiento óptimo de la infraestructura.
  connected: Conectado
  disconnected: Desconectado
  disabled: Deshabilitado
  running: En ejecución
  manager: Gestor
  managerVersion: Versión
  managerUptime: Tiempo de actividad
  managerSystemUptime: Tiempo de actividad del sistema
  platform: Plataforma
  platformArch: Arquitectura
  platformFamily: Familia
  platformPlatform: Plataforma
  platformRelease: Lanzamiento
  platformVersion: Versión
  memory: Memoria
  memoryTotal: Total
  memoryUsed: Usado
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
  text: 您的MCP管理器的实时监控仪表板。跟踪性能指标、网关健康状况和资源协调，以确保基础设施的最佳运行。
  connected: 已连接
  disconnected: 已断开连接
  disabled: 已禁用
  running: 正在运行
  manager: 管理器
  managerVersion: 版本
  managerUptime: 正常运行时间
  managerSystemUptime: 系统正常运行时间
  platform: 平台
  platformArch: 架构
  platformFamily: 家族
  platformPlatform: 平台
  platformRelease: 发布版本
  platformVersion: 版本号
  memory: 内存
  memoryTotal: 总内存
  memoryUsed: 已用内存
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

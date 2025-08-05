<script setup lang="ts">
import AppPageForm from '~/components/app/AppPageForm.vue'
import RecordsEntry from '~/components/base/Records.Entry.vue'
import RecordsField from '~/components/base/Records.Field.vue'
import Records from '~/components/base/Records.vue'
import { useRunner } from '~/composables/useRunner'

const props = defineProps<{
  name: string
}>()

const { t } = useI18n()
const runner = useRunner(props)
const readableStatus = computed(() => ({
  uptime: formatDuration(runner.status.uptime),
  systemUptime: formatDuration(runner.status.system?.uptime),
  memoryFree: formatDataVolume(runner.status.system?.memoryFree),
  memoryTotal: formatDataVolume(runner.status.system?.memoryTotal),
  memoryAvailable: formatDataVolume(runner.status.system?.availmem),
  memoryUsed: formatDataVolume(runner.status.system?.memoryUsed),
  cpuCores: t('cpusCoresCount', { count: runner.status.system?.cpus?.length ?? 0 }),
  cpuModel: runner.status.system?.cpus?.[0]?.model ?? t('cpusModelUnknown'),
  cpuSpeed: formatFrequency(runner.status.system?.cpuAverageSpeed),
  cpuLoad: t('cpusLoadValue', { load: runner.status.system?.cpuAverageLoad?.[0] ?? 0 }),
}))

onMounted(() => {
  void runner.fetch()
  void runner.subscribeToEvents()
  void runner.subscribeToStatus()
})

onBeforeUnmount(() => {
  void runner.unsubscribeFromEvents()
  void runner.unsubscribeFromStatus()
})
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
          v-if="runner.status.ok"
          class="font-normal badge-success"
          icon="i-carbon:checkmark"
          :label="t('connected')"
        />
        <Badge
          v-else
          class="font-normal badge-danger"
          icon="i-carbon:close"
          :label="t('unreachable')"
        />
        <Badge
          v-if="runner.data.disabledAt"
          class="font-normal badge-warning"
          icon="i-carbon:stop-outline"
          :label="t('disabled')"
        />
        <Badge
          v-else
          class="font-normal badge-success"
          icon="i-carbon:play-outline"
          :label="t('running')"
        />
      </div>

      <!-- Memory -->
      <RecordsEntry :title="t('runner')" icon="i-carbon:process">
        <template #fields>
          <RecordsField :label="t('runnerVersion')" :value="runner.status.version" />
          <RecordsField :label="t('runnerUptime')" :value="readableStatus.uptime" />
          <RecordsField :label="t('runnerSystemUptime')" :value="readableStatus.systemUptime" />
        </template>
      </RecordsEntry>

      <!-- Platform -->
      <RecordsEntry :title="t('platform')" icon="i-carbon:screen">
        <template #fields>
          <RecordsField :label="t('platformArch')" :value="runner.status.system?.arch" />
          <RecordsField :label="t('platformFamily')" :value="runner.status.system?.family" />
          <RecordsField :label="t('platformPlatform')" :value="runner.status.system?.platform" />
          <RecordsField :label="t('platformRelease')" :value="runner.status.system?.release" />
          <RecordsField :label="t('platformVersion')" :value="runner.status.system?.version" />
        </template>
      </RecordsEntry>

      <!-- Memory -->
      <RecordsEntry :title="t('memory')" icon="i-ph:memory">
        <template #fields>
          <RecordsField :label="t('memoryTotal')" :value="readableStatus.memoryTotal" />
          <RecordsField :label="t('memoryUsed')" :value="readableStatus.memoryUsed" />
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
  text: Real-time monitoring dashboard for your runner server. Track performance metrics, system health, and resource utilization to ensure optimal operation.
  disabled: Disabled
  connected: Connected
  unreachable: Unreachable
  lastSeen: Last seen {distance}
  running: Running
  inactive: Inactive
  runner: Runner
  runnerVersion: Version
  runnerUptime: Uptime
  runnerSystemUptime: System Uptime
  memory: Memory
  memoryFree: Free
  memoryTotal: Total
  memoryAvailable: Available
  memoryUsed: Used
  platform: Platform
  platformArch: Architecture
  platformFamily: Family
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
  text: Tableau de bord de surveillance en temps réel pour votre serveur d'exécution. Suivez les métriques de performance, la santé du système et l'utilisation des ressources pour garantir un fonctionnement optimal.
  disabled: Désactivé
  connected: Connecté
  unreachable: Inaccessible
  lastSeen: Vu pour la dernière fois {distance}
  running: En cours d'exécution
  inactive: Inactif
  runner: Exécuteur
  runnerVersion: Version
  runnerUptime: Temps de fonctionnement
  runnerSystemUptime: Temps de fonctionnement du système
  memory: Mémoire
  memoryFree: Libre
  memoryTotal: Total
  memoryAvailable: Disponible
  memoryUsed: Utilisée
  platform: Plateforme
  platformArch: Architecture
  platformFamily: Famille
  platformPlatform: Plateforme
  platformRelease: Version
  platformVersion: Version
  cpus: Processeurs
  cpusCores: Cœurs
  cpusCoresCount: '{count} cœurs logiques'
  cpusModel: Modèle
  cpusModelUnknown: Inconnu
  cpusSpeed: Vitesse
  cpusLoad: Charge
  cpusLoadValue: '{load}%'
de:
  title: Status
  text: Echtzeit-Überwachungsdashboard für Ihren Runner-Server. Verfolgen Sie Leistungskennzahlen, Systemgesundheit und Ressourcennutzung, um einen optimalen Betrieb sicherzustellen.
  disabled: Deaktiviert
  connected: Verbunden
  unreachable: Nicht erreichbar
  lastSeen: Zuletzt gesehen {distance}
  running: Laufend
  inactive: Inaktiv
  runner: Runner
  runnerVersion: Version
  runnerUptime: Betriebszeit
  runnerSystemUptime: Systembetriebszeit
  memory: Speicher
  memoryFree: Frei
  memoryTotal: Gesamt
  memoryAvailable: Verfügbar
  memoryUsed: Verwendet
  platform: Plattform
  platformArch: Architektur
  platformFamily: Familie
  platformPlatform: Plattform
  platformRelease: Release
  platformVersion: Version
  cpus: CPUs
  cpusCores: Kerne
  cpusCoresCount: '{count} Logische Kerne'
  cpusModel: Modell
  cpusModelUnknown: Unbekannt
  cpusSpeed: Geschwindigkeit
  cpusLoad: Last
  cpusLoadValue: '{load}%'
es:
  title: Estado
  text: Panel de monitoreo en tiempo real para tu servidor runner. Sigue las métricas de rendimiento, la salud del sistema y la utilización de recursos para garantizar un funcionamiento óptimo.
  disabled: Deshabilitado
  connected: Conectado
  unreachable: Inalcanzable
  lastSeen: Última vez visto {distance}
  running: En ejecución
  inactive: Inactivo
  runner: Runner
  runnerVersion: Versión
  runnerUptime: Tiempo de actividad
  runnerSystemUptime: Tiempo de actividad del sistema
  memory: Memoria
  memoryFree: Libre
  memoryTotal: Total
  memoryAvailable: Disponible
  memoryUsed: Usado
  platform: Plataforma
  platformArch: Arquitectura
  platformFamily: Familia
  platformPlatform: Plataforma
  platformRelease: Lanzamiento
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
  text: 您的运行器服务器的实时监控仪表板。跟踪性能指标、系统健康状况和资源利用率，以确保最佳运行。
  disabled: 已禁用
  connected: 已连接
  unreachable: 无法访问
  lastSeen: 上次看到 {distance}
  running: 正在运行
  inactive: 不活跃
  runner: 运行器
  runnerVersion: 版本
  runnerUptime: 正常运行时间
  runnerSystemUptime: 系统正常运行时间
  memory: 内存
  memoryFree: 可用内存
  memoryTotal: 总内存
  memoryAvailable: 可用内存
  memoryUsed: 已用内存
  platform: 平台
  platformArch: 架构
  platformFamily: 家族
  platformPlatform: 平台
  platformRelease: 发布版本
  platformVersion: 版本号
  cpus: CPU
  cpusCores: 核心数
  cpusCoresCount: '{count} 个逻辑核心'
  cpusModel: 型号
  cpusModelUnknown: 未知型号
  cpusSpeed: 时钟速度
  cpusLoad: CPU负载
  cpusLoadValue: '{load}%'
</i18n>

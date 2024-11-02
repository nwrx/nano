<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'
import type { FlowEventMeta, NodeEventMeta } from '@nwrx/core'

const props = defineProps<{
  event: FlowSessionEventPayload
}>()

const { t } = useI18n()
const meta = computed(() => (
  'meta' in props.event
    ? props.event.meta as Partial<FlowEventMeta & NodeEventMeta>
    : {}
))
</script>

<template>
  <FlowEditorPanelDataContainer>
    <FlowEditorPanelData v-if="event.event" :name="t('meta.event')" :model-value="event.event" />
    <FlowEditorPanelData v-if="'state' in meta" :name="t('meta.state')" :model-value="meta.state" />
    <FlowEditorPanelData v-if="'delta' in meta" :name="t('meta.delta')" :model-value="t('meta.delta.value', { delta: meta.delta })" />
    <FlowEditorPanelData v-if="'duration' in meta" :name="t('meta.duration')" :model-value="t('meta.duration.value', { duration: meta.duration })" />
    <FlowEditorPanelData v-if="'timestamp' in meta" :name="t('meta.timestamp')" :model-value="formatDateTime(meta.timestamp)" />
    <FlowEditorPanelData v-if="'id' in event" :name="t('meta.id')" :model-value="event.id" />
    <FlowEditorPanelData v-if="'threadId' in meta" :name="t('meta.threadId')" :model-value="meta.threadId" />
    <FlowEditorPanelData v-if="'executionId' in meta" :name="t('meta.executionId')" :model-value="meta.executionId" />
  </FlowEditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  meta.event: Event
  meta.state: State
  meta.delta: Started at
  meta.delta.value: '{delta} ms'
  meta.duration: Duration
  meta.duration.value: '{duration} ms'
  meta.timestamp: Timestamp
  meta.id: ID
  meta.threadId: Thread
  meta.executionId: Execution ID
  data.title: Data
  data.empty: The node did not receive any data.
  result.title: Result
  result.empty: The node did not produce any result.
fr:
  meta.event: Événement
  meta.state: État
  meta.delta: Démarré à
  meta.delta.value: '{delta} ms'
  meta.duration: Durée
  meta.duration.value: '{duration} ms'
  meta.timestamp: Horodatage
  meta.id: ID
  meta.threadId: Fil d'exécution
  meta.executionId: ID d'exécution
  data.title: Données
  data.empty: Le nœud n'a reçu aucune donnée.
  result.title: Résultat
  result.empty: Le nœud n'a produit aucun résultat.
de:
  meta.event: Ereignis
  meta.state: Status
  meta.delta: Gestartet um
  meta.delta.value: '{delta} ms'
  meta.duration: Dauer
  meta.duration.value: '{duration} ms'
  meta.timestamp: Zeitstempel
  meta.id: ID
  meta.threadId: Thread
  meta.executionId: Ausführung
  data.title: Daten
  data.empty: Der Knoten hat keine Daten erhalten.
  result.title: Ergebnis
  result.empty: Der Knoten hat kein Ergebnis erzeugt.
es:
  meta.event: Evento
  meta.state: Estado
  meta.delta: Iniciado en
  meta.delta.value: '{delta} ms'
  meta.duration: Duración
  meta.duration.value: '{duration} ms'
  meta.timestamp: Marca de tiempo
  meta.id: ID
  meta.threadId: Hilo
  meta.executionId: ID de ejecución
  data.title: Datos
  data.empty: El nodo no recibió ningún dato.
  result.title: Resultado
  result.empty: El nodo no produjo ningún resultado.
zh:
  meta.event: 事件
  meta.state: 状态
  meta.delta: 开始于
  meta.delta.value: '{delta} ms'
  meta.duration: 持续时间
  meta.duration.value: '{duration} ms'
  meta.timestamp: 时间戳
  meta.id: ID
  meta.threadId: 线程
  meta.executionId: 执行 ID
  data.title: 数据
  data.empty: 节点未收到任何数据。
  result.title: 结果
  result.empty: 节点未产生任何结果。
</i18n>

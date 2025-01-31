<script setup lang="ts">
import type { EditorSessionServerMessage } from '@nwrx/api'
import type { NodeEventMeta, ThreadEventMeta } from '@nwrx/core'

defineProps<{
  event: EditorSessionServerMessage & Partial<NodeEventMeta & ThreadEventMeta>
}>()

const { t } = useI18n()
</script>

<template>
  <EditorPanelDataContainer>
    <EditorPanelData v-if="event.event" :name="t('meta.event')" :model-value="event.event" />
    <EditorPanelData v-if="'state' in event" :name="t('meta.state')" :model-value="event.state" />
    <EditorPanelData v-if="'delta' in event" :name="t('meta.delta')" :model-value="t('meta.delta.value', { delta: event.delta })" />
    <EditorPanelData v-if="'duration' in event" :name="t('meta.duration')" :model-value="t('meta.duration.value', { duration: event.duration })" />
    <EditorPanelData v-if="'timestamp' in event" :name="t('meta.timestamp')" :model-value="formatDateTime(event.timestamp)" />
    <EditorPanelData v-if="'id' in event" :name="t('meta.id')" :model-value="event.id" />
    <EditorPanelData v-if="'threadId' in event" :name="t('meta.threadId')" :model-value="event.threadId" />
    <EditorPanelData v-if="'executionId' in event" :name="t('meta.executionId')" :model-value="event.executionId" />
  </EditorPanelDataContainer>
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
</i18n>

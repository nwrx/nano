<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'
defineProps<{ event: FlowSessionEventPayload<'flow:start'> }>()
const { t } = useI18n()
</script>

<template>
  <!-- Meta -->
  <FlowEditorPanelDataContainer>
    <FlowEditorPanelData :name="t('meta.event')" :model-value="event.event" />
    <FlowEditorPanelData :name="t('meta.timestamp')" :model-value="formatDateTime(event.timestamp)" />
    <FlowEditorPanelData :name="t('meta.threadId')" :model-value="event.threadId" />
  </FlowEditorPanelDataContainer>

  <!-- Input -->
  <FlowEditorPanelDataContainer :title="t('input.title')">
    <template v-if="Object.keys(event.input).length > 0">
      <FlowEditorPanelData v-for="(value, name) in event.input" :model-value="value" :name="name" />
    </template>
    <template v-else>
      <div class="text-subtle p-sm">
        {{ t('input.empty') }}
      </div>
    </template>
  </FlowEditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  meta.event: Event
  meta.timestamp: Timestamp
  meta.threadId: Thread
  input.title: Flow input
  input.empty: The flow did not receive any input data.
fr:
  meta.event: Événement
  meta.timestamp: Horodatage
  meta.threadId: Fil d'exécution
  input.title: Entrée de flux
  input.empty: Le flux n'a reçu aucune donnée en entrée.
de:
  meta.event: Ereignis
  meta.timestamp: Zeitstempel
  meta.threadId: Thread
  input.title: Flow-Eingabe
  input.empty: Der Flow hat keine Eingabedaten erhalten.
es:
  meta.event: Evento
  meta.timestamp: Marca de tiempo
  meta.threadId: Hilo
  input.title: Entrada de flujo
  input.empty: El flujo no recibió ningún dato de entrada.
zh:
  meta.event: 事件
  meta.timestamp: 时间戳
  meta.threadId: 线程
  input.title: 流输入
  input.empty: 流没有接收任何输入数据。
</i18n>

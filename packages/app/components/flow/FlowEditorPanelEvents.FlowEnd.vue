<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'
defineProps<{ event: FlowSessionEventPayload<'flow:end'> }>()
const { t } = useI18n()
</script>

<template>
  <!-- Meta -->
  <FlowEditorPanelDataContainer>
    <FlowEditorPanelData :name="t('meta.event')" :model-value="event.event" />
    <FlowEditorPanelData :name="t('meta.delta')" :model-value="t('meta.delta.value', { delta: event.delta })" />
    <FlowEditorPanelData :name="t('meta.timestamp')" :model-value="formatDateTime(event.timestamp)" />
    <FlowEditorPanelData :name="t('meta.threadId')" :model-value="event.threadId" />
  </FlowEditorPanelDataContainer>

  <!-- Input -->
  <FlowEditorPanelDataContainer :title="t('output.title')">
    <template v-if="Object.keys(event.output).length > 0">
      <FlowEditorPanelData v-for="(value, name) in event.output" :model-value="value" :name="name" />
    </template>
    <template v-else>
      <div class="text-subtle p-sm">
        {{ t('output.empty') }}
      </div>
    </template>
  </FlowEditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  meta.event: Event
  meta.delta: Total duration
  meta.delta.value: '{delta} ms'
  meta.timestamp: Timestamp
  meta.threadId: Thread
  output.title: Flow output
  output.empty: The flow did not produce any output data.
fr:
  meta.event: Événement
  meta.delta: Durée totale
  meta.delta.value: '{delta} ms'
  meta.timestamp: Horodatage
  meta.threadId: Fil d'exécution
  output.title: Sortie de flux
  output.empty: Le flux n'a produit aucune donnée en sortie.
de:
  meta.event: Ereignis
  meta.delta: Gesamtdauer
  meta.delta.value: '{delta} ms'
  meta.timestamp: Zeitstempel
  meta.threadId: Thread
  output.title: Flow-Ausgabe
  output.empty: Der Flow hat keine Ausgabedaten erzeugt.
es:
  meta.event: Evento
  meta.delta: Duración total
  meta.delta.value: '{delta} ms'
  meta.timestamp: Marca de tiempo
  meta.threadId: Hilo
  output.title: Salida de flujo
  output.empty: El flujo no produjo ningún dato de salida.
zh:
  meta.event: 事件
  meta.delta: 总持续时间
  meta.delta.value: '{delta} ms'
  meta.timestamp: 时间戳
  meta.threadId: 线程
  output.title: 流输出
  output.empty: 流没有产生任何输出数据。
</i18n>

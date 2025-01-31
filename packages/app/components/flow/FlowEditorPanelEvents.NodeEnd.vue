<script setup lang="ts">
import type { FlowSessionEventPayload, NodeInstanceJSON } from '@nwrx/api'

defineProps<{
  event: FlowSessionEventPayload<'node:end'>
  node?: NodeInstanceJSON
}>()

const { t } = useI18n()
</script>

<template>
  <!-- Meta -->
  <FlowEditorPanelDataContainer>
    <FlowEditorPanelData :name="t('meta.event')" :model-value="event.event" />
    <FlowEditorPanelData :name="t('meta.delta')" :model-value="t('meta.delta.value', { delta: event.delta })" />
    <FlowEditorPanelData :name="t('meta.duration')" :model-value="t('meta.duration.value', { duration: event.duration })" />
    <FlowEditorPanelData :name="t('meta.timestamp')" :model-value="formatDateTime(event.timestamp)" />
    <FlowEditorPanelData :name="t('meta.id')" :model-value="event.id" />
    <FlowEditorPanelData :name="t('meta.threadId')" :model-value="event.threadId" />
    <FlowEditorPanelData :name="t('meta.executionId')" :model-value="event.executionId" />
  </FlowEditorPanelDataContainer>

  <!-- Data -->
  <FlowEditorPanelDataContainer :title="t('data.title')">
    <template v-if="Object.keys(event.data).length > 0">
      <FlowEditorPanelData
        v-for="socket in node?.dataSchema"
        :model-value="event.data[socket.key]"
        :socket="socket"
        :node="node"
      />
    </template>
    <template v-else>
      <div class="text-subtle p-sm">
        {{ t('data.empty') }}
      </div>
    </template>
  </FlowEditorPanelDataContainer>

  <!-- Result -->
  <FlowEditorPanelDataContainer :title="t('result.title')">
    <template v-if="Object.keys(event.result).length > 0">
      <FlowEditorPanelData
        v-for="socket in node?.resultSchema"
        :model-value="event.result[socket.key]"
        :socket="socket"
        :node="node"
      />
    </template>
    <template v-else>
      <div class="text-subtle p-sm">
        {{ t('result.empty') }}
      </div>
    </template>
  </FlowEditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  meta.event: Event
  meta.delta: Started at
  meta.delta.value: '{delta} ms'
  meta.duration: Duration
  meta.duration.value: '{duration} ms'
  meta.timestamp: Timestamp
  meta.id: Node ID
  meta.threadId: Thread
  meta.executionId: Execution
  data.title: Node Data
  data.empty: The node did not receive any data.
  result.title: Node Result
  result.empty: The node did not produce any result.
fr:
  meta.event: Événement
  meta.delta: Démarré à
  meta.delta.value: '{delta} ms'
  meta.duration: Durée
  meta.duration.value: '{duration} ms'
  meta.timestamp: Horodatage
  meta.id: ID du nœud
  meta.threadId: Fil d'exécution
  meta.executionId: Exécution
  data.title: Données du nœud
  data.empty: Le nœud n'a reçu aucune donnée.
  result.title: Résultat du nœud
  result.empty: Le nœud n'a produit aucun résultat.
de:
  meta.event: Ereignis
  meta.delta: Gestartet um
  meta.delta.value: '{delta} ms'
  meta.duration: Dauer
  meta.duration.value: '{duration} ms'
  meta.timestamp: Zeitstempel
  meta.id: Knoten-ID
  meta.threadId: Thread
  meta.executionId: Ausführung
  data.title: Knotendaten
  data.empty: Der Knoten hat keine Daten erhalten.
  result.title: Knotenergebnis
  result.empty: Der Knoten hat kein Ergebnis erzeugt.
es:
  meta.event: Evento
  meta.delta: Iniciado en
  meta.delta.value: '{delta} ms'
  meta.duration: Duración
  meta.duration.value: '{duration} ms'
  meta.timestamp: Marca de tiempo
  meta.id: ID de nodo
  meta.threadId: Hilo
  meta.executionId: Ejecución
  data.title: Datos del nodo
  data.empty: El nodo no recibió ningún dato.
  result.title: Resultado del nodo
  result.empty: El nodo no produjo ningún resultado.
zh:
  meta.event: 事件
  meta.delta: 开始于
  meta.delta.value: '{delta} ms'
  meta.duration: 持续时间
  meta.duration.value: '{duration} ms'
  meta.timestamp: 时间戳
  meta.id: 节点 ID
  meta.threadId: 线程
  meta.executionId: 执行
  data.title: 节点数据
  data.empty: 节点没有接收任何数据。
  result.title: 节点结果
  result.empty: 节点没有产生任何结果。
</i18n>

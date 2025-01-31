<script setup lang="ts">
import type { FlowSessionEventPayload, NodeInstanceJSON } from '@nwrx/api'

defineProps<{
  event: FlowSessionEventPayload<'node:end'>
  node?: NodeInstanceJSON
}>()

const { t } = useI18n()
</script>

<template>
  <FlowEditorPanelDataContainer :title="t('data.title')">
    <template v-if="Object.keys(event.data).length > 0">
      <FlowEditorPanelData
        v-for="socket in node?.dataSchema"
        :key="socket.key"
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
        :key="socket.key"
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
  data.title: Node Data
  data.empty: The node did not receive any data.
  result.title: Node Result
  result.empty: The node did not produce any result.
fr:
  data.title: Données du nœud
  data.empty: Le nœud n'a reçu aucune donnée.
  result.title: Résultat du nœud
  result.empty: Le nœud n'a produit aucun résultat.
de:
  data.title: Knotendaten
  data.empty: Der Knoten hat keine Daten erhalten.
  result.title: Knotenergebnis
  result.empty: Der Knoten hat kein Ergebnis erzeugt.
es:
  data.title: Datos del nodo
  data.empty: El nodo no recibió ningún dato.
  result.title: Resultado del nodo
  result.empty: El nodo no produjo ningún resultado.
zh:
  data.title: 节点数据
  data.empty: 节点没有接收任何数据。
  result.title: 节点结果
  result.empty: 节点没有产生任何结果。
</i18n>

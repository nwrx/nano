<script setup lang="ts">
import type { ComponentInstanceJSON, EditorSessionServerMessage } from '@nwrx/nano-api'

defineProps<{
  event?: EditorSessionServerMessage & { event: 'thread:nodeEnd' }
  node?: ComponentInstanceJSON
}>()

const { t } = useI18n()
</script>

<template>
  <EditorPanelDataContainer :title="t('input.title')">
    <template v-if="event && Object.keys(event.data).length > 0">
      <EditorPanelData
        v-for="socket in node?.inputSchema"
        :key="socket.key"
        :model-value="event.data[socket.key]"
        :socket="socket"
        :node="node"
      />
    </template>
    <template v-else>
      <div class="text-subtle p-sm">
        {{ t('input.empty') }}
      </div>
    </template>
  </EditorPanelDataContainer>

  <!-- Result -->
  <EditorPanelDataContainer :title="t('output.title')">
    <template v-if="event && Object.keys(event.result).length > 0">
      <EditorPanelData
        v-for="socket in node?.outputSchema"
        :key="socket.key"
        :model-value="event.result[socket.key]"
        :socket="socket"
        :node="node"
      />
    </template>
    <template v-else>
      <div class="text-subtle p-sm">
        {{ t('output.empty') }}
      </div>
    </template>
  </EditorPanelDataContainer>
</template>

<i18n lang="yaml">
en:
  input.title: Input
  input.empty: The node did not receive any input.
  output.title: Output
  output.empty: The node did not produce any output.
fr:
  input.title: Entrée
  input.empty: Le nœud n'a reçu aucune entrée.
  output.title: Sortie
  output.empty: Le nœud n'a produit aucune sortie.
de:
  input.title: Eingabe
  input.empty: Der Knoten hat keine Eingabe erhalten.
  output.title: Ausgabe
  output.empty: Der Knoten hat keine Ausgabe erzeugt.
es:
  input.title: Entrada
  input.empty: El nodo no recibió ninguna entrada.
  output.title: Salida
  output.empty: El nodo no produjo ninguna salida.
zh:
  input.title: 输入
  input.empty: 该节点未收到任何输入。
  output.title: 输出
  output.empty: 该节点未产生任何输出。
</i18n>

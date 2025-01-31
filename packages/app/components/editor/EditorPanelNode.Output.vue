<script setup lang="ts">
import type { ComponentInstanceJSON } from '@nwrx/nano-api'

const props = defineProps<{
  isOpen?: boolean
  node?: ComponentInstanceJSON
}>()

const emit = defineEmits<{
  'update:isOpen': [boolean]
}>()

const { t } = useI18n()
const isOutputOpen = useVModel(props, 'isOpen', emit, { passive: true })
</script>

<template>
  <EditorPanelSection
    v-model="isOutputOpen"
    :title="t('title')"
    :text="t('text')">
    <EditorPanelDataContainer>
      <template v-if="node && node.outputSchema && Object.keys(node.outputSchema).length > 0">
        <EditorPanelData
          v-for="socket in node?.outputSchema"
          :key="socket.key"
          :model-value="node?.output[socket.key]"
          :socket="socket"
        />
      </template>
      <EditorPanelDataText v-else>
        {{ t('empty') }}
      </EditorPanelDataText>
    </EditorPanelDataContainer>
  </EditorPanelSection>
</template>

<i18n lang="yaml">
en:
  title: Output
  text: The output data of the node.
  empty: This node does not produce any output data.
fr:
  title: Sortie
  text: Les données de sortie du nœud.
  empty: Ce nœud ne produit aucune donnée de sortie.
de:
  title: Ausgabe
  text: Die Ausgabedaten des Knotens.
  empty: Dieser Knoten erzeugt keine Ausgabedaten.
es:
  title: Salida
  text: Los datos de salida del nodo.
  empty: Este nodo no produce datos de salida.
zh:
  title: 输出
  text: 节点的输出数据。
  empty: 此节点不生成任何输出数据。
</i18n>

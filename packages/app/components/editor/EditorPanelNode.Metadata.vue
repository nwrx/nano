<script setup lang="ts">
import type { ComponentInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  isOpen?: boolean
  node?: ComponentInstanceJSON
}>()

const emit = defineEmits<{
  'update:isOpen': [boolean]
}>()

const { t } = useI18n()
const isMetadataOpen = useVModel(props, 'isOpen', emit, { passive: true })
</script>

<template>
  <EditorPanelSection
    v-model="isMetadataOpen"
    :title="t('title')"
    :text="t('text')">
    <EditorPanelDataContainer>
      <template v-if="node">
        <EditorPanelData :name="t('state')" :model-value="node.state" />
        <EditorPanelData :name="t('kind')" :model-value="node.kind" />
        <EditorPanelData :name="t('category')" :model-value="node.categoryKind" />
        <EditorPanelData :name="t('id')" :model-value="node.id" />
        <!-- Debug -->
        <EditorPanelData v-for="(value, key) in node" :key="key" :name="key" :model-value="value" />
      </template>
      <EditorPanelDataText v-else>
        {{ t('empty') }}
      </EditorPanelDataText>
    </EditorPanelDataContainer>
  </EditorPanelSection>
</template>

<i18n lang="yaml">
en:
  title: Metadata
  text: The internal metadata of this node.
  id: ID
  kind: Class
  state: State
  category: Category
  empty: Metadata is not available for this node.
fr:
  title: Métadonnées
  text: Les métadonnées internes de ce nœud.
  id: ID
  kind: Classe
  state: État
  category: Catégorie
  empty: Les métadonnées ne sont pas disponibles pour ce nœud.
de:
  title: Metadaten
  text: Die internen Metadaten dieses Knotens.
  id: ID
  kind: Klasse
  state: Zustand
  category: Kategorie
  empty: Metadaten sind für diesen Knoten nicht verfügbar.
es:
  title: Metadatos
  text: Los metadatos internos de este nodo.
  id: ID
  kind: Clase
  state: Estado
  category: Categoría
  empty: No hay metadatos disponibles para este nodo.
zh:
  title: 元数据
  text: 此节点的内部元数据。
  id: ID
  kind: 类
  state: 状态
  category: 类别
  empty: 此节点的元数据不可用。
</i18n>

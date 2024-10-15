<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  name: string
  description: string
  node: NodeInstanceJSON
  isDataOpen: boolean
  isResultOpen: boolean
}>()

const emit = defineEmits<{
  run: [id: string]
  'update:name': [name: string]
  'update:description': [description: string]
  'update:isDataOpen': [isOpen: boolean]
  'update:isResultOpen': [isOpen: boolean]
}>()

const { t } = useI18n()
const isDataOpen = useVModel(props, 'isDataOpen', emit, { passive: true })
const isResultOpen = useVModel(props, 'isResultOpen', emit, { passive: true })
const name = useVModel(props, 'name', emit, { passive: true })
const description = useVModel(props, 'description', emit, { passive: true })

// --- Formatted data.
const data = computed(() => {
  const result: Record<string, unknown> = {}
  for (const key in props.node.data) {
    const value = props.node.data[key]
    const name = props.node.dataSchema.find(field => field.key === key)?.name ?? key
    result[name] = value
  }
  return result
})

// --- Formatted result.
const result = computed(() => {
  const result: Record<string, unknown> = {}
  for (const key in props.node.result) {
    const value = props.node.result[key]
    const name = props.node.resultSchema.find(field => field.key === key)?.name ?? key
    result[name] = value
  }
  return result
})
</script>

<template>
  <div>

    <!-- Title & Desscription -->
    <FlowEditorPanelSectionName
      v-model:name="name"
      v-model:description="description"
      :placeholder-name="t('name.name.placeholder')"
      :placeholder-description="t('name.description.placeholder')"
    />

    <!-- Data fields and values -->
    <FlowEditorPanelSection
      v-model="isDataOpen"
      :title="t('data.title')"
      :text="t('data.text')">
      <FlowEditorPanelSectionData :data="data"/>
    </FlowEditorPanelSection>

    <!-- Result fields and values -->
    <FlowEditorPanelSection
      v-model="isResultOpen"
      :title="t('result.title')"
      :text="t('result.text')">
      <FlowEditorPanelSectionData :data="result"/>
    </FlowEditorPanelSection>
  </div>
</template>

<i18n lang="yaml">
  en:
    name.name.placeholder: Custom label
    name.description.placeholder: Describe the purpose of this node in the flow.
    data.title: Data
    data.text: The current input data of this node.
    result.title: Result
    result.text: The output data of this node.
  fr:
    name.name.placeholder: Étiquette personnalisée
    name.description.placeholder: Décrivez lobjectif de ce nœud dans le flux.
    data.title: Données
    data.text: Les données dentrée actuelles de ce nœud.
    result.title: Résultat
    result.text: Les données de sortie de ce nœud.
  de:
    name.name.placeholder: Benutzer
    name.description.placeholder: Beschreiben Sie den Zweck dieses Knotens im Fluss.
    data.title: Daten
    data.text: Die aktuellen Eingabedaten dieses Knotens.
    result.title: Ergebnis
    result.text: Die Ausgabedaten dieses Knotens.
  es:
    name.name.placeholder: Etiqueta personalizada
    name.description.placeholder: Describa el propósito de este nodo en el flujo.
    data.title: Datos
    data.text: Los datos de entrada actuales de este nodo.
    result.title: Resultado
    result.text: Los datos de salida de este nodo.
  zh:
    name.name.placeholder: 自定义标签
    name.description.placeholder: 描述此节点在流程中的目的。
    data.title: 数据
    data.text: 此节点的当前输入数据。
    result.title: 结果
    result.text: 此节点的输出数据。
</i18n>

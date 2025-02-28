<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'
import type { SchemaOption } from '@nwrx/nano/utils'

const props = defineProps<{
  isOpen?: boolean
  node?: EditorNodeObject
  nodes?: EditorNodeObject[]
  getOptions?: (search: string) => Promise<Array<SchemaOption<unknown>>>
}>()

const emit = defineEmits<{
  'setValue': [key: string, value: unknown]
  'update:isOpen': [boolean]
}>()

const { t } = useI18n()
const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
</script>

<template>
  <EditorPanelSection
    v-model="isOpen"
    :title="t('title')"
    :text="t('text')">
    <EditorPanelDataContainer>
      <template v-if="node && node.inputs">
        <EditorPanelData
          v-for="(socket, name) in node?.inputs"
          :key="name"
          :model-value="node?.input[name]"
          :socket="socket"
          :nodes="nodes"
          :node="node"
          is-clearable
          is-editable
          @clear="() => emit('setValue', name, undefined)"
          @update:model-value="(value: unknown) => emit('setValue', name, value)"
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
  title: Input
  text: The current input data of this node.
  empty: This node does not expect any input data.
fr:
  title: Entrée
  text: Les données d'entrée actuelles de ce nœud.
  empty: Ce nœud n'attend aucune donnée d'entrée.
de:
  title: Eingabe
  text: Die aktuellen Eingabedaten dieses Knotens.
  empty: Dieser Knoten erwartet keine Eingabedaten.
es:
  title: Entrada
  text: Los datos de entrada actuales de este nodo.
  empty: Este nodo no espera ningún dato de entrada.
zh:
  title: 输入
  text: 此节点的当前输入数据。
  empty: 此节点不需要任何输入数据。
</i18n>

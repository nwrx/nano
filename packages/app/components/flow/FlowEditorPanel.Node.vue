<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { NodeInstanceJSON } from '@nwrx/api'
import type { SocketListOption } from '@nwrx/core'

const props = defineProps<{
  name: string
  description: string
  node: NodeInstanceJSON
  nodes: NodeInstanceJSON[]
  isDataOpen: boolean
  isResultOpen: boolean
  getOptions?: (search: string) => Promise<Array<SocketListOption<unknown>>>
}>()

const emit = defineEmits<{
  'setDataValue': [key: string, value: unknown]
  'update:isDataOpen': [isOpen: boolean]
  'update:isResultOpen': [isOpen: boolean]
}>()

const { t } = useI18n()
const isDataOpen = useVModel(props, 'isDataOpen', emit, { passive: true })
const isResultOpen = useVModel(props, 'isResultOpen', emit, { passive: true })
</script>

<template>
  <div>

    <!-- Title & Desscription -->
    <FlowEditorPanelSectionName
      name="name"
      description="description"
      :placeholder-name="t('name.name.placeholder')"
      :placeholder-description="t('name.description.placeholder')"
    />

    <!-- Message -->
    <div v-if="node.error" class="hint hint-danger p-sm b-x-0 rd-0">
      {{ node.error }}
    </div>

    <!-- Data -->
    <FlowEditorPanelSection v-model="isDataOpen" :title="t('data.title')" :text="t('data.text')">
      <FlowEditorPanelDataContainer>
        <FlowEditorPanelData
          v-for="socket in node.dataSchema"
          :key="socket.key"
          :model-value="node.data[socket.key]"
          :socket="socket"
          :nodes="nodes"
          :node="node"
          is-clearable
          is-editable
          @clear="() => emit('setDataValue', socket.key, undefined)"
          @update:model-value="(value) => emit('setDataValue', socket.key, value)"
        />
      </FlowEditorPanelDataContainer>
    </FlowEditorPanelSection>

    <!-- Result -->
    <FlowEditorPanelSection v-model="isResultOpen" :title="t('results.title')" :text="t('results.text')">
      <FlowEditorPanelDataContainer>
        <FlowEditorPanelData
          v-for="socket in node.resultSchema"
          :key="socket.key"
          :model-value="node.result[socket.key]"
          :socket="socket"
        />
      </FlowEditorPanelDataContainer>
    </FlowEditorPanelSection>

    <!-- Errors -->
    <FlowEditorPanelSection :title="t('errors.title')" :text="t('errors.text')" class-content="space-y-4">

      <!-- Data -->
      <FlowEditorPanelDataContainer>
        <template v-if="Object.keys(node.dataParseErrors).length > 0">
          <FlowEditorPanelData
            v-for="(socket, key) in node.dataParseErrors"
            :key="key"
            :name="key"
            :model-value="socket"
          />
        </template>
        <template v-else-if="node.state === 'DONE'">
          <div class="text-subtle p-sm">
            {{ t('errors.data.done') }}
          </div>
        </template>
        <template v-else>
          <div class="text-subtle p-sm">
            {{ t('errors.data.pending') }}
          </div>
        </template>
      </FlowEditorPanelDataContainer>

      <!-- Result -->
      <FlowEditorPanelDataContainer>
        <template v-if="Object.keys(node.resultParseErrors).length > 0">
          <FlowEditorPanelData
            v-for="(socket, key) in node.resultParseErrors"
            :key="key"
            :name="key"
            :model-value="socket"
          />
        </template>
        <template v-else-if="node.state === 'DONE'">
          <div class="text-subtle p-sm">
            {{ t('errors.result.done') }}
          </div>
        </template>
        <template v-else>
          <div class="text-subtle p-sm">
            {{ t('errors.result.pending') }}
          </div>
        </template>
      </FlowEditorPanelDataContainer>
    </FlowEditorPanelSection>

    <!-- Debug -->
    <FlowEditorPanelSection :title="t('debug.title')" :text="t('debug.text')">
      <FlowEditorPanelDataContainer :title="t('debug.dataSchema')">
        <FlowEditorPanelData
          v-for="socket in node.dataSchema"
          :key="socket.key"
          :name="socket.key"
          :model-value="socket"
        />
      </FlowEditorPanelDataContainer>
      <FlowEditorPanelDataContainer :title="t('debug.resultSchema')">
        <FlowEditorPanelData
          v-for="socket in node.resultSchema"
          :key="socket.key"
          :name="socket.key"
          :model-value="socket"
        />
      </FlowEditorPanelDataContainer>
    </FlowEditorPanelSection>
  </div>
</template>

<i18n lang="yaml">
en:
  name.name.placeholder: Custom label
  name.description.placeholder: Describe the purpose of this node in the flow.
  data.title: Data
  data.text: The current input data of this node.
  results.title: Result
  results.text: The output data of this node.
  errors.title: Errors
  errors.text: The errors that occurred during the lifecycle of this node.
  errors.data: Data Resolution
  errors.data.done: Data resolution was successful.
  errors.data.pending: Data resolution is pending.
  errors.result: Result resolution
  errors.result.done: Result resolution was successful.
  errors.result.pending: Result resolution is pending.
fr:
  name.name.placeholder: Étiquette personnalisée
  name.description.placeholder: Décrivez lobjectif de ce nœud dans le flux.
  data.title: Données
  data.text: Les données dentrée actuelles de ce nœud.
  results.title: Résultat
  results.text: Les données de sortie de ce nœud.
  errors.title: Erreurs
  errors.text: Les erreurs survenues lors de lexécution de ce nœud.
de:
  name.name.placeholder: Benutzer
  name.description.placeholder: Beschreiben Sie den Zweck dieses Knotens im Fluss.
  data.title: Daten
  data.text: Die aktuellen Eingabedaten dieses Knotens.
  results.title: Ergebnis
  results.text: Die Ausgabedaten dieses Knotens.
  errors.title: Fehler
  errors.text: Die Fehler, die während der Ausführung dieses Knotens aufgetreten sind.
es:
  name.name.placeholder: Etiqueta personalizada
  name.description.placeholder: Describa el propósito de este nodo en el flujo.
  data.title: Datos
  data.text: Los datos de entrada actuales de este nodo.
  results.title: Resultado
  results.text: Los datos de salida de este nodo.
  errors.title: Errores
  errors.text: Los errores que ocurrieron durante la ejecución de este nodo.
zh:
  name.name.placeholder: 自定义标签
  name.description.placeholder: 描述此节点在流程中的目的。
  data.title: 数据
  data.text: 此节点的当前输入数据。
  results.title: 结果
  results.text: 此节点的输出数据。
  errors.title: 错误
  errors.text: 在执行此节点时发生的错误。
</i18n>

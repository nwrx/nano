<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import type { FlowThreadNodeJSON } from '@nwrx/api'
import type { SocketListOption } from '@nwrx/core'

const props = defineProps<{
  node?: FlowThreadNodeJSON
  nodes?: FlowThreadNodeJSON[]
  isInputOpen?: boolean
  isOutputOpen?: boolean
  isMetadataOpen?: boolean
  getOptions?: (search: string) => Promise<Array<SocketListOption<unknown>>>
}>()

const emit = defineEmits<{
  'setLabel': [string]
  'setComment': [string]
  'setInputValue': [key: string, value: unknown]
  'setMetaValue': [key: string, value: unknown]
  'update:isInputOpen': [boolean]
  'update:isOutputOpen': [boolean]
  'update:isMetadataOpen': [boolean]
}>()

const { t } = useI18n()
const isInputOpen = useVModel(props, 'isInputOpen', emit, { passive: true })
const isOutputOpen = useVModel(props, 'isOutputOpen', emit, { passive: true })
const isMetadataOpen = useVModel(props, 'isMetadataOpen', emit, { passive: true })
</script>

<template>
  <div>

    <!-- Title & Desscription -->
    <EditorPanelHeader
      :name="node?.label ?? node?.name"
      :description="node?.comment"
      :placeholder-name="t('label')"
      :placeholder-description="t('comment')"
      @update:name="label => emit('setLabel', label)"
      @update:description="comment => emit('setComment', comment)"
    />

    <!-- Error Hint -->
    <EditorPanelError
      v-if="node?.error"
      :message="node.error"
      :code="node.errorCode"
    />

    <!-- Input Data Table -->
    <EditorPanelNodeInput
      v-model:is-open="isInputOpen"
      :node="node"
      :nodes="nodes"
      @set-value="(key, value) => emit('setInputValue', key, value)"
    />

    <!-- Output Data Table -->
    <EditorPanelNodeOutput
      v-model:is-open="isOutputOpen"
      :node="node"
    />

    <!-- Metadata -->
    <EditorPanelNodeMetadata
      v-model:is-open="isMetadataOpen"
      :node="node"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  label: Give this node a label.
  comment: Provide additional information about this node.
fr:
  label: Donnez un libellé à ce nœud.
  comment: Fournir des informations supplémentaires sur ce nœud.
de:
  label: Geben Sie diesem Knoten ein Label.
  comment: Geben Sie zusätzliche Informationen zu diesem Knoten an.
es:
  label: Asigne un nombre a este nodo.
  comment: Proporcione información adicional sobre este nodo.
zh:
  label: 为此节点命名。
  comment: 提供有关此节点的附加信息。
</i18n>

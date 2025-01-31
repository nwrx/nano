<!-- eslint-disable vue/no-extra-parens -->
<script setup lang="ts">
import type { InputSocketJSON, FlowThreadNodeJSON } from '@nwrx/api'

const props = defineProps<{
  nodes?: FlowThreadNodeJSON[]
  socket?: InputSocketJSON
  modelValue?: unknown
  isEditable?: boolean
  isClearable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <!-- Link -->
  <EditorPanelDataDetailLink
    v-if="socket?.control === 'socket'"
    v-model="model"
    :nodes="nodes"
    :is-editable="isEditable"
  />

  <!-- Text -->
  <EditorPanelDataDetailText
    v-else-if="typeof model === 'string'"
    v-model="model"
  />

  <!-- Object -->
  <EditorPanelDataDetailObject
    v-else-if="typeof model === 'object' && model !== null"
    v-model="model"
    :socket="socket"
  />

  <!-- No Data -->
  <div
    v-else
    class="flex items-center py-xs px-sm">
    <span class="text-subtle italic">
      {{ t('noData') }}
    </span>
  </div>
</template>

<i18n lang="yaml">
en:
  noData: No data
fr:
  noData: Pas de données
</i18n>

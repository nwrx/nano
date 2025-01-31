<script setup lang="ts">
import type { DataSocketJSON, NodeInstanceJSON } from '@nwrx/api'

const props = defineProps<{
  name?: string
  node?: NodeInstanceJSON
  nodes?: NodeInstanceJSON[]
  socket?: DataSocketJSON
  modelValue?: unknown
  isOpen?: boolean
  isEditable?: boolean
  isClearable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })

// --- Resolve the default value.
const defaultValue = computed(() => {
  if (props.socket?.defaultValue === undefined) return
  return String(props.socket.defaultValue)
})

// --- Predicate if the value is a link to another node.
const isLink = computed(() => {
  if (!props.isEditable) return false
  if (!props.socket) return false
  if (props.socket.control === undefined) return true
  return props.socket.control === 'socket'
})
</script>

<template>
  <FlowEditorPanelDataValueLink
    v-if="isLink"
    :modelValue="model"
    :nodes="nodes"
  />

  <!-- Number -->
  <div
    v-else-if="typeof model === 'number'"
    class="px-sm font-mono"
    v-text="model"
  />

  <!-- Object -->
  <Badge
    v-else-if="typeof model === 'object' && model !== null"
    class="badge-sm text-white"
    :style="{ backgroundColor: socket?.typeColor }"
    :label="socket?.typeName ?? t('object')"
  />

  <!-- Boolean -->
  <FlowEditorPanelDataValueRadio
    v-else-if="typeof model === 'boolean'"
    v-model="model"
    :options="socket?.options"
  />

  <!-- Fallback to text -->
  <input
    v-else
    v-model="model"
    class="px-sm line-clamp-1 font-mono bg-transparent outline-none transition grow"
    :class="{ 'opacity-50': isOpen, 'cursor-default italic': !model && !defaultValue }"
    :placeholder="defaultValue ?? t('noDefault')"
    :readonly="!isEditable"
  />
</template>

<i18n lang="yaml">
  en:
    object: Object
    noDefault: No default value
  fr:
    object: Objet
    noDefault: Aucune valeur par défaut
  de:
    object: Objekt
    noDefault: Kein Standardwert
  es:
    object: Objeto
    noDefault: Sin valor predeterminado
  zh:
    object: 对象
    noDefault: 没有默认值
</i18n>

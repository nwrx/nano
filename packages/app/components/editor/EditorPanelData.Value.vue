<script setup lang="ts">
import type { ComponentInstanceJSON, InputJSON } from '@nwrx/api'
import { isReferenceLink } from '#imports'

const props = defineProps<{
  name?: string
  node?: ComponentInstanceJSON
  nodes?: ComponentInstanceJSON[]
  socket?: InputJSON
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
</script>

<template>
  <EditorPanelDataValueLink
    v-if="isReferenceLink(model)"
    :id="model.$fromNode.id"
    :name="model.$fromNode.name"
    :path="model.$fromNode.path"
    :nodes="nodes"
  />

  <!-- Object -->
  <Badge
    v-else-if="typeof model === 'object' && model !== null"
    class="badge-sm text-white mx-sm"
    :style="{ backgroundColor: socket?.typeColor }"
    :label="socket?.typeName ?? t('object')"
  />

  <!-- Boolean -->
  <EditorPanelDataValueRadio
    v-else-if="typeof model === 'boolean'"
    v-model="model"
    :options="socket?.options"
  />

  <!-- Fallback to text -->
  <input
    v-else-if="isEditable"
    v-model="model"
    class="px-sm line-clamp-1 font-mono bg-transparent outline-none transition grow"
    :class="{ 'opacity-50': isOpen, 'cursor-default italic': !model && !defaultValue }"
    :placeholder="defaultValue ?? t('noDefault')">

  <!-- Text -->
  <span
    v-else
    class="px-sm line-clamp-1 font-mono bg-transparent"
    :class="{ 'opacity-50': isOpen }"
    v-text="model"
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

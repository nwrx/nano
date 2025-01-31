<script setup lang="ts">
import type { InputSocketJSON, FlowThreadNodeJSON } from '@nwrx/api'

const props = defineProps<{
  name?: string
  node?: FlowThreadNodeJSON
  nodes?: FlowThreadNodeJSON[]
  socket?: InputSocketJSON
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

function isLink(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return value.startsWith('$NODE.')
}
</script>

<template>
  <EditorPanelDataValueLink
    v-if="isLink(model)"
    :model-value="model"
    :nodes="nodes"
  />

  <!-- Array -->
  <div v-else-if="Array.isArray(model)" class="flex flex-col">
    <!-- Count badge -->
    <Badge
      class="badge-sm"
      :style="{ backgroundColor: socket?.typeColor }"
      :label="model.length"
    />
  </div>

  <!-- Object -->
  <Badge
    v-else-if="typeof model === 'object' && model !== null"
    class="badge-sm text-white"
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
    v-else
    v-model="model"
    class="px-sm line-clamp-1 font-mono bg-transparent outline-none transition grow"
    :class="{ 'opacity-50': isOpen, 'cursor-default italic': !model && !defaultValue }"
    :placeholder="defaultValue ?? t('noDefault')"
    :readonly="!isEditable">
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

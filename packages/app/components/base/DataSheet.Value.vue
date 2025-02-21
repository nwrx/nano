<script setup lang="ts">
const props = defineProps<{
  name?: string
  modelValue?: unknown
  placeholder?: string
  color?: string
  isOpen?: boolean
  isEditable?: boolean
  isClearable?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <!-- Object -->
  <Badge
    v-if="typeof model === 'object' && model !== null"
    class="badge-sm text-white mx-sm"
    :style="{ backgroundColor: color }"
    :label="t('object')"
  />

  <!-- Boolean -->
  <!--
    <EditorPanelDataValueRadio
    v-else-if="typeof model === 'boolean'"
    v-model="model"
    :options="socket?.options"
    />
  -->

  <!-- Fallback to text -->
  <input
    v-else-if="isEditable"
    v-model="model"
    class="px-sm line-clamp-1 font-mono bg-transparent outline-none transition grow"
    :class="{ 'opacity-50': isOpen, 'cursor-default italic': !model && !placeholder }"
    :placeholder="placeholder ?? t('noDefault')">

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

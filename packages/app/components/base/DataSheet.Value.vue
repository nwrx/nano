<script setup lang="ts">
import DataSheetValueTextArea from './DataSheet.ValueTextArea.vue'

const props = defineProps<{
  name?: string
  modelValue?: unknown
  placeholder?: string
  color?: string
  isOpen?: boolean
  isEditable?: boolean
  isClearable?: boolean
  isTextArea?: boolean
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue')
</script>

<template>
  <div class="flex items-center w-full h-full relative">

    <!-- Object -->
    <div v-if="typeof model === 'object' && model !== null" class=" h-8">
      <Badge
        class="badge-sm text-white mx-sm"
        :style="{ backgroundColor: color }"
        :label="t('object')"
      />
    </div>

    <!-- Boolean -->
    <!--
      <EditorPanelDataValueRadio
      v-else-if="typeof model === 'boolean'"
      v-model="model"
      :options="socket?.options"
      />
    -->

    <!-- Text -->
    <input
      v-else-if="isEditable && !isTextArea"
      v-model="model"
      :placeholder="placeholder ?? t('placeholder')"
      class="px-sm line-clamp-1 font-mono outline-none transition grow bg-transparent w-full h-full"
      :class="{
        'opacity-50': isOpen,
        'cursor-default italic': !model && !placeholder,
      }">

    <!-- Textarea -->
    <DataSheetValueTextArea
      v-else-if="isEditable && isTextArea"
      v-model="model"
      :placeholder="placeholder"
    />

    <!-- Text -->
    <span
      v-else
      class="px-sm py-sm line-clamp-1 font-mono bg-transparent h-8"
      :class="{ 'text-subtle': isOpen }"
      v-text="model"
    />
  </div>
</template>

<i18n lang="yaml">
en:
  object: Object
  placeholder: No default value
fr:
  object: Objet
  placeholder: Aucune valeur par défaut
de:
  object: Objekt
  placeholder: Kein Standardwert
es:
  object: Objeto
  placeholder: Sin valor predeterminado
zh:
  object: 对象
  placeholder: 没有默认值
</i18n>

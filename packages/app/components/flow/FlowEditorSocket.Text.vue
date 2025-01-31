<script setup lang="ts">
const props = defineProps<{
  name: string
  modelValue: string
  defaultValue?: unknown
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// --- Localization
const { t } = useI18n()

// --- State && Two-way binding
const input = ref<HTMLInputElement>()
const model = useVModel(props, 'modelValue', emit, {
  passive: true,
  eventName: 'update:modelValue',
})
</script>

<template>
  <FlowEditorSocketGroup class="cursor-text" @click="() => input?.focus()">

    <!-- Label -->
    <FlowEditorSocketLabel :label="name" />

    <!-- Field -->
    <input
      ref="input"
      v-model="model"
      :class="{ 'text-editor-node': !model, 'italic': !model && !defaultValue }"
      class="w-full outline-none bg-transparent text-sm"
      :placeholder="typeof defaultValue === 'string' ? defaultValue : t('empty')"
    />
  </FlowEditorSocketGroup>
</template>

<i18n lang="yaml">
  en:
    empty: No default value
  fr:
    empty: Aucune valeur par défaut
  de:
    empty: Kein Standardwert
  es:
    empty: Sin valor predeterminado
  zh:
    empty: 无默认值
</i18n>

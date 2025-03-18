<script setup lang="ts">
import type { Schema } from '@nwrx/nano/utils'
import type { ComponentInstance } from 'vue'
import { BaseInputText } from '@unshared/vue/BaseInputText'
import { isReference } from '~/composables/useEditor/isReference'
import EditorNodeInputValueBadge from './EditorNodeInput.ValueBadge.vue'

const props = defineProps<{
  name?: string
  schema?: Schema
  readonly?: boolean
}>()

const { t } = useI18n()
const value = defineModel()

// --- Get the default value as the placeholder.
const placeholder = computed(() => {
  const defaultValue = props.schema?.default
  return typeof defaultValue === 'string' ? defaultValue : t('empty')
})

// --- When the read-only value is too long, truncate it.
const valueReadonly = computed(() => {
  if (typeof value.value === 'number') return String(value.value)
  if (value.value === null) return t('empty')
  if (value.value === undefined) return t('empty')
  if (value.value === '') return t('empty')
  if (typeof value.value !== 'string') return t('notString')
  const newLineIndex = value.value.indexOf('\n')
  return newLineIndex === -1 ? value.value : `${value.value.slice(0, newLineIndex)}...`
})

// --- Expose the field focus method.
const inputComponent = ref<ComponentInstance<typeof BaseInputText>>()
defineExpose({
  focus: () => {
    if (!inputComponent.value) return
    const inputElement = inputComponent.value.$el as HTMLInputElement
    inputElement.focus({ preventScroll: true })
  },
})

// --- Show a badge when a reference is detected.
const isValueRefence = computed(() => isReference(value.value))
</script>

<template>
  <EditorNodeInputValueBadge
    v-if="isValueRefence"
    :value="value"
  />
  <p
    v-else-if="props.readonly"
    :class="{ 'text-subtle': !value }"
    class="outline-none placeholder:text-subtle bg-transparent w-full text-sm font-mono line-clamp-1"
    v-text="valueReadonly || placeholder"
  />
  <BaseInputText
    v-else
    ref="inputComponent"
    :model-value="value"
    :readonly="readonly"
    :placeholder="placeholder"
    :class="{ 'text-subtle': !value }"
    class="outline-none placeholder:text-subtle bg-transparent w-full text-sm font-mono"
    @update:model-value="(v) => value = v"
  />
</template>

<i18n lang="yaml">
en:
  empty: No default value
  notString: Value is not a string
fr:
  empty: Aucune valeur par défaut
  notString: La valeur n'est pas un texte
de:
  empty: Kein Standardwert
  notString: Wert ist kein String
es:
  empty: Sin valor predeterminado
  notString: El valor no es una cadena de texto
zh:
  empty: 没有默认值
  notString: 值不是字符串
</i18n>

<script setup lang="ts">
import type { Schema } from '@nwrx/nano/utils'
import type { ComponentInstance } from 'vue'
import { BaseInputText } from '@unshared/vue/BaseInputText'
import { isReference } from '~/composables/useEditor/isReference'
import EditorNodeInputValueBadge from './EditorNodeInput.ValueBadge.vue'

const props = defineProps<{
  name: string
  schema: Schema
  readonly: boolean
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

  <!-- If field is not editable and has no value, show a placeholder. -->
  <p
    v-else-if="props.readonly"
    :class="{
      'text-subtle italic': !value,
      'font-mono': value,
    }"
    class="outline-none bg-transparent w-full text-sm line-clamp-1">
    {{ valueReadonly || placeholder }}
  </p>

  <!-- If field is editable -->
  <BaseInputText
    v-else
    ref="inputComponent"
    v-model="value"
    :readonly="readonly"
    :placeholder="placeholder"
    :class="{
      'text-subtle italic pb-0.5': !value,
      'font-mono': value,
    }"
    class="outline-none placeholder:text-subtle placeholder:italic bg-transparent w-full text-sm"
  />
</template>

<i18n lang="yaml">
en:
  empty: Empty
  notString: Value is not a string
fr:
  empty: Vide
  notString: La valeur n'est pas un texte
de:
  empty: Leer
  notString: Wert ist kein String
es:
  empty: Vacío
  notString: El valor no es una cadena de texto
zh:
  empty: 空
  notString: 值不是字符串
</i18n>

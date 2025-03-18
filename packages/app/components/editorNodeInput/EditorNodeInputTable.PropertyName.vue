<script setup lang="ts">
import type { Schema } from '@nwrx/nano/utils'

const props = defineProps<{
  properties?: Record<string, Schema>
  additionalProperties?: boolean | Schema
  usedProperties?: string[]
}>()

const { t } = useI18n()
const path = defineModel('path', { default: '' })
const options = computed(() => {
  if (!props.properties) return []
  return Object.entries( props.properties)
    .filter(([value]) => {
      if (path.value === value) return true
      return !props.usedProperties?.includes(value)
    })
    .map(([value, label]) => ({ value, label: label.title ?? value }))
})
</script>

<template>
  <div class="flex items-center w-full h-full text-sm font-mono">

    <!-- If the schema has properties, show a select dropdown. -->
    <select
      v-if="properties"
      v-model="path"
      :class="{ 'text-subtle': !path }"
      class="cursor-pointer w-0 grow h-full outline-none px-sm bg-transparent">
      <option
        value=""
        :disabled="true"
        v-text="t('property')"
      />
      <option
        v-for="({ label, value }) in options"
        :key="value"
        :value="value"
        v-text="label"
      />
    </select>

    <!-- Show an input field. -->
    <input
      v-if="additionalProperties"
      v-model="path"
      :placeholder="t('property')"
      class="cursor-text w-0 grow h-full outline-none bg-transparent px-sm placeholder:text-subtle">
  </div>
</template>

<i18n lang="yaml">
en:
  property: Property
fr:
  property: Propriété
de:
  property: Eigenschaft
es:
  property: Propiedad
zh:
  property: 属性
</i18n>

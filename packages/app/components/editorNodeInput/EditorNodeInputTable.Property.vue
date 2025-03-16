<script setup lang="ts">
import type { EditorNodeObject } from '@nwrx/nano-api'

const props = defineProps<{
  editor: Editor
  node: EditorNodeObject
  name: string
  isLast: boolean
  isFirst: boolean
}>()

const emit = defineEmits<{
  add: []
  remove: []
}>()

const { t } = useI18n()
const schema = computed(() => props.node.inputs[props.name])

const property = defineModel('property', { default: '' })
const propertySchema = computed(() => {
  const additionalProperties = typeof schema.value.additionalProperties === 'object' ? schema.value.additionalProperties : {}
  if (schema.value.properties) return schema.value.properties[property.value] ?? additionalProperties
  return additionalProperties
})

const value = defineModel('modelValue')
</script>

<template>
  <div
    class="
      flex items-center h-8 b b-transparent b-t-editor bg-emphasized
      hover:b hover:b-active
    "
    @mouseenter.stop="() => {}"
    @mouseleave.stop="() => {}">

    <!-- Select property -->
    <div class="w-2/5 h-full flex items-center pl-sm mr-sm b-r b-editor text-sm">
      <input
        v-if="schema.additionalProperties"
        v-model="property"
        :placeholder="t('property')"
        :class="{ 'text-editor-node italic': !property }"
        class="cursor-text w-0 grow h-full outline-none bg-transparent">

      <select
        v-else
        v-model="property"
        class="cursor-pointer w-0 grow h-full outline-none bg-transparent">
        <option
          v-for="(option, optionKey) in schema.properties"
          :key="optionKey"
          :value="optionKey"
          v-text="`${option.title ?? value} (${option.type})`"
        />
      </select>
    </div>

    <!-- Text -->
    <template v-if="property">
      <input
        v-if="propertySchema.type === 'string'"
        v-model="value"
        :placeholder="t('value')"
        :class="{ 'text-editor-node italic': !value }"
        class="cursor-text w-0 grow h-full outline-none bg-transparent text-sm px-sm b-l b-editor">

      <!-- Boolean - True false radio inline -->
      <div
        v-else-if="propertySchema.type === 'boolean'"
        class="flex items-center h-full px-sm grow cursor-pointer space-x-sm"
        @click="() => value = !value">

        <!-- 2 values / clickable -->
        <div
          class="relative flex items-center h-full space-x-xs px-sm"
          :class="{ 'bg-active text-active': value }">
          <BaseIcon icon="i-carbon:checkmark" class="size-4" />
          <span class="text-sm">True</span>
        </div>

        <div
          class="relative flex items-center h-full space-x-xs px-sm"
          :class="{ 'bg-active text-active': !value }">
          <BaseIcon icon="i-carbon:close" class="size-4" />
          <span class="text-sm">False</span>
        </div>
      </div>
    </template>

    <div class="grow" />

    <!-- Add -->
    <EditorNodeInputTableButton
      v-if="isLast"
      class="op-0 group-hover:op-100"
      icon="i-carbon:add"
      @click="() => emit('add')"
    />

    <EditorNodeInputTableButton
      class="op-0 group-hover:op-100"
      icon="i-carbon:close"
      @click="() => emit('remove')"
    />
  </div>
</template>

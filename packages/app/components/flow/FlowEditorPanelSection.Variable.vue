<script setup lang="ts">
import { toConstantCase } from '@unshared/string'

const props = defineProps<{
  name: string
  value?: string
  isCreating?: boolean
  isEditable?: boolean
}>()

const emit = defineEmits<{
  'create': [name: string, value: string]
  'update': [value: string]
  'delete': []
}>()

const name = useVModel(props, 'name', emit, { passive: true, defaultValue: '' })
const value = useVModel(props, 'value', emit, { passive: true, defaultValue: '' }) as Ref<string>
const isEditable = useVModel(props, 'isEditable', emit, { passive: true })
</script>

<template>
  <div class="flex space-x-4">

    <!-- Name -->
    <BaseContentEditable
      v-model="name"
      eager
      :readonly="!isCreating"
      :parse="(value) => toConstantCase(value.toUpperCase())"
      placeholder="VARIABLE_NAME"
      :class="{
        'text-primary-500 bg-primary-500/10': isEditable,
        'text-white bg-primary-500': isCreating,
      }"
      class="
        font-mono font-medium text-xs outline-none
        px-2 py-1 h-6 rounded"
    />

    <!-- Value -->
    <BaseInputText
      v-model="value"
      placeholder="VALUE"
      eager
      :class="{
        'w-0': !isEditable,
      }"
      class="
        font-mono text-xs
        border border-primary-100 outline-none
        px-2 py-1 h-6 rounded w-full
      "
    />

    <!-- Create -->
    <BaseButton v-if="value && isCreating" @click="() => emit('create', name, value)">
      <BaseIcon icon="i-carbon:checkmark" class="w-4 h-4" />
    </BaseButton>

    <!-- Cancel -->
    <BaseButton v-else-if="!value && isCreating" @click="() => emit('delete')">
      <BaseIcon icon="i-carbon:close" class="w-4 h-4" />
    </BaseButton>

    <!-- Update -->
    <BaseButton v-else-if="isEditable" @click="() => emit('update', value)">
      <BaseIcon icon="i-carbon:checkmark" class="w-4 h-4" />
    </BaseButton>

    <!-- Delete -->
    <BaseButton v-else @click="() => emit('delete')">
      <BaseIcon icon="i-carbon:close" class="w-4 h-4" />
    </BaseButton>
  </div>
</template>

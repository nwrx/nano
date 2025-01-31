<script setup lang="ts">
import { toConstantCase } from '@unshared/string/toConstantCase'

const props = defineProps<{
  isOpen: boolean
  title: string
  text: string
}>()

const emit = defineEmits<{
  create: [name: string, value: string]
  'update:isOpen': [isOpen: boolean]
}>()

const isOpen = useVModel(props, 'isOpen', emit, { passive: true })
const title = ref('')
const value = ref('')

function reset() {
  title.value = ''
  value.value = ''
}
</script>

<template>
  <AppDialog
    v-model="isOpen"
    :title="title"
    :text="text"
    @open="() => reset()">

    <template #default="{ open }">
      <BaseButton
        eager
        class="
          px-2 py-1 rounded
          font-mono font-medium text-xs
          bg-primary-700 text-white/80
          hover:text-white
          transition-colors duration-200
        "
        label="+ CREATE_NEW_VARIABLE"
        @click="() => open()"
      />
    </template>

    <template #dialog="{ close }">
      <div class="space-y-4">
        <InputText
          v-model="name"
          placeholder="YOUR_VARIABLE_NAME"
          :parse="(value) => toConstantCase(value.toUpperCase())"
        />
        <InputText
          v-model="value"
          type="textarea"
          placeholder="Value"
        />
        <Button
          link
          label="Create variable"
          @click="() => { emit('create', name, value); close() }"
        />
      </div>
    </template>
  </AppDialog>
</template>

<!-- eslint-disable vue/prop-name-casing -->
<script setup lang="ts">
import type { BaseInputTextProps } from '@unshared/vue'
import type { InputText } from '#components'
import type { ComponentInstance } from 'vue'

const props = defineProps<Omit<BaseInputTextProps, 'modelValue'> & {
  modelValue: boolean
  initialValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'submit': [string]
}>()

const model = ref<string>('')
const input = ref<ComponentInstance<typeof InputText>>()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })

// --- When the dialog is opened, focus the input. Since the `input`
// --- element is nested inside `InputText`, we need to go several
// --- levels deep to find it.
watch([isOpen, input], async([isOpen, input]) => {
  if (!isOpen) {
    model.value = props.initialValue ?? ''
    return
  }
  if (!input) return
  await nextTick()
  const inputElementContainer = input.$el as HTMLInputElement
  const inputElement = inputElementContainer.querySelector('input')
  if (inputElement) inputElement.focus()
})

function submit() {
  emit('submit', model.value)
  isOpen.value = false
}
</script>

<template>
  <AppDialog
    v-model="isOpen"
    class-container="max-w-3xl !w-3/4"
    @confirm="() => emit('submit', model)">
    <template #container>
      <InputText
        ref="input"
        v-bind="props"
        v-model="model"
        :placeholder="placeholder"
        class-input="h-24 text-3xl sm:text-4xl px-xl"
        @keydown.enter="() => submit()"
      />
    </template>
  </AppDialog>
</template>

<script setup lang="ts">
import type { InputText } from '#components'
import type { ComponentInstance } from 'vue'
import { toSlug } from '@unshared/string/toSlug'

const props = defineProps<{
  modelValue: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'submit': [title: string]
}>()

const { t } = useI18n()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })
const title = ref<string>('')
const input = ref<ComponentInstance<typeof InputText>>()

// --- When the dialog is opened, focus the input. Since the `input`
// --- element is nested inside `InputText`, we need to go several
// --- levels deep to find it.
watchEffect(async() => {
  if (!isOpen.value) return
  if (!input.value) return
  await nextTick()
  const inputElementContainer = input.value.$el as HTMLInputElement
  const inputElement = inputElementContainer.querySelector('input')
  if (inputElement) inputElement.focus()
})

function submit() {
  emit('submit', title.value)
  isOpen.value = false
}
</script>

<template>
  <AppDialog
    v-model="isOpen"
    class-container="max-w-3xl !w-3/4"
    @confirm="() => emit('submit', title)">

    <template #container>
      <InputText
        ref="input"
        v-model="title"
        :parse="toSlug"
        :placeholder="t('placeholder')"
        class-input="h-24 text-3xl sm:text-4xl px-xl"
        @keydown.enter="() => submit()"
      />
    </template>

  </AppDialog>
</template>

<i18n lang="yaml">
en:
  placeholder: Give your project a name
fr:
  placeholder: Donnez un nom à votre projet
de:
  placeholder: Geben Sie Ihrem Projekt einen Namen
es:
  placeholder: Dale un nombre a tu proyecto
zh:
  placeholder: 为您的项目命名
</i18n>

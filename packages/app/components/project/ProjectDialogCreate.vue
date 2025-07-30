<script setup lang="ts">
import type { ComponentInstance } from 'vue'
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import { useProjects } from '~/composables/useProject'

const props = defineProps<{
  workspace: string
}>()

const { t } = useI18n()
const projects = useProjects(props)
const name = ref<string>('')
const input = ref<ComponentInstance<typeof InputText>>()
const isOpen = defineModel({ default: false })

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
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-container="max-w-3xl !w-3/4">

    <template #container>
      <InputText
        ref="input"
        v-model="name"
        :placeholder="t('placeholder')"
        class-input="h-24 text-3xl sm:text-4xl px-xl"
        @keydown.enter="() => {
          projects.createProject({ name })
          name = ''
          isOpen = false
        }"
      />
    </template>

  </Dialog>
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

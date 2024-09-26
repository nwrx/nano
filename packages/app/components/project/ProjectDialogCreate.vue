<script setup lang="ts">
import type { CreateProjectOptions } from '~/composables/useWorkspace'
import { toSlug } from '@unshared/string/toSlug'

const props = defineProps<{
  modelValue: boolean
  workspaceName: string
}>()

const emit = defineEmits<{
  'submit': [options: CreateProjectOptions]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
const options = ref<CreateProjectOptions>({
  name: '',
  title: '',
  description: '',
})
</script>

<template>
  <AppDialog v-model="model" :title="`Create a new project in ${workspaceName}`">
    <AppPageHint type="info">
      Get started by creating a new project in your workspace.
    </AppPageHint>

    <div class="space-y-4 mt-8">
      <InputText
        v-model="options.name"
        :parse="toSlug"
        placeholder="my-project"
      />
      <InputText
        v-model="options.title"
        placeholder="My Project"
      />
      <InputText
        v-model="options.description"
        placeholder="A short description of the project"
        type="textarea"
      />
    </div>

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        label="Confirm"
        @close="() => close()"
        @confirm="() => emit('submit', options)"
      />
    </template>
  </AppDialog>
</template>

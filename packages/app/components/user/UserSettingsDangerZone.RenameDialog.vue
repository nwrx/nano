<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
}>()

const emit = defineEmits<{
  'submit': [value: string]
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
const newName = ref('')
const error = ref('')

function onInput() {
  error.value = ''
}

function onSubmit() {
  if (!newName.value) return error.value = 'The new name cannot be empty'
  emit('submit', newName.value)
  model.value = false
}
</script>

<template>
  <AppDialog v-model="model">
    <template #title>
      Rename the <span class="font-bold">{{ project }}</span> user?
    </template>

    <!-- Message -->
    <AppPageHint type="warning">
      Changing the username might break existing integrations. Make sure you are certain about this action before proceeding.
    </AppPageHint>

    <!-- New name input -->
    <InputText
      v-model="newName"
      class="mt-2"
      placeholder="New username"
      :hint="error"
      @input="() => onInput()"
    />

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        label="Rename User"
        variant="primary"
        manualClose
        @close="() => close()"
        @confirm="() => onSubmit()"
      />
    </template>
  </AppDialog>
</template>

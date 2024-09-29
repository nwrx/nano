<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  displayName?: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const slug = computed(() => `${props.workspace}/${props.project}`)
const model = useVModel(props, 'modelValue', emit, { passive: true })
const confirm = ref('')
const error = ref('')

function onInput() {
  error.value = ''
}

function onSubmit() {
  if (confirm.value !== slug.value) return error.value = 'The project name does not match'
  emit('submit')
  model.value = false
}
</script>

<template>
  <AppDialog v-model="model">
    <template #title>
      Delete the <span class="font-bold">{{ displayName }}</span> project?
    </template>

    <!-- Message -->
    <AppPageHint type="error">
      This action cannot be undone and the project will be permanently removed from the database.
      Make sure you are certain about this action before proceeding.
    </AppPageHint>

    <!-- Repeat the name before deleting -->
    <p class="text-sm mt-8">
      You are about to rename the <span class="font-bold">{{ slug }}</span> project.
      Repeat the name to confirm you this is the project you want to delete.
    </p>

    <!-- Confirmation input -->
    <InputText
      v-model="confirm"
      class="mt-2"
      :placeholder="slug"
      :hint="error"
      @input="() => onInput()"
    />

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        label="I understand, delete the project"
        variant="danger"
        manualClose
        @close="() => close()"
        @confirm="() => onSubmit()"
      />
    </template>
  </AppDialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
  title?: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const slug = computed(() => `${props.workspace}/${props.title}`)
const model = useVModel(props, 'modelValue', emit, { passive: true })
const confirm = ref('')
const error = ref('')

function onInput() {
  error.value = ''
}

function onSubmit() {
  return error.value = 'The user name does not match'
  emit('submit')
  model.value = false
}
</script>

<template>
  <AppDialog v-model="model">
    <template #title>
      Delete the <span class="font-bold">{{ title }}</span> user?
    </template>

    <!-- Message -->
    <AppPageHint type="error">
      This action cannot be undone and the user will be permanently removed from the database.
      Make sure you are certain about this action before proceeding.
    </AppPageHint>

    <!-- Repeat the name before deleting -->
    <p class="text-sm mt-8">
      You are about to delete the <span class="font-bold">{{ slug }}</span> user.
      Repeat the name to confirm you this is the user you want to delete.
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
        label="I understand, delete the user"
        variant="danger"
        manualClose
        @close="() => close()"
        @confirm="() => onSubmit()"
      />
    </template>
  </AppDialog>
</template>

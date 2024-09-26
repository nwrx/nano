<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  workspace: string
  project: string
}>()

const emit = defineEmits<{
  'submit': [value: string]
}>()

const apiUrl = computed(() => `api.nwrx.io/${props.workspace}/`)
const slug = computed(() => `${props.workspace}/${props.project}`)
const model = useVModel(props, 'modelValue', emit, { passive: true })
const name = ref('')
</script>

<template>
  <AppDialog v-model="model" :title="`Rename the '${slug}' project`">
    <AppPageHint type="warning">
      Renaming the project will change the project URL and the project name. Make
      sure you are certain about this action before proceeding.
    </AppPageHint>

    <!-- Repeat the name before deleting -->
    <p class="text-sm mt-8">
      Define the new project slug.
    </p>

    <!-- Confirmation input -->
    <InputText
      v-model="name"
      class="mt-2"
      :textBefore="apiUrl"
      placeholder="New project name"
    />

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        label="I understand, rename the project"
        variant="success"
        :disabled="!name"
        manualClose
        @close="() => close()"
        @confirm="() => emit('submit', name)"
      />
    </template>
  </AppDialog>
</template>

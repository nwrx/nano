<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  userName: string
  userDisplayName: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': []
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <AppDialog v-model="model" :title="`Are you sure you want to unassign ${userDisplayName}?`">
    <AppPageHint type="error">
      You are about to unassign a member from the project. This means they will lose access to the project
      and will no longer be able to view the project, its flows, and variables.
    </AppPageHint>

    <!-- Message -->
    <p class="text-sm mt-4">
      Are you sure you want to unassign <span class="font-medium">{{ userDisplayName }}</span>
      from the project? This action cannot be undone and the user will lose access to the project.
    </p>

    <!-- Confirm -->
    <template #cta="{ close }">
      <AppDialogActions
        label="Unassign from the project"
        variant="danger"
        @close="() => close()"
        @confirm="() => emit('submit')"
      />
    </template>
  </AppDialog>
</template>

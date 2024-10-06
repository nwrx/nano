<script setup lang="ts">
defineProps<{
  username: string
}>()

const emit = defineEmits<{
  submitRename: [value: string]
  submitDelete: []
}>()

const isDialogDeleteOpen = ref(false)
const isDialogRenameOpen = ref(false)
</script>

<template>
  <AppPageForm
    vertical
    title="Danger Zone">
    <template #text>
      Be cautious when making changes in this section. These actions are irreversible and may have a
      significant impact on your account and data. Proceed with caution.
    </template>

    <!-- Actions -->
    <AppPageFormActions variant="danger">
      <AppPageFormAction
        variant="danger"
        title="Delete User"
        text="This action cannot be undone. All data associated with the user will be lost."
        label="Delete"
        @click="() => isDialogDeleteOpen = true"
      />
      <AppPageFormAction
        variant="danger"
        title="Change Username"
        text="Changing the username might break existing integrations."
        label="Rename"
        @click="() => isDialogRenameOpen = true"
      />
    </AppPageFormActions>

    <!-- Delete project dialog -->
    <UserSettingsDangerZoneDialogDelete
      v-model="isDialogDeleteOpen"
      :username="username"
      @submit="() => emit('submitDelete')"
    />

    <!-- Rename project dialog -->
    <UserSettingsDangerZoneDialogRename
      v-model="isDialogRenameOpen"
      :username="username"
      @submit="(name) => emit('submitRename', name)"
    />
  </AppPageForm>
</template>

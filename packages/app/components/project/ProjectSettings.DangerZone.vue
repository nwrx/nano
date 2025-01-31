<script setup lang="ts">
import type { UserObject } from '@nwrx/api'

defineProps<{
  searchUsers: (search: string) => Promise<UserObject[]>
  workspace: string
  project: string
  title?: string
}>()

const emit = defineEmits<{
  submitName: [value: string]
  submitDelete: []
  submitTransfer: [value: string]
}>()

const isDialogDeleteOpen = ref(false)
const isDialogRenameOpen = ref(false)
const isDialogTransferOpen = ref(false)
</script>

<template>
  <AppPageForm title="Danger Zone">
    <template #text>
      Be cautious when making changes in this section. You can delete your project or change the URL
      which might break existing integrations and cause issues with the services that depend on it.
      <br>
      <br>
      For ways to mitigate these issues, please refer to the <Button link variant="primary" href="#">guide</Button>
      for more information and best-practices.
    </template>

    <!-- Actions -->
    <AppPageFormActions variant="danger">
      <AppPageFormAction
        variant="danger"
        title="Delete Project"
        text="This action cannot be undone. All data associated with the project will be lost."
        label="Delete Project"
        @click="() => isDialogDeleteOpen = true"
      />
      <AppPageFormAction
        variant="danger"
        title="Rename Project"
        text="Changing the project URL might break existing integrations."
        label="Rename Project"
        @click="() => isDialogRenameOpen = true"
      />
      <AppPageFormAction
        variant="danger"
        title="Transfer Ownership"
        text="Will change the owner and might break existing integrations."
        label="Transfer"
        @click="() => isDialogTransferOpen = true"
      />
    </AppPageFormActions>

    <!-- Delete project dialog -->
    <ProjectSettingsDangerZoneDialogDelete
      v-model="isDialogDeleteOpen"
      :workspace="workspace"
      :project="project"
      :title="title"
      @submit="() => emit('submitDelete')"
    />

    <!-- Rename project dialog -->
    <ProjectSettingsDangerZoneDialogRename
      v-model="isDialogRenameOpen"
      :project="project"
      :workspace="workspace"
      @submit="(name) => emit('submitName', name)"
    />

    <!-- Transfer project dialog -->
    <ProjectSettingsDangerZoneDialogTransfer
      v-model="isDialogTransferOpen"
      :owner="workspace"
      :slug="project"
      :searchUsers="searchUsers"
      @submit="(owner) => emit('submitTransfer', owner)"
    />

  </AppPageForm>
</template>

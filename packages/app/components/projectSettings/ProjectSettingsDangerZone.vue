<script setup lang="ts">
defineProps<{
  workspace: string
  project: string
}>()

const { t } = useI18n()
const showRenameDialog = ref(false)
const showTransferDialog = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <AppPageFormActions class="border-danger">
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:edit"
        :title="t('rename.title')"
        :text="t('rename.text')"
        :label="t('rename.label')"
        @click="() => showRenameDialog = true"
      />
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:status-change"
        :title="t('transfer.title')"
        :text="t('transfer.text')"
        :label="t('transfer.label')"
        @click="() => showTransferDialog = true"
      />
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:trash-can"
        :title="t('delete.title')"
        :text="t('delete.text')"
        :label="t('delete.label')"
        @click="() => showDeleteDialog = true"
      />
    </AppPageFormActions>
  </AppPageForm>

  <!-- Rename Dialog -->
  <ProjectSettingsDangerZoneRename
    v-model="showRenameDialog"

    :workspace="workspace"
    :project="project"
  />

  <!-- Transfer Dialog -->
  <ProjectSettingsDangerZoneTransfer
    v-model="showTransferDialog"
    :workspace="workspace"
    :project="project"
  />

  <!-- Delete Dialog -->
  <ProjectSettingsDangerZoneDelete
    v-model="showDeleteDialog"
    :workspace="workspace"
    :project="project"
  />
</template>

<i18n lang="yaml">
en:
  title: Danger zone
  text: Proceed with caution. Actions here can permanently affect your project and its integrations.
  rename:
    title: Rename project
    text: Renaming your project will update its URL. Existing integrations and bookmarks may break. Proceed carefully.
    label: Rename
  transfer:
    title: Transfer ownership
    text: Transfer this project to another workspace or user. Ensure the new owner is aware of this change.
    label: Transfer
  delete:
    title: Permanently delete project
    text: This action is **irreversible**. All project project will be permanently lost.
    label: Delete
</i18n>

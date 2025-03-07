<script setup lang="ts">
defineProps<{ username: string }>()
const { t } = useI18n()
const showRenameDialog = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">

    <!-- Actions -->
    <AppPageFormActions class="b-danger">
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        icon="i-carbon:edit"
        :text="t('actions.rename.text')"
        :title="t('actions.rename.title')"
        :label="t('actions.rename.label')"
        @click="() => showRenameDialog = true"
      />
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        icon="i-carbon:trash-can"
        :text="t('actions.delete.text')"
        :title="t('actions.delete.title')"
        :label="t('actions.delete.label')"
        @click="() => showDeleteDialog = true"
      />
    </AppPageFormActions>

    <!-- Rename user dialog -->
    <UserSettingsDangerZoneDialogRename
      v-model="showRenameDialog"
      :username="username"
    />

    <!-- Delete user dialog -->
    <UserSettingsDangerZoneDialogDelete
      v-model="showDeleteDialog"
      :username="username"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Be cautious when making changes in this section. These actions are **irreversible** and may have a significant impact on your account and data. Proceed with caution.
  actions:
    rename:
      title: Change Username
      text: Changing the username might break existing integrations.
      label: Change Username
    delete:
      title: Delete the user
      text: This action cannot be undone. All data associated with the user will be lost.
      label: Delete User
</i18n>

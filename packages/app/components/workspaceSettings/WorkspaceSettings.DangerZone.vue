<script setup lang="ts">
defineProps<{ workspace: string }>()
const { t } = useI18n()
const router = useRouter()

const showRenameDialog = ref(false)
const showArchiveDialog = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">
    <AppPageFormActions class="border-danger">
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:archive"
        :title="t('archive.title')"
        :text="t('archive.text')"
        :label="t('archive.label')"
        @click="() => showArchiveDialog = true"
      />
      <AppPageFormAction
        class="border-danger"
        class-button="button-danger"
        icon="i-carbon:edit"
        :title="t('rename.title')"
        :text="t('rename.text')"
        :label="t('rename.label')"
        @click="() => showRenameDialog = true"
      />
    </AppPageFormActions>
  </AppPageForm>

  <!-- Rename workspace dialog -->
  <WorkspaceSettingsDangerZoneRename
    v-model="showRenameDialog"
    :workspace="workspace"
    @submit="(workspace) => router.replace({ params: { workspace } })"
  />

  <!-- Archive workspace dialog -->
  <WorkspaceSettingsDangerZoneArchive
    v-model="showArchiveDialog"
    :workspace="workspace"
  />
</template>

<i18n lang="yaml">
en:
  title: Danger zone
  text: Be careful with these actions. They are irreversible.
  rename:
    title: Rename workspace
    text: Change the name of your workspace.
    label: Rename
  archive:
    title: Archive workspace
    text: Move your workspace to the archive.
    label: Archive
</i18n>

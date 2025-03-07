<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
  vault: string
  project: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

async function removeAccess() {
  await client.requestAttempt('DELETE /api/workspaces/:workspace/vaults/:vault/projects/:project', {
    data: {
      name: props.vault,
      workspace: props.workspace,
      project: props.project,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:delete"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { project, workspace, vault })"
    :text="t('text', { project, workspace, vault })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => removeAccess()">
    <ProjectCard :workspace :project load />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove project access to the **{workspace}/{vault}** vault
  text: This project will no longer be able to access this vault.
  cancel: Cancel
  confirm: Remove access
  success: Project access removed successfully
</i18n>

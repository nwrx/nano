<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
  vault: string
  username: string
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
  await client.requestAttempt('DELETE /workspaces/:workspace/vaults/:vault/assignments/:username', {
    data: {
      vault: props.vault,
      workspace: props.workspace,
      username: props.username,
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
    :title="t('title', { username, workspace, vault })"
    :text="t('text', { username, workspace, vault })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => removeAccess()">
    <UserCard :username load />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove {username}'s access to the **{workspace}/{vault}** vault
  text: This user will no longer be able to access this vault.
  cancel: Cancel
  confirm: Remove access
  success: User access removed successfully
</i18n>

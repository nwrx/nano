<script setup lang="ts">
import type { VaultUserPermissions } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue?: boolean
  workspace: string
  vault: string
  assignment: VaultUserPermissions
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
  await client.requestAttempt('DELETE /api/workspaces/:workspace/vaults/:name/assignments/:username', {
    data: {
      name: props.vault,
      workspace: props.workspace,
      username: props.assignment.username,
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
    :title="t('title', { ...assignment, workspace, vault })"
    :text="t('text')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => removeAccess()">
    <UserCard
      :display-name="assignment.displayName"
      :username="assignment.username"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove {username}'s access to {vault}
  text: This user will no longer be able to access this vault.
  cancel: Cancel
  confirm: Remove access
  success: User access removed successfully
</i18n>

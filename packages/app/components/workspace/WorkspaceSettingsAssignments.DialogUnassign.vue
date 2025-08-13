<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
  username: string
  displayName: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()

async function unassignUser() {
  await client.requestAttempt('DELETE /workspaces/:workspace/assignments/:username', {
    data: {
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
    icon="i-carbon:warning"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { workspace, username })"
    :text="t('text', { workspace, username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => unassignUser()">
    <UserCard
      :display-name="displayName"
      :username="username"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Remove **{username}** from **{workspace}**
  text: This user will lose all access to the workspace and its projects. This action cannot be undone.
  cancel: Cancel
  confirm: Remove user
  success: User successfully removed from the workspace
</i18n>

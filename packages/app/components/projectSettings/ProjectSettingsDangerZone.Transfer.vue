<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
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
const selectedUsers = ref<string[]>([])

async function transferProject() {
  if (selectedUsers.value.length === 0) return

  await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project/workspace', {
    data: {
      workspace: props.workspace,
      project: props.project,
      newWorkspace: selectedUsers.value[0],
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success', {
        workspace: props.workspace,
        project: props.project,
        newWorkspace: selectedUsers.value[0],
      }))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => selectedUsers.value = [], { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:status-change"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, project })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="selectedUsers.length === 0"
    @confirm="() => transferProject()">
    <UserSearch
      v-model="selectedUsers"
      class="mt-2"
      :placeholder="t('label')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Transfer project **{workspace}/{project}**
  text: Transferring ownership will move the project to another workspace. Ensure the new owner is prepared for this change.
  cancel: Cancel
  confirm: Transfer
  label: Search and select new owner
  success: Project **{workspace}/{project}** has been transferred to **{newWorkspace}**
</i18n>

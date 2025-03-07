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
const confirm = ref('')

async function deleteProject() {
  await client.requestAttempt('DELETE /api/workspaces/:workspace/projects/:project', {
    data: {
      workspace: props.workspace,
      project: props.project,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success', { workspace: props.workspace, project: props.project }))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => confirm.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:trash-can"
    class-hint="hint-danger"
    class-button="button-danger"
    :title="t('title', { workspace, project })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== project"
    @confirm="() => deleteProject()">
    <InputText
      v-model="confirm"
      :text-before="`${CONSTANTS.appHost}/${workspace}/`"
      :placeholder="t('label')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Confirm deletion of **{workspace}/{project}**
  text: This action **cannot be undone**. To confirm deletion, please type the exact project path below.
  cancel: Cancel
  confirm: Delete
  label: Confirm deletion by typing the name of the project
  success: Project **{workspace}/{project}** has been deleted.
</i18n>

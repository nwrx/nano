<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const confirmName = ref('')

async function archiveWorkspace() {
  await client.request('DELETE /api/workspaces/:workspace', {
    data: {
      workspace: props.workspace,
    },
    onSuccess: () => {
      alerts.success(t('success', { name: props.workspace }))
      emit('submit')
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => confirmName.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:archive"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { name: workspace })"
    :text="t('text', { name: workspace })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirmName !== workspace"
    @confirm="() => archiveWorkspace()">
    <InputText
      v-model="confirmName"
      :label="t('label')"
      :placeholder="workspace"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Archive workspace
  text: Move your workspace to the archive.
  label: Type the workspace name to confirm
  cancel: Cancel
  confirm: Archive
  success: Workspace "{name}" archived.
</i18n>

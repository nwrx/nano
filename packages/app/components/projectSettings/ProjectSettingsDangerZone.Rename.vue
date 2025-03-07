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
const name = ref('')

async function renameProject() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/projects/:project/name', {
    data: {
      workspace: props.workspace,
      project: props.project,
      name: name.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success', { workspace: props.workspace, project: name.value }))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => { name.value = props.project }, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { workspace, project })"
    :text="t('text', { workspace, project })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => renameProject()">
    <InputText
      v-model="name"
      class="mt-2"
      :text-before="`${CONSTANTS.appHost}/${workspace}/`"
      :placeholder="t('label')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename project **{workspace}/{project}**
  text: Renaming your project will update its URL and may break existing integrations. Ensure you communicate this change to your team and update any dependent services.
  cancel: Cancel
  confirm: Rename
  label: Enter new project name
  success: Project **{workspace}/{project}** has been renamed.
</i18n>

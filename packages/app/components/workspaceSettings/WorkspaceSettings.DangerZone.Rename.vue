<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': [string]
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const name = ref('')

async function renameWorkspace() {
  await client.request('PUT /api/workspaces/:workspace', {
    data: {
      workspace: props.workspace,
      name: name.value,
    },
    onSuccess: () => {
      alerts.success(t('success', { name: name.value }))
      emit('submit', name.value)
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => name.value = props.workspace, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:label"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { name: workspace })"
    :text="t('text', { name: workspace })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="name === workspace"
    @confirm="() => renameWorkspace()">
    <InputText
      v-model="name"
      class="mt-2"
      :text-before="`${CONSTANTS.appHost}/`"
      :hint="t('label')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename workspace
  text: Change the name of your workspace.
  label: Define the new workspace name
  cancel: Cancel
  confirm: Rename
  success: Workspace renamed to "{name}".
</i18n>

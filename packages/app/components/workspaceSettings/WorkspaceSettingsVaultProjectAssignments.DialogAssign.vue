<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  workspace: string
  vault: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const project = ref('')
const permissions = ref(['Read'])

async function assignProject() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:vault/projects/:project', {
    data: {
      workspace: props.workspace,
      vault: props.vault,
      project: project.value,
      permissions: permissions.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => project.value = '', { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:add"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { workspace, vault })"
    :text="t('text', { workspace, vault })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => assignProject()">
    <ProjectSearch v-model="project" :workspace />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Add projects to **{workspace}/{vault}** vault
  text: Select projects and assign appropriate permission levels.
  selectPermissions: Select permissions to grant
  cancel: Cancel
  confirm: Add project
  success: Project successfully added to the vault
  permissions:
    Use:
      label: Use
      text: Can use secrets from this vault
    Read:
      label: Read
      text: Can view and use secrets from this vault
    Write:
      label: Write
      text: Can add, modify and delete secrets in this vault
    Owner:
      label: Owner
      text: Full control over this vault, including managing access
</i18n>

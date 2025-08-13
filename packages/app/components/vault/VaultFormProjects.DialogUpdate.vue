<!-- eslint-disable vue/no-dupe-keys -->
<script setup lang="ts">
import type { VaultPermission } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue?: boolean
  workspace: string
  vault: string
  project: string
  permissions: VaultPermission[]
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const selectedPermissions = ref<VaultPermission[]>([])

async function updatePermissions() {
  await client.requestAttempt('PUT /workspaces/:workspace/vaults/:vault/projects/:project', {
    data: {
      workspace: props.workspace,
      vault: props.vault,
      project: props.project,
      permissions: selectedPermissions.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => selectedPermissions.value = [...props.permissions], { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { project, workspace, vault })"
    :text="t('text', { project, workspace, vault })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => updatePermissions()">
    <div class="space-y-md">
      <Checkbox
        v-for="permission in ['Use', 'Read', 'Write', 'Owner']"
        :key="permission"
        v-model="selectedPermissions"
        :value="permission"
        type="checkbox"
        :label="t(`permissions.${permission}.label`)"
        :text="t(`permissions.${permission}.text`)"
      />
    </div>
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Edit permissions for project in **{workspace}/{vault}**
  text: Select the permissions you want to assign to this project in **{workspace}/{vault}**
  cancel: Keep existing permissions
  confirm: Update permissions
  success: Permissions updated successfully
  permissions:
    title: Select permissions
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

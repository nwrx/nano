<script setup lang="ts">
import type { VaultPermission, VaultUserPermissions } from '@nwrx/nano-api'

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
const permissions = ref<VaultPermission[]>([])

async function updatePermissions() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:name/assignments/:username', {
    data: {
      name: props.vault,
      workspace: props.workspace,
      username: props.assignment.username,
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
watch(isOpen, () => permissions.value = [...props.assignment.permissions], { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { ...assignment, workspace, vault })"
    :text="t('text', { ...assignment, workspace, vault })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => updatePermissions()">
    <div class="space-y-4">
      <Checkbox
        v-for="permission in ['Read', 'Write', 'Admin']"
        :key="permission"
        v-model="permissions"
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
  title: Edit permissions for {username} in **{workspace}/{vault}**
  text: Select the permissions you want to assign to {username} in **{workspace}/{vault}**
  cancel: Cancel
  confirm: Update permissions
  success: Permissions updated successfully
  permissions:
    Read:
      label: Read
      text: Can view and use secrets from this vault
    Write:
      label: Write
      text: Can add, modify and delete secrets in this vault
    Admin:
      label: Admin
      text: Full control over this vault, including managing access
</i18n>

<!-- eslint-disable vue/no-dupe-keys -->
<script setup lang="ts">
import type { VaultPermission } from '@nwrx/nano-api'

const props = defineProps<{
  modelValue?: boolean
  workspace: string
  vault: string
  username: string
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
const permissions = ref<VaultPermission[]>([])

async function updatePermissions() {
  await client.requestAttempt('PUT /workspaces/:workspace/vaults/:vault/assignments/:username', {
    data: {
      vault: props.vault,
      workspace: props.workspace,
      username: props.username,
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
watch(isOpen, () => permissions.value = [...props.permissions], { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:edit"
    class-hint="hint-warning"
    class-button="button-warning"
    :title="t('title', { username, workspace, vault })"
    :text="t('text', { username, workspace, vault })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => updatePermissions()">
    <div class="space-y-4">
      <Checkbox
        v-for="permission in ['Use', 'Read', 'Write', 'Owner']"
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

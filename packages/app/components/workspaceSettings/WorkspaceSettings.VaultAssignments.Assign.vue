<script setup lang="ts">
import type { VaultPermission } from '@nwrx/nano-api'

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
const users = ref<string[]>([])
const permissions = ref<VaultPermission[]>(['Read'])

async function assignUsers() {
  await client.requestAttempt('POST /api/workspaces/:workspace/vaults/:name/assignments', {
    data: {
      workspace: props.workspace,
      name: props.vault,
      usernames: users.value,
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
watch(isOpen, () => {
  users.value = []
  permissions.value = ['Read']
}, { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:add"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { vault })"
    :text="t('text')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => assignUsers()">
    <UserSearch v-model="users" />

    <div class="mt-4 space-y-2">
      <div class="font-medium">
        {{ t('selectPermissions') }}
      </div>
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
  title: Add users to {vault} vault
  text: Select users and assign appropriate permission levels.
  selectPermissions: Select permissions to grant
  cancel: Cancel
  confirm: Add user(s)
  success: User(s) successfully added to the vault
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

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
const users = ref<string[]>([])

async function assignUsers() {
  await client.requestAttempt('PUT /api/workspaces/:workspace/vaults/:name/assignments/:username', {
    data: {
      workspace: props.workspace,
      name: props.vault,
      username: users.value[0],
      permissions: ['Read'],
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => { users.value = [] }, { immediate: true })
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
</i18n>

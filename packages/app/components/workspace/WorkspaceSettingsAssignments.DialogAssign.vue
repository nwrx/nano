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
const selectedUsers = ref<string[]>([])

async function assignUsers() {
  await client.requestAttempt('POST /workspaces/:workspace/assignments', {
    data: {
      workspace: props.workspace,
      usernames: selectedUsers.value,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
      selectedUsers.value = []
    },
  })
}

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => selectedUsers.value = [], { immediate: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    icon="i-carbon:add"
    class-hint="hint-success"
    class-button="button-success"
    :title="t('title', { workspace })"
    :text="t('text', { workspace })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => assignUsers()">
    <UserSearch v-model="selectedUsers" />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Add a new member to **{workspace}**
  text: Select a user to add to this workspace. The user will gain access according to the permissions you set.
  cancel: Cancel
  confirm: Add member
  success: Member successfully added to the workspace
</i18n>

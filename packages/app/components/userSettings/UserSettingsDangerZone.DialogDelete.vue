<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  username: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': []
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const confirmUsername = ref('')

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => confirmUsername.value = '', { immediate: true })

async function deleteUser() {
  await client.requestAttempt('DELETE /api/users/:username', {
    data: {
      username: props.username,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success'))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-danger"
    icon="i-carbon:trash-can"
    :title="t('title', { username })"
    :text="t('text', { username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirmUsername !== username"
    @confirm="() => deleteUser()">
    <UserCard :username load />
    <InputText
      v-model="confirmUsername"
      class="mt-md"
      :hint="t('message')"
      :placeholder="username"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Delete User
  text: This action cannot be undone. All data associated with the user will be lost.
  message: Type your username to confirm deletion
  cancel: Cancel
  confirm: Delete User
  success: User has been deleted successfully
</i18n>

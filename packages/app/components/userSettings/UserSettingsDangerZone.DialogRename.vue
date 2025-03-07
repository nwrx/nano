<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  username: string
  displayName?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'submit': [string]
}>()

// --- Model.
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const newUsername = ref('')

// --- State.
const isOpen = useVModel(props, 'modelValue', emit)
watch(isOpen, () => newUsername.value = props.username, { immediate: true })

async function changeUsername() {
  await client.requestAttempt('PUT /api/users/:username', {
    data: {
      username: props.username,
      newUsername: newUsername.value,
    },
    onSuccess: () => {
      emit('submit', newUsername.value)
      alerts.success(t('success'))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-danger"
    icon="i-carbon:edit"
    :title="t('title', { username })"
    :text="t('text', { username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => changeUsername()">
    <UserCard
      :username="username"
      :display-name="displayName"
    />
    <InputText
      v-model="newUsername"
      class="mt-md"
      :hint="t('hint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Change Username
  text: Changing the username might break existing integrations.
  hint: Enter your new username
  cancel: Cancel
  confirm: Change Username
  success: Username changed successfully
</i18n>

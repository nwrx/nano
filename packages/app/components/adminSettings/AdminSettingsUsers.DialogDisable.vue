<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

const props = defineProps<{ modelValue?: boolean; user: UserObject }>()
const emit = defineEmits<{ 'submit': [] }>()

const { t } = useI18n()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })
const confirm = ref('')
watch(() => isOpen.value, () => confirm.value = '')

const client = useClient()
const alerts = useAlerts()
async function disableUser() {
  await client.requestAttempt('POST /api/users/:username/disable', {
    data: {
      username: props.user.username,
    },
    onSuccess: () => {
      confirm.value = ''
      emit('submit')
      alerts.success(t('success', { ...props.user }))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-danger"
    class-button="button-danger"
    icon="i-carbon:trash-can"
    :title="t('title', { ...user })"
    :text="t('hint', { ...user })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== user.username"
    @confirm="() => disableUser()">

    <!-- User Card -->
    <UserCard
      :display-name="user.displayName"
      :username="user.username"
    />

    <!-- Confirmation input -->
    <InputText
      v-model="confirm"
      :label="t('message')"
      :placeholder="user.username"
      class="mt-md"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Disable the **{username}** user?
  hint: You are about to disable the user. This action is irreversible and will permanently disable the user. Please confirm that you understand the consequences of this action.
  message: Please confirm by the username
  cancel: Cancel
  confirm: Disable
  success: The user **{displayName}** has been disabled.
fr:
  title: Désactiver l'utilisateur **{username}** ?
  hint: Vous êtes sur le point de désactiver l'utilisateur. Cette action est irréversible et désactivera définitivement l'utilisateur. Veuillez confirmer que vous comprenez les conséquences de cette action.
  message: Veuillez confirmer en le nom d'utilisateur
  cancel: Annuler
  confirm: Désactiver
  success: L'utilisateur **{displayName}** a été désactivé.
de:
  title: Deaktivieren Sie den Benutzer **{username}**?
  hint: Sie sind dabei, den Benutzer zu deaktivieren. Dieser Vorgang ist nicht rückgängig zu machen und deaktiviert den Benutzer dauerhaft. Bitte bestätigen Sie, dass Sie die Kon
  message: Bitte bestätigen Sie durch den Benutzernamen
  cancel: Stornieren
  confirm: Deaktivieren
  success: Der Benutzer **{displayName}** wurde deaktiviert.
es:
  title: ¿Deshabilitar al usuario **{username}**?
  hint: Estás a punto de deshabilitar al usuario. Esta acción es irreversible y deshabilitará permanentemente al usuario. Por favor, confirma que entiendes las consecuencias de esta acción.
  message: Por favor confirma por el nombre de usuario
  cancel: Cancelar
  confirm: Deshabilitar
  success: El usuario **{displayName}** ha sido deshabilitado.
zh:
  title: 禁用用户 **{username}**？
  hint: 您即将禁用用户。此操作是不可逆的，将永久禁用用户。请确认您理解此操作的后果。
  message: 请通过用户名确认
  cancel: 取消
  confirm: 禁用
  success: 用户 **{displayName}** 已被禁用。
</i18n>

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
async function deleteUser() {
  await client.requestAttempt('DELETE /users/:username', {
    data: {
      username: props.user.username,
    },
    onSuccess: () => {
      confirm.value = ''
      emit('submit')
      alerts.success(t('success', { username: props.user.username }))
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
    :title="t('title', { username: user.username })"
    :text="t('text', { username: user.username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== user.username"
    @confirm="() => deleteUser()">
    <!-- User Card -->
    <UserCard
      :display-name="user.displayName"
      :username="user.username"
    />
    <!-- Confirmation input -->
    <InputText
      v-model="confirm"
      :label="t('confirmLabel')"
      :placeholder="user.username"
      class="mt-md"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Delete User Account
  text: You are about to permanently delete the user account for "{username}". This action is irreversible and will remove all associated data, projects, and access permissions. Please confirm your understanding of the consequences.
  confirmLabel: Type the username to confirm deletion
  cancel: Keep User Account
  confirm: Delete User Account
  success: User account "{username}" has been permanently deleted
fr:
  title: Supprimer le Compte Utilisateur
  text: Vous êtes sur le point de supprimer définitivement le compte utilisateur de "{username}". Cette action est irréversible et supprimera toutes les données associées, projets et permissions d'accès. Veuillez confirmer votre compréhension des conséquences.
  confirmLabel: Tapez le nom d'utilisateur pour confirmer la suppression
  cancel: Conserver le Compte Utilisateur
  confirm: Supprimer le Compte Utilisateur
  success: Le compte utilisateur "{username}" a été supprimé définitivement
de:
  title: Benutzerkonto Löschen
  text: Sie sind dabei, das Benutzerkonto für "{username}" dauerhaft zu löschen. Diese Aktion ist nicht rückgängig zu machen und entfernt alle zugehörigen Daten, Projekte und Zugriffsberechtigungen. Bitte bestätigen Sie Ihr Verständnis der Konsequenzen.
  confirmLabel: Geben Sie den Benutzernamen ein, um die Löschung zu bestätigen
  cancel: Benutzerkonto Behalten
  confirm: Benutzerkonto Löschen
  success: Benutzerkonto "{username}" wurde dauerhaft gelöscht
es:
  title: Eliminar Cuenta de Usuario
  text: Está a punto de eliminar permanentemente la cuenta de usuario de "{username}". Esta acción es irreversible y eliminará todos los datos asociados, proyectos y permisos de acceso. Por favor confirme su comprensión de las consecuencias.
  confirmLabel: Escriba el nombre de usuario para confirmar la eliminación
  cancel: Mantener Cuenta de Usuario
  confirm: Eliminar Cuenta de Usuario
  success: La cuenta de usuario "{username}" ha sido eliminada permanentemente
zh:
  title: 删除用户账户
  text: 您即将永久删除用户 "{username}" 的账户。此操作不可逆转，将删除所有关联数据、项目和访问权限。请确认您理解此操作的后果。
  confirmLabel: 输入用户名以确认删除
  cancel: 保留用户账户
  confirm: 删除用户账户
  success: 用户账户 "{username}" 已被永久删除
</i18n>

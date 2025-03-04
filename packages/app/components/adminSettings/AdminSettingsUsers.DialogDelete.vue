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
  await client.requestAttempt('DELETE /api/users/:username', {
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
    @confirm="() => deleteUser()">

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
  title: Delete the **{username}** user?
  hint: You are about to delete the user. This action is irreversible and will permanently delete all data associated with the user. Please confirm that you understand the consequences of this action.
  message: Confirm by typing the username below.
  cancel: Keep the user
  confirm: I understand, delete the user
  success: User **{username}** deleted successfully
fr:
  title: Supprimer l'utilisateur **{username}** ?
  hint: Vous êtes sur le point de supprimer l'utilisateur. Cette action est irréversible et supprimera définitivement toutes les données associées à l'utilisateur. Veuillez confirmer que vous comprenez les conséquences de cette action.
  message: Confirmez en tapant le nom d'utilisateur ci-dessous.
  cancel: Conserver l'utilisateur
  confirm: Je comprends, supprimer l'utilisateur
  success: Utilisateur **{username}** supprimé avec succès
de:
  title: Benutzer **{username}** löschen?
  hint: Sie sind dabei, den Benutzer zu löschen. Diese Aktion ist nicht rückgängig zu machen und löscht alle mit dem Benutzer verbundenen Daten dauerhaft. Bitte bestätigen Sie, dass Sie die Konsequenzen dieser Aktion verstehen.
  message: Bestätigen Sie, indem Sie den Benutzernamen unten eingeben.
  cancel: Benutzer behalten
  confirm: Ich verstehe, den Benutzer löschen
  success: Benutzer **{username}** erfolgreich gelöscht
es:
  title: ¿Eliminar al usuario **{username}**?
  hint: Estás a punto de eliminar al usuario. Esta acción es irreversible y eliminará permanentemente todos los datos asociados con el usuario. Por favor, confirma que entiendes las consecuencias de esta acción.
  message: Confirma escribiendo el nombre de usuario a continuación.
  cancel: Mantener al usuario
  confirm: Entiendo, eliminar al usuario
  success: Usuario **{username}** eliminado con éxito
zh:
  title: 删除用户 **{username}**？
  hint: 您即将删除用户。此操作是不可逆的，将永久删除与用户关联的所有数据。请确认您理解此操作的后果。
  message: 通过在下面输入用户名来确认。
  cancel: 保留用户
  confirm: 我明白，删除用户
  success: 用户 **{username}** 已成功删除
</i18n>

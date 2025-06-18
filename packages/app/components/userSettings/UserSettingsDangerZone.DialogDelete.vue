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
es:
  title: Eliminar Usuario
  text: Esta acción no se puede deshacer. Todos los datos asociados con el usuario se perderán.
  message: Escribe tu nombre de usuario para confirmar la eliminación
  cancel: Cancelar
  confirm: Eliminar Usuario
  success: Usuario eliminado exitosamente
fr:
  title: Supprimer l'Utilisateur
  text: Cette action ne peut pas être annulée. Toutes les données associées à l'utilisateur seront perdues.
  message: Tapez votre nom d'utilisateur pour confirmer la suppression
  cancel: Annuler
  confirm: Supprimer l'Utilisateur
  success: Utilisateur supprimé avec succès
de:
  title: Benutzer Löschen
  text: Diese Aktion kann nicht rückgängig gemacht werden. Alle mit dem Benutzer verbundenen Daten gehen verloren.
  message: Geben Sie Ihren Benutzernamen ein, um die Löschung zu bestätigen
  cancel: Abbrechen
  confirm: Benutzer Löschen
  success: Benutzer erfolgreich gelöscht
zh:
  title: 删除用户
  text: 此操作无法撤销。与用户相关的所有数据都将丢失。
  message: 输入您的用户名以确认删除
  cancel: 取消
  confirm: 删除用户
  success: 用户删除成功
</i18n>

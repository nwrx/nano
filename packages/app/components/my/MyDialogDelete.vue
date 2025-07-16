<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import UserCard from '~/components/user/UserCard.vue'

const emit = defineEmits<{
  'submit': []
}>()

// --- State.
const { t } = useI18n()
const user = useSession()
const client = useClient()
const alerts = useAlerts()
const confirmUsername = ref('')
const isOpen = defineModel({ default: false })
watch(isOpen, () => confirmUsername.value = '', { immediate: true })

async function deleteUser() {
  await client.requestAttempt('DELETE /api/users/:username', {
    parameters: { username: user.data.username },
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
    :title="t('title', { username: user.data.username })"
    :text="t('text', { username: user.data.username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirmUsername !== user.data.username"
    @confirm="() => deleteUser()">

    <!-- Current user card -->
    <UserCard
      :username="user.data.username"
      :display-name="user.data.displayName"
    />

    <!-- Confirm username -->
    <InputText
      v-model="confirmUsername"
      class="mt-md"
      :hint="t('hint')"
      :placeholder="user.data.username"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: 'Delete user **{username}**'
  text: 'This action cannot be undone. All data associated with **{username}** will be permanently lost.'
  hint: Type the username to confirm deletion
  cancel: Cancel
  confirm: Delete user
  success: 'User **{username}** has been deleted successfully'
es:
  title: 'Eliminar usuario **{username}**'
  text: 'Esta acción no se puede deshacer. Todos los datos asociados con **{username}** se perderán permanentemente.'
  hint: Escribe el nombre de usuario para confirmar la eliminación
  cancel: Cancelar
  confirm: Eliminar usuario
  success: 'Usuario **{username}** eliminado exitosamente'
fr:
  title: "Supprimer l'utilisateur **{username}**"
  text: 'Cette action ne peut pas être annulée. Toutes les données associées à **{username}** seront définitivement perdues.'
  hint: "Tapez le nom d'utilisateur pour confirmer la suppression"
  cancel: Annuler
  confirm: "Supprimer l'utilisateur"
  success: 'Utilisateur **{username}** supprimé avec succès'
de:
  title: 'Benutzer **{username}** löschen'
  text: 'Diese Aktion kann nicht rückgängig gemacht werden. Alle mit **{username}** verbundenen Daten gehen dauerhaft verloren.'
  hint: 'Geben Sie den Benutzernamen ein, um die Löschung zu bestätigen'
  cancel: Abbrechen
  confirm: Benutzer löschen
  success: 'Benutzer **{username}** erfolgreich gelöscht'
zh:
  title: '删除用户 **{username}**'
  text: '此操作无法撤销。与 **{username}** 相关的所有数据都将永久丢失。'
  hint: 输入用户名以确认删除
  cancel: 取消
  confirm: 删除用户
  success: '用户 **{username}** 删除成功'
</i18n>

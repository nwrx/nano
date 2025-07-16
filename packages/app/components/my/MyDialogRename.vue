<script setup lang="ts">
import Dialog from '~/components/base/Dialog.vue'
import InputText from '~/components/base/InputText.vue'
import UserCard from '~/components/user/UserCard.vue'

const emit = defineEmits<{
  'submit': [string]
}>()

// --- State.
const { t } = useI18n()
const user = useSession()
const client = useClient()
const alerts = useAlerts()
const newUsername = ref<string>()
const isOpen = defineModel({ default: false })
watch(isOpen, () => newUsername.value = user.data.username, { immediate: true })

// --- Methods.
async function changeUsername() {
  if (!newUsername.value) return
  await client.requestAttempt('PUT /api/users/:username', {
    parameters: { username: user.data.username },
    body: { newUsername: newUsername.value },
    onSuccess: () => {
      emit('submit', newUsername.value!)
      alerts.success(t('success'))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-warning"
    icon="i-carbon:edit"
    :title="t('title', { username: user.data.username })"
    :text="t('text', { username: user.data.username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => changeUsername()">

    <!-- Current user card -->
    <UserCard
      :username="user.data.username"
      :display-name="user.data.displayName"
    />

    <!-- Change username field -->
    <InputText
      v-model="newUsername"
      class="mt-md"
      :hint="t('hint')"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Rename user account
  text: 'This action will permanently change your username from **{username}** and may affect existing integrations and shared links.'
  hint: Choose a new username
  cancel: Cancel
  confirm: Rename Account
  success: Your username has been updated successfully
es:
  title: Cambiar nombre de usuario
  text: 'Esta acción cambiará permanentemente tu nombre de usuario de **{username}** y puede afectar integraciones existentes y enlaces compartidos.'
  hint: Elige un nuevo nombre de usuario
  cancel: Cancelar
  confirm: Cambiar Usuario
  success: Tu nombre de usuario se ha actualizado correctamente
fr:
  title: Renommer le compte
  text: "Cette action changera définitivement votre nom d'utilisateur de **{username}** et pourrait affecter les intégrations existantes et les liens partagés."
  hint: "Choisissez un nouveau nom d'utilisateur"
  cancel: Annuler
  confirm: Renommer le Compte
  success: "Votre nom d'utilisateur a été mis à jour avec succès"
de:
  title: Konto umbenennen
  text: 'Diese Aktion ändert Ihren Benutzernamen dauerhaft von **{username}** und könnte bestehende Integrationen und geteilte Links beeinträchtigen.'
  hint: Wählen Sie einen neuen Benutzernamen
  cancel: Abbrechen
  confirm: Konto Umbenennen
  success: Ihr Benutzername wurde erfolgreich aktualisiert
zh:
  title: 重命名账户
  text: '此操作将永久更改您的用户名从 **{username}**，可能会影响现有集成和共享链接。'
  hint: 选择新的用户名
  cancel: 取消
  confirm: 重命名账户
  success: 您的用户名已成功更新
</i18n>

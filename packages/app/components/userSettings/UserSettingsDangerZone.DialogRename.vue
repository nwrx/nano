<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  username: string
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
    <UserCard :username load />
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
es:
  title: Cambiar Nombre de Usuario
  text: Cambiar el nombre de usuario podría romper las integraciones existentes.
  hint: Ingresa tu nuevo nombre de usuario
  cancel: Cancelar
  confirm: Cambiar Nombre de Usuario
  success: Nombre de usuario cambiado exitosamente
fr:
  title: Changer le Nom d'Utilisateur
  text: Changer le nom d'utilisateur pourrait casser les intégrations existantes.
  hint: Entrez votre nouveau nom d'utilisateur
  cancel: Annuler
  confirm: Changer le Nom d'Utilisateur
  success: Nom d'utilisateur changé avec succès
de:
  title: Benutzername Ändern
  text: Das Ändern des Benutzernamens könnte bestehende Integrationen beschädigen.
  hint: Geben Sie Ihren neuen Benutzernamen ein
  cancel: Abbrechen
  confirm: Benutzername Ändern
  success: Benutzername erfolgreich geändert
zh:
  title: 更改用户名
  text: 更改用户名可能会破坏现有的集成。
  hint: 输入您的新用户名
  cancel: 取消
  confirm: 更改用户名
  success: 用户名更改成功
</i18n>

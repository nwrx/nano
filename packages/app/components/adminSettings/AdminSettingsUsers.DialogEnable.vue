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
async function enableUser() {
  await client.requestAttempt('POST /api/users/:username/enable', {
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
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:user-online"
    :title="t('title', { ...user })"
    :text="t('hint', { ...user })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="confirm !== user.username"
    @confirm="() => enableUser()">

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
  title: Enable the **{username}** user?
  hint: You are about to enable the user. This will allow the user to log in and access the system again. Please confirm that you understand the consequences of this action.
  message: Please confirm by the username
  cancel: Cancel
  confirm: Enable
  success: The user **{displayName}** has been enabled.
fr:
  title: Activer l'utilisateur **{username}** ?
  hint: Vous êtes sur le point d'activer l'utilisateur. Cela permettra à l'utilisateur de se connecter et d'accéder à nouveau au système. Veuillez confirmer que vous comprenez les conséquences de cette action.
  message: Veuillez confirmer en le nom d'utilisateur
  cancel: Annuler
  confirm: Activer
  success: L'utilisateur **{displayName}** a été activé.
de:
  title: Aktivieren Sie den Benutzer **{username}**?
  hint: Sie sind dabei, den Benutzer zu aktivieren. Dadurch kann sich der Benutzer anmelden und wieder auf das System zugreifen. Bitte bestätigen Sie, dass Sie die Konsequenzen dieser Aktion verstehen.
  message: Bitte bestätigen Sie durch den Benutzernamen
  cancel: Stornieren
  confirm: Aktivieren
  success: Der Benutzer **{displayName}** wurde aktiviert.
es:
  title: ¿Habilitar al usuario **{username}**?
  hint: Estás a punto de habilitar al usuario. Esto permitirá que el usuario inicie sesión y acceda al sistema nuevamente. Por favor, confirma que entiendes las consecuencias de esta acción.
  message: Por favor confirma por el nombre de usuario
  cancel: Cancelar
  confirm: Habilitar
  success: El usuario **{displayName}** ha sido habilitado.
zh:
  title: 启用用户 **{username}**？
  hint: 您即将启用用户。这将允许用户再次登录并访问系统。请确认您理解此操作的后果。
  message: 请通过用户名确认
  cancel: 取消
  confirm: 启用
  success: 用户 **{displayName}** 已被启用。
</i18n>

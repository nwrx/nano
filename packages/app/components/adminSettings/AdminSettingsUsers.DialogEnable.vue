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
  await client.requestAttempt('POST /users/:username/enable', {
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
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:user-online"
    :title="t('title', { username: user.username })"
    :text="t('text', { username: user.username })"
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
      :label="t('confirmLabel')"
      :placeholder="user.username"
      class="mt-md"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Enable User Account
  text: You are about to enable the user account for "{username}". This will restore the user's access to the platform and all associated permissions. The user will be able to log in immediately.
  confirmLabel: Type the username to confirm account activation
  cancel: Keep Account Disabled
  confirm: Enable Account
  success: User account "{username}" has been enabled successfully
fr:
  title: Activer le Compte Utilisateur
  text: Vous êtes sur le point d'activer le compte utilisateur de "{username}". Ceci restaurera l'accès de l'utilisateur à la plateforme et toutes les permissions associées. L'utilisateur pourra se connecter immédiatement.
  confirmLabel: Tapez le nom d'utilisateur pour confirmer l'activation du compte
  cancel: Garder le Compte Désactivé
  confirm: Activer le Compte
  success: Le compte utilisateur "{username}" a été activé avec succès
de:
  title: Benutzerkonto Aktivieren
  text: Sie sind dabei, das Benutzerkonto für "{username}" zu aktivieren. Dies wird den Zugriff des Benutzers auf die Plattform und alle zugehörigen Berechtigungen wiederherstellen. Der Benutzer kann sich sofort anmelden.
  confirmLabel: Geben Sie den Benutzernamen ein, um die Kontoaktivierung zu bestätigen
  cancel: Konto Deaktiviert Lassen
  confirm: Konto Aktivieren
  success: Benutzerkonto "{username}" wurde erfolgreich aktiviert
es:
  title: Habilitar Cuenta de Usuario
  text: Está a punto de habilitar la cuenta de usuario de "{username}". Esto restaurará el acceso del usuario a la plataforma y todos los permisos asociados. El usuario podrá iniciar sesión inmediatamente.
  confirmLabel: Escriba el nombre de usuario para confirmar la activación de la cuenta
  cancel: Mantener Cuenta Deshabilitada
  confirm: Habilitar Cuenta
  success: La cuenta de usuario "{username}" ha sido habilitada exitosamente
zh:
  title: 启用用户账户
  text: 您即将启用用户 "{username}" 的账户。这将恢复用户对平台的访问权限和所有相关权限。用户将能够立即登录。
  confirmLabel: 输入用户名以确认账户激活
  cancel: 保持账户禁用
  confirm: 启用账户
  success: 用户账户 "{username}" 已成功启用
</i18n>

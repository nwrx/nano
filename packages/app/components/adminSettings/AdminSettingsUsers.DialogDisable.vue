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
      alerts.success(t('success', { username: props.user.username }))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-warning"
    class-button="button-warning"
    icon="i-carbon:user-x"
    :title="t('title', { username: user.username })"
    :text="t('text', { username: user.username })"
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
      :label="t('confirmLabel')"
      :placeholder="user.username"
      class="mt-md"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Disable User Account
  text: You are about to disable the user account for "{username}". This will prevent the user from accessing the platform while preserving their data and settings. The account can be re-enabled at any time.
  confirmLabel: Type the username to confirm account suspension
  cancel: Keep Account Active
  confirm: Disable Account
  success: User account "{username}" has been disabled successfully
fr:
  title: Désactiver le Compte Utilisateur
  text: Vous êtes sur le point de désactiver le compte utilisateur de "{username}". Ceci empêchera l'utilisateur d'accéder à la plateforme tout en préservant ses données et paramètres. Le compte peut être réactivé à tout moment.
  confirmLabel: Tapez le nom d'utilisateur pour confirmer la suspension du compte
  cancel: Garder le Compte Actif
  confirm: Désactiver le Compte
  success: Le compte utilisateur "{username}" a été désactivé avec succès
de:
  title: Benutzerkonto Deaktivieren
  text: Sie sind dabei, das Benutzerkonto für "{username}" zu deaktivieren. Dies verhindert den Zugriff des Benutzers auf die Plattform, während Daten und Einstellungen erhalten bleiben. Das Konto kann jederzeit wieder aktiviert werden.
  confirmLabel: Geben Sie den Benutzernamen ein, um die Kontosperrung zu bestätigen
  cancel: Konto Aktiv Halten
  confirm: Konto Deaktivieren
  success: Benutzerkonto "{username}" wurde erfolgreich deaktiviert
es:
  title: Deshabilitar Cuenta de Usuario
  text: Está a punto de deshabilitar la cuenta de usuario de "{username}". Esto impedirá que el usuario acceda a la plataforma mientras preserva sus datos y configuraciones. La cuenta puede ser reactivada en cualquier momento.
  confirmLabel: Escriba el nombre de usuario para confirmar la suspensión de la cuenta
  cancel: Mantener Cuenta Activa
  confirm: Deshabilitar Cuenta
  success: La cuenta de usuario "{username}" ha sido deshabilitada exitosamente
zh:
  title: 禁用用户账户
  text: 您即将禁用用户 "{username}" 的账户。这将阻止用户访问平台，同时保留其数据和设置。账户可以随时重新启用。
  confirmLabel: 输入用户名以确认账户暂停
  cancel: 保持账户激活
  confirm: 禁用账户
  success: 用户账户 "{username}" 已成功禁用
</i18n>

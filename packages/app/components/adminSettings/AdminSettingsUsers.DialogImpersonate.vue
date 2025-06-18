<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

const props = defineProps<{ modelValue?: boolean; user: UserObject }>()
const emit = defineEmits<{ 'submit': [] }>()

const { t } = useI18n()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-warning"
    class-button="button-warning"
    icon="i-carbon:login"
    :title="t('title', { username: user.username })"
    :text="t('text', { username: user.username })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => emit('submit')">
    <UserCard
      :display-name="user.displayName"
      :username="user.username"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Impersonate User Account
  text: You are about to impersonate the user "{username}". While impersonating, you will have complete access to their account and can perform actions on their behalf. All administrative actions will be logged and attributed to your admin session for audit purposes.
  confirm: Begin User Impersonation
  cancel: Cancel Impersonation
fr:
  title: Usurper le Compte Utilisateur
  text: Vous êtes sur le point d'usurper l'utilisateur "{username}". Pendant l'usurpation, vous aurez un accès complet à son compte et pourrez effectuer des actions en son nom. Toutes les actions administratives seront enregistrées et attribuées à votre session d'administration à des fins d'audit.
  confirm: Commencer l'Usurpation d'Utilisateur
  cancel: Annuler l'Usurpation
de:
  title: Benutzerkonto Verkörpern
  text: Sie sind dabei, den Benutzer "{username}" zu verkörpern. Während der Verkörperung haben Sie vollständigen Zugriff auf dessen Konto und können Aktionen in seinem Namen ausführen. Alle administrativen Aktionen werden protokolliert und Ihrer Admin-Sitzung zu Audit-Zwecken zugeordnet.
  confirm: Benutzerverkörperung Beginnen
  cancel: Verkörperung Abbrechen
es:
  title: Personificar Cuenta de Usuario
  text: Está a punto de personificar al usuario "{username}". Durante la personificación, tendrá acceso completo a su cuenta y podrá realizar acciones en su nombre. Todas las acciones administrativas serán registradas y atribuidas a su sesión de administrador con fines de auditoría.
  confirm: Iniciar Personificación de Usuario
  cancel: Cancelar Personificación
zh:
  title: 模拟用户账户
  text: 您即将模拟用户 "{username}"。在模拟期间，您将完全访问其账户并可以代表他们执行操作。所有管理操作将被记录并归属于您的管理员会话以用于审计目的。
  confirm: 开始用户模拟
  cancel: 取消模拟
</i18n>

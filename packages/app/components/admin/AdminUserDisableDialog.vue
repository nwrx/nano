<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  username: string
  displayName: string
  avatarUrl: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n({ useScope: 'local' })
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <AppDialog
    v-model="model"
    class-hint="hint-warning"
    icon="i-carbon:warning"
    :title="t('title', { username: props.username })"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => emit('submit')">

    <!-- User Card -->
    <AdminUserCard
      :avatar-url="avatarUrl"
      :display-name="displayName"
      :username="username"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Disable the **{username}** user?
  hint: Disabling this user will prevent them from logging in and accessing the platform. Please consider the impact of this action before proceeding.
  confirm: I understand, disable the user
  cancel: Keep the user enabled
  message: Confirm by typing the username below.
fr:
  title: Désactiver l'utilisateur **{username}** ?
  hint: Désactiver cet utilisateur l'empêchera de se connecter et d'accéder à la plateforme. Veuillez considérer l'impact de cette action avant de continuer.
  confirm: Désactiver l'utilisateur
  cancel: Garder l'utilisateur activé
  message: Confirmez en tapant le nom d'utilisateur ci-dessous.
de:
  title: Benutzer **{username}** deaktivieren?
  hint: Das Deaktivieren dieses Benutzers verhindert, dass er sich anmeldet und auf die Plattform zugreift. Bitte bedenken Sie die Auswirkungen dieser Aktion, bevor Sie fortfahren.
  confirm: Ich verstehe, Benutzer deaktivieren
  cancel: Benutzer aktiviert lassen
  message: Bestätigen Sie, indem Sie den Benutzernamen unten eingeben.
es:
  title: ¿Desactivar al usuario **{username}**?
  hint: Desactivar a este usuario le impedirá iniciar sesión y acceder a la plataforma. Por favor, considere el impacto de esta acción antes de continuar.
  confirm: Entiendo, desactivar al usuario
  cancel: Mantener al usuario activado
  message: Confirma escribiendo el nombre de usuario a continuación.
zh:
  title: 禁用用户 **{username}**？
  hint: 禁用此用户将阻止其登录并访问平台。请在继续之前考虑此操作的影响。
  confirm: 我明白，禁用用户
  cancel: 保持用户启用
  message: 通过在下面输入用户名来确认。
</i18n>

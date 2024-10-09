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
    variant="success"
    icon="i-carbon:checkmark"
    :title="t('title', { username: props.username })"
    :text="t('hint')"
    :labelCancel="t('cancel')"
    :labelConfirm="t('confirm')"
    @confirm="() => emit('submit')">

    <!-- User Card -->
    <div class="flex items-center p-sm space-x-md">
      <img :src="props.avatarUrl" class="size-12 rounded" />
      <div>
        <p class="font-medium">{{ props.displayName }}</p>
        <p class="text-sm">{{ props.username }}</p>
      </div>
    </div>
  </AppDialog>
</template>

<i18n lang="yaml">
  en:
    title: Enable the **{username}** user?
    hint: You are about to enable the user, allowing them to log in and access the platform. For security reasons, make sure you are certain about this action before proceeding.
    confirm: I understand, enable the user
    cancel: Keep the user disabled
    message: Confirm by typing the username below.
  fr:
    title: Activer l'utilisateur **{username}** ?
    hint: Vous êtes sur le point d'activer l'utilisateur, lui permettant de se connecter et d'accéder à la plateforme. Pour des raisons de sécurité, assurez-vous d'être certain de cette action avant de continuer.
    confirm: Activer l'utilisateur
    cancel: Garder l'utilisateur désactivé
    message: Confirmez en tapant le nom d'utilisateur ci-dessous.
  de:
    title: Benutzer **{username}** aktivieren?
    hint: Sie sind dabei, den Benutzer zu aktivieren, damit er sich anmelden und auf die Plattform zugreifen kann. Aus Sicherheitsgründen sollten Sie sicher sein, bevor Sie fortfahren.
    confirm: Ich verstehe, Benutzer aktivieren
    cancel: Benutzer deaktiviert lassen
    message: Bestätigen Sie, indem Sie den Benutzernamen unten eingeben.
  es:
    title: ¿Activar al usuario **{username}**?
    hint: Estás a punto de activar al usuario, permitiéndole iniciar sesión y acceder a la plataforma. Por razones de seguridad, asegúrate de estar seguro de esta acción antes de continuar.
    confirm: Entiendo, activar al usuario
    cancel: Mantener al usuario desactivado
    message: Confirma escribiendo el nombre de usuario a continuación.
  zh:
    title: 启用用户 **{username}**？
    hint: 您即将启用用户，使其能够登录并访问平台。出于安全原因，请确保在继续之前您对此操作有把握。
    confirm: 我明白，启用用户
    cancel: 保持用户禁用
    message: 通过在下面输入用户名来确认。
</i18n>

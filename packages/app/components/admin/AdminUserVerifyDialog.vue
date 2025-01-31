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
    :labelCancel="t('cancel')"
    :labelConfirm="t('confirm')"
    @confirm="() => emit('submit')">

    <!-- User Card -->
    <AdminUserCard
      :avatarUrl="avatarUrl"
      :displayName="displayName"
      :username="username"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
  en:
    title: Verify the **{username}** user?
    hint: Verifying this user will grant them access to additional features. Please ensure that the user meets all verification criteria before proceeding.
    confirm: I understand, verify the user
    cancel: Keep the user unverified
    message: Confirm by typing the username below.
  fr:
    title: Vérifier l'utilisateur **{username}** ?
    hint: Vérifier cet utilisateur lui accordera l'accès à des fonctionnalités supplémentaires. Veuillez vous assurer que l'utilisateur répond à tous les critères de vérification avant de continuer.
    confirm: Je comprends, vérifier l'utilisateur
    cancel: Garder l'utilisateur non vérifié
    message: Confirmez en tapant le nom d'utilisateur ci-dessous.
  de:
    title: Benutzer **{username}** verifizieren?
    hint: Durch die Verifizierung dieses Benutzers erhält er Zugang zu zusätzlichen Funktionen. Bitte stellen Sie sicher, dass der Benutzer alle Verifizierungskriterien erfüllt, bevor Sie fortfahren.
    confirm: Ich verstehe, Benutzer verifizieren
    cancel: Benutzer nicht verifizieren
    message: Bestätigen Sie, indem Sie den Benutzernamen unten eingeben.
  es:
    title: ¿Verificar al usuario **{username}**?
    hint: Verificar a este usuario le otorgará acceso a funciones adicionales. Por favor, asegúrese de que el usuario cumpla con todos los criterios de verificación antes de continuar.
    confirm: Entiendo, verificar al usuario
    cancel: Mantener al usuario no verificado
    message: Confirma escribiendo el nombre de usuario a continuación.
  zh:
    title: 验证用户 **{username}**？
    hint: 验证此用户将授予他们访问其他功能的权限。请确保用户在继续之前满足所有验证标准。
    confirm: 我明白，验证用户
    cancel: 保持用户未验证
    message: 通过在下面输入用户名来确认。
</i18n>

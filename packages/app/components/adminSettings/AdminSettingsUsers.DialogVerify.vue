<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

const props = defineProps<{ modelValue: boolean; user: UserObject }>()
const emit = defineEmits<{ 'submit': [] }>()

const { t } = useI18n()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })

const client = useClient()
const alerts = useAlerts()
async function verifyUser() {
  await client.requestAttempt('POST /api/users/:username/verify', {
    data: {
      username: props.user.username,
    },
    onSuccess: () => {
      emit('submit')
      alerts.success(t('success', { ...props.user }))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-warning"
    icon="i-carbon:warning"
    :title="t('title', { ...user })"
    :text="t('hint', { ...user })"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => verifyUser()">

    <!-- User Card -->
    <UserCard
      :display-name="user.displayName"
      :username="user.username"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Verify the **{username}** user?
  hint: Verifying this user will grant them access to additional features. Please ensure that the user meets all verification criteria before proceeding.
  confirm: I understand, verify the user
  cancel: Keep the user unverified
  message: Confirm by typing the username below.
  success: User **{username}** verified successfully.
fr:
  title: Vérifier l'utilisateur **{username}** ?
  hint: Vérifier cet utilisateur lui accordera l'accès à des fonctionnalités supplémentaires. Veuillez vous assurer que l'utilisateur répond à tous les critères de vérification avant de continuer.
  confirm: Je comprends, vérifier l'utilisateur
  cancel: Garder l'utilisateur non vérifié
  message: Confirmez en tapant le nom d'utilisateur ci-dessous.
  success: Utilisateur **{username}** vérifié avec succès.
de:
  title: Benutzer **{username}** verifizieren?
  hint: Durch die Verifizierung dieses Benutzers erhält er Zugang zu zusätzlichen Funktionen. Bitte stellen Sie sicher, dass der Benutzer alle Verifizierungskriterien erfüllt, bevor Sie fortfahren.
  confirm: Ich verstehe, Benutzer verifizieren
  cancel: Benutzer nicht verifizieren
  message: Bestätigen Sie, indem Sie den Benutzernamen unten eingeben.
  success: Benutzer **{username}** erfolgreich verifiziert.
es:
  title: ¿Verificar al usuario **{username}**?
  hint: Verificar a este usuario le otorgará acceso a funciones adicionales. Por favor, asegúrese de que el usuario cumpla con todos los criterios de verificación antes de continuar.
  confirm: Entiendo, verificar al usuario
  cancel: Mantener al usuario no verificado
  message: Confirma escribiendo el nombre de usuario a continuación.
  success: Usuario **{username}** verificado con éxito.
zh:
  title: 验证用户 **{username}**？
  hint: 验证此用户将授予他们访问其他功能的权限。请确保用户在继续之前满足所有验证标准。
  confirm: 我明白，验证用户
  cancel: 保持用户未验证
  message: 通过在下面输入用户名来确认。
  success: 用户 **{username}** 验证成功。
</i18n>

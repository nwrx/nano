<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  username: string
  displayName: string
}>()

const emit = defineEmits<{
  'submit': []
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <Dialog
    v-model="model"
    class-hint="hint-warning"
    class-button="button-warning"
    icon="i-carbon:login"
    :title="t('title', { username: props.username })"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    @confirm="() => emit('submit')">
    <UserCard :display-name="displayName" :username="username" />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Impersonate the **{username}** user?
  hint: You are about to impersonate this user. While impersonating, you will have access to their account and perform actions on their behalf. All actions will be logged and traceable back to your admin account.
  message: Confirm by typing the username below.
  confirm: I understand, impersonate this user
  cancel: Cancel impersonation
fr:
  title: Usurper l'utilisateur **{username}** ?
  hint: Vous êtes sur le point d'usurper cet utilisateur. Pendant l'usurpation, vous aurez accès à leur compte et pourrez effectuer des actions en leur nom. Toutes les actions seront enregistrées et traçables jusqu'à votre compte administrateur.
  message: Confirmez en tapant le nom d'utilisateur ci-dessous.
  confirm: Je comprends, usurper cet utilisateur
  cancel: Annuler l'usurpation
de:
  title: Benutzer **{username}** imitieren?
  hint: Sie sind dabei, diesen Benutzer zu imitieren. Während der Imitation haben Sie Zugriff auf deren Konto und können Aktionen in deren Namen ausführen. Alle Aktionen werden protokolliert und sind zu Ihrem Administratorkonto zurückverfolgbar.
  message: Bestätigen Sie, indem Sie den Benutzernamen unten eingeben.
  confirm: Ich verstehe, diesen Benutzer imitieren
  cancel: Imitation abbrechen
es:
  title: ¿Suplantar al usuario **{username}**?
  hint: Estás a punto de suplantar a este usuario. Durante la suplantación, tendrás acceso a su cuenta y podrás realizar acciones en su nombre. Todas las acciones serán registradas y rastreables hasta tu cuenta de administrador.
  message: Confirma escribiendo el nombre de usuario a continuación.
  confirm: Entiendo, suplantar a este usuario
  cancel: Cancelar suplantación
zh:
  title: 模拟用户 **{username}**？
  hint: 您即将模拟此用户。在模拟期间，您将可以访问他们的帐户并以他们的名义执行操作。所有操作都将被记录并可以追溯到您的管理员帐户。
  message: 通过在下面输入用户名来确认。
  confirm: 我明白，模拟此用户
  cancel: 取消模拟
</i18n>

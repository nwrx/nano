<script setup lang="ts">
const props = defineProps<{ modelValue?: boolean }>()
const emit = defineEmits<{ 'submit': [] }>()

const { t } = useI18n()
const isOpen = useVModel(props, 'modelValue', emit, { passive: true })
const username = ref('')
const email = ref('')
watch(() => isOpen.value, () => {
  if (!isOpen.value) return
  username.value = ''
  email.value = ''
})

const client = useClient()
const alerts = useAlerts()
async function createUser() {
  await client.requestAttempt('POST /api/users', {
    data: {
      username: username.value,
      email: email.value,
    },
    onSuccess: () => {
      email.value = ''
      username.value = ''
      emit('submit')
      alerts.success(t('success'))
    },
  })
}
</script>

<template>
  <Dialog
    v-model="isOpen"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:user-admin"
    :title="t('title')"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!username || !email"
    @confirm="() => createUser()">
    <!-- Username Input -->
    <InputText
      v-model="username"
      :placeholder="t('usernamePlaceholder')"
      :hint="t('usernameHint')"
    />
    <!-- Email Input -->
    <InputText
      v-model="email"
      :placeholder="t('emailPlaceholder')"
      :hint="t('emailHint')"
      class="mt-4"
    />
  </Dialog>
</template>

<i18n lang="yaml">
en:
  title: Create New User Account
  hint: Create a new user account with administrative privileges. The user will receive a secure email invitation to complete their account setup and establish their password.
  confirm: Create User Account
  cancel: Cancel
  usernamePlaceholder: Enter username
  usernameHint: Unique identifier for user authentication and system identification
  emailPlaceholder: Enter email address
  emailHint: Primary contact email for account notifications and password recovery
  success: User account has been created successfully and invitation email sent
fr:
  title: Créer un Nouveau Compte Utilisateur
  hint: Créer un nouveau compte utilisateur avec des privilèges administratifs. L'utilisateur recevra une invitation par email sécurisée pour compléter la configuration de son compte et établir son mot de passe.
  confirm: Créer le Compte Utilisateur
  cancel: Annuler
  usernamePlaceholder: Entrez le nom d'utilisateur
  usernameHint: Identifiant unique pour l'authentification utilisateur et l'identification système
  emailPlaceholder: Entrez l'adresse email
  emailHint: Email de contact principal pour les notifications de compte et la récupération de mot de passe
  success: Le compte utilisateur a été créé avec succès et l'email d'invitation envoyé
de:
  title: Neues Benutzerkonto Erstellen
  hint: Erstellen Sie ein neues Benutzerkonto mit Administratorrechten. Der Benutzer erhält eine sichere E-Mail-Einladung zur Vervollständigung der Kontoeinrichtung und Festlegung seines Passworts.
  confirm: Benutzerkonto Erstellen
  cancel: Abbrechen
  usernamePlaceholder: Benutzername eingeben
  usernameHint: Eindeutige Kennung für Benutzerauthentifizierung und Systemidentifikation
  emailPlaceholder: E-Mail-Adresse eingeben
  emailHint: Primäre Kontakt-E-Mail für Kontobenachrichtigungen und Passwort-Wiederherstellung
  success: Benutzerkonto wurde erfolgreich erstellt und Einladungs-E-Mail gesendet
es:
  title: Crear Nueva Cuenta de Usuario
  hint: Crear una nueva cuenta de usuario con privilegios administrativos. El usuario recibirá una invitación por correo electrónico segura para completar la configuración de su cuenta y establecer su contraseña.
  confirm: Crear Cuenta de Usuario
  cancel: Cancelar
  usernamePlaceholder: Ingrese nombre de usuario
  usernameHint: Identificador único para autenticación de usuario e identificación del sistema
  emailPlaceholder: Ingrese dirección de correo electrónico
  emailHint: Correo electrónico de contacto principal para notificaciones de cuenta y recuperación de contraseña
  success: La cuenta de usuario ha sido creada exitosamente y se envió el correo de invitación
zh:
  title: 创建新用户账户
  hint: 创建具有管理员权限的新用户账户。用户将收到安全的邮件邀请以完成账户设置并建立密码。
  confirm: 创建用户账户
  cancel: 取消
  usernamePlaceholder: 输入用户名
  usernameHint: 用于用户身份验证和系统识别的唯一标识符
  emailPlaceholder: 输入邮箱地址
  emailHint: 用于账户通知和密码恢复的主要联系邮箱
  success: 用户账户已成功创建并发送邀请邮件
</i18n>

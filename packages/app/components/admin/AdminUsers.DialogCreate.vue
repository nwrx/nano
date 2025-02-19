<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'submit': [name: string, value: string]
}>()

const { t } = useI18n()
const model = useVModel(props, 'modelValue', emit, { passive: true })

const username = ref('')
const email = ref('')

function handleSubmit() {
  emit('submit', username.value, email.value)
  username.value = ''
  email.value = ''
}
</script>

<template>
  <AppDialog
    v-model="model"
    class-hint="hint-success"
    class-button="button-success"
    icon="i-carbon:user-admin"
    :title="t('title')"
    :text="t('hint')"
    :label-cancel="t('cancel')"
    :label-confirm="t('confirm')"
    :disabled="!username || !email"
    @confirm="() => handleSubmit()">

    <!-- Username Input -->
    <InputText
      v-model="username"
      :placeholder="t('username.placeholder')"
      :hint="t('username.hint')"
    />

    <!-- Email Input -->
    <InputText
      v-model="email"
      :placeholder="t('email.placeholder')"
      :hint="t('email.hint')"
      class="mt-4"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
en:
  title: Create a New User
  hint: Create a new user account. The user will receive an email with instructions to set their password.
  confirm: Create User
  cancel: Cancel
  username.placeholder: Enter the username
  username.hint: The username is used to log in and identify the user.
  email.placeholder: Enter the email address
  email.hint: The email address is used to send the user an invitation to set their password.
fr:
  title: Créer un nouvel utilisateur
  hint: Créer un nouveau compte utilisateur. L'utilisateur recevra un e-mail avec des instructions pour définir son mot de passe.
  confirm: Créer l'utilisateur
  cancel: Annuler
  username.placeholder: Entrez le nom d'utilisateur
  username.hint: Le nom d'utilisateur est utilisé pour se connecter et identifier l'utilisateur.
  email.placeholder: Entrez l'adresse e-mail
  email.hint: L'adresse e-mail est utilisée pour envoyer à l'utilisateur une invitation pour définir son mot de passe.
de:
  title: Neuen Benutzer erstellen
  hint: Erstellen Sie ein neues Benutzerkonto. Der Benutzer erhält eine E-Mail mit Anweisungen zum Festlegen seines Passworts.
  confirm: Benutzer erstellen
  cancel: Abbrechen
  username.placeholder: Geben Sie den Benutzernamen ein
  username.hint: Der Benutzername wird zum Anmelden und Identifizieren des Benutzers verwendet.
  email.placeholder: Geben Sie die E-Mail-Adresse ein
  email.hint: Die E-Mail-Adresse wird verwendet, um dem Benutzer eine Einladung zum Festlegen seines Passworts zu senden.
es:
  title: Crear un nuevo usuario
  hint: Crea una nueva cuenta de usuario. El usuario recibirá un correo electrónico con instrucciones para establecer su contraseña.
  confirm: Crear usuario
  cancel: Cancelar
  username.placeholder: Introduce el nombre de usuario
  username.hint: El nombre de usuario se utiliza para iniciar sesión e identificar al usuario.
  email.placeholder: Introduce la dirección de correo electrónico
  email.hint: La dirección de correo electrónico se utiliza para enviar al usuario una invitación para establecer su contraseña.
zh:
  title: 创建新用户
  hint: 创建新用户帐户。用户将收到一封电子邮件，其中包含设置密码的说明。
  confirm: 创建用户
  cancel: 取消
  username.placeholder: 输入用户名
  username.hint: 用户名用于登录和识别用户。
  email.placeholder: 输入电子邮件地址
  email.hint: 电子邮件地址用于向用户发送邀请，以设置其密码。
</i18n>

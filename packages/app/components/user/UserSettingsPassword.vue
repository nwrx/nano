<script setup lang="ts">
const emit = defineEmits<{
  submit: [
    oldPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
  ]
}>()

const { t } = useI18n()
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :label="t('button.submit')"
    @submit="() => emit('submit', oldPassword, newPassword, newPasswordConfirm)">

    <!-- Text -->
    <template #text>
      <I18nT keypath="text">
        <template #newline>
          <br><br>
        </template>
      </I18nT>
    </template>

    <!-- Old Password -->
    <InputText
      v-model="oldPassword"
      type="password"
      class="w-full"
      icon="i-carbon:password"
      :placeholder="t('oldPassword.label')"
      :hint="t('oldPassword.hint')"
    />

    <!-- New Password -->
    <InputText
      v-model="newPassword"
      type="password"
      class="w-full"
      icon="i-carbon:password"
      :placeholder="t('newPassword.label')"
    />

    <!-- New Password Confirm -->
    <InputText
      v-model="newPasswordConfirm"
      type="password"
      class="w-full"
      icon="i-carbon:password"
      :placeholder="t('newPassword.confirm')"
      :hint="t('newPassword.hint')"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Password
  text: Update your password to keep your account secure. Make sure to use a strong password that is unique to this account.
  oldPassword.label: Enter your current password
  oldPassword.hint: Your current password is required to update your password.
  newPassword.label: Define your new password.
  newPassword.confirm: Confirm your new password
  newPassword.hint: Your new password must be at least 8 characters long.
  button.submit: Save new password
fr:
  title: Mot de passe
  text: Mettez à jour votre mot de passe pour sécuriser votre compte. Assurez-vous d'utiliser un mot de passe fort qui est unique à ce compte.
  oldPassword.label: Entrez votre mot de passe actuel
  oldPassword.hint: Votre mot de passe actuel est requis pour mettre à jour votre mot de passe.
  newPassword.label: Définissez votre nouveau mot de passe.
  newPassword.confirm: Confirmez votre nouveau mot de passe
  newPassword.hint: Votre nouveau mot de passe doit comporter au moins 8 caractères.
  button.submit: Enregistrer le nouveau mot de passe
de:
  title: Passwort
  text: Aktualisieren Sie Ihr Passwort, um Ihr Konto sicher zu halten. Stellen Sie sicher, dass Sie ein starkes Passwort verwenden, das einzigartig für dieses Konto ist.
  oldPassword.label: Geben Sie Ihr aktuelles Passwort ein
  oldPassword.hint: Ihr aktuelles Passwort ist erforderlich, um Ihr Passwort zu aktualisieren.
  newPassword.label: Legen Sie Ihr neues Passwort fest.
  newPassword.confirm: Bestätigen Sie Ihr neues Passwort
  newPassword.hint: Ihr neues Passwort muss mindestens 8 Zeichen lang sein.
  button.submit: Neues Passwort speichern
es:
  title: Contraseña
  text: Actualice su contraseña para mantener segura su cuenta. Asegúrese de usar una contraseña fuerte que sea única para esta cuenta.
  oldPassword.label: Introduzca su contraseña actual
  oldPassword.hint: Se requiere su contraseña actual para actualizar su contraseña.
  newPassword.label: Defina su nueva contraseña.
  newPassword.confirm: Confirme su nueva contraseña
  newPassword.hint: Su nueva contraseña debe tener al menos 8 caracteres.
  button.submit: Guardar nueva contraseña
zh:
  title: 密码
  text: 更新您的密码以保护您的账户安全。请确保使用一个强密码，该密码是唯一的。
  oldPassword.label: 输入您的当前密码
  oldPassword.hint: 更新密码需要您的当前密码。
  newPassword.label: 设置您的新密码。
  newPassword.confirm: 确认您的新密码
  newPassword.hint: 您的新密码必须至少 8 个字符。
  button.submit: 保存新密码
</i18n>

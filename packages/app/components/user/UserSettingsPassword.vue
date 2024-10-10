<script setup lang="ts">
const emit = defineEmits<{
  submit: [UserSetPasswordOptions]
}>()

const { t } = useI18n({ useScope: 'local' })
const oldPassword = ref('')
const newPassword = ref('')
const newPasswordConfirm = ref('')
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :label="t('button.submit')"
    @submit="() => emit('submit', { oldPassword, newPassword, newPasswordConfirm })">

    <!-- Text -->
    <template #text>
      <I18nT keypath="text">
        <template #newline><br><br></template>
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
      :placeholder="t('newPasswordConfirm.confirm')"
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
</i18n>

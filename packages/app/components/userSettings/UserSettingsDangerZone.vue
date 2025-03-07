<script setup lang="ts">
definePageMeta({
  name: 'UserSettings',
  path: '/settings',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  group: 'user-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Account',
    fr: 'Compte',
    de: 'Konto',
    es: 'Cuenta',
    zh: '帐户',
  },
  description: {
    en: 'Manage your account settings and enrich your profile.',
    fr: 'Gérez les paramètres de votre compte et enrichissez votre profil.',
    de: 'Verwalten Sie Ihre Kontoeinstellungen und bereichern Sie Ihr Profil.',
    es: 'Administre la configuración de su cuenta y enriquezca su perfil.',
    zh: '管理您的帐户设置并丰富您的个人资料。',
  },
})

const { t } = useI18n()
const user = useSession()
const { data, getUser } = useUser(user.data.username, { withProfile: true })
onMounted(getUser)

const showRenameDialog = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
  <AppPageForm :title="t('title')" :text="t('text')">

    <!-- Actions -->
    <AppPageFormActions class="b-danger">
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        icon="i-carbon:edit"
        :text="t('changeUsername.text')"
        :title="t('changeUsername.title')"
        :label="t('changeUsername.label')"
        @click="() => showRenameDialog = true"
      />
      <AppPageFormAction
        class="b-danger"
        class-button="button-danger"
        icon="i-carbon:trash-can"
        :text="t('deleteUser.text')"
        :title="t('deleteUser.title')"
        :label="t('deleteUser.label')"
        @click="() => showDeleteDialog = true"
      />
    </AppPageFormActions>

    <!-- Rename user dialog -->
    <UserSettingsDangerZoneDialogRename
      v-model="showRenameDialog"
      :username="data.username"
      :display-name="data.displayName"
    />

    <!-- Delete user dialog -->
    <UserSettingsDangerZoneDialogDelete
      v-model="showDeleteDialog"
      :username="data.username"
      :display-name="data.displayName"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Danger Zone
  text: Be cautious when making changes in this section. These actions are **irreversible** and may have a significant impact on your account and data. Proceed with caution.
  changeUsername:
    title: Change Username
    text: Changing the username might break existing integrations.
    label: Change Username
  deleteUser:
    title: Delete the user
    text: This action cannot be undone. All data associated with the user will be lost.
    label: Delete User
</i18n>

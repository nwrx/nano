<script setup lang="ts">
definePageMeta({
  name: 'UserSettings',
  path: '/settings',
  middleware: 'redirect-when-guest',
  layout: 'user-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Settings',
    fr: 'Paramètres',
    de: 'Einstellungen',
    es: 'Ajustes',
    zh: '设置',
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
const { data, getUser, setAvatar, setProfile, setUsername } = useUser(user.data.username, { withProfile: true })
onMounted(getUser)
</script>

<template>
  <AppPageContainer contained>

    <!-- Informations -->
    <AppPageForm
      :title="t('informations.title')"
      :label="t('informations.label')"
      :text="t('informations.text')"
      @submit="() => setProfile(data)">
      <InputText
        v-model="data.displayName"
        :placeholder="t('informations.displayNameLabel')"
        :hint="t('informations.displayNameHint')"
      />
      <InputText
        v-model="data.biography"
        type="textarea"
        :placeholder="t('informations.biographyLabel')"
      />
      <div class="grid grid-cols-1 gap-md md:grid-cols-2 w-full">
        <InputText
          v-model="data.website"
          :label="t('informations.websiteLabel')"
          :placeholder="t('informations.websitePlaceholder')"
        />
        <InputText
          v-model="data.company"
          :label="t('informations.companyLabel')"
          :placeholder="t('informations.companyPlaceholder')"
        />
      </div>
    </AppPageForm>

    <!-- Avatar -->
    <AppPageForm :title="t('avatar.title')" :text="t('avatar.text')">
      <div class="flex items-center space-x-4 w-full">
        <InputImage
          circular
          :label="t('avatar.imageLabel')"
          accept="image/*"
          class="max-w-64"
          @insert="([file]) => setAvatar({ file })"
        />

        <div class="w-full py-8">
          <Button
            class="button-danger button-lg"
            icon="i-carbon:trash-can"
            :label="t('avatar.imageRemove')"
          />
          <p class="text-sm text-subtle mt-2">
            {{ t('avatar.imageHint') }}
          </p>
        </div>
      </div>
    </AppPageForm>

    <!-- Danger zone -->
    <Trigger v-slot="dialogs" :keys="['rename', 'delete']">
      <AppPageForm
        :title="t('dangerZone.title')"
        :text="t('dangerZone.text')">

        <!-- Actions -->
        <AppPageFormActions class="b-danger">
          <AppPageFormAction
            class="b-danger"
            class-button="button-danger"
            :text="t('dangerZone.changeUsername.text')"
            :title="t('dangerZone.changeUsername.title')"
            :label="t('dangerZone.changeUsername.label')"
            @click="() => dialogs.open('rename')"
          />
          <AppPageFormAction
            class="b-danger"
            class-button="button-danger"
            :text="t('dangerZone.deleteUser.text')"
            :title="t('dangerZone.deleteUser.title')"
            :label="t('dangerZone.deleteUser.label')"
            @click="() => dialogs.open('delete')"
          />
        </AppPageFormActions>

        <!-- Rename user dialog -->
        <Ephemeral v-slot="{ value }" :initial-value="{ username: data.username }">
          <Dialog
            v-model="dialogs.value.rename"
            class-hint="hint-danger"
            icon="i-carbon:trash-can"
            :title="t('changeUsername.title', { username: data.username })"
            :text="t('changeUsername.text', { username: data.username })"
            :label-cancel="t('changeUsername.cancel')"
            :label-confirm="t('changeUsername.confirm')"
            @open="() => value.username = data.username"
            @confirm="() => setUsername(value.username)">
            <UserCard
              :username="data.username"
              :display-name="data.displayName"
            />
            <InputText
              v-model="value.username"
              class="mt-md"
              :hint="t('changeUsername.hint')"
            />
          </Dialog>
        </Ephemeral>

        <!-- Delete project dialog -->
        <Ephemeral v-slot="{ value }" :initial-value="{ username: '' }">
          <Dialog
            v-model="dialogs.value.delete"
            class-hint="hint-danger"
            icon="i-carbon:trash-can"
            :title="t('deleteUser.title', { username: data.username })"
            :text="t('deleteUser.text', { username: data.username })"
            :label-cancel="t('deleteUser.cancel')"
            :label-confirm="t('deleteUser.confirm')"
            :disabled="value.username !== data.username"
            @open="() => value.username = ''"
            @confirm="() => $router.push('/')">
            <UserCard
              :username="data.username"
              :display-name="data.displayName"
            />
            <InputText
              v-model="value.username"
              class="mt-md"
              :hint="t('deleteUser.message')"
              :placeholder="data.username"
            />
          </Dialog>
        </Ephemeral>
      </AppPageForm>
    </Trigger>
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  informations:
    title: Public Informations
    label: Save Changes
    text: Your public informations allow other users to know more about you. You can update your display name, a short bio, your personal website, and your current company.
    displayNameLabel: Your display name
    displayNameHint: Your display name is visible to other users.
    biographyLabel: Your biography
    websiteLabel: Your website
    websitePlaceholder: 'https://example.com'
    companyLabel: Your company
    companyPlaceholder: Company Inc.
  avatar:
    title: Profile Picture
    text: Update your profile picture. This can be your photo or any image you like to represent you. Keep in mind that this image will be visible to other users.
    imageLabel: Upload a new profile picture
    imageHint: 'Accepted formats: JPG, PNG, GIF. Max file size: 5MB.'
    imageRemove: Remove current profile picture
  dangerZone:
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
  changeUsername:
    title: Change the username of **{username}**?
    text: You are about to rename the user. Keep in mind that this will also rename your personal workspace and all associated projects. Meaning that all integrations relying on the URLs of your flows will be broken. Please confirm that you understand the consequences of this action.
    hint: Define the new username below.
    confirm: I understand, change anyway
    cancel: Keep my username as-is
  deleteUser:
    title: Delete the user **{username}**?
    text: You are about to delete the user. This action is irreversible and will permanently delete all data associated with the user. Please confirm that you understand the consequences of this action.
    message: Confirm by typing the username below.
    cancel: Keep the user
    confirm: I understand, delete the user
</i18n>

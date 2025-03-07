<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'

const props = defineProps<{ username: string }>()
const { t } = useI18n()
const client = useClient()
const alerts = useAlerts()
const data = ref<UserObject>({} as UserObject)

async function getUser() {
  await client.requestAttempt('GET /api/users/:username', {
    data: {
      username: props.username,
      withProfile: true,
    },
    onData: (user) => {
      data.value = user
    },
  })
}

async function setProfile(profile: UserObject) {
  await client.requestAttempt('PUT /api/users/:username/profile', {
    data: {
      ...profile,
      username: props.username,
    },
    onSuccess: () => {
      alerts.success(t('alert.success'))
    },
  })
}

onMounted(getUser)
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('text')"
    :label="t('label')"
    @submit="() => setProfile(data)">
    <InputText
      v-model="data.displayName"
      :placeholder="t('form.displayName.placeholder')"
      :label="t('form.displayName.label')"
    />
    <InputText
      v-model="data.biography"
      type="textarea"
      :placeholder="t('form.biography.placeholder')"
    />
    <div class="grid grid-cols-1 gap-md md:grid-cols-2 w-full">
      <InputText
        v-model="data.website"
        :label="t('form.website.label')"
        :placeholder="t('form.website.placeholder')"
      />
      <InputText
        v-model="data.company"
        :label="t('form.company.label')"
        :placeholder="t('form.company.placeholder')"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Public Informations
  label: Save Changes
  text: Your public informations allow other users to know more about you. You can update your display name, a short bio, your personal website, and your current company.
  form:
    displayName:
      label: Your display name
      placeholder: Enter your display name
    biography:
      placeholder: Enter a short bio
    website:
      label: Your personal website
      placeholder: Enter your personal website
    company:
      label: Your current company
      placeholder: Enter your current company
  alert:
    success: Your profile has been updated successfully.
fr:
  title: Informations Publiques
  label: Enregistrer les modifications
  text: Vos informations publiques permettent aux autres utilisateurs d'en savoir plus sur vous. Vous pouvez mettre à jour votre nom d'affichage, une courte biographie, votre site web personnel et votre entreprise actuelle.
  form:
    displayName:
      label: Votre nom d'affichage
      placeholder: Entrez votre nom d'affichage
    biography:
      placeholder: Entrez une courte biographie
    website:
      label: Votre site web personnel
      placeholder: Entrez votre site web personnel
    company:
      label: Votre entreprise actuelle
      placeholder: Entrez votre entreprise actuelle
  alert:
    success: Votre profil a été mis à jour avec succès.
de:
  title: Öffentliche Informationen
  label: Änderungen speichern
  text: Ihre öffentlichen Informationen ermöglichen es anderen Benutzern, mehr über Sie zu erfahren. Sie können Ihren Anzeigenamen, eine kurze Biografie, Ihre persönliche Website und Ihr derzeitiges Unternehmen aktualisieren.
  form:
    displayName:
      label: Ihr Anzeigename
      placeholder: Geben Sie Ihren Anzeigenamen ein
    biography:
      placeholder: Geben Sie eine kurze Biografie ein
    website:
      label: Ihre persönliche Website
      placeholder: Geben Sie Ihre persönliche Website ein
    company:
      label: Ihr aktuelles Unternehmen
      placeholder: Geben Sie Ihr aktuelles Unternehmen ein
  alert:
    success: Ihr Profil wurde erfolgreich aktualisiert.
es:
  title: Informaciones Públicas
  label: Guardar cambios
  text: Sus informaciones públicas permiten a otros usuarios saber más sobre usted. Puede actualizar su nombre de visualización, una breve biografía, su sitio web personal y su empresa actual.
  form:
    displayName:
      label: Su nombre de visualización
      placeholder: Introduzca su nombre de visualización
    biography:
      placeholder: Introduzca una breve biografía
    website:
      label: Su sitio web personal
      placeholder: Introduzca su sitio web personal
    company:
      label: Su empresa actual
      placeholder: Introduzca su empresa actual
  alert:
    success: Su perfil se ha actualizado correctamente.
zh:
  title: 公共信息
  label: 保存更改
  text: 您的公共信息允许其他用户了解更多关于您的信息。您可以更新您的显示名称、简短的个人简介、您的个人网站和您目前的公司。
  form:
    displayName:
      label: 您的显示名称
      placeholder: 输入您的显示名称
    biography:
      placeholder: 输入简短的个人简介
    website:
      label: 您的个人网站
      placeholder: 输入您的个人网站
    company:
      label: 您目前的公司
      placeholder: 输入您目前的公司
  alert:
    success: 您的个人资料已成功更新。
</i18n>

<script setup lang="ts">
import type { UserObject } from '@nwrx/nano-api'
import AppPageForm from '~/components/app/AppPageForm.vue'
import InputText from '~/components/base/InputText.vue'

const { t } = useI18n()
const user = useSession()
const client = useClient()
const alerts = useAlerts()
const profile = ref<UserObject>({} as UserObject)

async function getUser() {
  if (!user.data.username) return
  await client.requestAttempt('GET /api/users/:username', {
    parameters: { username: user.data.username },
    query: { withProfile: true },
    onData: (user) => { profile.value = user },
  })
}

async function saveProfile() {
  if (!user.data.username) return
  await client.requestAttempt('PUT /api/users/:username/profile', {
    parameters: { username: user.data.username },
    body: { ...profile.value },
    onSuccess: () => {
      alerts.success(t('successMessage'))
      void getUser()
    },
  })
}

onMounted(() => {
  profile.value = {
    displayName: user.data.displayName,
    biography: user.data.biography,
    website: user.data.website,
    company: user.data.company,
  } as UserObject
})
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :text="t('description')"
    :label="t('submitLabel')"
    @submit="() => saveProfile()">

    <!-- My display name -->
    <InputText
      v-model="profile.displayName"
      :placeholder="t('displayNamePlaceholder')"
      :label="t('displayNameLabel')"
    />

    <!-- My biography -->
    <InputText
      v-model="profile.biography"
      type="textarea"
      :placeholder="t('biographyPlaceholder')"
      :label="t('biographyLabel')"
    />

    <!-- My website and company -->
    <div class="grid grid-cols-1 gap-md md:grid-cols-2 w-full">
      <InputText
        v-model="profile.website"
        :label="t('websiteLabel')"
        :placeholder="t('websitePlaceholder')"
      />
      <InputText
        v-model="profile.company"
        :label="t('companyLabel')"
        :placeholder="t('companyPlaceholder')"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Public Profile
  submitLabel: Save Changes
  description: Customize how others see you in the community. Your public profile helps teammates and collaborators connect with you and understand your expertise.
  displayNameLabel: Display Name
  displayNamePlaceholder: How should others see your name?
  biographyLabel: About You
  biographyPlaceholder: Share your background, interests, or current projects...
  websiteLabel: Website
  websitePlaceholder: Your personal website or portfolio
  companyLabel: Organization
  companyPlaceholder: Your company or organization
  successMessage: Profile updated successfully!
fr:
  title: Profil Public
  submitLabel: Enregistrer les modifications
  description: Personnalisez la façon dont les autres vous voient dans la communauté. Votre profil public aide vos coéquipiers et collaborateurs à se connecter avec vous et comprendre votre expertise.
  displayNameLabel: Nom d'affichage
  displayNamePlaceholder: Comment les autres devraient-ils voir votre nom ?
  biographyLabel: À propos de vous
  biographyPlaceholder: Partagez votre parcours, vos intérêts ou vos projets actuels...
  websiteLabel: Site web
  websitePlaceholder: Votre site web personnel ou portfolio
  companyLabel: Organisation
  companyPlaceholder: Votre entreprise ou organisation
  successMessage: Profil mis à jour avec succès !
de:
  title: Öffentliches Profil
  submitLabel: Änderungen speichern
  description: Gestalten Sie, wie andere Sie in der Community sehen. Ihr öffentliches Profil hilft Teammitgliedern und Mitarbeitern, sich mit Ihnen zu vernetzen und Ihre Expertise zu verstehen.
  displayNameLabel: Anzeigename
  displayNamePlaceholder: Wie sollen andere Ihren Namen sehen?
  biographyLabel: Über Sie
  biographyPlaceholder: Teilen Sie Ihren Hintergrund, Ihre Interessen oder aktuelle Projekte...
  websiteLabel: Website
  websitePlaceholder: Ihre persönliche Website oder Portfolio
  companyLabel: Organisation
  companyPlaceholder: Ihr Unternehmen oder Ihre Organisation
  successMessage: Profil erfolgreich aktualisiert!
es:
  title: Perfil Público
  submitLabel: Guardar cambios
  description: Personaliza cómo otros te ven en la comunidad. Tu perfil público ayuda a compañeros y colaboradores a conectar contigo y entender tu experiencia.
  displayNameLabel: Nombre para mostrar
  displayNamePlaceholder: ¿Cómo deberían ver otros tu nombre?
  biographyLabel: Acerca de ti
  biographyPlaceholder: Comparte tu experiencia, intereses o proyectos actuales...
  websiteLabel: Sitio web
  websitePlaceholder: Tu sitio web personal o portafolio
  companyLabel: Organización
  companyPlaceholder: Tu empresa u organización
  successMessage: ¡Perfil actualizado exitosamente!
zh:
  title: 公开档案
  submitLabel: 保存更改
  description: 自定义他人在社区中如何看待您。您的公开档案帮助团队成员和合作者与您联系并了解您的专业知识。
  displayNameLabel: 显示名称
  displayNamePlaceholder: 其他人应该如何看到您的姓名？
  biographyLabel: 关于您
  biographyPlaceholder: 分享您的背景、兴趣或当前项目...
  websiteLabel: 网站
  websitePlaceholder: 您的个人网站或作品集
  companyLabel: 组织
  companyPlaceholder: 您的公司或组织
  successMessage: 档案更新成功！
</i18n>

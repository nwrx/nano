<script setup lang="ts">
const props = defineProps<{
  displayName: string
  biography?: string
  website?: string
  company?: string
}>()

const emit = defineEmits<{
  submit: [profile: UserSetProfileOptions]
}>()

// --- Localization
const { t } = useI18n()

// --- Two-way binding
const displayName = useVModel(props, 'displayName', emit, { passive: true })
const biography = useVModel(props, 'biography', emit, { passive: true })
const website = useVModel(props, 'website', emit, { passive: true })
const company = useVModel(props, 'company', emit, { passive: true })
</script>

<template>
  <AppPageForm
    :title="t('title')"
    :label="t('label')"
    :text="t('text')"
    @submit="() => emit('submit', { displayName, biography, website, company })">
    <InputText
      v-model="displayName"
      :placeholder="t('displayName.label')"
      :hint="t('displayName.hint')"
    />
    <InputText
      v-model="biography"
      type="textarea"
      :placeholder="t('biography.label')"
    />
    <div class="grid grid-cols-1 gap-md md:grid-cols-2 w-full">
      <InputText
        v-model="website"
        :label="t('website.label')"
        :placeholder="t('website.placeholder')"
      />
      <InputText
        v-model="company"
        :label="t('company.label')"
        :placeholder="t('company.placeholder')"
      />
    </div>
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Public Informations
  label: Save Changes
  text: Your public informations allow other users to know more about you. You can update your display name, a short bio, your personal website, and your current company.
  displayName.label: Your display name
  displayName.hint: Your display name is visible to other users.
  biography.label: A short bio about yourself
  website.label: Website
  website.placeholder: Your personal website or blog
  company.label: Company
  company.placeholder: Your current company or organization
fr:
  title: Informations Publiques
  label: Sauvegarder les modifications
  text: Vos informations publiques permettent aux autres utilisateurs d'en savoir plus sur vous. Vous pouvez mettre à jour votre nom d'affichage, une courte biographie, votre site web personnel et votre entreprise actuelle.
  displayName.label: Votre nom d'affichage
  displayName.hint: Votre nom d'affichage est visible par les autres utilisateurs.
  biography.label: Une courte biographie sur vous-même
  website.label: Site Web
  website.placeholder: Votre site web personnel ou blog
  company.label: Entreprise
  company.placeholder: Votre entreprise ou organisation actuelle
de:
  title: Öffentliche Informationen
  label: Änderungen speichern
  text: Ihre öffentlichen Informationen ermöglichen es anderen Benutzern, mehr über Sie zu erfahren. Sie können Ihren Anzeigenamen, eine kurze Biografie, Ihre persönliche Website und Ihr derzeitiges Unternehmen aktualisieren.
  displayName.label: Ihr Anzeigename
  displayName.hint: Ihr Anzeigename ist für andere Benutzer sichtbar.
  biography.label: Eine kurze Biografie über sich selbst
  website.label: Webseite
  website.placeholder: Ihre persönliche Website oder Ihr Blog
  company.label: Unternehmen
  company.placeholder: Ihr aktuelles Unternehmen oder Ihre Organisation
es:
  title: Informaciones Públicas
  label: Guardar cambios
  text: Sus informaciones públicas permiten a otros usuarios saber más sobre usted. Puede actualizar su nombre de visualización, una breve biografía, su sitio web personal y su empresa actual.
  displayName.label: Su nombre de visualización
  displayName.hint: Su nombre de visualización es visible para otros usuarios.
  biography.label: Una breve biografía sobre usted
  website.label: Sitio Web
  website.placeholder: Su sitio web personal o blog
  company.label: Empresa
  company.placeholder: Su empresa u organización actual
zh:
  title: 公共信息
  label: 保存更改
  text: 您的公共信息允许其他用户了解更多关于您的信息。您可以更新您的显示名称、简短的个人简介、您的个人网站和您目前的公司。
  displayName.label: 您的显示名称
  displayName.hint: 您的显示名称对其他用户可见。
  biography.label: 关于您自己的简短传记
  website.label: 网站
  website.placeholder: 您的个人网站或博客
  company.label: 公司
  company.placeholder: 您目前的公司或组织
</i18n>

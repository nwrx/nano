<script setup lang="ts">
import type { ProjectSetSettingsOptions } from '~/composables/useProject'

const props = defineProps<{
  name: string
  title?: string
  description?: string
  workspace: string
}>()

const emit = defineEmits<{
  submit: [settings: ProjectSetSettingsOptions]
}>()

const { t } = useI18n({ useScope: 'local' })
const url = computed(() => `${CONSTANTS.appHost}/${props.workspace}/`)
</script>

<i18n lang="yaml">
  en:
    title: General
    submitText: Save Changes
    fieldTitleLabel: Title
    fieldTitleDescription: The public name of your project.
    fieldNameLabel: Name
    fieldNameDescription: This is the unique identifier for your project and will define the path of your flows in the API.
    fieldDescriptionLabel: Description
    fieldDescriptionDescription: Give a brief description of your project.
    text: Describe and name your project. You can also define the URL name that will be used in the API endpoint.{newline}Note that this might break existing integrations if you change it. For more information, please refer to the {documentation}.
    textDocumentation: documentation
  fr:
    title: Général
    submitText: Enregistrer les modifications
    fieldTitleLabel: Titre
    fieldTitleDescription: Le nom public de votre projet.
    fieldNameLabel: Nom
    fieldNameDescription: C'est l'identifiant unique de votre projet et définira le chemin de vos flux dans l'API.
    fieldDescriptionLabel: Description
    fieldDescriptionDescription: Donnez une brève description de votre projet.
    text: Décrivez et nommez votre projet. Vous pouvez également définir le nom d'URL qui sera utilisé dans le point de terminaison de l'API.{newline}Notez que cela pourrait rompre les intégrations existantes si vous le modifiez. Pour plus d'informations, veuillez vous référer à la {documentation}.
    textDocumentation: documentation
  de:
    title: Allgemein
    submitText: Änderungen speichern
    fieldTitleLabel: Titel
    fieldTitleDescription: Der öffentliche Name Ihres Projekts.
    fieldNameLabel: Name
    fieldNameDescription: Dies ist der eindeutige Bezeichner für Ihr Projekt und bestimmt den Pfad Ihrer Flows in der API.
    fieldDescriptionLabel: Beschreibung
    fieldDescriptionDescription: Geben Sie eine kurze Beschreibung Ihres Projekts an.
    text: Beschreiben und benennen Sie Ihr Projekt. Sie können auch den URL-Namen definieren, der im API-Endpunkt verwendet wird.{newline}Beachten Sie, dass dies bestehende Integrationen unterbrechen könnte, wenn Sie ihn ändern. Weitere Informationen finden Sie in der {documentation}.
    textDocumentation: Dokumentation
  es:
    title: General
    submitText: Guardar cambios
    fieldTitleLabel: Título
    fieldTitleDescription: El nombre público de su proyecto.
    fieldNameLabel: Nombre
    fieldNameDescription: Este es el identificador único de su proyecto y definirá la ruta de sus flujos en la API.
    fieldDescriptionLabel: Descripción
    fieldDescriptionDescription: Dé una breve descripción de su proyecto.
    text: Describa y nombre su proyecto. También puede definir el nombre de URL que se utilizará en el punto final de la API.{newline}Tenga en cuenta que esto podría romper las integraciones existentes si lo cambia. Para obtener más información, consulte la {documentation}.
    textDocumentation: documentación
  zh:
    title: 通用
    submitText: 保存更改
    fieldTitleLabel: 标题
    fieldTitleDescription: 您的项目的公共名称。
    fieldNameLabel: 名称
    fieldNameDescription: 这是您的项目的唯一标识符，并将定义 API 中流的路径。
    fieldDescriptionLabel: 描述
    fieldDescriptionDescription: 为您的项目提供简要描述。
    text: 描述和命名您的项目。您还可以定义将在 API 端点中使用的 URL 名称。{newline}请注意，如果更改它，这可能会破坏现有的集成。有关更多信息，请参阅 {documentation}。
    textDocumentation: 文档
</i18n>

<template>
  <AppPageForm
    :title="t('title')"
    :submitText="t('submitText')"
    @submit="() => emit('submit', { title, description })">
    <template #text>
      <I18nT keypath="text">
        <template #newline><br><br></template>
        <template #documentation="text">
          <Button link variant="primary" :label="t('textDocumentation')" :href="CONSTANTS.appCanonicalUrl" />
        </template>
      </I18nT>
    </template>

    <!-- Project Title -->
    <InputText
      :modelValue="title"
      icon="i-carbon:label"
      :placeholder="t('fieldTitleDescription')"
      class="w-full"
    />

    <!-- Project Name / Readonly -->
    <InputText
      readonly
      :modelValue="name"
      :text-before="url"
      :hint="t('fieldNameDescription')"
      class="w-full"
    />

    <!-- Project Description -->
    <InputText
      :modelValue="description"
      :placeholder="t('fieldDescriptionDescription')"
      type="textarea"
      class-input="!h-32"
    />
  </AppPageForm>
</template>

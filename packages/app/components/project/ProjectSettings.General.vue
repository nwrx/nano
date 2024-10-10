<script setup lang="ts">
import type { ProjectSetSettingsOptions } from '~/composables/useProject'

const props = defineProps<{
  project: string
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
    text: Describe and name your project. You can also define the URL name that will be used in the API endpoint.{newline}Note that this might break existing integrations if you change it. For more information, please refer to the {documentation}.
    text.documentation: documentation
    submit.text: Save Changes
    field.title.label: Title
    field.title.description: The public name of your project.
    field.name.label: Name
    field.name.description: This is the unique identifier for your project and will define the path of your flows in the API.
    field.description.label: Description
    field.description.description: Give a brief description of your project.
  fr:
    title: Général
    text: Décrivez et nommez votre projet. Vous pouvez également définir le nom d'URL qui sera utilisé dans le point de terminaison de l'API.{newline}Notez que cela pourrait rompre les intégrations existantes si vous le modifiez. Pour plus d'informations, veuillez vous référer à la {documentation}.
    text.documentation: documentation
    submit.text: Enregistrer les modifications
    field.title.label: Titre
    field.title.description: Le nom public de votre projet.
    field.name.label: Nom
    field.name.description: C'est l'identifiant unique de votre projet et définira le chemin de vos flux dans l'API.
    field.description.label: Description
    field.description.description: Donnez une brève description de votre projet.
  de:
    title: Allgemein
    text: Beschreiben und benennen Sie Ihr Projekt. Sie können auch den URL-Namen definieren, der im API-Endpunkt verwendet wird.{newline}Beachten Sie, dass dies bestehende Integrationen unterbrechen könnte, wenn Sie ihn ändern. Weitere Informationen finden Sie in der {documentation}.
    text.documentation: dokumentation
    submit.text: Änderungen speichern
    field.title.label: Titel
    field.title.description: Der öffentliche Name Ihres Projekts.
    field.name.label: Name
    field.name.description: Dies ist der eindeutige Bezeichner für Ihr Projekt und bestimmt den Pfad Ihrer Flows in der API.
    field.description.label: Beschreibung
    field.description.description: Geben Sie eine kurze Beschreibung Ihres Projekts an.
  es:
    title: General
    text: Describa y nombre su proyecto. También puede definir el nombre de URL que se utilizará en el punto final de la API.{newline}Tenga en cuenta que esto podría romper las integraciones existentes si lo cambia. Para obtener más información, consulte la {documentation}.
    text.documentation: documentación
    submit.text: Guardar cambios
    field.title.label: Título
    field.title.description: El nombre público de su proyecto.
    field.name.label: Nombre
    field.name.description: Este es el identificador único de su proyecto y definirá la ruta de sus flujos en la API.
    field.description.label: Descripción
    field.description.description: Dé una breve descripción de su proyecto.
  zh:
    title: 通用
    text: 描述和命名您的项目。您还可以定义将在 API 端点中使用的 URL 名称。{newline}请注意，如果更改它，这可能会破坏现有的集成。有关更多信息，请参阅 {documentation}。
    text.documentation: 文档
    submit.text: 保存更改
    field.title.label: 标题
    field.title.description: 您的项目的公共名称。
    field.name.label: 名称
    field.name.description: 这是您的项目的唯一标识符，并将定义 API 中流的路径。
    field.description.label: 描述
    field.description.description: 为您的项目提供简要描述。
</i18n>

<template>
  <AppPageForm
    :title="t('title')"
    :label="t('submit.text')"
    @submit="() => emit('submit', { title, description })">

    <!-- Text -->
    <template #text>
      <I18nT keypath="text">
        <template #newline><br><br></template>
        <template #documentation="text">
          <Button link variant="primary" :label="t('text.documentation')" :href="CONSTANTS.appCanonicalUrl" />
        </template>
      </I18nT>
    </template>

    <!-- Project Title -->
    <InputText
      :modelValue="title"
      icon="i-carbon:label"
      :placeholder="t('field.title.description')"
      class="w-full"
    />

    <!-- Project Name / Readonly -->
    <InputText
      readonly
      :modelValue="project"
      :text-before="url"
      :hint="t('field.name.description')"
      class="w-full"
    />

    <!-- Project Description -->
    <InputText
      :modelValue="description"
      :placeholder="t('field.description.description')"
      type="textarea"
      class-input="!h-32"
    />
  </AppPageForm>
</template>

<script setup lang="ts">
import type { CreateProjectOptions } from '~/composables/useWorkspace'
import { toSlug } from '@unshared/string/toSlug'

const props = defineProps<{
  modelValue: boolean
  workspace: string
  baseUrl: string
}>()

const emit = defineEmits<{
  'submit': [options: CreateProjectOptions]
}>()

const { t } = useI18n({ useScope: 'local' })
const model = useVModel(props, 'modelValue', emit, { passive: true })
const options = ref<CreateProjectOptions>({
  name: '',
  title: '',
  description: '',
})
</script>

<template>
  <AppDialog
    v-model="model"
    variant="success"
    class-hint="hint-success"
    class-content="space-y-md"
    icon="i-carbon:flow"
    :title="t('title', { workspace })"
    :text="t('text')"
    :labelSubmit="t('submit')"
    :labelCancel="t('cancel')"
    @confirm="() => emit('submit', options)">
    <InputText
      v-model="options.name"
      :textBefore="`${baseUrl}/${workspace}/`"
      :parse="toSlug"
      :placeholder="t('name.placeholder')"
      :hint="t('name.hint')"
    />
    <InputText
      v-model="options.title"
      :placeholder="t('title.placeholder')"
    />
    <InputText
      v-model="options.description"
      :placeholder="t('description.placeholder')"
      type="textarea"
    />
  </AppDialog>
</template>

<i18n lang="yaml">
  en:
    title: Create a new project in the **{workspace}** workspace
    text: Get started by creating a new project in your workspace.
    cancel: Abort project creation
    submit: Create project
    name.hint: The project name is used in the URL and must be unique.
    name.placeholder: project-name
    title.placeholder: Give your project a title
    description.placeholder: A short description of the project.
  fr:
    title: Créez un nouveau projet dans l'espace de travail **{workspace}**
    text: Commencez par créer un nouveau projet dans votre espace de travail.
    cancel: Annuler la création du projet
    submit: Créer le projet
    name.hint: Le nom du projet est utilisé dans l'URL et doit être unique.
    name.placeholder: nom-du-projet
    title.placeholder: Donnez un titre à votre projet
    description.placeholder: Une courte description du projet.
  de:
    title: Erstellen Sie ein neues Projekt im Arbeitsbereich **{workspace}**
    text: Legen Sie los, indem Sie ein neues Projekt in Ihrem Arbeitsbereich erstellen.
    cancel: Projekt erstellen abbrechen
    submit: Projekt erstellen
    name.hint: Der Projektname wird in der URL verwendet und muss eindeutig sein.
    name.placeholder: projekt-name
    title.placeholder: Geben Sie Ihrem Projekt einen Titel
    description.placeholder: Eine kurze Beschreibung des Projekts.
  es:
    title: Crear un nuevo proyecto en el espacio de trabajo **{workspace}**
    text: Comience creando un nuevo proyecto en su espacio de trabajo.
    cancel: Cancelar la creación del proyecto
    submit: Crear proyecto
    name.hint: El nombre del proyecto se utiliza en la URL y debe ser único.
    name.placeholder: nombre-del-proyecto
    title.placeholder: Dale un título a tu proyecto
    description.placeholder: Una breve descripción del proyecto.
  zh:
    title: 在 **{workspace}** 工作区中创建新项目
    text: 通过在工作区中创建新项目开始。
    cancel: 中止项目创建
    submit: 创建项目
    name.hint: 项目名称用于 URL 中，必须是唯一的。
    name.placeholder: xiang-mu-ming
    title.placeholder: 为您的项目命名
    description.placeholder: 项目的简短描述。
</i18n>

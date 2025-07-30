<!-- eslint-disable sonarjs/no-commented-code -->
<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import Hyperlink from '~/components/base/Hyperlink.vue'
import ProjectDialogCreate from '~/components/project/ProjectDialogCreate.vue'
import ProjectList from '~/components/project/ProjectList.vue'

definePageMeta({
  name: 'Workspace',
  path: '/:workspace',
  middleware: ['redirect-when-guest', 'abort-reserved'],
  layout: 'workspace',
  icon: 'i-carbon:flow',
  groups: ['nav-items-workspace'],
  title: {
    en: 'Projects',
    fr: 'Projets',
    de: 'Projekte',
    es: 'Proyectos',
    zh: '项目',
  },
  description: {
    en: 'Create, edit, and manage your projects.',
    fr: 'Créez, éditez et gérez vos projets.',
    de: 'Erstellen, bearbeiten und verwalten Sie Ihre Projekte.',
    es: 'Crea, edita y gestiona tus proyectos.',
    zh: '创建、编辑和管理您的项目。',
  },
})

const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const isDialogCreateProjectOpen = ref(false)
</script>

<template>
  <AppPageContainer contained>

    <!-- Create project button -->
    <div class="flex items-center justify-end space-x-md mb-lg">
      <Hyperlink
        icon="i-carbon:add"
        :label="t('createProject')"
        @click="() => isDialogCreateProjectOpen = true"
      />
    </div>

    <!-- Bookmarks -->
    <!-- <ProjectBookmarks :flows="bookmarkFlows" /> -->
    <ProjectList :workspace="workspace" />

    <!-- Create project dialog -->
    <ProjectDialogCreate
      v-model="isDialogCreateProjectOpen"
      :workspace="workspace"
    />
  </AppPageContainer>
</template>

<i18n lang="yaml">
en:
  title: Workspace
  description: Create, edit, and delete your flows.
  createProject: Create new project
fr:
  title: Espace de travail
  description: Créez, éditez et supprimez vos flux.
  createProject: Créer nouveau projet
de:
  title: Arbeitsbereich
  description: Erstellen, bearbeiten und löschen Sie Ihre Flows.
  createProject: Neues Projekt erstellen
es:
  title: Espacio de trabajo
  description: Crea, edita y elimina tus flujos.
  createProject: Crear nuevo proyecto
zh:
  title: 工作区
  description: 创建、编辑和删除您的流程。
  createProject: 创建新项目
</i18n>

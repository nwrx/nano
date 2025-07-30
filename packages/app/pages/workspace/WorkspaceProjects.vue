<!-- eslint-disable sonarjs/no-commented-code -->
<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
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

const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
</script>

<template>
  <AppPageContainer contained>
    <ProjectList :workspace="workspace" />
  </AppPageContainer>
</template>

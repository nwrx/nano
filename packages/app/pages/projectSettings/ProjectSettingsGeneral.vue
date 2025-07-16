<script setup lang="ts">
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import ProjectFormDangerZone from '~/components/project/ProjectFormDangerZone.vue'
import ProjectFormGeneral from '~/components/project/ProjectFormGeneral.vue'

definePageMeta({
  name: 'ProjectSettings',
  path: '/:workspace/:project/settings',
  middleware: 'redirect-when-guest',
  layout: 'project-settings',
  group: 'project-settings',
  icon: 'i-carbon:settings',
  title: {
    en: 'Settings',
    fr: 'Paramètres du projet',
    de: 'Projekteinstellungen',
    es: 'Configuración del proyecto',
    zh: '项目设置',
  },
  description: {
    en: 'Update your project settings, manage integrations, and configure your project to meet your team\'s needs.',
    fr: 'Mettez à jour les paramètres de votre projet, gérez les intégrations et configurez votre projet pour répondre aux besoins de votre équipe.',
    de: 'Aktualisieren Sie Ihre Projekteinstellungen, verwalten Sie Integrationen und konfigurieren Sie Ihr Projekt, um den Anforderungen Ihres Teams gerecht zu werden.',
    es: 'Actualice la configuración de su proyecto, administre las integraciones y configure su proyecto para satisfacer las necesidades de su equipo.',
    zh: '更新您的项目设置，管理集成，并配置您的项目以满足团队的需求。',
  },
})

// --- Route.
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const project = computed(() => route.params.project as string)
</script>

<template>
  <AppPageContainer contained>
    <ProjectFormGeneral
      :workspace="workspace"
      :project="project"
    />
    <ProjectFormDangerZone
      :workspace="workspace"
      :project="project"
    />
  </AppPageContainer>
</template>

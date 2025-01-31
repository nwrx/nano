<script setup lang="ts">
import type { WorkspaceProjectObject } from '@nwrx/api'

defineProps<{
  projects: WorkspaceProjectObject[]
  selectedFlow?: string
  selectedProject?: string
}>()

const emit = defineEmits<{
  select: [project: string, flow: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-stretch h-full">

    <!-- Empty -->
    <MonitoringEmpty v-if="projects.length === 0">
      {{ t('noProjects') }}
    </MonitoringEmpty>

    <!-- List -->
    <ul v-else>
      <MonitoringProjectsItem
        v-for="project in projects"
        :key="project.name"
        :project="project"
        :selected-flow="selectedFlow"
        :is-selected="project.name === selectedProject"
        @select="(flow) => emit('select', project.name, flow)"
      />
    </ul>
  </div>
</template>

<i18n lang="yaml">
en:
  noProjects: You either have no projects or you are not allowed to monitor any projects.
fr:
  noProjects: Vous n'avez pas de projets ou vous n'êtes pas autorisé à surveiller des projets.
de:
  noProjects: Sie haben entweder keine Projekte oder Sie dürfen keine Projekte überwachen.
es:
  noProjects: No tiene proyectos o no tiene permiso para monitorear proyectos.
zh:
  noProjects: 您没有项目，或者您没有权限监视任何项目。
</i18n>

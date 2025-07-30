<script setup lang="ts">
import { useProjects } from '~/composables/useProject'
import ProjectListItem from './ProjectList.Item.vue'

const props = defineProps<{
  workspace: string
}>()

const localSettings = useLocalSettings()
function setOpen(name: string, value: boolean) {
  localSettings.value.workspaceOpenProjects ??= {}
  localSettings.value.workspaceOpenProjects[name] = value
}

const projects = useProjects(props)
projects.options.withCreatedBy = true
projects.options.withUpdatedBy = true

onMounted(() => {
  void projects.searchProjects()
  void projects.subscribeToEvents()
})

onBeforeUnmount(() => {
  void projects.unsubscribeFromEvents()
})
</script>

<template>
  <div class="flex flex-col w-full">
    <ProjectListItem
      v-for="project in projects.data"
      :key="project.name"
      :workspace="workspace"
      :project="project"
      :model-value="localSettings.workspaceOpenProjects?.[project.name]"
      @update:model-value="(value) => setOpen(project.name, value)"
    />
  </div>
</template>

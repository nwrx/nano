<script setup lang="ts">
import { useProjects } from '~/composables/useProject'
import ProjectDialogCreate from './ProjectDialogCreate.vue'
import ProjectListControls from './ProjectList.Controls.vue'
import ProjectListItem from './ProjectList.Item.vue'

const props = defineProps<{
  workspace: string
}>()

const localSettings = useLocalSettings()
function setOpen(name: string, value: boolean) {
  localSettings.value.workspaceOpenProjects ??= {}
  localSettings.value.workspaceOpenProjects[name] = value
}

const showCreateDialog = ref(false)
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

watchThrottled(
  () => projects.options,
  () => void projects.searchProjects(),
  { deep: true, throttle: 300 },
)
</script>

<template>
  <div class="flex flex-col w-full space-y-lg">

    <!-- Filters and Sort -->
    <ProjectListControls
      v-model:search="projects.options.search"
      v-model:sort-by="projects.options.sortBy"
      v-model:sort-direction="projects.options.sortDirection"
      v-model:show-create-dialog="showCreateDialog"
    />

    <!-- List -->
    <div class="flex flex-col w-full space-y-md">
      <ProjectListItem
        v-for="project in projects.data"
        :key="project.name"
        :workspace="workspace"
        :project="project"
        :model-value="localSettings.workspaceOpenProjects?.[project.name]"
        @update:model-value="(value) => setOpen(project.name, value)"
      />
    </div>

    <!-- Create Dialog -->
    <ProjectDialogCreate
      v-model="showCreateDialog"
      :workspace="workspace"
    />
  </div>
</template>

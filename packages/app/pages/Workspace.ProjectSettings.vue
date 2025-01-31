<script setup lang="ts">
import { useClient } from '#imports'

definePageMeta({
  name: 'ProjectSettings',
  path: '/:workspace/:project/settings',
  middleware: 'redirect-when-guest',
})

// --- Extract route parameters.
const route = useRoute()
const client = useClient()
const alerts = useAlerts()
const name = computed(() => route.params.project as string)
const workspace = computed(() => route.params.workspace as string)

// --- Remote data.
const project = useProject(workspace, name, {
  withSecrets: true,
  withVariables: true,
  withAssignments: true,
})

// --- Set the page title and description.
useHead(() => ({
  title: project.data.title,
  description: project.data.description,
}))

async function searchUsers(search: string) {
  return await client.request('GET /api/users', {
    data: { search, limit: 5, withProfile: true },
    onError: error => alerts.error(error),
  })
}

onMounted(project.refresh)
</script>

<template>
  <ProjectSettings :workspace="workspace" :project="name">
    <ProjectSettingsGeneral
      :project="name"
      :title="project.data.title"
      :description="project.data.description"
      :workspace="workspace"
      @submit="({ title, description }) => project.setSettings({ title, description })"
    />
    <ProjectSettingsAssigments
      v-if="project.data.assignments"
      :workspace="workspace"
      :project="name"
      :title="project.data.title"
      :assigments="project.data.assignments"
      :search-users="searchUsers"
      @submit="(username, permissions) => project.setUserAssignments(username, permissions)"
    />
    <ProjectSettingsDangerZone
      :search-users="searchUsers"
      :workspace="workspace"
      :project="name"
      :title="project.data.title"
      @submit-name="name => project.setName(name)"
      @submit-delete="() => project.delete()"
      @submit-transfer="username => project.setName(username)"
    />
  </ProjectSettings>
</template>

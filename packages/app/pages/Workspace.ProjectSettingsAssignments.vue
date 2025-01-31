<script setup lang="ts">
import ProjectSettingsAssignments from '~/components/project/ProjectSettings.Assignments.vue'

definePageMeta({
  name: 'WorkspaceProjectSettingsAssignments',
  path: '/:workspace/:project/settings/assignments',
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

    <pre class="whitespace-pre-wrap break-words">{{ project.data }}</pre>

    <ProjectSettingsAssignments
      :workspace="workspace"
      :project="name"
      :title="project.data.title"
      :assignments="project.data.assignments"
      :search-users="searchUsers"
      @submit="(username, permissions) => project.setUserAssignments(username, permissions)"
    />
  </ProjectSettings>
</template>

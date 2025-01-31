<script setup lang="ts">
import { useClient } from '#imports'

definePageMeta({
  name: 'ProjectSettings',
  path: '/:workspace/:name/settings',
  middleware: 'redirect-when-guest',
})

// --- Extract route parameters.
const route = useRoute()
const name = computed(() => route.params.name as string)
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
  return await useClient().request('GET /api/users', {
    data: { search, limit: 5 },
    onError: error => useAlerts().error(error),
  })
}

// --- Set the name of the project and navigate to the new URL.
async function onSetName(name: string) {
  await project.setName(name)
  await useRouter().replace({ name: 'ProjectSettings', params: { workspace: workspace.value, name } })
}

// --- Delete and navigate to the workspace.
async function onDelete() {
  await project.delete()
  await useRouter().replace({ name: 'Workspace', params: { name: workspace.value } })
}

onMounted(async() => {
  await project.refresh()
})
</script>

<template>
  <AppPage>
    <AppPageHeader
      icon="i-carbon:settings"
      headline="Flows"
      title="Project Settings"
      description="Manage your project settings, and configurations."
    />

    <!-- Toolbar -->
    <AppPageContainer class="bg-white grow pt-32">
      <ProjectSettingsGeneral
        :name="name"
        :title="project.data.title"
        :description="project.data.description"
        :workspace="workspace"
        @submit="({ title, description }) => project.setSettings({ title, description })"
      />
      <ProjectSettingsAssigments
        v-if="project.data.assignments"
        :assigments="project.data.assignments"
        :searchUsers="searchUsers"
        @submit="(username, permissions) => project.setUserAssignments(username, permissions)"
      />
      <ProjectSettingsDangerZone
        :searchUsers="searchUsers"
        :workspace="workspace"
        :project="name"
        :title="project.data.title"
        @submitName="name => onSetName(name)"
        @submitDelete="() => onDelete()"
        @submitTransfer="username => project.setName(username)"
      />
    </AppPageContainer>
  </AppPage>
</template>

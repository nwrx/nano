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
        @submitName="name => project.setName(name)"
        @submitDelete="() => project.delete()"
        @submitTransfer="username => project.setName(username)"
      />
    </AppPageContainer>
  </AppPage>
</template>

<script setup lang="ts">
import { useClient } from '#imports'

definePageMeta({
  name: 'ProjectSettings',
  path: '/:workspace/:name/settings',
  middleware: 'redirect-when-guest',
})

const workspace = computed(() => useRoute().params.workspace as string)
const name = computed(() => useRoute().params.name as string)
const project = useProject(workspace, name, {
  withSecrets: true,
  withVariables: true,
  withAssignments: true,
})

useHead(() => ({
  title: project.data.title,
  description: project.data.description,
}))

async function searchUsers(search: string) {
  return await useClient().requestAttempt('GET /api/users', {
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
      <ProjectSettings
        v-if="project.data.name"
        v-bind="project.data"
        :workspace="workspace"
        :searchUsers="searchUsers"
        @submitName="name => onSetName(name)"
        @submitSettings="(data) => project.setSettings(data)"
        @submitUserAssignment="(username, permissions) => project.setUserAssignments(username, permissions)"
        @submitDelete="() => onDelete()"
      />
    </AppPageContainer>
  </AppPage>
</template>

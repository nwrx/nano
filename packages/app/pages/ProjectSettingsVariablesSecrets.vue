<script setup lang="ts">
definePageMeta({
  name: 'ProjectSettingsVariables',
  path: '/:workspace/:project/settings/variables',
  middleware: 'redirect-when-guest',
})

// --- Extract route parameters.
const route = useRoute()
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

onMounted(project.refresh)
</script>

<template>
  <ProjectSettings :workspace="workspace" :project="name">
    <ProjectSettingsVariables
      :workspace="workspace"
      :project="name"
      :variables="project.data.variables"
      @submit-create="(name, value) => project.createVariable(name, value)"
      @submit-update="(name, value) => project.updateVariable(name, value)"
      @submit-delete="(name) => project.deleteVariable(name)"
    />
    <ProjectSettingsSecrets
      :workspace="workspace"
      :project="name"
      :secrets="project.data.secrets"
      @submit-create="(name, value) => project.createSecret(name, value)"
      @submit-update="(name, value) => project.updateSecret(name, value)"
      @submit-delete="(name) => project.deleteSecret(name)"
    />
  </ProjectSettings>
</template>

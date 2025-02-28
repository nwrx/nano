<script setup lang="ts">
definePageMeta({
  name: 'ProjectSettings',
  path: '/:workspace/:project/settings',
  middleware: 'redirect-when-guest',
  layout: 'project-settings',
})

const route = useRoute()
const name = computed(() => route.params.project as string)
const workspace = computed(() => route.params.workspace as string)
const { data, getProject, update, rename, remove } = useProject(workspace, name)
onMounted(getProject)
</script>

<template>
  <AppPageContainer contained>
    <ProjectSettingsGeneral
      :project="name"
      :title="data.title"
      :description="data.description"
      :workspace="workspace"
      @submit="(options) => update(options)"
    />
    <ProjectSettingsDangerZone
      :workspace="workspace"
      :project="name"
      @submit-name="name => rename(name)"
      @submit-delete="() => remove()"
    />
  </AppPageContainer>
</template>

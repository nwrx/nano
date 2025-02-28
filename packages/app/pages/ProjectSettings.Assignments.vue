<script setup lang="ts">
definePageMeta({
  name: 'ProjectSettingsAssignments',
  path: '/:workspace/:project/settings/assignments',
  middleware: 'redirect-when-guest',
  layout: 'project-settings',
})

const route = useRoute()
const name = computed(() => route.params.project as string)
const workspace = computed(() => route.params.workspace as string)
const { assignments, getAssignments, setUserAssignments } = useProject(workspace, name)
onMounted(getAssignments)
</script>

<template>
  <AppPageContainer contained>
    <ProjectSettingsAssignments
      :workspace="workspace"
      :project="name"
      :assignments="assignments"
      @submit-assign="(username) => setUserAssignments(username, ['Read'])"
      @submit-unassign="(username) => setUserAssignments(username, [])"
      @submit-permissions="(username, permissions) => setUserAssignments(username, permissions)"
    />
  </AppPageContainer>
</template>

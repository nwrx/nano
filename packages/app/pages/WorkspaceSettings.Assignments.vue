<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettingsAssignments',
  path: '/:workspace/settings/assignments',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
})

const route = useRoute()
const name = computed(() => route.params.workspace as string)
const { assignments, getAssignments, setUserAssignments } = useWorkspace(name)
onMounted(getAssignments)
</script>

<template>
  <AppPageContainer contained>
    <WorkspaceSettingsAssignments
      :workspace="name"
      :assignments="assignments"
      @submit-assign="(username) => setUserAssignments(username, ['Read'])"
      @submit-unassign="(username) => setUserAssignments(username, [])"
      @submit-permissions="(username, permissions) => setUserAssignments(username, permissions)"
    />
  </AppPageContainer>
</template>

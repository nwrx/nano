<script setup lang="ts">
definePageMeta({
  name: 'WorkspaceSettings',
  path: '/:workspace/settings',
  middleware: 'redirect-when-guest',
  layout: 'workspace-settings',
})

const route = useRoute()
const name = computed(() => route.params.workspace as string)
const { getWorkspace, rename } = useWorkspace(name)
onMounted(getWorkspace)
</script>

<template>
  <AppPageContainer contained>
    <WorkspaceSettingsGeneral :workspace="name" />
    <WorkspaceSettingsDangerZone
      :workspace="name"
      @submit-name="name => rename(name)"
    />
  </AppPageContainer>
</template>

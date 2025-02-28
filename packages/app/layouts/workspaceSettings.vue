<!-- eslint-disable unicorn/prevent-abbreviations -->
<script setup lang="ts">
const { t } = useI18n()

// --- Define the sidebar navigation.
const NAV_ITEMS = [
  { name: 'WorkspaceSettings', icon: 'i-carbon:settings' },
  // { name: 'WorkspaceSettingsMembers', icon: 'i-carbon:user' },
]

// --- Extract route name, title, and description.
const route = useRoute()
const routeName = computed(() => route.name as string)
const routeTitle = computed(() => t(`${routeName.value}.title`))
const routeDescription = computed(() => t(`${routeName.value}.description`))
const routeIcon = computed(() => NAV_ITEMS.find(x => x.name === routeName.value)?.icon)

// --- Extract route parameters.
const workspace = computed(() => route.params.workspace as string)
const params = { workspace: workspace.value }

// --- Set page title and meta description.
useHead(() => ({
  title: routeTitle.value,
  meta: [{ hid: 'description', name: 'description', content: routeDescription.value }],
}))
</script>

<template>
  <AppLayout>
    <AppPage>
      <!-- Header -->
      <AppPageHeader
        :icon="routeIcon"
        :title="[workspace, routeTitle]"
        :description="routeDescription"
      />

      <!-- Side menu -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto">
        <AppPageNav class="shrink-0 h-full sticky top-0 overflow-y-auto">
          <AppPageNavGroup>
            <AppPageNavItem
              v-for="{ name, icon } in NAV_ITEMS"
              :key="name"
              :to="{ name, params }"
              :icon="icon"
              :label="t(`${name}.title`)"
            />
          </AppPageNavGroup>
        </AppPageNav>

        <!-- Content -->
        <NuxtPage transition />
      </div>
    </AppPage>
  </AppLayout>
</template>

<i18n lang="yaml">
en:
  WorkspaceSettings.title: Settings
  WorkspaceSettings.description: Manage workspace settings.
  WorkspaceSettingsMembers.title: Members
  WorkspaceSettingsMembers.description: Manage workspace members and their permissions.
</i18n>

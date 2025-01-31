<script setup lang="ts">
const NAV_GROUPS_TOP = computed<NavItem[]>(() => [
  {
    items: [
      {
        to: '/',
        label: 'Overview',
        icon: 'i-carbon:home',
      },
      {
        to: '/flows',
        label: 'Flows',
        icon: 'i-carbon:flow',
      },
      {
        to: '/modules',
        label: 'Modules',
        icon: 'i-carbon:box',
      },
      {
        to: '/integrations',
        label: 'Integrations',
        icon: 'i-carbon:connect',
      },
      {
        to: '/storage',
        label: 'Storage',
        icon: 'i-carbon:db2-database',
      },
      {
        to: '/keys',
        label: 'API Keys',
        icon: 'i-carbon:api-key',
      },
    ],
  },
  {
    label: 'Organization',
    items: [
      {
        to: '/members',
        label: 'Members',
        icon: 'i-carbon:user',
      },
      {
        to: '/settings',
        label: 'Settings',
        icon: 'i-carbon:settings',
      },
      {
        to: '/monitoring',
        label: 'Monitoring',
        icon: 'i-carbon:cloud-monitoring',
      },
      {
        to: '/usage',
        label: 'Usage',
        icon: 'i-carbon:analytics',
      },
      {
        to: '/billing',
        label: 'Billing',
        icon: 'i-carbon:document',
      },
    ],
  },
])

const NAV_GROUP_BOTTON = computed<NavItem[]>(() => [
  {
    items: [
      {
        to: '/help',
        label: 'Help',
        icon: 'i-carbon:help',
      },
      {
        to: '/support',
        label: 'Support',
        icon: 'i-carbon:chat',
      },
      {
        to: '/feedback',
        label: 'Feedback',
        icon: 'i-carbon:feedback',
      },
    ],
  },
])
</script>

<template>
  <div class="flex w-full">

    <!-- Nav Drawer -->
    <AppNavDrawer
      class="h-screen shrink-0"
      :itemsTop="NAV_GROUPS_TOP"
      :itemsBottom="NAV_GROUP_BOTTON"
    />

    <!-- Main Content -->
    <main class="flex-1">
      <NuxtPage />
    </main>
  </div>
</template>

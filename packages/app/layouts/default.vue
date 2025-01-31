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
        icon: 'i-carbon:user-feedback',
      },
    ],
  },
])
</script>

<template>
  <div class="flex w-full">

    <!-- Nav Drawer -->
    <AppNavDrawer
      class="h-screen shrink-0 pb-8"
      :itemsTop="NAV_GROUPS_TOP"
      :itemsBottom="NAV_GROUP_BOTTON"
    />

    <!-- Main Content -->
    <div class="relative w-full h-screen overflow-x-hidden p-8 bg-primary-100 pl-0">
      <main class="relative w-full h-full overflow-hidden rounded-lg bg-white border border-primary-300">
        <NuxtPage
          class="absolute top-0 left-0 w-full h-full"
          :transition="{
            duration: 600,
            enterActiveClass: 'transition-opacity duration-150 delay-150',
            enterFromClass: 'opacity-0',
            enterToClass: 'opacity-100',
            leaveActiveClass: 'transition-opacity duration-150',
            leaveFromClass: 'opacity-100',
            leaveToClass: 'opacity-0',
          }"
        />
      </main>
    </div>
  </div>
</template>

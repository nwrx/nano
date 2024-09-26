<script setup lang="ts">
import { useAlerts, useClient } from '#imports'
import ASSET_NWRX_LOGO from '~/assets/nwrx-logo-white.svg'
import { CONSTANTS } from '~/utils/constants'
import { NAV_BAR_END, NAV_BAR_START, NAV_DRAWER_END, NAV_DRAWER_START } from '~/utils/navigation'

const route = useRoute()
const isAuthenticationRoute = computed(() => route.path.startsWith('/auth'))
const isDrawerOpen = useLocalStorage('__DrawerOpen', true)

function signout() {
  return useClient().requestAttempt('DELETE /api/signout', {
    onSuccess: () => useAlerts().success('You have been signed out'),
    onError: error => useAlerts().error(error),
    onEnd: () => useRouter().push('/auth/signin'),
  })
}
</script>

<template>
  <div id="layout" class="flex flex-col w-full h-screen bg-primary-900 text-white overflow-hidden">

    <!-- Header -->
    <AppNavBar
      class="shrink-0 col-span-2"
      :title="CONSTANTS.appTitle"
      :imageUrl="ASSET_NWRX_LOGO"
      :itemsStart="NAV_BAR_START"
      :itemsEnd="NAV_BAR_END"
      userName="John Doe"
      userAvatar="https://fakeimg.pl/32x32/"
      @signout="() => signout()"
    />

    <!-- Nav Drawer -->
    <div class="shrink-1 flex w-full h-full pb-8 overflow-hidden">
      <AppNavDrawer
        v-model="isDrawerOpen"
        class="dark text-white h-full shrink-0 pt-12 overflow-y-auto"
        :itemsTop="NAV_DRAWER_START"
        :itemsBottom="NAV_DRAWER_END"
        :isHidden="isAuthenticationRoute"
      />

      <!-- Main Content -->
      <div class="w-full h-full overflow-x-hidden pr-8">
        <main class="relative w-full h-full overflow-hidden rounded-lg">

          <!-- Alerts -->
          <AppAlerts />

          <!-- On error, show error boundary -->
          <NuxtErrorBoundary @error="(error) => console.error(error)">
            <template #error="{ error, clearError }">
              <AppPageErrorBoundary
                :message="error"
                @clearError="() => clearError()"
              />
            </template>

            <!-- Page -->
            <slot>
              <NuxtPage/>
            </slot>
          </NuxtErrorBoundary>
        </main>
      </div>
    </div>

  </div>
</template>

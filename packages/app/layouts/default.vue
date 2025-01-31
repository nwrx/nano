<script setup lang="ts">
import ASSET_NWRX_LOGO from '~/assets/nwrx-logo-white.svg'

const route = useRoute()
const session = useSession()

// --- Conditional UI.
const isAuthenticationRoute = computed(() => {
  if (typeof route.name !== 'string') return false
  return route.name.startsWith('Authentication')
})

// --- State
const isDrawerOpen = useLocalStorage('__DrawerOpen', true)
const themeColor = useLocalStorage('__ThemeColor', 'system')

// --- On theme change, disable transitions for a moment.
watch(themeColor, () => {
  document.documentElement.classList.add('theme-change')
  setTimeout(() => document.documentElement.classList.remove('theme-change'), 100)
})

// --- Locale
const { setLocale, locale } = useI18n()
</script>

<template>
  <div
    id="layout"
    :class="{ dark: themeColor === 'dark' }"
    class="font-sans flex flex-col w-full h-screen overflow-hidden pb pr bg-layout text-layout">

    <!-- Header -->
    <AppNav
      class="h-16 px"
      :theme="themeColor"
      :title="CONSTANTS.appTitle"
      :imageUrl="ASSET_NWRX_LOGO"
      :itemsStart="NAV_BAR_START"
      :itemsEnd="NAV_BAR_END"
      :userAvatarUrl="session.data.avatarUrl"
      :userEmail="session.data.email"
      :userDisplayName="session.data.displayName"
      :locale="locale"
      :locales="LOCALES"
      @signout="() => session.signout()"
      @setLocale="(locale) => setLocale(locale)"
      @setTheme="(theme) => themeColor = theme"
    />

    <!-- Nav Drawer -->
    <div class="flex w-full h-full shrink-1 overflow-hidden">
      <AppDrawer
        v-model="isDrawerOpen"
        class="h-full shrink-0 overflow-y-auto text-unset"
        :itemsTop="NAV_DRAWER_START"
        :itemsBottom="NAV_DRAWER_END"
        :isHidden="isAuthenticationRoute"
      />

      <!-- Main Content -->
      <main class="w-full h-full relative overflow-hidden rd-app bg-app">

        <!-- Alerts -->
        <AppAlerts class="fixed top-0 z-100 w-full" />

        <!-- On error, show error boundary -->
        <NuxtErrorBoundary>
          <template #error="{ error, clearError }">
            <AppPageErrorBoundary
              :message="error"
              @clearError="() => clearError()"
            />
          </template>

          <!-- Page -->
          <NuxtPage transition/>
        </NuxtErrorBoundary>
      </main>
    </div>
  </div>
</template>

<style>
.theme-change * {
  transition: 100ms all ease-in-out !important;
}

/* Scrollbar should be light, thin and hidden when not in use. */
::-webkit-scrollbar {
  width: 0.15rem;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(0 0 0 / 0.3);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0 0 0 / 0.5);
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Scollbar when dark mode is enabled. */
.dark ::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

<script setup lang="ts">
import ASSET_NWRX_LOGO from '~/assets/nwrx-logo-white.svg'
import AppPageErrorBoundary from './AppPage.ErrorBoundary.vue'
import '~/assets/css/code.css'
import '~/assets/css/markdown.css'

const route = useRoute()
const session = useSession()
const localSettings = useLocalSettings()

// --- Conditional UI.
const isAuthenticationRoute = computed(() => {
  if (typeof route.name !== 'string') return false
  return route.name.startsWith('Authentication')
})

// --- On theme change, disable transitions for a moment.
watch(() => localSettings.value.themeColor, () => {
  document.documentElement.classList.add('theme-change')
  setTimeout(() => document.documentElement.classList.remove('theme-change'), 100)
})

// --- Locale
const { setLocale, locale } = useI18n()
</script>

<template>
  <div
    id="layout"
    :class="{ dark: localSettings.themeColor === 'dark' }"
    class="font-sans flex flex-col w-full h-screen overflow-hidden pb pr bg-layout text-layout">

    <!-- Header -->
    <AppNav
      class="h-16 px"
      :theme="localSettings.themeColor"
      :title="CONSTANTS.appTitle"
      :image-url="ASSET_NWRX_LOGO"
      :items="NAV_BAR_END"
      :user-username="session.data.username"
      :user-email="session.data.email"
      :user-display-name="session.data.displayName"
      :locale="locale"
      :locales="LOCALES"
      @signout="() => session.signout()"
      @set-locale="(locale) => setLocale(locale)"
      @set-theme="(theme) => localSettings.themeColor = theme"
    />

    <!-- Nav Drawer -->
    <div class="flex w-full h-full shrink-1 overflow-hidden">
      <AppDrawer
        v-model="localSettings.drawerOpen"
        class="h-full shrink-0 overflow-y-auto text-unset"
        :items-top="NAV_DRAWER_START"
        :items-bottom="NAV_DRAWER_END"
        :is-hidden="isAuthenticationRoute"
      />

      <!-- Main Content -->
      <main class="w-full h-full relative overflow-hidden rd-app bg-app b b-app">

        <!-- Alerts -->
        <AppAlerts class="fixed top-0 z-100 w-full" />

        <!-- On error, show error boundary -->
        <NuxtErrorBoundary>
          <template #error="{ error, clearError }">
            <AppPageErrorBoundary
              :message="error instanceof Error ? error.message : error"
              :stack="error instanceof Error ? error.stack : undefined"
              @clear-error="() => clearError()"
            />
          </template>

          <!-- Page -->
          <slot>
            <NuxtPage />
          </slot>
        </NuxtErrorBoundary>
      </main>
    </div>
  </div>
</template>

<style>
.theme-change * {
  transition-property: all !important;
  transition-duration: 500ms !important;
  transition-timing-function: cubic-bezier(0,1,0.15,0.9) !important;
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

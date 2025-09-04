<script setup lang="ts">
import ASSET_NWRX_LOGO from '~/assets/nwrx-logo-white.svg'
import { useLocalSettings } from '~/composables/useLocalSettings'
import { useSession } from '~/composables/useSession'
import AppAlerts from './AppAlerts.vue'
import AppDrawer from './AppDrawer.vue'
import AppNav from './AppNav.vue'
import AppPageErrorBoundary from './AppPage.ErrorBoundary.vue'
import '~/assets/css/code.css'
import '~/assets/css/markdown.css'

const route = useRoute()
const session = useSession()
const localSettings = useLocalSettings()

// --- Version information from environment variables
const config = useRuntimeConfig()
const version = config.public.nanoVersion
const versionSha = config.public.nanoVersionSha
const shortSha = computed(() => versionSha.slice(0, 7))

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

type NuxtError = Error & {
  statusCode?: number
  statusMessage?: string
  cause?: Error
}

// --- Error handling.
const nuxtError = ref<NuxtError | undefined>(undefined)
function handleError(error: unknown) {
  if (error instanceof Error)
    nuxtError.value = error as NuxtError
  else if (typeof error === 'string')
    nuxtError.value = new Error(error) as NuxtError
}
</script>

<template>
  <div
    id="layout"
    :class="{ dark: localSettings.themeColor === 'dark' }"
    class="font-sans flex flex-col w-full h-screen overflow-hidden pr bg-layout text-layout relative">

    <!-- Header -->
    <AppNav
      class="h-16 px"
      :theme="localSettings.themeColor"
      title="Nanoworks"
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
        :is-hidden="isAuthenticationRoute || nuxtError !== undefined"
      />

      <!-- Main Content -->
      <main class="w-full h-full relative overflow-hidden rd-app bg-app b b-app">

        <!-- Alerts -->
        <AppAlerts class="fixed top-0 z-100 w-full" />

        <!-- On error, show error boundary -->
        <NuxtErrorBoundary @error="(err) => handleError(err)">
          <template #error="{ clearError }">
            <AppPageErrorBoundary
              v-if="nuxtError"
              :constructor-name="nuxtError.constructor.name"
              :name="nuxtError.cause?.name || nuxtError.name"
              :stack="nuxtError.stack"
              :message="nuxtError.message"
              :status-code="nuxtError.statusCode"
              :status-message="nuxtError.statusMessage"
              is-error-boundary
              @clear-error="() => clearError()"
            />
          </template>

          <!-- Content -->
          <slot>
            <NuxtPage />
          </slot>
        </NuxtErrorBoundary>

        <!-- Version Information -->
        <!--
          <div class="fixed bottom-2 right-2 text-xs opacity-50 hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none">
          <div class="bg-black/20 dark:bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-white dark:text-black">
          <div>v{{ version }}</div>
          <div class="font-mono">{{ shortSha }}</div>
          </div>
          </div>
        -->

      </main>
    </div>

    <!-- Footer / Mainly debug infos -->
    <div class="flex justify-end w-full px-sm py-xs space-x-md">
      <div class="font-mono text-subtle text-xs">
        {{ shortSha }}
      </div>
      <div class="font-mono text-subtle text-xs">
        v{{ version }}
      </div>
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

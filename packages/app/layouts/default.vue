<script setup lang="ts">
import ASSET_NWRX_LOGO from '~/assets/nwrx-logo-white.svg'

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
      :items-start="NAV_BAR_START"
      :items-end="NAV_BAR_END"
      :user-avatar-url="session.data.avatarUrl"
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
      <main class="w-full h-full relative overflow-hidden rd-app bg-app">

        <!-- Alerts -->
        <AppAlerts class="fixed top-0 z-100 w-full" />

        <!-- On error, show error boundary -->
        <NuxtErrorBoundary>
          <template #error="{ error, clearError }">
            <AppPageErrorBoundary
              :message="error"
              @clear-error="() => clearError()"
            />
          </template>

          <!-- Page -->
          <NuxtPage />
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

/* Markdown */
.markdown {
  white-space: wrap;
  line-height: 1.5;
}

.markdown > *:first-child {
  margin-top: 0;
}

.markdown h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.markdown h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.markdown h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.markdown p {
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.markdown a {
  color: rgb(var(--theme-textColor-prominent));
  text-decoration: underline;
}

.markdown b,
.markdown strong {
  font-weight: 600;
}

.markdown code {
  padding: 0.15rem 0.25rem;
  margin: 0 0.25rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  border-width: 1px;
  border-style: solid;
  border-color: var(--theme-borderColor-app);
  background-color: rgb(var(--theme-colors-prominent));
}

.markdown pre {
  padding: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  border-width: 1px;
  border-style: solid;
  border-color: var(--theme-borderColor-prominent);
  background-color: rgb(var(--theme-colors-emphasized));
  overflow-x: auto;
}

.markdown pre > code {
  padding: 0;
  margin: 0;
  border-radius: 0;
  background-color: transparent;
  border: 0;
}

.markdown hr {
  border: 0;
  border-top: 2px solid var(--theme-borderColor-editor);
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.markdown ul {
  white-space: normal;
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
  list-style-type: disc;
  list-style-position: outside;
}

.markdown ol {
  white-space: normal;
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
  list-style-type: decimal;
  list-style-position: outside;
}

.markdown ol > li > p,
.markdown ul > li > p {
  display: inline;
}

.markdown ol ol,
.markdown ul ul {
  list-style-type: circle;
  margin-left: 1.5rem;
}

.markdown ul ul ul {
  list-style-type: square;
  margin-left: 1.5rem;
}
</style>

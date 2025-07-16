<!-- eslint-disable unicorn/prevent-abbreviations -->
<script setup lang="ts">
import AppLayout from '~/components/app/AppLayout.vue'
import AppPageHeader from '~/components/app/AppPage.Header.vue'
import AppPage from '~/components/app/AppPage.vue'
import ContextMenuItem from '~/components/base/ContextMenu.Item.vue'
import ContextMenu from '~/components/base/ContextMenu.vue'
import { useRouteGroup } from '~/composables/useRouteGroup'

const { t } = useI18n()
const route = useRoute()
const workspace = computed(() => route.params.workspace as string)
const workspaceRoutes = useRouteGroup('nav-items-workspace')
</script>

<template>
  <AppLayout>
    <AppPage>
      <AppPageHeader
        class="z-10"
        :icon="route.meta.icon"
        :title="[workspace, localize(route.meta.title)]"
        :description="localize(route.meta.description)">

        <!-- Tabs -->
        <!--
          <template #default>
          <AppPageHeaderTab
          v-for="x in workspaceRoutes"
          :key="x.name"
          :icon="x.meta.icon"
          :label="localize(x.meta.title)"
          :to="{ name: x.name, params: { workspace } }"
          :disabled="x.meta.isWorkInProgress"
          />
          </template>
        -->

        <!-- Menu -->
        <template #menu>
          <ContextMenu>
            <template #menu>
              <!-- Settings -->
              <ContextMenuItem
                :to="{ name: 'WorkspaceSettings', params: { workspace } }"
                icon="i-carbon:settings"
                :label="t('settings')"
              />
              <ContextMenuDivider />
              <ContextMenuItem
                v-for="x in workspaceRoutes"
                :key="x.name"
                :to="{ name: x.name, params: { workspace } }"
                :icon="x.meta.icon"
                :label="localize(x.meta.title)"
              />
            </template>
          </contextmenu>
        </template>
      </AppPageHeader>

      <!-- Content -->
      <div class="flex w-full h-full overflow-x-hidden overflow-y-auto divide-x divide-app">
        <div class="relative w-full">
          <NuxtPage transition />
        </div>
      </div>
    </AppPage>
  </AppLayout>
</template>

<i18n lang="yaml">
en:
  settings: Settings
fr:
  settings: Paramètres
de:
  settings: Einstellungen
es:
  settings: Configuración
zh:
  settings: 设置
</i18n>

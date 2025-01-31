<script setup lang="ts">
definePageMeta({
  name: 'Modules',
  path: '/modules',
  middleware: 'redirect-when-guest',
})

const { t } = useI18n()

useHead(() => ({
  title: t('title'),
  meta: [{ name: 'description', content: t('description') }],
}))

const category = ref('popular')
const featured = MODULES_MOCK
</script>

<template>
  <AppPage class="!flex-row">
    <ModuleNav
      class="
        sticky top-0 h-full
        overflow-y-auto
      "
    />

    <div class="grow">
      <AppPageHeader
        icon="i-carbon:flow"
        :title="t('title')"
        :description="t('description')"
      />

      <!-- Featured -->
      <div class="w-full grid cols-3 gap-lg p-lg">
        <ModuleCardFeatured v-for="module in featured" v-bind="module" :key="module.title" />
      </div>
    </div>
  </AppPage>
</template>

<i18n lang="yaml">
en:
  title: Modules
  description: Manage and configure your integrations using curated and community-built modules.
fr:
  title: Modules
  description: Gérez et configurez vos intégrations à l'aide de modules créés par la communauté et sélectionnés avec soin.
de:
  title: Module
  description: Verwalten und konfigurieren Sie Ihre Integrationen mit sorgfältig ausgewählten und von der Community erstellten Modulen.
es:
  title: Módulos
  description: Administre y configure sus integraciones utilizando módulos creados por la comunidad y seleccionados cuidadosamente.
zh:
  title: 模块
  description: 使用由社区精心构建和筛选的模块管理和配置您的集成。
</i18n>

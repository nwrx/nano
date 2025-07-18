<script setup lang="ts">
import type { IconCollectionObject } from '@nwrx/nano-api'

defineProps<{
  collection: IconCollectionObject
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex items-center space-x-sm py-sm">
    <!-- Icon -->
    <div class="flex items-center justify-center size-10 bg-subtle rd b b-app">
      <BaseIcon
        icon="i-carbon:image"
        class="size-5 text-prominent"
      />
    </div>

    <!-- Content -->
    <div class="flex flex-col">
      <h3 class="text-sm font-semibold text-app line-clamp-1">
        {{ collection.title }}
      </h3>

      <!-- Licence -->
      <p class="text-xs font-normal text-subtle line-clamp-1">
        {{ t('licence') }}: {{ collection.license }}
      </p>
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  licence: Licence
fr:
  licence: Licence
de:
  licence: Lizenz
es:
  licence: Licencia
zh:
  licence: 许可
</i18n>

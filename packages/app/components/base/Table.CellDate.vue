<script setup lang="ts">
defineProps<{
  createdAt?: string
  updatedAt?: string
  lastSeenAt?: string
}>()

const { t, locale } = useI18n()
</script>

<template>
  <div :key="locale" class="lt-md:hidden">
    <p v-if="createdAt" class="flex flex-col">
      <span class="text-xs text-subtle" v-text="t('createdAt.date', { date: formatDate(createdAt) })" />
      <span class="text-xs text-app" v-text="t('createdAt.distance', { date: formatDateFromNow(createdAt) })" />
    </p>
  </div>
</template>

<i18n lang="yaml">
en:
  createdAt:
    date: '{date}'
    distance: created {date}
fr:
  createdAt:
    date: '{date}'
    distance: créé {date}
de:
  createdAt:
    date: '{date}'
    distance: erstellt {date}
es:
  createdAt:
    date: '{date}'
    distance: creado {date}
zh:
  createdAt:
    date: '{date}'
    distance: 创建于 {date}
</i18n>

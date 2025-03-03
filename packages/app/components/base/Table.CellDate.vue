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
      <span class="text-sm text-app" v-text="t('createdAt.date', { date: formatDate(createdAt) })" />
      <span class="text-xs text-subtle" v-text="formatDateFromNow(createdAt)" />
    </p>
  </div>
</template>

<i18n lang="yaml">
en:
  createdAt:
    date: Created on {date}
fr:
  createdAt:
    date: Créé le {date}
de:
  createdAt:
    date: Erstellt am {date}
es:
  createdAt:
    date: Creado el {date}
zh:
  createdAt:
    date: 创建于 {date}
</i18n>

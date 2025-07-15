<script setup lang="ts">
import { formatDate, formatDateFromNow } from '~/utils/formatDate'

defineProps<{
  createdAt?: string
  updatedAt?: string
  lastSeenAt?: string
}>()

const { t, locale } = useI18n()
</script>

<template>
  <div :key="locale">
    <p v-if="createdAt" class="flex flex-col">
      <span class="text-xs text-subtle" v-text="t('createdAt.date', { date: formatDate(createdAt) })" />
      <span class="text-xs text-app" v-text="t('createdAt.distance', { date: formatDateFromNow(createdAt) })" />
    </p>
    <p v-if="lastSeenAt" class="flex flex-col">
      <span class="text-xs text-subtle" v-text="t('lastSeenAt.date', { date: formatDate(lastSeenAt) })" />
      <span class="text-xs text-app" v-text="t('lastSeenAt.distance', { date: formatDateFromNow(lastSeenAt) })" />
    </p>
    <p v-if="updatedAt" class="flex flex-col">
      <span class="text-xs text-subtle" v-text="t('updatedAt.date', { date: formatDate(updatedAt) })" />
      <span class="text-xs text-app" v-text="t('updatedAt.distance', { date: formatDateFromNow(updatedAt) })" />
    </p>
  </div>
</template>

<i18n lang="yaml">
en:
  createdAt:
    date: '{date}'
    distance: created {date}
  lastSeenAt:
    date: '{date}'
    distance: last seen {date}
  updatedAt:
    date: '{date}'
    distance: updated {date}
fr:
  createdAt:
    date: '{date}'
    distance: créé {date}
  lastSeenAt:
    date: '{date}'
    distance: vu pour la dernière fois {date}
  updatedAt:
    date: '{date}'
    distance: mis à jour {date}
de:
  createdAt:
    date: '{date}'
    distance: erstellt {date}
  lastSeenAt:
    date: '{date}'
    distance: zuletzt gesehen {date}
  updatedAt:
    date: '{date}'
    distance: aktualisiert {date}
es:
  createdAt:
    date: '{date}'
    distance: creado {date}
  lastSeenAt:
    date: '{date}'
    distance: visto por última vez {date}
  updatedAt:
    date: '{date}'
    distance: actualizado {date}
zh:
  createdAt:
    date: '{date}'
    distance: 创建于 {date}
  lastSeenAt:
    date: '{date}'
    distance: 最后一次看到 {date}
  updatedAt:
    date: '{date}'
    distance: 更新于 {date}
</i18n>

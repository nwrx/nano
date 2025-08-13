<script setup lang="ts">
import type { ThreadObject } from '@nwrx/nano-api'
import type { UUID } from 'node:crypto'
import PanelGroup from '~/components/base/Panel.Group.vue'
import ThreadListItem from './ThreadList.Item.vue'

const props = defineProps<{
  threads: ThreadObject[]
  label: string
  icon: string
}>()

const { t } = useI18n()
const selectedThreadId = defineModel<UUID>()
const badge = computed(() => {
  const count = props.threads.length
  return `${count} ${count === 1 ? t('thread') : t('threads')}`
})
</script>

<template>
  <PanelGroup
    :label="props.label"
    :icon="props.icon"
    :badge="badge"
    class-badge="badge-success">

    <ThreadListItem
      v-for="thread in threads"
      :key="thread.id"
      v-model="selectedThreadId"
      :thread="thread"
    />
  </PanelGroup>
</template>

<i18n lang="yaml">
en:
  thread: thread
  threads: threads
fr:
  thread: thread
  threads: threads
de:
  thread: Thread
  threads: Threads
es:
  thread: hilo
  threads: hilos
zh:
  thread: 线程
  threads: 线程
</i18n>

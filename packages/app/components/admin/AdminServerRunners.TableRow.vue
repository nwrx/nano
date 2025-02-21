<script setup lang="ts">
import type { ThreadRunnerWorkerPoolStatus } from '@nwrx/nano-runner'

defineProps<{
  address: string
  identity: string
  lastSeenAt: string
  isRunning: boolean
  isReachable: boolean
  workerPool: ThreadRunnerWorkerPoolStatus[]
}>()

const emit = defineEmits<{
  'submitPing': []
  'submitEnable': []
  'submitDisable': []
  'submitRelease': []
}>()

const { t } = useI18n()
const isOpen = ref(false)
</script>

<template>
  <div>
    <BaseButton
      eager
      class="
        px-md py-sm
        flex items-center justify-between w-full
        space-x-md font-normal py-sm bg-transparent
        text-start cursor-pointer b-b b-app
      "
      :class="{ 'bg-subtle': isOpen }"
      @mousedown="() => isOpen = !isOpen">
      <!-- <div class="flex items-center justify-between space-x-md font-normal py-sm"> -->

      <!-- Address -->
      <div class="flex items-center space-x-md">
        <BaseIcon icon="i-carbon:dot-mark" class="size-4 text-success" />
        <div class="flex flex-col">
          <p class="text-sm text-app" v-text="identity" />
          <span class="text-xs text-subtle" v-text="address" />
        </div>
      </div>

      <!-- Address -->
      <div>
        <Badge
          size="small"
          class="font-normal badge-soft"
          :class="isReachable ? 'badge-success' : 'badge-danger'"
          :icon="isReachable ? 'i-carbon:checkmark' : 'i-carbon:close'"
          :label="address"
        />
      </div>

      <!-- Status -->
      <div class="flex flex-col items-start space-y-xs">
        <span class="text-sm text-subtle">
          {{ t('lastSeen', { distance: formatDateFromNow(lastSeenAt) }) }}
        </span>
      </div>

      <!-- Actions -->
      <AdminServerRunnersTableRowActions
        :address="address"
        :identity="identity"
        @submit-ping="() => emit('submitPing')"
        @submit-enable="() => emit('submitEnable')"
        @submit-disable="() => emit('submitDisable')"
        @submit-release="() => emit('submitRelease')"
      />
    </BaseButton>

    <BaseCollapse
      vertical
      :is-open="isOpen"
      :duration="300"
      class="transition-all"
      :class="{ 'op-0 pointer-events-none': isOpen !== true }">

      <div class="text-left font-normal text-sm p-md space-y-md">
        <DataSheet
          :model-value="workerPool"
          :options-label="({ threadId }) => t('title', { threadId })"
        />
      </div>
    </BaseCollapse>
  </div>
</template>

<i18n lang="yaml">
en:
  connected: Connected
  disconnected: Disconnected
  lastSeen: Last seen {distance}
  title: 'Thread #{threadId}'
fr:
  connected: Connecté
  disconnected: Déconnecté
  lastSeen: Vu pour la dernière fois {distance}
  title: "Fil d'exécution #{threadId}"
de:
  connected: Verbunden
  disconnected: Getrennt
  lastSeen: Zuletzt gesehen {distance}
  title: 'Thread #{threadId}'
es:
  connected: Conectado
  disconnected: Desconectado
  lastSeen: Visto por última vez {distance}
  title: 'Hilo #{threadId}'
zh:
  connected: 已连接
  disconnected: 未连接
  lastSeen: 最后查看 {distance}
  title: '线程 #{threadId}'
</i18n>

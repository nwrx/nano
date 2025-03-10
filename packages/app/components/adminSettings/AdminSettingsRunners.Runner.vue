<!-- eslint-disable sonarjs/no-selector-parameter -->
<script setup lang="ts">
import type { application, ThreadRunnerObject } from '@nwrx/nano-api'
import type { ThreadRunnerStatus } from '@nwrx/nano-runner'
import type { ChannelConnectOptions } from '@unserved/client'
import type { WebSocketChannel } from '@unshared/client/websocket'
type Channel = WebSocketChannel<ChannelConnectOptions<typeof application, 'WS /ws/runners/:identity'>>

const props = defineProps<{
  runner: ThreadRunnerObject
}>()

const { t } = useI18n()
const isOpen = ref(false)
const client = useClient()
const channel = ref<Channel>()

const previous = ref<Partial<ThreadRunnerStatus>>({})
const status = ref<Partial<ThreadRunnerStatus>>({})

async function subscribe() {
  channel.value = await client.connect('WS /ws/runners/:identity', {
    autoReconnect: true,
    reconnectDelay: 1000,
    reconnectLimit: 3,
    data: { identity: props.runner.identity },
    onMessage: (message: Partial<ThreadRunnerStatus>) => {
      previous.value = status.value
      status.value = message
    },
  })
}

watch(isOpen, (isOpen) => {
  if (isOpen) void subscribe()
  else void channel.value?.close()
})

function getCpuLoad(index: number) {
  const cpuCurrent = status.value.cpus?.[index]
  const cpuPrevious = previous.value.cpus?.[index]
  if (!cpuCurrent || !cpuPrevious) return 0
  return Math.max(10, cpuCurrent.times.user - cpuPrevious.times.user)
}
</script>

<template>
  <div v-if="runner">
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
          <p class="text-sm text-app" v-text="runner.identity" />
          <span class="text-xs text-subtle" v-text="runner.address" />
        </div>
      </div>

      <!-- Address -->
      <div>
        <Badge
          size="small"
          class="font-normal badge-soft"
          :class="status.isReachable ? 'badge-success' : 'badge-danger'"
          :icon="status.isReachable ? 'i-carbon:checkmark' : 'i-carbon:close'"
          :label="runner.address"
        />
      </div>

      <!-- Status -->
      <div class="flex flex-col items-start space-y-xs">
        <span class="text-sm text-subtle">
          {{ t('lastSeen', { distance: formatDateFromNow(runner.lastSeenAt) }) }}
        </span>
      </div>

      <!-- Actions -->
      <AdminSettingsRunnersActions :runner="runner" />
    </BaseButton>

    <Collapse v-model="isOpen">

      <!-- Status badges -->
      <div class="flex items-center space-x-md px-sm py-md b b-app">
        <Badge
          class="font-normal"
          :class="status.isReachable ? 'badge-success' : 'badge-danger'"
          :icon="status.isReachable ? 'i-carbon:checkmark' : 'i-carbon:close'"
          :label="status.isReachable ? t('connected') : t('disconnected')"
        />
        <Badge
          class="font-normal"
          :class="status.isRunning ? 'badge-warning' : ''"
          :icon="status.isRunning ? 'i-carbon:play-filled' : 'i-carbon:stop-filled'"
          :label="status.isRunning ? 'Running' : 'Idle'"
        />
      </div>

      <!-- Free/Total/Available Memory in GB -->
      <div class="flex items-center space-x-md px-sm py-md b b-app">
        <BaseIcon icon="i-carbon:memory" class="size-4 text-app" />
        <div class="flex flex-col">
          <p class="text-sm text-app">
            Memory
          </p>
          <span class="text-xs text-subtle">
            {{ (status.freemem / 2e9).toFixed(2) }} GB Free / {{ (status.totalmem / 2e9).toFixed(2) }} GB Total
          </span>
        </div>
      </div>

      <!-- Platform / Release / Type / Version -->
      <div class="flex items-center space-x-md px-sm py-md b b-app">
        <BaseIcon icon="i-carbon:os" class="size-4 text-app" />
        <div class="flex flex-col">
          <p class="text-sm text-app">
            Platform
          </p>
          <span class="text-xs text-subtle">
            {{ status.platform }} / {{ status.release }} / {{ status.type }} / {{ status.version }}
          </span>
        </div>
      </div>

      <!-- Bars of 3 levels for each `cpus` -->
      <div class="space-y-md px-lg py-md b b-app w-full">
        <div>
          <p class="text-sm text-app">
            CPUs
          </p>
          <span class="text-xs text-subtle">
            {{ status.cpus?.length }} CPUs
          </span>
          <span class="text-xs text-subtle">
            {{ status.cpus?.[0].model }} {{ status.cpus?.[0].speed }} MHz
          </span>
        </div>
        <div v-if="previous.cpus" class="flex items-center justify-between space-x-xs h-10 w-full">
          <template v-for="(cpu, index) in status.cpus" :key="index">
            <div
              class="w-full bg-active rd transition duration-100"
              :style="{
                height: `${getCpuLoad(index)}%`,
                opacity: 0.1 + (getCpuLoad(index) / 100) * 0.9,
              }"
            />
          </template>
        </div>
      </div>
      <!--
        <DataSheet
        :model-value="status.workerPool"
        :options-label="({ threadId }) => t('title', { threadId })"
        />
      -->
    </Collapse>
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

<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import type { ThreadRunnerStatus } from '@nwrx/nano-runner'

defineProps<{
  runners: Array<ThreadRunnerObject & ThreadRunnerStatus>
}>()

const emit = defineEmits<{
  'submitPing': [runnerId: string]
  'submitEnable': [runnerId: string]
  'submitDisable': [runnerId: string]
  'submitRelease': [runnerId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="w-full b b-app rd">
    <BaseTable
      class="w-full"
      :rows="runners"
      :columns="['address']"
      class-header="bg-subtle"
      class-row="b-t b-app hover:bg-subtle">

      <!-- Header -->
      <template #header="label">
        <div class="w-full font-medium px-lg py-sm text-sm text-start">
          {{ t(`header.${label}`) }}
        </div>
      </template>

      <!-- Rows -->
      <template #cell.address="{ address, identity, isRunning, isReachable, lastSeenAt, workerPool }">
        <AdminServerRunnersTableRow
          :address="address"
          :identity="identity"
          :is-running="isRunning"
          :is-reachable="isReachable"
          :last-seen-at="lastSeenAt"
          :worker-pool="workerPool"
          @submit-ping="() => emit('submitPing', identity)"
          @submit-enable="() => emit('submitEnable', identity)"
          @submit-disable="() => emit('submitDisable', identity)"
          @submit-release="() => emit('submitRelease', identity)"
        />
      </template>
    </BaseTable>
  </div>
</template>

<i18n lang="yaml">
en:
  header.address: Address
  header.actions: Actions
fr:
  header.address: Adresse
  header.actions: Actions
de:
  header.address: Adresse
  header.actions: Aktionen
es:
  header.address: Dirección
  header.actions: Acciones
zh:
  header.address: 地址
  header.actions: 动作
</i18n>

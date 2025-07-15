<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import { toCamelCase } from '@unshared/string/toCamelCase'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Hyperlink from '~/components/base/Hyperlink.vue'
import TableCellDate from '~/components/base/Table.CellDate.vue'
import Table from '~/components/base/Table.vue'
import RunnerCard from '~/components/runner/RunnerCard.vue'
import AdminSettingsRunnerActions from './AdminSettingsRunner.Actions.vue'
import AdminSettingsRunnersDialogClaim from './AdminSettingsRunner.DialogClaim.vue'

const { t } = useI18n()
const client = useClient()
const showClaimDialog = ref(false)

const runners = ref<ThreadRunnerObject[]>([])
async function getRunners() {
  await client.request('GET /api/runners', {
    onData: data => runners.value = data,
  })
}

onMounted(getRunners)
</script>

<template>
  <AppPageForm vertical :title="t('title')" :text="t('text')">
    <Table
      :rows="runners"
      :columns="['identity', 'address', 'lastSeenAt', 'actions']">
      <template #header="name">
        {{ t(toCamelCase('header', name)) }}
      </template>

      <!-- Identity -->
      <template #cell.identity="runner">
        <RunnerCard :runner is-link />
      </template>

      <!-- Address -->
      <template #cell.address="{ address }">
        <span class="text-sm text-subtle">{{ address }}</span>
      </template>

      <!-- Last Seen At -->
      <template #cell.lastSeenAt="{ lastSeenAt }">
        <TableCellDate :created-at="lastSeenAt" />
      </template>

      <!-- Actions -->
      <template #cell.actions="runner">
        <AdminSettingsRunnerActions
          :runner="runner"
          @submit="() => getRunners()"
        />
      </template>
    </Table>

    <!-- Claim Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('claim')"
      @click="() => showClaimDialog = true"
    />

    <!-- Claim Dialog -->
    <AdminSettingsRunnersDialogClaim
      v-model="showClaimDialog"
      @submit="() => getRunners()"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Thread Runners
  text: Manage and monitor thread runner servers. Thread runners are responsible for executing background tasks and heavy computations.
  claim: Claim a new runner
  headerIdentity: Runner
  headerAddress: Address
  headerLastSeenAt: Last Seen
  headerActions: ''
fr:
  title: Serveurs d'exécution de threads
  text: Gérez et surveillez les serveurs d'exécution de threads. Les serveurs d'exécution de threads sont responsables de l'exécution de tâches en arrière-plan et de calculs lourds.
  claim: Revendiquer un nouveau serveur d'exécution
  headerIdentity: Serveur d'exécution
  headerAddress: Adresse
  headerLastSeenAt: Dernière vue
  headerActions: ''
de:
  title: Thread-Ausführungsserver
  text: Verwalten und überwachen Sie Thread-Ausführungsserver. Thread-Ausführungsserver sind für die Ausführung von Hintergrundaufgaben und schweren Berechnungen verantwortlich.
  claim: Neuen Ausführungsserver beanspruchen
  headerIdentity: Ausführungsserver
  headerAddress: Adresse
  headerLastSeenAt: Zuletzt gesehen
  headerActions: ''
es:
  title: Servidores de ejecución de hilos
  text: Administre y supervise los servidores de ejecución de hilos. Los servidores de ejecución de hilos son responsables de ejecutar tareas en segundo plano y cálculos pesados.
  claim: Reclamar un nuevo servidor de ejecución
  headerIdentity: Servidor de ejecución
  headerAddress: Dirección
  headerLastSeenAt: Última vista
  headerActions: ''
zh:
  title: 线程执行服务器
  text: 管理和监控线程执行服务器。线程执行服务器负责执行后台任务和大量计算。
  claim: 声明新执行服务器
  headerIdentity: 执行服务器
  headerAddress: 地址
  headerLastSeenAt: 最后查看
  headerActions: ''
</i18n>

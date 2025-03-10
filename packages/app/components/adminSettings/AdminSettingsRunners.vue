<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'

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
    <div class="flex flex-col w-full space-y-md">
      <AdminSettingsRunnersRunner
        v-for="runner in runners"
        :key="runner.identity"
        :runner="runner"
      />
    </div>

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
  claim: Register a new runner
  header:
    address: Address
fr:
  title: Serveurs d'exécution
  text: Gérez et surveillez les serveurs d'exécution de thread. Les serveurs d'exécution de thread sont responsables de l'exécution de tâches en arrière-plan et de calculs lourds.
  claim: Enregistrer un nouveau serveur
  header:
    address: Adresse
de:
  title: Thread-Server
  text: Verwalten und überwachen Sie Thread-Server. Thread-Server sind für die Ausführung von Hintergrundaufgaben und schweren Berechnungen verantwortlich.
  claim: Einen neuen Server registrieren
  header:
    address: Adresse
es:
  title: Servidores de hilos
  text: Administre y supervise los servidores de hilos. Los servidores de hilos son responsables de ejecutar tareas en segundo plano y cálculos pesados.
  claim: Registrar un nuevo servidor
  header:
    address: Dirección
zh:
  title: 线程运行器
  text: 管理和监控线程运行器服务器。线程运行器负责执行后台任务和大量计算。
  claim: 注册新运行器
  header:
    address: 地址
</i18n>

<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import type { ThreadRunnerStatus } from '@nwrx/nano-runner'

defineProps<{
  runners: Array<ThreadRunnerObject & ThreadRunnerStatus>
}>()

const emit = defineEmits<{
  'submitRelease': [runnerId: string]
  'submitClaim': [address: string]
}>()

const { t } = useI18n()
const isDialogClaimOpen = ref(false)
</script>

<template>
  <AppPageForm
    vertical
    :title="t('title')"
    :text="t('text')">

    <!-- Table -->
    <AdminServerRunnersTable
      :runners="runners"
      @submit-release="(runnerId) => emit('submitRelease', runnerId)"
    />

    <!-- Claim Button -->
    <Hyperlink
      eager
      class="text-sm ml-auto mb-4"
      icon="i-carbon:add"
      icon-append="i-carbon:chevron-right"
      :label="t('claim')"
      @click="() => isDialogClaimOpen = true"
    />

    <!-- Claim Dialog -->
    <AdminServerRunnersDialogClaim
      v-model="isDialogClaimOpen"
      @submit="(address) => emit('submitClaim', address)"
    />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Thread Runners
  text: Manage and monitor thread runner servers. Thread runners are responsible for executing background tasks and heavy computations.
  claim: Register a new runner
fr:
  title: Serveurs d'exécution
  text: Gérez et surveillez les serveurs d'exécution de thread. Les serveurs d'exécution de thread sont responsables de l'exécution de tâches en arrière-plan et de calculs lourds.
  claim: Enregistrer un nouveau serveur
de:
  title: Thread-Server
  text: Verwalten und überwachen Sie Thread-Server. Thread-Server sind für die Ausführung von Hintergrundaufgaben und schweren Berechnungen verantwortlich.
  claim: Einen neuen Server registrieren
es:
  title: Servidores de hilos
  text: Administre y supervise los servidores de hilos. Los servidores de hilos son responsables de ejecutar tareas en segundo plano y cálculos pesados.
  claim: Registrar un nuevo servidor
zh:
  title: 线程运行器
  text: 管理和监控线程运行器服务器。线程运行器负责执行后台任务和大量计算。
  claim: 注册新运行器
</i18n>

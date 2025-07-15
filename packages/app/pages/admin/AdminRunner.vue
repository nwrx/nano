<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import AppPageContainer from '~/components/app/AppPage.Container.vue'
import RunnerFormDangerZone from '~/components/runner/RunnerFormDangerZone.vue'
import RunnerFormSettings from '~/components/runner/RunnerFormSettings.vue'
import RunnerFormStatus from '~/components/runner/RunnerFormStatus.vue'

definePageMeta({
  name: 'AdminSettingsRunner',
  path: '/admin/runners/:identity',
  layout: 'admin-settings',
  icon: 'i-carbon:bare-metal-server-02',
  parent: 'AdminSettingsRunners',
  title: {
    en: 'Runner Details',
    fr: 'Détails du travailleur',
    de: 'Runner-Details',
    es: 'Detalles del ejecutor',
    zh: '运行器详情',
  },
  description: {
    en: 'View detailed information about a specific runner.',
    fr: 'Voir les informations détaillées sur un travailleur spécifique.',
    de: 'Detaillierte Informationen zu einem bestimmten Runner anzeigen.',
    es: 'Ver información detallada sobre un ejecutor específico.',
    zh: '查看特定运行器的详细信息。',
  },
})

// --- Model.
const route = useRoute()
const identity = computed(() => route.params.identity as string)
const runner = ref<ThreadRunnerObject>()
const client = useClient()

// --- Methods.
async function getRunner() {
  await client.requestAttempt('GET /api/runners/:identity', {
    parameters: { identity: identity.value },
    onData: data => runner.value = data,
  })
}

onMounted(getRunner)
</script>

<template>
  <AppPageContainer v-if="runner" contained>
    <RunnerFormSettings :runner="runner" />
    <RunnerFormStatus :runner="runner" />
    <RunnerFormDangerZone :runner="runner" @refresh="() => getRunner()" />
  </AppPageContainer>
</template>

<script setup lang="ts">
import type { ThreadRunnerObject } from '@nwrx/nano-api'
import AdminSettingsRunnerDangerZone from '~/components/runner/AdminSettingsRunner.DangerZone.vue'
import AdminSettingsRunnerStatus from '~/components/runner/AdminSettingsRunner.Status.vue'
import AdminSettingsRunner from '~/components/runner/AdminSettingsRunner.vue'
import AppPageContainer from '~/components/app/AppPage.Container.vue'

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

const route = useRoute()
const identity = computed(() => route.params.identity as string)
const runner = ref<ThreadRunnerObject>()
const client = useClient()

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
    <AdminSettingsRunner :runner="runner" />
    <AdminSettingsRunnerStatus :runner="runner" />
    <AdminSettingsRunnerDangerZone :runner="runner" @refresh="() => getRunner()" />
  </AppPageContainer>
</template>

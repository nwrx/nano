<!-- eslint-disable sonarjs/prefer-single-boolean-return -->
<!-- eslint-disable vue/no-dupe-keys -->
<script setup lang="ts">
import { useMcpServer } from '~/composables/useMcp'
import BadgeCondition from './McpServerBadgeCondition.vue'
import BadgePhase from './McpServerBadgePhase.vue'

const props = defineProps<{
  workspace: string
  pool: string
  name: string
}>()

const { t } = useI18n()
const server = useMcpServer(props)
onMounted(() => {
  void server.fetchServer(true)
  void server.subscribeToStatus()
})

const canStartServer = computed(() => {
  if (!server.status.isReachable) return false
  if (server.status.phase === 'Idle') return true
  if (server.status.phase === 'Degraded') return true
  return false
})

const conditions = computed(() => {
  if (!server.status.isReachable) return []
  if (!server.status.conditions) return []
  return server.status.conditions.toSorted((a, b) => a.type.localeCompare(b.type))
})
</script>

<template>
  <div class="flex items-end p-lg bg-subtle b-b b-app min-h-32">

    <!-- Left -->
    <div class="flex flex-col items-start">

      <!-- Raw name and Title -->
      <div class="flex items-center space-x-md">
        <h2 class="text-lg font-semibold">
          {{ server.data.title || server.data.name }}
        </h2>
        <p class="text-lg font-mono text-subtle">
          {{ pool }}/{{ server.data.name }}
        </p>
      </div>

      <!-- Description -->
      <p class="text-sm text-subtle">
        <span v-if="server.data.description">{{ server.data.description }}</span>
        <span v-else class="italic">{{ t('noDescription') }}</span>
      </p>

      <!-- Phase and Conditions -->
      <div class="flex items-center space-x-md mt-md">
        <template v-if="server.status.isReachable">
          <BadgePhase :phase="server.status.phase" />

          <!-- Conditions -->
          <BadgeCondition
            v-for="condition in conditions"
            :key="condition.type"
            :condition="condition"
          />
        </template>

        <!-- If unreachable -->
        <Badge
          v-else
          :label="t('statusUnreachable')"
          class="badge-danger"
          icon="i-carbon:close"
        />
      </div>
    </div>

    <!-- Spacer -->
    <div class="grow" />

    <!-- Right -->
    <div class="flex flex-col items-end">

      <!-- Start / Stop -->
      <div class="flex items-end space-x-md">
        <Button
          v-if="canStartServer"
          :label="t('startServer')"
          class="button-success"
          icon-append="i-carbon:play"
          @click="() => server.request()"
        />
        <Button
          v-else-if="server.status.isReachable"
          :label="t('stopServer')"
          class="btn btn-secondary"
          @click="() => server.shutdown()"
        />
      </div>

    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  noDescription: Provide a description for this server to help users understand its purpose.
  totalRequests: 'Requests: {count}'
fr:
  noDescription: Fournissez une description pour ce serveur afin d'aider les utilisateurs à comprendre son objectif.
de:
  noDescription: Geben Sie eine Beschreibung für diesen Server an, um den Benutzern zu helfen, seinen Zweck zu verstehen.
es:
  noDescription: Proporcione una descripción para este servidor para ayudar a los usuarios a entender su propósito.
zh:
  noDescription: 为此服务器提供描述，以帮助用户了解其目的。
</i18n>

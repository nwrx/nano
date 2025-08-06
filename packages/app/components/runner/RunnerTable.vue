<script setup lang="ts">
import { toCamelCase } from '@unshared/string/toCamelCase'
import AppPageForm from '~/components/app/AppPageForm.vue'
import Button from '~/components/base/Button.vue'
import Table from '~/components/base/Table.vue'
import RunnerCard from '~/components/runner/RunnerCard.vue'
import { useRunners } from '~/composables/useRunner'
import RunnerActions from './RunnerActions.vue'
import RunnersDialogClaim from './RunnerDialogRegister.vue'

const { t } = useI18n()
const showClaimDialog = ref(false)
const runners = useRunners()
runners.options.withCreatedBy = true
runners.options.withUpdatedBy = true
runners.options.withDisabledBy = true

onMounted(() => {
  void runners.search()
  void runners.subscribeToEvents()
})

onBeforeUnmount(() => {
  void runners.unsubscribeFromEvents()
})
</script>

<template>
  <AppPageForm vertical :title="t('title')" :text="t('text')">
    <Table
      :rows="runners.data"
      :columns="['name', 'actions']">

      <!-- Header -->
      <template #header="name">
        {{ t(toCamelCase('header', name)) }}
      </template>

      <!-- Name -->
      <template #cell.name="runner">
        <RunnerCard :runner="runner" is-link inline />
      </template>

      <!-- Actions -->
      <template #cell.actions="runner">
        <RunnerActions :runner="runner" />
      </template>
    </Table>

    <!-- Claim Button -->
    <Button
      eager
      class="button-success ml-auto mb-4"
      icon-append="i-carbon:chevron-right"
      :label="t('claim')"
      @click="() => showClaimDialog = true"
    />

    <!-- Claim Dialog -->
    <RunnersDialogClaim v-model="showClaimDialog" />
  </AppPageForm>
</template>

<i18n lang="yaml">
en:
  title: Thread Runners
  text: Manage and monitor thread runner servers. Thread runners are responsible for executing background tasks and heavy computations.
  claim: Claim a new runner
  headerName: Runner
  headerAddress: Address
  headerLastSeenAt: ''
  headerActions: ''
</i18n>

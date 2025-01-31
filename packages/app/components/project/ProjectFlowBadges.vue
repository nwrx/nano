<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'

defineProps<FlowObject>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 mt-2">
    <Badge
      v-if="isCron"
      class="badge-primary"
      icon="i-carbon:timer"
    />
    <Badge
      v-if="isDeployed"
      :label="t('deployed')"
      class="badge-success"
      icon="i-carbon:dot-mark"
    />
    <Badge
      v-else
      :label="t('draft')"
      class="badge-warning"
      icon="i-carbon:dot-mark"
    />
    <Badge
      v-if="isRunning"
      :label="t('running')"
      class="badge-warning"
      icon="i-carbon:dot-mark"
    />
    <!--
      <Badge
      class="badge-danger"
      icon="i-carbon:error"
      />
    -->
  </div>
</template>

<i18n lang="yaml">
en:
  cron: Cron
  deployed: Deployed
  draft: Draft
  running: Running
fr:
  cron: Cron
  deployed: Déployé
  draft: Brouillon
  running: En cours
de:
  cron: Cron
  deployed: Bereitgestellt
  draft: Entwurf
  running: Laufend
es:
  cron: Cron
  deployed: Desplegado
  draft: Borrador
  running: En ejecución
zh:
  cron: Cron
  deployed: 已部署
  draft: 草稿
  running: 运行中
</i18n>

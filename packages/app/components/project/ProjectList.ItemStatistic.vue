<script setup lang="ts">
defineProps<{
  name: string
  value: number
  trend?: 'down' | 'up'
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex items-start justify-center">

    <!-- Trend -->
    <BaseIcon
      v-if="trend"
      :icon="trend === 'down' ? 'i-carbon:arrow-down' : 'i-carbon:arrow-up'"
      :class="trend === 'down' ? 'text-danger' : 'text-success'"
      class="size-6 shrink-0 mt-1 mr-2"
    />

    <!-- Value -->
    <div class="flex flex-col items-start justify-center ">
      <h4 class="flex items-end whitespace-nowrap space-x-xs">
        <p class="text-lg font-medium">
          {{ value }}
        </p>
        <p class="text-sm text-subtle">
          {{ t(`${name}.unit`) }}
        </p>
      </h4>

      <!-- Name -->
      <p class="text-sm text-subtle whitespace-nowrap">
        {{ t(`${name}.label`) }}
      </p>

    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  executions.label: Executions
  executions.unit: ''
  cost.label: Cost per month
  cost.unit: €/mo
fr:
  executions.label: Exécutions
  executions.unit: ''
  cost.label: Coût par mois
  cost.unit: €/mo
de:
  executions.label: Ausführungen
  executions.unit: ''
  cost.label: Kosten pro Monat
  cost.unit: €/mo
es:
  executions.label: Ejecuciones
  executions.unit: ''
  cost.label: Costo por mes
  cost.unit: €/mo
zh:
  executions.label: 执行
  executions.unit: ''
  cost.label: 每月成本
  cost.unit: €/mo
</i18n>

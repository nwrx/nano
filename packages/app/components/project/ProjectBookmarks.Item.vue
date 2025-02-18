<script setup lang="ts">
import type { FlowObject } from '@nwrx/nano-api'

const props = defineProps<FlowObject & { imageUrl: string }>()

// const statistics = computed(() => [
//   {
//     icon: 'i-carbon:cost',
//     label: 'Total Cost',
//     value: props.totalCost
//       ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(props.totalCost)
//       : '-',
//   },
//   {
//     icon: 'i-carbon:time',
//     label: 'Duration',
//     value: props.totalDuration ?? '-',
//   },
//   {
//     icon: 'i-carbon:run',
//     label: 'Executions',
//     value: props.totalExecutions ?? '-',
//   },
// ])

// const status = computed(() => [
//   {
//     visible: props.isDraft,
//     label: 'Draft',
//     variant: 'accent',
//     icon: 'i-carbon:dot-mark',
//     size: 'xsmall',
//     outlined: true,
//   },
//   {
//     visible: props.isDeployed,
//     label: 'Deployed',
//     variant: 'secondary',
//     icon: 'i-carbon:dot-mark',
//     size: 'xsmall',
//   },
//   {
//     visible: props.isRunning,
//     label: 'Running',
//     variant: 'accent',
//     icon: 'i-carbon:dot-mark',
//     size: 'xsmall',
//   },
// ].filter(badge => badge.visible) as Status[])
</script>

<template>
  <BaseButton
    v-bind="props"
    eager
    class="
      flex flex-col w-full bg-subtle rd b-1 b-app cursor-pointer
      hover:b-prominent hover:bg-emphasized overflow-hidden
      transition
    ">

    <!-- Image -->
    <div
      class="w-1/3 sm:w-full aspect-1/1 sm:aspect-16/9 bg-center bg-cover bg-no-repeat rounded shrink-0"
      :style="{ backgroundImage: `url(${imageUrl})` }"
    />

    <!-- Content -->
    <div class="flex flex-col p-md w-full h-full">
      <ProjectFlowBadges v-bind="props" />

      <!-- Name & Icon -->
      <h3 class="flex items-center space-x-sm mt-sm">
        <BaseIcon icon="i-carbon:flow" class="size-4" />
        <span class="text-base font-medium truncate">{{ title }}</span>
      </h3>

      <!-- Description -->
      <p class="text-sm text-subtle line-clamp-2">
        {{ description }}
      </p>

      <!-- Spacer -->
      <div class="grow" />

      <!-- Stats -->
      <div class="flex divide-x divide-app lt-md:hidden mt-lg">
        <ProjectListItemStatistic
          v-for="(statistic, key) in statistics"
          :key="key"
          :name="key"
          :trend="statistic.trend"
          :value="statistic.value"
          class="w-full"
        />
      </div>
    </div>
  </BaseButton>
</template>

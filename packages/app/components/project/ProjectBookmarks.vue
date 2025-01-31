<script setup lang="ts">
const props = defineProps<{
  id?: string
  slug?: string
  icon?: string
  name?: string
  imageUrl?: string
  description?: string
  isDraft?: boolean
  isDeployed?: boolean
  isRunning?: boolean
  totalCost?: number
  totalDuration?: number
  totalExecutions?: number
}>()

const statistics = computed(() => [
  {
    icon: 'i-carbon:cost',
    label: 'Total Cost',
    value: props.totalCost
      ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(props.totalCost)
      : '-',
  },
  {
    icon: 'i-carbon:time',
    label: 'Duration',
    value: props.totalDuration ?? '-',
  },
  {
    icon: 'i-carbon:run',
    label: 'Executions',
    value: props.totalExecutions ?? '-',
  },
])

interface Status {
  visible: boolean
  label: string
  variant: Variant
  icon: string
  size: Size
  outlined?: boolean
}

const status = computed(() => [
  {
    visible: props.isDraft,
    label: 'Draft',
    variant: 'accent',
    icon: 'i-carbon:dot-mark',
    size: 'xsmall',
    outlined: true,
  },
  {
    visible: props.isDeployed,
    label: 'Deployed',
    variant: 'secondary',
    icon: 'i-carbon:dot-mark',
    size: 'xsmall',
  },
  {
    visible: props.isRunning,
    label: 'Running',
    variant: 'accent',
    icon: 'i-carbon:dot-mark',
    size: 'xsmall',
  },
].filter(badge => badge.visible) as Status[])
</script>

<template>
  <BaseButton
    eager
    :to="{ name: 'FlowsEditor', params: { id: slug ?? id } }"
    class="
      flex sm:flex-col w-full bg-white rounded
      ring-1 ring-primary-100 cursor-pointer
      hover:ring-primary-600 overflow-hidden
      transition-all duration-100
    ">

    <!-- Image -->
    <div
      class="w-1/3 sm:w-full aspect-1/1 sm:aspect-16/9 bg-center bg-cover bg-no-repeat rounded shrink-0"
      :style="{ backgroundImage: `url(${imageUrl})` }"
    />

    <!-- Content -->
    <div class="flex flex-col p-4 w-full grow-1">
      <div class="flex flex-wrap items-center gap-2">
        <Badge
          v-for="badge in status"
          :key="badge.label"
          :label="badge.label"
          :variant="badge.variant"
          :icon="badge.icon"
          :size="badge.size"
          :outlined="badge.outlined"
        />
      </div>

      <!-- Name & Icon -->
      <h3 class="flex items-center space-x-2 mt-4">
        <BaseIcon :icon="icon ?? 'i-carbon:flow'" class="w-4 h-4" />
        <span class="text-base font-medium truncate">{{ name }}</span>
      </h3>

      <!-- Description -->
      <p class="text-sm text-black/50 line-clamp-2 mb-auto">
        {{ description }}
      </p>

      <!-- Stats -->
      <div class="flex items-center pt-4 mt-4 border-t border-black/15">
        <div v-for="stat in statistics" :key="stat.label" class="w-full">
          <div class="flex items-center space-x-2 text-black/50">
            <BaseIcon :icon="stat.icon" class="w-3 h-3" />
            <span class="text-xs">{{ stat.label }}</span>
          </div>
          <span class="text-sm font-medium">
            {{ stat.value }}
          </span>
        </div>
      </div>
    </div>
  </BaseButton>
</template>

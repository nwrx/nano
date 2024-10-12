<script setup lang="ts">
import type { Alert } from '@unshared/vue'
import { useAlerts } from '#imports'

const { alerts } = useAlerts()

function getAlertIcon(alert: Alert) {
  if (alert.type === 'error') return 'i-carbon:error'
  if (alert.type === 'success') return 'i-carbon:checkmark'
  if (alert.type === 'warning') return 'i-carbon:warning-alt'
  return 'i-carbon:information'
}

function getAlertIconColor(alert: Alert) {
  if (alert.type === 'error') return 'text-danger-500'
  if (alert.type === 'success') return 'text-success-500'
  if (alert.type === 'warning') return 'text-warning-500'
  return 'text-layout'
}
</script>

<template>
  <BaseAlerts
    id="alerts"
    class="
      p-12 flex items-end justify-start flex-col-reverse
      right-0 bottom-0 pointer-events-none gap-4
    ">
    <TransitionGroup
      enter-active-class="transition ease-out duration-300"
      leave-active-class="transition ease-out duration-300"
      move-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4"
      leave-to-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="
          bg-layout text-white
          border border-app
          flex items-center gap-2
          px-2 py-1 rounded
        ">

        <!-- Icon -->
        <BaseIcon
          :class="getAlertIconColor(alert)"
          :icon="getAlertIcon(alert)"
          class="w-4 h-4"
        />

        <!-- Content -->
        <p
          class="text-sm"
          v-text="alert.text"
        />
      </div>
    </TransitionGroup>
  </BaseAlerts>
</template>

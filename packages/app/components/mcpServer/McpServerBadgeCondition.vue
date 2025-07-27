<script setup lang="ts">
import type { NmcpManager } from '@nwrx/nano-api'
import Badge from '~/components/base/Badge.vue'
import Tooltip from '~/components/base/Tooltip.vue'

const props = defineProps<{
  condition: NonNullable<NmcpManager.ServerStatus['conditions']>[number]
}>()

const { t } = useI18n()

const fullCondition = computed(() => {
  if (!props.condition) return 'Unknown'
  return props.condition.type + props.condition.reason
})

const icon = computed(() => {
  if (!props.condition) return 'i-carbon:help'
  if (props.condition.type === 'Requested') return 'i-carbon:intent-request-upgrade'
  if (props.condition.type === 'PodScheduled') return 'i-carbon:kubernetes-pod'
  if (props.condition.type === 'PodReady') return 'i-carbon:checkmark'
  return 'i-carbon:help'
})

const classes = computed(() => {
  if (!props.condition) return ''
  if (props.condition.status === 'True') return 'badge-success'
  if (props.condition.status === 'False') return ''
  return 'badge-warning'
})
</script>

<template>
  <Tooltip
    :title="t('type', condition)"
    :text="t(`${fullCondition}Text`)">
    <Badge
      :label="t(fullCondition)"
      :icon="icon"
      :class="classes"
    />
  </Tooltip>
</template>

<i18n lang="yaml">
en:
  'True': True
  'False': False
  Unknown: Unknown
  type: '{type} → {reason}'

  # Requested condition reasons
  RequestedConnection: Requested
  RequestedConnectionText: The server has successfully established a connection and all required system resources have been allocated for operation.
  RequestedManualStart: Manual Start
  RequestedManualStartText: The server has been manually initiated by a user through the management interface.
  RequestedManualStop: Manual Stop
  RequestedManualStopText: The server has been manually terminated by a user through the management interface.
  RequestedIdleTimeout: Idle Timeout
  RequestedIdleTimeoutText: The server has been automatically stopped due to inactivity for a specified period of time, as per the configured idle timeout settings.

  # PodScheduled condition reasons
  PodScheduledFailed: Failed
  PodScheduledFailedText: The server pod could not be scheduled due to insufficient resources, configuration errors, or infrastructure constraints. Please check system resources and configuration settings.
  PodScheduledSucceeded: Terminated
  PodScheduledSucceededText: The server has been successfully terminated and all associated resources have been properly cleaned up and returned to the system pool.
  PodScheduledScheduled: Scheduled
  PodScheduledScheduledText: The server pod has been successfully scheduled and is preparing to initialize. Resources have been allocated and the startup process will begin shortly.
  PodScheduledTerminating: Terminating
  PodScheduledTerminatingText: The server is currently in the process of graceful shutdown. All active connections are being closed and resources are being released.
  PodScheduledRunning: Running
  PodScheduledRunningText: The server is fully operational and actively accepting incoming connections and processing requests.
</i18n>

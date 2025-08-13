<script setup lang="ts">
import type { FlowSchema, ThreadEventObject } from '@nwrx/nano-api'
import { format } from 'date-fns'
import Badge from '~/components/base/Badge.vue'
import IconDynamic from '~/components/icon/IconDynamic.vue'

const props = defineProps<{
  node?: FlowSchema.Node
  event: ThreadEventObject
}>()

const time = computed(() => {
  if ('createdAt' in props.event && props.event.createdAt)
    return format(new Date(props.event.createdAt), 'HH:mm:ss')
})
</script>

<template>
  <div class="flex items-center space-x-md h-8">

    <!-- Tag -->
    <h3
      v-if="node"
      class="flex items-center b-2 h-7 rd-sm whitespace-nowrap overflow-hidden"
      :style="{ borderColor: node.color }">

      <!-- Icon -->
      <div
        class="flex items-center justify-center aspect-1/1 h-full"
        :style="{ backgroundColor: node.color }">
        <IconDynamic
          :name="node.icon"
          fallback="i-carbon:box"
          class="size-5"
          load
        />
      </div>
      <span class="font-mono px-sm text-sm truncate uppercase">
        {{ localize(node.title) }}
      </span>
    </h3>

    <!-- Spacer -->
    <div class="grow" />

    <!-- If the event corresponds to an error, show a badge -->
    <Badge
      v-if="event.message.event === 'nodeError'"
      class="badge-danger badge-sm font-mono"
      :label="event.message.data[1].name"
    />

    <!-- Otherwise, show the event name -->
    <span v-else class="font-mono text-sm truncate text-subtle">
      {{ event.message.event }}
    </span>

    <!-- Date -->
    <span class="font-mono text-xs truncate text-subtle">
      {{ time }}
    </span>

    <!-- Index -->
    <span class="font-mono text-xs truncate text-subtle">
      {{ event.index.toFixed(0).padStart(3, '&nbsp;') }}
    </span>
  </div>
</template>

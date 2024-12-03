<script setup lang="ts">
import type { FlowSessionEventName } from '@nwrx/api'
import type { EditorSessionServerMessage } from '@nwrx/api'

const props = defineProps<{
  events?: EditorSessionServerMessage[]
}>()

const emit = defineEmits<{
  clear: []
}>()

const whitelist = ref<FlowSessionEventName[]>([
  'thread:nodeState',
  'thread:nodeStart',
  'thread:nodeEnd',
  'thread:nodeError',
])

const { t } = useI18n()
const isOpen = ref(false)
const container = ref<HTMLDivElement>()

// --- Scroll to the bottom of the container when the events change.
watch(() => props.events, () => {
  void nextTick(() => {
    if (!container.value) return
    container.value.scrollTop = container.value.scrollHeight
  })
})

function getEventScope(event: EditorSessionServerMessage) {
  const [scope] = event.event.split(':')
  return scope
}

const events = computed(() => {
  if (!props.events) return []
  return props.events.filter(event => whitelist.value.includes(event.event))
})
</script>

<template>
  <div
    :class="{ 'b-editor': isOpen }"
    class="
      flex flex-col rd backdrop-blur-2xl overflow-hidden h-48
      bg-editor-panel border border-editor transition-all duration-slow
    ">

    <!-- Title -->
    <div class="flex items-center p-sm">
      <h3>Console</h3>

      <div class="flex-1" />

      <!-- FAB to toggle whitelist -->
      <div class="flex items-center mx-md">
        <EditorConsoleToggle
          v-model="whitelist"
          value="thread:nodeState"
          icon="i-carbon:status-change"
        />
        <EditorConsoleToggle
          v-model="whitelist"
          value="thread:nodeStart"
          icon="i-carbon:play-outline"
        />
        <EditorConsoleToggle
          v-model="whitelist"
          value="thread:nodeError"
          icon="i-carbon:warning"
        />
        <EditorConsoleToggle
          v-model="whitelist"
          value="thread:nodeEnd"
          icon="i-carbon:stop-outline"
        />
      </div>

      <BaseButton eager size="sm" @click="() => emit('clear')">
        Clear
      </BaseButton>
    </div>

    <!-- Events -->
    <div ref="container" class="overflow-y-auto select-text">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="flex space-x-sm items-center b-t b-editor p-sm">

        <Badge>
          {{ t(getEventScope(event)) }}
        </Badge>

        <Badge>
          {{ t(event.event) }}
        </Badge>

        <p class="text-sm font-mono text-subtle">
          {{ t(`${event.event}.message`, { ...event }) }}
        </p>

        <div class="flex-1" />

        <p class="text-sm font-mono text-subtle">
          {{ event.event }}
        </p>
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
en:
  user: User
  user:join: Joined
  user:join.message: User "{ name }" joined the session.
  user:leave: Left
  user:leave.message: User "{ name }" left the session.

  node: Node
  node:created: Created
  node:created.message: Node "{ kind }" was created.
  node:removed: Removed
  node:removed.message: One or more nodes were removed.
  node:inputValueChanged: Value
  node:inputValueChanged.message: '{ key } => { value }'

  thread:nodeState: State
  thread:nodeState.message: '{ state }'
  thread:nodeStart: Started
  thread:nodeStart.message: Node started.
  thread:nodeError: Error
  thread:nodeError.message: '{ message }'
  thread:nodeEnd: Ended
  thread:nodeEnd.message: Node ended.

  thread: Thread
  thread:start: Started
  thread:start.message: Thread started.
  thread:end: Ended
  thread:end.message: Thread ended.
</i18n>

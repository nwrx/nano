<script setup lang="ts">
import type { FlowSessionEventPayload } from '@nwrx/api'

defineProps<{
  event: FlowSessionEventPayload
}>()

// --- Localization
const i18n = useI18n({ useScope: 'local' })
</script>

<template>
  <div class="flex flex-col items-start border-editor not-first:border-t">

    <!-- Header -->
    <div class="flex items-center font-medium px py hover:bg-emphasized transition w-full cursor-pointer">
      <I18nT :keypath="`event.${event.event}`" :i18n="i18n">
        <template #flow>
          <Badge filled size="xsmall" class="!bg-layout text-layout! mr-sm">
            <BaseIcon icon="i-carbon:flow" class="size-4" />
            <span>{{ i18n.t('event.flow') }}</span>
          </Badge>
        </template>
        <template #node>
          <Badge filled size="xsmall" class="!bg-emphasized border !border-editor !text-app mr-sm">
            <BaseIcon icon="i-carbon:box" class="size-4" />
            <span>{{ i18n.t('event.node') }}</span>
          </Badge>
        </template>
      </I18nT>
    </div>

    <!-- Data -->
    <template v-if="event.event === 'node:data'">
      <div class="w-full border-t border-editor px">
        <FlowEditorPanelSectionDataProperty
          v-for="(value, name) in event.data"
          :key="name"
          :name="name"
          :value="value"
        />
      </div>
    </template>

    <!-- Result -->
    <template v-if="event.event === 'node:result'">
      <div class="w-full border-t border-editor px">
        <FlowEditorPanelSectionDataProperty
          v-for="(value, name) in event.result"
          :key="name"
          class="border-x border-editor"
          :name="name"
          :value="value"
        />
      </div>
    </template>
  </div>
</template>

<i18n lang="yaml">
  en:
    event.flow: Flow
    event.flow:start: '{flow} Execution started'
    event.flow:end: '{flow} Execution completed'
    event.flow:abort: '{flow} Execution aborted'
    event.node: Node
    event.node:start: '{node} Execution started'
    event.node:end: '{node} Execution completed'
    event.node:abort: '{node} Execution aborted'
    event.node:data: '{node} Received data'
    event.node:result: '{node} Produced result'
</i18n>

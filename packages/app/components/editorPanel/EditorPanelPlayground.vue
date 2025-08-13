<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup lang="ts">
import VerticalTabs from '~/components/base/VerticalTabs.vue'
import { useThreads } from '~/composables/useThread'
import VerticalTabsItem from '../base/VerticalTabs.Item.vue'
import ThreadList from '../thread/ThreadList.vue'
import ThreadTree from '../thread/ThreadTree.vue'

const props = defineProps<{
  workspace: string
  project: string
  flow: string
}>()

type PanelTab =
  | 'threadsChat'
  | 'threadsEvents'
  | 'threadsList'

const threads = useThreads(props)
threads.options.withCreatedBy = true
threads.options.withUpdatedBy = true

const selectedPanel = ref<PanelTab>('threadsList')
// watch(() => threads.selectedThreadId, (id) => {
//   selectedPanel.value = id ? 'threadsChat' : 'threadsList'
// })

const TABS = [
  { value: 'threadsList', icon: 'i-carbon:list-boxes' },
  { value: 'threadsEvents', icon: 'i-carbon:list' },
  { value: 'threadsChat', icon: 'i-carbon:chat-bot' },
]
</script>

<template>
  <div class="flex items-stretch h-full">

    <!-- Vertical fabs -->
    <VerticalTabs class="b-r b-app">
      <VerticalTabsItem
        v-for="tab in TABS"
        :key="tab.value"
        v-model="selectedPanel"
        type="radio"
        :value="tab.value"
        :icon="tab.icon"
        small
      />
    </VerticalTabs>

    <div class="flex flex-col w-full">
      <KeepAlive>
        <ThreadList
          v-if="selectedPanel === 'threadsList'"
          :model-value="threads.selectedThreadId"
          :workspace="workspace"
          :project="project"
          :flow="flow"
          @update:model-value="(id) => threads.selectThread(id)"
        />

        <!-- Message of the current thread -->
        <ThreadTree
          v-else-if="selectedPanel === 'threadsEvents'"
          :id="threads.selectedThreadId"
          :workspace="workspace"
          :project="project"
          :flow="flow"
          :follow="threads.isSelectedThreadNew"
        />

        <!-- Message of the current thread -->
        <ThreadChat
          v-else-if="selectedPanel === 'threadsChat'"
          :id="threads.selectedThreadId"
          :workspace="workspace"
          :project="project"
          :flow="flow"
        />
      </KeepAlive>

      <!-- Spacer -->
      <div class="flex-grow" />

      <!-- Playground for the thread inputs -->
      <ThreadInputs
        :workspace="workspace"
        :project="project"
        :name="flow"
        class="b-t b-app"
        @submit="(inputs) => threads.start({ inputs })"
      />
    </div>
  </div>
</template>
